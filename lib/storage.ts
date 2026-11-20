import type { EvidenceAttachment, EvidenceItemType } from "./types";

/**
 * Phase 2 Evidence Storage Contract.
 *
 * Implement this adapter with Vercel Blob (`@vercel/blob`), AWS S3, or Cloudflare R2
 * once file uploads (payslips, contracts, accommodation condition photos) are enabled.
 *
 * Security & GDPR checklist before enabling uploads:
 * 1. Enforce MIME whitelist (PDF, PNG, JPEG, WebP) and max file size (e.g. 10 MB).
 * 2. Store files as private blobs with short-lived signed URLs rather than public buckets.
 * 3. Strip EXIF metadata and advise workers to redact BSN numbers and third-party faces/names.
 */
export interface EvidenceUploadRequest {
  reportId: string;
  type: EvidenceItemType;
  fileName: string;
  mimeType: EvidenceAttachment["mimeType"];
  sizeBytes: number;
}

export interface EvidenceStorageAdapter {
  readonly mode: "disabled-text-only" | "blob-enabled";
  readonly providerName: string;
  createUploadSlot(
    req: EvidenceUploadRequest
  ): Promise<{ uploadUrl: string; attachmentId: string }>;
  listByReport(reportId: string): Promise<EvidenceAttachment[]>;
}

export const ALLOWED_EVIDENCE_MIME_TYPES: readonly EvidenceAttachment["mimeType"][] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_EVIDENCE_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export const evidenceStorage: EvidenceStorageAdapter = {
  mode: "disabled-text-only",
  providerName: "Pending Blob Adapter (Vercel Blob / S3 / R2)",

  async createUploadSlot(req: EvidenceUploadRequest) {
    throw new Error(
      `Blob storage is not yet enabled (requested upload for ${req.fileName}). Wire lib/storage.ts to Vercel Blob or S3 in Phase 2.`
    );
  },

  async listByReport() {
    return [];
  },
};
