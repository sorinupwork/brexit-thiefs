import { NextResponse } from "next/server";
import {
  readPolls,
  recordPollVote,
  validatePollVote,
} from "@/lib/polls-store";

export async function GET() {
  const polls = await readPolls();
  return NextResponse.json(
    { polls },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const validated = validatePollVote(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const polls = await recordPollVote(validated.data);
    return NextResponse.json({ polls }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to persist vote locally." },
      { status: 500 }
    );
  }
}
