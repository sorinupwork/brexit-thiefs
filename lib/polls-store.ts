import { promises as fs } from "fs";
import path from "path";
import type {
  BrusselsActionOptionId,
  InstituteActionOptionId,
  PollState,
  RedFlagPollOptionId,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const POLLS_FILE = path.join(DATA_DIR, "polls.json");

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
  updatedAt: "2026-11-20T02:15:00.000Z",
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

async function ensurePollsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(POLLS_FILE);
  } catch {
    await fs.writeFile(
      POLLS_FILE,
      JSON.stringify(DEFAULT_POLL_STATE, null, 2),
      "utf-8"
    );
  }
}

export async function readPolls(): Promise<PollState> {
  try {
    await ensurePollsFile();
    const raw = await fs.readFile(POLLS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PollState>;
    return {
      redFlagVotes: {
        ...DEFAULT_POLL_STATE.redFlagVotes,
        ...(parsed.redFlagVotes ?? {}),
      },
      brusselsActionVotes: {
        ...DEFAULT_POLL_STATE.brusselsActionVotes,
        ...(parsed.brusselsActionVotes ?? {}),
      },
      instituteActionVotes: {
        ...DEFAULT_POLL_STATE.instituteActionVotes,
        ...(parsed.instituteActionVotes ?? {}),
      },
      reportFlags: { ...(parsed.reportFlags ?? {}) },
      agencyFlags: { ...(parsed.agencyFlags ?? {}) },
      diagnosticConfirmations:
        typeof parsed.diagnosticConfirmations === "number" &&
        Number.isFinite(parsed.diagnosticConfirmations)
          ? parsed.diagnosticConfirmations
          : 0,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : DEFAULT_POLL_STATE.updatedAt,
    };
  } catch {
    return DEFAULT_POLL_STATE;
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
    return {
      ok: true,
      data: { kind: "report-flag", targetId },
    };
  }

  if (kind === "agency-flag") {
    return {
      ok: true,
      data: { kind: "agency-flag", targetId },
    };
  }

  if (kind === "diagnostic-confirm") {
    return {
      ok: true,
      data: { kind: "diagnostic-confirm", targetId },
    };
  }

  return { ok: false, error: "Unknown vote kind." };
}

export async function recordPollVote(vote: PollVoteInput): Promise<PollState> {
  const current = await readPolls();
  const next: PollState = {
    redFlagVotes: { ...current.redFlagVotes },
    brusselsActionVotes: { ...current.brusselsActionVotes },
    instituteActionVotes: { ...current.instituteActionVotes },
    reportFlags: { ...current.reportFlags },
    agencyFlags: { ...current.agencyFlags },
    diagnosticConfirmations: current.diagnosticConfirmations,
    updatedAt: new Date().toISOString(),
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

  await ensurePollsFile();
  await fs.writeFile(POLLS_FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
