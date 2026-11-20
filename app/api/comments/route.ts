import { NextResponse } from "next/server";
import {
  appendComment,
  confirmComment,
  readComments,
  validateCommentInput,
} from "@/lib/comments-store";

export async function GET() {
  const comments = await readComments();
  return NextResponse.json(
    { comments },
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

  const validated = validateCommentInput(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const comment = await appendComment(validated.data);
    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to persist community comment." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const commentId =
    typeof (body as Record<string, unknown>).commentId === "string"
      ? ((body as Record<string, unknown>).commentId as string).trim()
      : "";

  if (!commentId) {
    return NextResponse.json(
      { error: "Missing commentId to confirm." },
      { status: 400 }
    );
  }

  try {
    const comments = await confirmComment(commentId);
    if (!comments) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }
    return NextResponse.json({ comments }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to confirm comment." },
      { status: 500 }
    );
  }
}
