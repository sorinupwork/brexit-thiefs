"use server";

import { revalidatePath } from "next/cache";
import {
  readUserVotes,
  recordDiagnosticSubmission,
  recordPollVote,
  validateDiagnosticSubmission,
  validatePollVote,
  type PollVoteInput,
} from "@/lib/polls-store";
import type {
  DiagnosticSubmissionInput,
  PollState,
  UserVotesState,
} from "@/lib/types";
import { getOrCreateVoterIdInMutation } from "@/lib/voter-cookie";

export interface VoteActionResult {
  ok: boolean;
  polls?: PollState;
  userVotes?: UserVotesState;
  alreadyVoted?: boolean;
  error?: string;
}

export interface DiagnosticActionResult {
  ok: boolean;
  polls?: PollState;
  userVotes?: UserVotesState;
  alreadySubmitted?: boolean;
  submissionId?: string | null;
  error?: string;
}

export async function submitVoteAction(
  input: PollVoteInput
): Promise<VoteActionResult> {
  const validated = validatePollVote(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  try {
    const voterId = await getOrCreateVoterIdInMutation();
    const { polls, alreadyVoted } = await recordPollVote(
      validated.data,
      voterId
    );
    const userVotes = await readUserVotes(voterId);
    revalidatePath("/");
    if (validated.data.kind === "agency-flag") {
      revalidatePath("/agencies");
      revalidatePath(`/agencies/${validated.data.targetId}`);
    }
    return { ok: true, polls, userVotes, alreadyVoted };
  } catch (err) {
    console.error("[submitVoteAction] Firestore write failed:", err);
    return {
      ok: false,
      error: "Failed to persist vote in the database.",
    };
  }
}

export async function submitDiagnosticAction(
  input: DiagnosticSubmissionInput
): Promise<DiagnosticActionResult> {
  const validated = validateDiagnosticSubmission(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  try {
    const voterId = await getOrCreateVoterIdInMutation();
    const { polls, alreadySubmitted, submissionId } =
      await recordDiagnosticSubmission(validated.data, voterId);
    const userVotes = await readUserVotes(voterId);

    revalidatePath("/");
    revalidatePath("/agencies");
    revalidatePath(`/agencies/${validated.data.agencySlug}`);

    return {
      ok: true,
      polls,
      userVotes,
      alreadySubmitted,
      submissionId,
    };
  } catch (err) {
    console.error("[submitDiagnosticAction] Firestore write failed:", err);
    return {
      ok: false,
      error: "Failed to persist diagnostic answers in Firestore.",
    };
  }
}
