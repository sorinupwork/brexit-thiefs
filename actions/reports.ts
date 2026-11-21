"use server";

import { revalidatePath } from "next/cache";
import { appendReport, validateReportInput } from "@/lib/reports-store";
import type {
  EvidenceAttachment,
  ReportSubmissionInput,
  WorkerReport,
} from "@/lib/types";

export interface CreateReportActionResult {
  ok: boolean;
  report?: WorkerReport;
  error?: string;
}

export async function createReportAction(
  input: ReportSubmissionInput & { attachments?: EvidenceAttachment[] }
): Promise<CreateReportActionResult> {
  const validated = validateReportInput(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  try {
    const report = await appendReport(validated.data);
    revalidatePath("/");
    return { ok: true, report };
  } catch {
    return {
      ok: false,
      error: "Failed to save case dossier to the database.",
    };
  }
}
