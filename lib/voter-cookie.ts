import crypto from "crypto";
import { cookies } from "next/headers";

const VOTER_COOKIE_NAME = "werkrecht_voter_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getVoterIdFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const id = cookieStore.get(VOTER_COOKIE_NAME)?.value;
    return id && UUID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

export async function getOrCreateVoterIdInMutation(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VOTER_COOKIE_NAME)?.value;
  if (existing && UUID_RE.test(existing)) {
    return existing;
  }

  const freshId = crypto.randomUUID();
  cookieStore.set(VOTER_COOKIE_NAME, freshId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR_SECONDS,
  });
  return freshId;
}
