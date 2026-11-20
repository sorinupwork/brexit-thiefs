import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { CATEGORY_META, SAMPLE_REPORTS } from "./data";
import type {
  EvidenceItemType,
  IssueCategory,
  LifecycleStageId,
  ReportSubmissionInput,
  WorkerReport,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

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

async function ensureStoreFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(REPORTS_FILE);
  } catch {
    await fs.writeFile(
      REPORTS_FILE,
      JSON.stringify(SAMPLE_REPORTS, null, 2),
      "utf-8"
    );
  }
}

export async function readReports(): Promise<WorkerReport[]> {
  try {
    await ensureStoreFile();
    const raw = await fs.readFile(REPORTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return SAMPLE_REPORTS;
    }
    return parsed as WorkerReport[];
  } catch {
    return SAMPLE_REPORTS;
  }
}

export function validateReportInput(
  body: unknown
): { ok: true; data: ReportSubmissionInput } | { ok: false; error: string } {
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
    },
  };
}

export async function appendReport(
  input: ReportSubmissionInput
): Promise<WorkerReport> {
  const existing = await readReports();
  const nextNumber = existing.length + 1;
  const year = new Date().getFullYear();

  const report: WorkerReport = {
    id: crypto.randomUUID(),
    caseNumber: `WR-${year}-${String(nextNumber).padStart(3, "0")}`,
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
    recommendedAuthorities: CATEGORY_META[input.category].authorities,
    attachments: [],
    createdAt: new Date().toISOString(),
    isSample: false,
  };

  const updated = [report, ...existing];
  await ensureStoreFile();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return report;
}
