import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type {
  CommentSubmissionInput,
  CommentTopicId,
  CommunityComment,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

const VALID_TOPICS = new Set<CommentTopicId>([
  "wage-money-back",
  "onboarding-lies",
  "housing-snf",
  "ignored-hours",
  "rights-lawsuit",
]);

export const SEEDED_COMMENTS: CommunityComment[] = [
  {
    id: "comment-seed-001",
    agencyName: "Charlie works",
    topic: "onboarding-lies",
    corridor: "HU / PL → NL",
    authorAlias: "Community Sample · Logistics Worker",
    body: "Example testimony: At the onboarding office, staff rushed contracts in Dutch without translating fuel/deduction rules, and weeks later money was taken off net wages. Never sign blindly—keep recruiter screenshots and demand full written terms to submit to SNCU & Arbeidsinspectie.",
    confirmations: 0,
    createdAt: "2026-11-18T10:15:00.000Z",
    isSeeded: true,
  },
  {
    id: "comment-seed-002",
    agencyName: "DIT & Larex",
    topic: "wage-money-back",
    corridor: "RO / EU → NL (Techniek & Bouw)",
    authorAlias: "Community Sample · Technical Worker",
    body: "Example testimony: Instead of applying host-company ADV hours, payroll placed statutory vakantie-uren into minus (-€890) and tried to reclaim earlier fuel lines. Under BW Art. 7:638, 7:628 & 7:632, workers can demand full repayment and file directly with SNCU & employment lawyers.",
    confirmations: 0,
    createdAt: "2026-11-19T14:30:00.000Z",
    isSeeded: true,
  },
  {
    id: "comment-seed-003",
    agencyName: "Other Dutch Agency",
    topic: "ignored-hours",
    corridor: "EU → NL",
    authorAlias: "Community Sample · Warehouse Worker",
    body: "Example testimony: Planning stopped calling back, left workers in agency housing without shifts or guaranteed pay while deducting weekly rent, and told them to use their own phone and car. Send a written availability notice (BW Art. 7:628) and attach call logs for Arbeidsinspectie.",
    confirmations: 0,
    createdAt: "2026-11-20T00:45:00.000Z",
    isSeeded: true,
  },
  {
    id: "comment-seed-004",
    agencyName: "General EU Mobility",
    topic: "rights-lawsuit",
    corridor: "EU → Netherlands",
    authorAlias: "Community Sample · Fair-Work Advocate",
    body: "Example testimony: Agencies count on international workers staying silent or leaving the country without filing forms. When our community votes, comments, and payslip proofs are exported together, Nederlandse Arbeidsinspectie, SNCU, Politie, and EU ELA receive undeniable collective evidence.",
    confirmations: 0,
    createdAt: "2026-11-20T08:00:00.000Z",
    isSeeded: true,
  },
];

async function ensureCommentsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(COMMENTS_FILE);
  } catch {
    await fs.writeFile(
      COMMENTS_FILE,
      JSON.stringify(SEEDED_COMMENTS, null, 2),
      "utf-8"
    );
  }
}

export async function readComments(): Promise<CommunityComment[]> {
  try {
    await ensureCommentsFile();
    const raw = await fs.readFile(COMMENTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return SEEDED_COMMENTS;
    }
    return parsed as CommunityComment[];
  } catch {
    return SEEDED_COMMENTS;
  }
}

export function validateCommentInput(
  body: unknown
):
  | { ok: true; data: CommentSubmissionInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const record = body as Record<string, unknown>;
  const agencyName =
    typeof record.agencyName === "string" && record.agencyName.trim()
      ? record.agencyName.trim().slice(0, 80)
      : "General EU Mobility";
  const topic = record.topic as CommentTopicId;
  if (!VALID_TOPICS.has(topic)) {
    return { ok: false, error: "Please select a valid comment topic." };
  }

  const corridor =
    typeof record.corridor === "string" && record.corridor.trim()
      ? record.corridor.trim().slice(0, 60)
      : undefined;
  const authorAlias =
    typeof record.authorAlias === "string" && record.authorAlias.trim()
      ? record.authorAlias.trim().slice(0, 60)
      : "Anonymous Worker";
  const commentBody =
    typeof record.body === "string" ? record.body.trim() : "";

  if (commentBody.length < 12 || commentBody.length > 1200) {
    return {
      ok: false,
      error: "Comment must be between 12 and 1,200 characters.",
    };
  }

  return {
    ok: true,
    data: {
      agencyName,
      topic,
      corridor,
      authorAlias,
      body: commentBody,
    },
  };
}

export async function appendComment(
  input: CommentSubmissionInput
): Promise<CommunityComment> {
  const existing = await readComments();
  const comment: CommunityComment = {
    id: `comment-${crypto.randomUUID().slice(0, 8)}`,
    agencyName: input.agencyName,
    topic: input.topic,
    ...(input.corridor ? { corridor: input.corridor } : {}),
    authorAlias: input.authorAlias,
    body: input.body,
    confirmations: 1,
    createdAt: new Date().toISOString(),
    isSeeded: false,
  };

  const updated = [comment, ...existing];
  await ensureCommentsFile();
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return comment;
}

export async function confirmComment(
  commentId: string
): Promise<CommunityComment[] | null> {
  const existing = await readComments();
  const index = existing.findIndex((c) => c.id === commentId);
  if (index === -1) return null;

  const updated = [...existing];
  updated[index] = {
    ...updated[index],
    confirmations: (updated[index].confirmations ?? 0) + 1,
  };

  await ensureCommentsFile();
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
