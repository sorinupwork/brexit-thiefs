import { NextResponse } from "next/server";
import { readAgencies } from "@/lib/agencies-store";

export async function GET() {
  const agencies = await readAgencies();
  return NextResponse.json(
    { agencies },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Public agency submissions are disabled. This directory displays curated compliance profiles only.",
    },
    { status: 405 }
  );
}
