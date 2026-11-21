import crypto from "crypto";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { parseVoterVotes, VOTE_RECORDS_COLLECTION } from "./polls-store";
import type {
  CommentSubmissionInput,
  CommentTopicId,
  CommunityComment,
} from "./types";

const COMMENTS_COLLECTION = "comments";

const VALID_TOPICS = new Set<CommentTopicId>([
  "wage-money-back",
  "onboarding-lies",
  "housing-snf",
  "ignored-hours",
  "rights-lawsuit",
]);

function mapFirestoreComment(
  id: string,
  data: Record<string, unknown>
): CommunityComment {
  const corridor =
    typeof data.corridor === "string" && data.corridor.trim()
      ? data.corridor
      : undefined;

  return {
    id,
    agencyName: String(data.agencyName ?? "General EU Mobility"),
    topic: (VALID_TOPICS.has(data.topic as CommentTopicId)
      ? data.topic
      : "rights-lawsuit") as CommentTopicId,
    ...(corridor ? { corridor } : {}),
    authorAlias: String(data.authorAlias ?? "Anonymous Worker"),
    body: String(data.body ?? ""),
    confirmations:
      typeof data.confirmations === "number" &&
      Number.isFinite(data.confirmations)
        ? data.confirmations
        : 1,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : new Date(0).toISOString(),
    isSeeded: Boolean(data.isSeeded),
  };
}

export async function readComments(): Promise<CommunityComment[]> {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      orderBy("createdAtMs", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) =>
      mapFirestoreComment(docSnap.id, docSnap.data())
    );
  } catch (err) {
    console.error("[comments-store] Firestore readComments failed:", err);
    return [];
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
  const id = `comment-${crypto.randomUUID().slice(0, 8)}`;
  const nowMs = Date.now();
  const createdAt = new Date(nowMs).toISOString();

  const comment: CommunityComment = {
    id,
    agencyName: input.agencyName,
    topic: input.topic,
    ...(input.corridor ? { corridor: input.corridor } : {}),
    authorAlias: input.authorAlias,
    body: input.body,
    confirmations: 1,
    createdAt,
    isSeeded: false,
  };

  await setDoc(doc(db, COMMENTS_COLLECTION, id), {
    ...comment,
    createdAtMs: nowMs,
  });

  return comment;
}

export async function confirmComment(
  commentId: string,
  voterId?: string | null
): Promise<{
  comments: CommunityComment[];
  alreadyConfirmed: boolean;
} | null> {
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  const voterRef = voterId ? doc(db, VOTE_RECORDS_COLLECTION, voterId) : null;
  const scopeKey = `comment-confirm:${commentId}`;

  const txOutcome = await runTransaction(db, async (tx) => {
    const [commentSnap, voterSnap] = await Promise.all([
      tx.get(commentRef),
      voterRef ? tx.get(voterRef) : Promise.resolve(null),
    ]);

    if (!commentSnap.exists()) {
      return "not-found" as const;
    }

    const voterVotes = voterSnap?.exists()
      ? parseVoterVotes(voterSnap.data())
      : {};

    if (voterRef && typeof voterVotes[scopeKey] === "string") {
      return "already-confirmed" as const;
    }

    tx.update(commentRef, { confirmations: increment(1) });
    if (voterRef) {
      tx.set(voterRef, {
        votes: { ...voterVotes, [scopeKey]: commentId },
        updatedAt: new Date().toISOString(),
      });
    }

    return "confirmed" as const;
  });

  if (txOutcome === "not-found") {
    return null;
  }

  const comments = await readComments();
  return {
    comments,
    alreadyConfirmed: txOutcome === "already-confirmed",
  };
}
