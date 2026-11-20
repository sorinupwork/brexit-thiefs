import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Public agency team submissions are disabled. Profiles are curated and read-only.",
    },
    { status: 405 }
  );
}
