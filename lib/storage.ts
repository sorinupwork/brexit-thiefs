import crypto from "crypto";
import { get, put, type GetBlobResult, type PutBlobResult } from "@vercel/blob";
import type { EvidenceAttachment, EvidenceItemType } from "./types";

/**
 * Phase 2 Evidence Storage Adapter — backed by Vercel Private Blob.
 *
 * Security & GDPR safeguards:
 * 1. Enforce MIME whitelist (PDF, PNG, JPEG, WebP) and max 4.5 MB server upload size.
 * 2. Always store blobs with `access: "private"` and stream through `/api/evidence?pathname=...`.
 * 3. Remind workers to redact BSN numbers and omit third-party faces/names.
 */
export interface EvidenceUploadRequest {
  reportId?: string;
  type: EvidenceItemType;
  fileName: string;
  mimeType: EvidenceAttachment["mimeType"];
  sizeBytes: number;
  body: Blob | Buffer | ReadableStream<Uint8Array>;
}

export const ALLOWED_EVIDENCE_MIME_TYPES: readonly EvidenceAttachment["mimeType"][] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Vercel App Router server uploads support up to 4.5 MB request bodies.
export const MAX_EVIDENCE_FILE_BYTES = 4_500_000;

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isAllowedEvidenceMimeType(
  mimeType: string
): mimeType is EvidenceAttachment["mimeType"] {
  return (ALLOWED_EVIDENCE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function sanitizeEvidenceFileName(rawName: string): string {
  const cleaned = rawName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (cleaned || "evidence-file").slice(0, 80);
}

export function buildPrivateEvidenceUrl(pathname: string): string {
  return `/api/evidence?pathname=${encodeURIComponent(pathname)}`;
}

export async function uploadEvidenceBlob(
  req: EvidenceUploadRequest
): Promise<PutBlobResult> {
  if (!isBlobConfigured()) {
    throw new Error(
      "Vercel Blob token (BLOB_READ_WRITE_TOKEN) is not configured."
    );
  }
  const safeName = sanitizeEvidenceFileName(req.fileName);
  const pathname = `evidence/${crypto.randomUUID()}-${safeName}`;

  return put(pathname, req.body, {
    access: "private",
    contentType: req.mimeType,
    addRandomSuffix: false,
  });
}

export async function getEvidenceBlob(
  pathname: string
): Promise<GetBlobResult | null> {
  if (!isBlobConfigured()) {
    return null;
  }
  return get(pathname, { access: "private" });
}
