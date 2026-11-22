import { cache } from "react";
import { io } from "next/cache";
import { readComments } from "@/lib/comments-store";
import { readPolls, readUserVotes } from "@/lib/polls-store";
import { readReports } from "@/lib/reports-store";
import { getVoterIdFromCookie } from "@/lib/voter-cookie";

export const getVoterId = cache(getVoterIdFromCookie);

export const getReports = cache(async () => {
  await io();
  return readReports();
});

export const getPolls = cache(async () => {
  await io();
  return readPolls();
});

export const getComments = cache(async () => {
  await io();
  return readComments();
});

export const getUserVotes = cache(async (voterId: string | null) => {
  await io();
  return readUserVotes(voterId);
});
