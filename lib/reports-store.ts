import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/firebase";
import { CATEGORY_META } from "./data";
import { compareIsoDesc, serializeFirestoreTimestamp } from "./firestore-utils";
import { buildPrivateEvidenceUrl } from "./storage";
import type {
  AuthorityId,
  EvidenceAttachment,
  EvidenceItemType,
  IssueCategory,
  LifecycleStageId,
  ReportSubmissionInput,
  WorkerReport,
} from "./types";

const REPORTS_COLLECTION = "reports";
const COUNTERS_COLLECTION = "counters";
const REPORTS_COUNTER_DOC = "reports";

const VALID_CATEGORIES = new Set<IssueCategory>([
  "wage-deduction",
  "transport-fuel",
  "contract-cao",
  "accommodation-snf",
  "recruitment",
  "hours-overtime",
]);

const VALID_STAGES = new Set<LifecycleStageId>([
  "recruitment",
  "coordination",
  "transport",
  "payroll",
  "accommodation",
  "escalation",
]);

const VALID_EVIDENCE = new Set<EvidenceItemType>([
  "payslips",
  "contract",
  "written-messages",
  "bank-statements",
  "fuel-transport-logs",
  "housing-photos",
  "hours-log",
]);

function mapAttachments(
  raw: unknown,
  reportId: string
): EvidenceAttachment[] {
  if (!Array.isArray(raw)) return [];
  const clean: EvidenceAttachment[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const blobPathname =
      typeof rec.blobPathname === "string" &&
      rec.blobPathname.startsWith("evidence/")
        ? rec.blobPathname
        : undefined;
    const blobUrl = blobPathname
      ? buildPrivateEvidenceUrl(blobPathname)
      : typeof rec.blobUrl === "string"
        ? rec.blobUrl
        : "";
    if (!blobUrl) continue;

    clean.push({
      id:
        typeof rec.id === "string" && rec.id.trim()
          ? rec.id
          : (blobPathname ?? blobUrl),
      reportId,
      type: (VALID_EVIDENCE.has(rec.type as EvidenceItemType)
        ? rec.type
        : "payslips") as EvidenceItemType,
      fileName: String(rec.fileName ?? "evidence-file"),
      mimeType: String(
        rec.mimeType ?? "application/pdf"
      ) as EvidenceAttachment["mimeType"],
      sizeBytes: typeof rec.sizeBytes === "number" ? rec.sizeBytes : 0,
      ...(blobPathname ? { blobPathname } : {}),
      blobUrl,
      redactedForPii: Boolean(rec.redactedForPii ?? true),
    });
  }
  return clean;
}

function mapFirestoreReport(
  id: string,
  data: Record<string, unknown>
): WorkerReport {
  const category = (VALID_CATEGORIES.has(data.category as IssueCategory)
    ? data.category
    : "wage-deduction") as IssueCategory;
  const stage = (VALID_STAGES.has(data.stage as LifecycleStageId)
    ? data.stage
    : "payroll") as LifecycleStageId;
  const agencyName =
    typeof data.agencyName === "string" && data.agencyName.trim()
      ? data.agencyName
      : undefined;
  const originCorridor =
    typeof data.originCorridor === "string" && data.originCorridor.trim()
      ? data.originCorridor
      : undefined;

  return {
    id,
    caseNumber: String(data.caseNumber ?? "WR-000"),
    title: String(data.title ?? ""),
    category,
    stage,
    region: String(data.region ?? "Netherlands"),
    ...(agencyName ? { agencyName } : {}),
    ...(originCorridor ? { originCorridor } : {}),
    weeksWorked:
      typeof data.weeksWorked === "number" ? data.weeksWorked : null,
    disputedAmountEur:
      typeof data.disputedAmountEur === "number"
        ? data.disputedAmountEur
        : null,
    authorAlias: String(data.authorAlias ?? "Anonymous Worker"),
    summary: String(data.summary ?? ""),
    timelineNotes: String(data.timelineNotes ?? ""),
    evidenceHeld: Array.isArray(data.evidenceHeld)
      ? (data.evidenceHeld as EvidenceItemType[])
      : [],
    recommendedAuthorities: Array.isArray(data.recommendedAuthorities)
      ? (data.recommendedAuthorities as AuthorityId[])
      : CATEGORY_META[category].authorities,
    attachments: mapAttachments(data.attachments, id),
    createdAt: serializeFirestoreTimestamp(data.createdAt, data.createdAtMs),
    isSample: Boolean(data.isSample),
  };
}

export async function readReports(): Promise<WorkerReport[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(
      collection(getDb(), REPORTS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((docSnap) =>
        mapFirestoreReport(
          docSnap.id,
          docSnap.data({ serverTimestamps: "estimate" })
        )
      )
      .sort((a, b) => compareIsoDesc(a.createdAt, b.createdAt));
  } catch (err) {
    console.error("[reports-store] Firestore readReports failed:", err);
    return [];
  }
}

export function validateReportInput(
  body: unknown
):
  | {
      ok: true;
      data: ReportSubmissionInput & { fallbackAttachments?: EvidenceAttachment[] };
    }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const record = body as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const timelineNotes =
    typeof record.timelineNotes === "string" ? record.timelineNotes.trim() : "";
  const region =
    typeof record.region === "string" && record.region.trim()
      ? record.region.trim().slice(0, 80)
      : "Netherlands (Unspecified)";
  const authorAlias =
    typeof record.authorAlias === "string" && record.authorAlias.trim()
      ? record.authorAlias.trim().slice(0, 80)
      : "Anonymous Worker";
  const agencyName =
    typeof record.agencyName === "string" && record.agencyName.trim()
      ? record.agencyName.trim().slice(0, 80)
      : undefined;
  const originCorridor =
    typeof record.originCorridor === "string" && record.originCorridor.trim()
      ? record.originCorridor.trim().slice(0, 60)
      : undefined;

  if (title.length < 8 || title.length > 160) {
    return {
      ok: false,
      error: "Report headline must be between 8 and 160 characters.",
    };
  }

  if (summary.length < 25 || summary.length > 3000) {
    return {
      ok: false,
      error: "Factual summary must be between 25 and 3,000 characters.",
    };
  }

  if (timelineNotes.length > 4000) {
    return {
      ok: false,
      error: "Timeline notes must be 4,000 characters or fewer.",
    };
  }

  const category = record.category as IssueCategory;
  if (!VALID_CATEGORIES.has(category)) {
    return { ok: false, error: "Please select a valid issue category." };
  }

  const stage = record.stage as LifecycleStageId;
  if (!VALID_STAGES.has(stage)) {
    return { ok: false, error: "Please select a valid employment stage." };
  }

  let weeksWorked: number | null = null;
  if (
    record.weeksWorked !== null &&
    record.weeksWorked !== undefined &&
    record.weeksWorked !== ""
  ) {
    const parsedWeeks = Number(record.weeksWorked);
    if (!Number.isFinite(parsedWeeks) || parsedWeeks < 0 || parsedWeeks > 520) {
      return { ok: false, error: "Weeks worked must be between 0 and 520." };
    }
    weeksWorked = Math.round(parsedWeeks);
  }

  let disputedAmountEur: number | null = null;
  if (
    record.disputedAmountEur !== null &&
    record.disputedAmountEur !== undefined &&
    record.disputedAmountEur !== ""
  ) {
    const parsedEur = Number(record.disputedAmountEur);
    if (!Number.isFinite(parsedEur) || parsedEur < 0 || parsedEur > 500000) {
      return {
        ok: false,
        error: "Disputed amount must be between €0 and €500,000.",
      };
    }
    disputedAmountEur = Math.round(parsedEur);
  }

  const rawEvidence = Array.isArray(record.evidenceHeld)
    ? record.evidenceHeld
    : [];
  const evidenceHeld = rawEvidence.filter(
    (item): item is EvidenceItemType =>
      typeof item === "string" && VALID_EVIDENCE.has(item as EvidenceItemType)
  );

  const fallbackAttachments: EvidenceAttachment[] = Array.isArray(
    record.attachments
  )
    ? record.attachments
        .filter(
          (att): att is EvidenceAttachment =>
            Boolean(att) &&
            typeof att === "object" &&
            typeof (att as EvidenceAttachment).blobPathname === "string" &&
            (att as EvidenceAttachment).blobPathname!.startsWith("evidence/")
        )
        .slice(0, 5)
    : [];

  return {
    ok: true,
    data: {
      title,
      category,
      stage,
      region,
      agencyName,
      originCorridor,
      weeksWorked,
      disputedAmountEur,
      authorAlias,
      summary,
      timelineNotes,
      evidenceHeld,
      fallbackAttachments,
    },
  };
}

export async function appendReport(
  input: ReportSubmissionInput & { fallbackAttachments?: EvidenceAttachment[] }
): Promise<WorkerReport> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const db = getDb();
  const authorities = CATEGORY_META[input.category].authorities;
  const counterRef = doc(db, COUNTERS_COLLECTION, REPORTS_COUNTER_DOC);
  const reportRef = doc(collection(db, REPORTS_COLLECTION));
  const attachments = mapAttachments(
    input.fallbackAttachments ?? [],
    reportRef.id
  );

  const year = Timestamp.now().toDate().getUTCFullYear();

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const prevSeq =
      counterSnap.exists() && typeof counterSnap.data().seq === "number"
        ? counterSnap.data().seq
        : 0;
    const nextSeq = prevSeq + 1;
    const caseNumber = `WR-${year}-${String(nextSeq).padStart(3, "0")}`;

    tx.set(counterRef, {
      seq: nextSeq,
      updatedAt: serverTimestamp(),
    });
    tx.set(reportRef, {
      caseNumber,
      title: input.title,
      category: input.category,
      stage: input.stage,
      region: input.region,
      ...(input.agencyName ? { agencyName: input.agencyName } : {}),
      ...(input.originCorridor ? { originCorridor: input.originCorridor } : {}),
      weeksWorked: input.weeksWorked,
      disputedAmountEur: input.disputedAmountEur,
      authorAlias: input.authorAlias,
      summary: input.summary,
      timelineNotes: input.timelineNotes,
      evidenceHeld: input.evidenceHeld,
      recommendedAuthorities: authorities,
      attachments,
      isSample: false,
      createdAt: serverTimestamp(),
    });
  });

  const createdSnap = await getDoc(reportRef);
  const data = createdSnap.data({ serverTimestamps: "estimate" }) ?? {};
  return mapFirestoreReport(createdSnap.id, data);
}
