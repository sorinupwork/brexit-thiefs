import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  buildPrivateEvidenceUrl,
  getEvidenceBlob,
  isAllowedEvidenceMimeType,
  isBlobConfigured,
  MAX_EVIDENCE_FILE_BYTES,
  uploadEvidenceBlob,
} from "@/lib/storage";
import type { EvidenceAttachment, EvidenceItemType } from "@/lib/types";

const VALID_EVIDENCE_TYPES = new Set<EvidenceItemType>([
  "payslips",
  "contract",
  "written-messages",
  "bank-statements",
  "fuel-transport-logs",
  "housing-photos",
  "hours-log",
]);

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  if (
    !pathname ||
    !pathname.startsWith("evidence/") ||
    pathname.includes("..")
  ) {
    return NextResponse.json(
      { error: "Invalid or missing evidence pathname." },
      { status: 400 }
    );
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Private evidence blob storage is not configured." },
      { status: 503 }
    );
  }

  try {
    const result = await getEvidenceBlob(pathname);
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    const forceDownload = request.nextUrl.searchParams.get("download") === "1";
    const headers: Record<string, string> = {
      "Cache-Control": "private, no-cache",
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    };
    if (forceDownload) {
      headers["Content-Disposition"] = "attachment";
    }

    return new NextResponse(result.stream, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve private evidence file." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Private evidence blob storage is not configured." },
      { status: 503 }
    );
  }

  const contentTypeHeader = request.headers.get("content-type") ?? "";
  if (!contentTypeHeader.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Upload must be submitted as multipart/form-data." },
      { status: 400 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read uploaded form data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const rawType = formData.get("type");
  const redactedConfirmed = formData.get("redactedConfirmed");

  if (redactedConfirmed !== "true") {
    return NextResponse.json(
      {
        error:
          "Confirm that personal BSN numbers and third-party faces are redacted before uploading.",
      },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing evidence file in upload." },
      { status: 400 }
    );
  }

  if (!isAllowedEvidenceMimeType(file.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file format. Upload PDF, JPEG, PNG, or WebP evidence only.",
      },
      { status: 400 }
    );
  }

  if (file.size <= 0 || file.size > MAX_EVIDENCE_FILE_BYTES) {
    return NextResponse.json(
      {
        error: "Evidence file must be between 1 byte and 4.5 MB.",
      },
      { status: 400 }
    );
  }

  const evidenceType: EvidenceItemType =
    typeof rawType === "string" &&
    VALID_EVIDENCE_TYPES.has(rawType as EvidenceItemType)
      ? (rawType as EvidenceItemType)
      : "payslips";

  try {
    const blob = await uploadEvidenceBlob({
      type: evidenceType,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      body: file,
    });

    const proxyUrl = buildPrivateEvidenceUrl(blob.pathname);
    const id = crypto.randomUUID();
    const uploadedAt = new Date().toISOString();

    const attachment: EvidenceAttachment = {
      id,
      reportId: "",
      type: evidenceType,
      fileName: file.name.slice(0, 140),
      mimeType: file.type,
      sizeBytes: file.size,
      blobPathname: blob.pathname,
      blobUrl: proxyUrl,
      uploadedAt,
      redactedForPii: true,
    };

    return NextResponse.json({ attachment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload evidence file to private blob store." },
      { status: 500 }
    );
  }
}
