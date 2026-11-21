"use server";

import { revalidatePath } from "next/cache";
import {
  readUserVotes,
  recordPollVote,
  validatePollVote,
  type PollVoteInput,
} from "@/lib/polls-store";
import type { PollState, UserVotesState } from "@/lib/types";
import { getOrCreateVoterIdInMutation } from "@/lib/voter-cookie";

export interface VoteActionResult {
  ok: boolean;
  polls?: PollState;
  userVotes?: UserVotesState;
  alreadyVoted?: boolean;
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
    return { ok: true, polls, userVotes, alreadyVoted };
  } catch {
    return {
      ok: false,
      error: "Failed to persist vote in the database.",
    };
  }
}
