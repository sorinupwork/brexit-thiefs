"use server";

import { revalidatePath } from "next/cache";
import {
  appendComment,
  confirmComment,
  validateCommentInput,
} from "@/lib/comments-store";
import { readUserVotes } from "@/lib/polls-store";
import type {
  CommentSubmissionInput,
  CommunityComment,
  UserVotesState,
} from "@/lib/types";
import { getOrCreateVoterIdInMutation } from "@/lib/voter-cookie";

export interface CreateCommentActionResult {
  ok: boolean;
  comment?: CommunityComment;
  error?: string;
}

export interface ConfirmCommentActionResult {
  ok: boolean;
  comments?: CommunityComment[];
  userVotes?: UserVotesState;
  alreadyConfirmed?: boolean;
  error?: string;
}

export async function createCommentAction(
  input: CommentSubmissionInput
): Promise<CreateCommentActionResult> {
  const validated = validateCommentInput(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  try {
    const comment = await appendComment(validated.data);
    revalidatePath("/");
    return { ok: true, comment };
  } catch {
    return {
      ok: false,
      error: "Failed to persist comment in the database.",
    };
  }
}

export async function confirmCommentAction(
  commentId: string
): Promise<ConfirmCommentActionResult> {
  const id = typeof commentId === "string" ? commentId.trim() : "";
  if (!id) {
    return { ok: false, error: "Missing comment identifier." };
  }

  try {
    const voterId = await getOrCreateVoterIdInMutation();
    const result = await confirmComment(id, voterId);
    if (!result) {
      return { ok: false, error: "Comment not found." };
    }
    const userVotes = await readUserVotes(voterId);
    revalidatePath("/");
    return {
      ok: true,
      comments: result.comments,
      userVotes,
      alreadyConfirmed: result.alreadyConfirmed,
    };
  } catch {
    return {
      ok: false,
      error: "Failed to confirm comment in the database.",
    };
  }
}
