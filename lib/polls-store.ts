import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/firebase";
import {
  EMPTY_USER_VOTES,
  type BrusselsActionOptionId,
  type InstituteActionOptionId,
  type PollState,
  type RedFlagPollOptionId,
  type UserVotesState,
} from "./types";

const POLLS_COLLECTION = "poll_metrics";
const POLLS_SUMMARY_DOC = "summary";
export const VOTE_RECORDS_COLLECTION = "vote_records";

export const DEFAULT_POLL_STATE: PollState = {
  redFlagVotes: {
    "retroactive-wage": 0,
    "fuel-clawback": 0,
    "adv-holiday-minus": 0,
    "unpaid-guarantee-benched": 0,
    "contract-bait-switch": 0,
    "snf-housing": 0,
    "street-abandonment": 0,
    "withheld-final-pay": 0,
    "discrimination-unequal-treatment": 0,
  },
  brusselsActionVotes: {
    "ela-inspection": 0,
    "eu-commission-complaint": 0,
    "ep-peti-petition": 0,
    "solvit-network": 0,
  },
  instituteActionVotes: {
    "arbeidsinspectie-audit": 0,
    "sncu-cao-audit": 0,
    "snf-housing-audit": 0,
    "politie-fraud-report": 0,
    "collective-lawsuit": 0,
  },
  reportFlags: {},
  agencyFlags: {},
  diagnosticConfirmations: 0,
};

const VALID_RED_FLAG_OPTIONS = new Set<RedFlagPollOptionId>([
  "retroactive-wage",
  "fuel-clawback",
  "adv-holiday-minus",
  "unpaid-guarantee-benched",
  "contract-bait-switch",
  "snf-housing",
  "street-abandonment",
  "withheld-final-pay",
  "discrimination-unequal-treatment",
]);

const VALID_BRUSSELS_ACTIONS = new Set<BrusselsActionOptionId>([
  "ela-inspection",
  "eu-commission-complaint",
  "ep-peti-petition",
  "solvit-network",
]);

const VALID_INSTITUTE_ACTIONS = new Set<InstituteActionOptionId>([
  "arbeidsinspectie-audit",
  "sncu-cao-audit",
  "snf-housing-audit",
  "politie-fraud-report",
  "collective-lawsuit",
]);

function coerceNumberRecord(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) {
      result[k] = v;
    }
  }
  return result;
}

function normalizePollState(raw?: Record<string, unknown>): PollState {
  if (!raw) return DEFAULT_POLL_STATE;
  return {
    redFlagVotes: {
      ...DEFAULT_POLL_STATE.redFlagVotes,
      ...(coerceNumberRecord(raw.redFlagVotes) as Partial<
        Record<RedFlagPollOptionId, number>
      >),
    },
    brusselsActionVotes: {
      ...DEFAULT_POLL_STATE.brusselsActionVotes,
      ...(coerceNumberRecord(raw.brusselsActionVotes) as Partial<
        Record<BrusselsActionOptionId, number>
      >),
    },
    instituteActionVotes: {
      ...DEFAULT_POLL_STATE.instituteActionVotes,
      ...(coerceNumberRecord(raw.instituteActionVotes) as Partial<
        Record<InstituteActionOptionId, number>
      >),
    },
    reportFlags: coerceNumberRecord(raw.reportFlags),
    agencyFlags: coerceNumberRecord(raw.agencyFlags),
    diagnosticConfirmations:
      typeof raw.diagnosticConfirmations === "number" &&
      Number.isFinite(raw.diagnosticConfirmations)
        ? raw.diagnosticConfirmations
        : 0,
  };
}

export function parseVoterVotes(raw?: Record<string, unknown>): Record<string, string> {
  const votesRaw = raw?.votes;
  if (!votesRaw || typeof votesRaw !== "object" || Array.isArray(votesRaw)) {
    return {};
  }
  const parsed: Record<string, string> = {};
  for (const [key, val] of Object.entries(votesRaw as Record<string, unknown>)) {
    if (typeof val === "string") {
      parsed[key] = val;
    }
  }
  return parsed;
}

export function getScopeKeyForVote(vote: PollVoteInput): string {
  switch (vote.kind) {
    case "red-flag":
      return "red-flag";
    case "institute-action":
      return "institute-action";
    case "brussels-action":
      return "brussels-action";
    case "diagnostic-confirm":
      return "diagnostic-confirm";
    case "agency-flag":
      return `agency-flag:${vote.targetId}`;
    case "report-flag":
      return `report-flag:${vote.targetId}`;
  }
}

function applyPollIncrement(
  current: PollState,
  vote: PollVoteInput
): PollState {
  const next: PollState = {
    redFlagVotes: { ...current.redFlagVotes },
    brusselsActionVotes: { ...current.brusselsActionVotes },
    instituteActionVotes: { ...current.instituteActionVotes },
    reportFlags: { ...current.reportFlags },
    agencyFlags: { ...current.agencyFlags },
    diagnosticConfirmations: current.diagnosticConfirmations,
  };

  if (vote.kind === "red-flag") {
    next.redFlagVotes[vote.targetId] =
      (next.redFlagVotes[vote.targetId] ?? 0) + 1;
  } else if (vote.kind === "brussels-action") {
    next.brusselsActionVotes[vote.targetId] =
      (next.brusselsActionVotes[vote.targetId] ?? 0) + 1;
  } else if (vote.kind === "institute-action") {
    next.instituteActionVotes[vote.targetId] =
      (next.instituteActionVotes[vote.targetId] ?? 0) + 1;
  } else if (vote.kind === "agency-flag") {
    next.agencyFlags[vote.targetId] =
      (next.agencyFlags[vote.targetId] ?? 0) + 1;
  } else if (vote.kind === "diagnostic-confirm") {
    next.diagnosticConfirmations = (next.diagnosticConfirmations ?? 0) + 1;
  } else {
    next.reportFlags[vote.targetId] =
      (next.reportFlags[vote.targetId] ?? 0) + 1;
  }

  return next;
}

export async function readPolls(): Promise<PollState> {
  if (!isFirebaseConfigured()) {
    return DEFAULT_POLL_STATE;
  }

  try {
    const snap = await getDoc(doc(db, POLLS_COLLECTION, POLLS_SUMMARY_DOC));
    return normalizePollState(snap.exists() ? snap.data() : undefined);
  } catch (err) {
    console.error("[polls-store] Firestore readPolls failed:", err);
    return DEFAULT_POLL_STATE;
  }
}

export async function readUserVotes(
  voterId: string | null
): Promise<UserVotesState> {
  if (!voterId || !isFirebaseConfigured()) return EMPTY_USER_VOTES;

  try {
    const snap = await getDoc(doc(db, VOTE_RECORDS_COLLECTION, voterId));
    if (!snap.exists()) return EMPTY_USER_VOTES;

    const voterScopes = parseVoterVotes(snap.data());
    const userVotes: UserVotesState = {
      redFlagVote: null,
      instituteActionVote: null,
      brusselsActionVote: null,
      flaggedAgencies: [],
      flaggedReports: [],
      confirmedComments: [],
      diagnosticConfirmed: false,
    };

    for (const [scopeKey, targetId] of Object.entries(voterScopes)) {
      if (
        scopeKey === "red-flag" &&
        VALID_RED_FLAG_OPTIONS.has(targetId as RedFlagPollOptionId)
      ) {
        userVotes.redFlagVote = targetId as RedFlagPollOptionId;
      } else if (
        scopeKey === "institute-action" &&
        VALID_INSTITUTE_ACTIONS.has(targetId as InstituteActionOptionId)
      ) {
        userVotes.instituteActionVote = targetId as InstituteActionOptionId;
      } else if (
        scopeKey === "brussels-action" &&
        VALID_BRUSSELS_ACTIONS.has(targetId as BrusselsActionOptionId)
      ) {
        userVotes.brusselsActionVote = targetId as BrusselsActionOptionId;
      } else if (scopeKey === "diagnostic-confirm") {
        userVotes.diagnosticConfirmed = true;
      } else if (scopeKey.startsWith("agency-flag:")) {
        userVotes.flaggedAgencies.push(targetId);
      } else if (scopeKey.startsWith("report-flag:")) {
        userVotes.flaggedReports.push(targetId);
      } else if (scopeKey.startsWith("comment-confirm:")) {
        userVotes.confirmedComments.push(targetId);
      }
    }

    return userVotes;
  } catch (err) {
    console.error("[polls-store] Firestore readUserVotes failed:", err);
    return EMPTY_USER_VOTES;
  }
}

export type PollVoteInput =
  | { kind: "red-flag"; targetId: RedFlagPollOptionId }
  | { kind: "brussels-action"; targetId: BrusselsActionOptionId }
  | { kind: "institute-action"; targetId: InstituteActionOptionId }
  | { kind: "report-flag"; targetId: string }
  | { kind: "agency-flag"; targetId: string }
  | { kind: "diagnostic-confirm"; targetId: string };

export function validatePollVote(
  body: unknown
): { ok: true; data: PollVoteInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const record = body as Record<string, unknown>;
  const kind = record.kind;
  const targetId =
    typeof record.targetId === "string" ? record.targetId.trim() : "";

  if (!targetId || targetId.length > 80) {
    return { ok: false, error: "Invalid vote target identifier." };
  }

  if (kind === "red-flag") {
    if (!VALID_RED_FLAG_OPTIONS.has(targetId as RedFlagPollOptionId)) {
      return { ok: false, error: "Invalid red-flag poll option." };
    }
    return {
      ok: true,
      data: { kind: "red-flag", targetId: targetId as RedFlagPollOptionId },
    };
  }

  if (kind === "brussels-action") {
    if (!VALID_BRUSSELS_ACTIONS.has(targetId as BrusselsActionOptionId)) {
      return { ok: false, error: "Invalid Brussels action poll option." };
    }
    return {
      ok: true,
      data: {
        kind: "brussels-action",
        targetId: targetId as BrusselsActionOptionId,
      },
    };
  }

  if (kind === "institute-action") {
    if (!VALID_INSTITUTE_ACTIONS.has(targetId as InstituteActionOptionId)) {
      return { ok: false, error: "Invalid official institute action option." };
    }
    return {
      ok: true,
      data: {
        kind: "institute-action",
        targetId: targetId as InstituteActionOptionId,
      },
    };
  }

  if (kind === "report-flag") {
    return { ok: true, data: { kind: "report-flag", targetId } };
  }

  if (kind === "agency-flag") {
    return { ok: true, data: { kind: "agency-flag", targetId } };
  }

  if (kind === "diagnostic-confirm") {
    return { ok: true, data: { kind: "diagnostic-confirm", targetId } };
  }

  return { ok: false, error: "Unknown vote kind." };
}

export async function recordPollVote(
  vote: PollVoteInput,
  voterId?: string | null
): Promise<{ polls: PollState; alreadyVoted: boolean }> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const summaryRef = doc(db, POLLS_COLLECTION, POLLS_SUMMARY_DOC);
  const voterRef = voterId ? doc(db, VOTE_RECORDS_COLLECTION, voterId) : null;
  const scopeKey = getScopeKeyForVote(vote);

  return runTransaction(db, async (tx) => {
    const [summarySnap, voterSnap] = await Promise.all([
      tx.get(summaryRef),
      voterRef ? tx.get(voterRef) : Promise.resolve(null),
    ]);

    const currentPolls = normalizePollState(
      summarySnap.exists() ? summarySnap.data() : undefined
    );
    const voterVotes = voterSnap?.exists()
      ? parseVoterVotes(voterSnap.data())
      : {};

    if (voterRef && typeof voterVotes[scopeKey] === "string") {
      return { polls: currentPolls, alreadyVoted: true };
    }

    const nextPolls = applyPollIncrement(currentPolls, vote);

    if (voterRef) {
      tx.set(voterRef, {
        votes: { ...voterVotes, [scopeKey]: vote.targetId },
        updatedAt: serverTimestamp(),
      });
    }
    tx.set(summaryRef, {
      ...nextPolls,
      updatedAt: serverTimestamp(),
    });

    return { polls: nextPolls, alreadyVoted: false };
  });
}
