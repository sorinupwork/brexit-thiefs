import { NextResponse } from "next/server";
import {
  appendReport,
  readReports,
  validateReportInput,
} from "@/lib/reports-store";

export async function GET() {
  const reports = await readReports();
  return NextResponse.json(
    { reports },
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

  const validated = validateReportInput(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const report = await appendReport(validated.data);
    return NextResponse.json({ report }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to persist report locally." },
      { status: 500 }
    );
  }
}
