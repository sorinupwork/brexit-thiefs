import { formatSlugTitle, getAgencyBySlug } from "./agency-team";
import type {
  AgencyDiagnosticTally,
  DiagnosticQuestionId,
  DiagnosticQuestionTally,
} from "./types";

export const DIAGNOSTIC_QUESTION_IDS: readonly DiagnosticQuestionId[] = [
  "q-onboarding",
  "q-clawback",
  "q-adv-minus",
  "q-ignored-gear",
  "q-housing-street",
  "q-threats-finalpay",
];

export function createEmptyDiagnosticQuestions(): Record<
  DiagnosticQuestionId,
  DiagnosticQuestionTally
> {
  return {
    "q-onboarding": { yes: 0, no: 0, unsure: 0 },
    "q-clawback": { yes: 0, no: 0, unsure: 0 },
    "q-adv-minus": { yes: 0, no: 0, unsure: 0 },
    "q-ignored-gear": { yes: 0, no: 0, unsure: 0 },
    "q-housing-street": { yes: 0, no: 0, unsure: 0 },
    "q-threats-finalpay": { yes: 0, no: 0, unsure: 0 },
  };
}

export function createEmptyAgencyDiagnosticTally(
  agencySlug: string,
  agencyName?: string
): AgencyDiagnosticTally {
  const matched = getAgencyBySlug(agencySlug);
  return {
    agencySlug,
    agencyName:
      matched?.name ?? (agencyName?.trim() || formatSlugTitle(agencySlug)),
    submissions: 0,
    totalYesFlags: 0,
    criticalSubmissions: 0,
    questions: createEmptyDiagnosticQuestions(),
  };
}
