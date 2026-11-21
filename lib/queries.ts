import { cache } from "react";
import { readComments } from "@/lib/comments-store";
import { readPolls, readUserVotes } from "@/lib/polls-store";
import { readReports } from "@/lib/reports-store";
import { getVoterIdFromCookie } from "@/lib/voter-cookie";

/**
 * Request-scoped memoized readers for Server Components so streamed Suspense
 * boundaries on the same page share one Firestore / cookie lookup per request.
 */
export const getReports = cache(readReports);
export const getPolls = cache(readPolls);
export const getComments = cache(readComments);
export const getVoterId = cache(getVoterIdFromCookie);
export const getUserVotes = cache(readUserVotes);
