export type Locale = "nl" | "en";

export type IssueCategory =
  | "wage-deduction"
  | "transport-fuel"
  | "contract-cao"
  | "accommodation-snf"
  | "recruitment"
  | "hours-overtime";

export type LifecycleStageId =
  | "recruitment"
  | "coordination"
  | "transport"
  | "payroll"
  | "accommodation"
  | "escalation";

export type EvidenceItemType =
  | "payslips"
  | "contract"
  | "written-messages"
  | "bank-statements"
  | "fuel-transport-logs"
  | "housing-photos"
  | "hours-log";

export type AuthorityId =
  | "arbeidsinspectie"
  | "sncu"
  | "snf"
  | "juridisch-loket"
  | "fairwork"
  | "politie";

/**
 * Phase 2 schema for blob-backed evidence attachments (e.g. Vercel Blob, S3, R2).
 * Currently unused in text-only mode; kept strongly typed for drop-in integration.
 */
export interface EvidenceAttachment {
  id: string;
  reportId: string;
  type: EvidenceItemType;
  fileName: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
  sizeBytes: number;
  blobPathname?: string;
  blobUrl: string;
  redactedForPii: boolean;
}

export interface WorkerReport {
  id: string;
  caseNumber: string;
  title: string;
  category: IssueCategory;
  stage: LifecycleStageId;
  region: string;
  agencyName?: string;
  originCorridor?: string;
  weeksWorked: number | null;
  disputedAmountEur: number | null;
  authorAlias: string;
  summary: string;
  timelineNotes: string;
  evidenceHeld: EvidenceItemType[];
  recommendedAuthorities: AuthorityId[];
  attachments: EvidenceAttachment[];
  createdAt: string;
  isSample?: boolean;
}

export interface ReportSubmissionInput {
  title: string;
  category: IssueCategory;
  stage: LifecycleStageId;
  region: string;
  agencyName?: string;
  originCorridor?: string;
  weeksWorked: number | null;
  disputedAmountEur: number | null;
  authorAlias: string;
  summary: string;
  timelineNotes: string;
  evidenceHeld: EvidenceItemType[];
}

export type RedFlagPollOptionId =
  | "retroactive-wage"
  | "fuel-clawback"
  | "adv-holiday-minus"
  | "unpaid-guarantee-benched"
  | "contract-bait-switch"
  | "snf-housing"
  | "street-abandonment"
  | "withheld-final-pay"
  | "discrimination-unequal-treatment";

export type BrusselsActionOptionId =
  | "ela-inspection"
  | "eu-commission-complaint"
  | "ep-peti-petition"
  | "solvit-network";

export type InstituteActionOptionId =
  | "arbeidsinspectie-audit"
  | "sncu-cao-audit"
  | "snf-housing-audit"
  | "politie-fraud-report"
  | "collective-lawsuit";

export type DiagnosticQuestionId =
  | "q-onboarding"
  | "q-clawback"
  | "q-adv-minus"
  | "q-ignored-gear"
  | "q-housing-street"
  | "q-threats-finalpay";

export type DiagnosticAnswer = "yes" | "no" | "unsure";

export type DiagnosticAnswersMap = Partial<
  Record<DiagnosticQuestionId, DiagnosticAnswer>
>;

export interface DiagnosticQuestionTally {
  yes: number;
  no: number;
  unsure: number;
}

export interface AgencyDiagnosticTally {
  agencySlug: string;
  agencyName: string;
  submissions: number;
  totalYesFlags: number;
  criticalSubmissions: number;
  questions: Record<DiagnosticQuestionId, DiagnosticQuestionTally>;
}

export interface DiagnosticSubmissionInput {
  agencySlug: string;
  agencyName?: string;
  answers: DiagnosticAnswersMap;
}

export interface PollState {
  redFlagVotes: Record<RedFlagPollOptionId, number>;
  brusselsActionVotes: Record<BrusselsActionOptionId, number>;
  instituteActionVotes: Record<InstituteActionOptionId, number>;
  reportFlags: Record<string, number>;
  agencyFlags: Record<string, number>;
  diagnosticConfirmations: number;
  agencyDiagnostics: Record<string, AgencyDiagnosticTally>;
}

export interface UserVotesState {
  redFlagVote: RedFlagPollOptionId | null;
  instituteActionVote: InstituteActionOptionId | null;
  brusselsActionVote: BrusselsActionOptionId | null;
  flaggedAgencies: string[];
  flaggedReports: string[];
  confirmedComments: string[];
  diagnosticConfirmed: boolean;
  diagnosticConfirmedAgencies: string[];
  diagnosticAnswersByAgency: Record<string, DiagnosticAnswersMap>;
}

export const EMPTY_USER_VOTES: UserVotesState = {
  redFlagVote: null,
  instituteActionVote: null,
  brusselsActionVote: null,
  flaggedAgencies: [],
  flaggedReports: [],
  confirmedComments: [],
  diagnosticConfirmed: false,
  diagnosticConfirmedAgencies: [],
  diagnosticAnswersByAgency: {},
};

export type CommentTopicId =
  | "wage-money-back"
  | "onboarding-lies"
  | "housing-snf"
  | "ignored-hours"
  | "rights-lawsuit";

export interface CommunityComment {
  id: string;
  agencyName: string;
  topic: CommentTopicId;
  corridor?: string;
  authorAlias: string;
  body: string;
  confirmations: number;
  createdAt: string;
  isSeeded?: boolean;
}

export interface CommentSubmissionInput {
  agencyName: string;
  topic: CommentTopicId;
  corridor?: string;
  authorAlias: string;
  body: string;
}

export interface LifecycleStageInfo {
  id: LifecycleStageId;
  stepNumber: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  legalFramework: string[];
  whatToVerify: string[];
  redFlags: string[];
  evidenceToCollect: string[];
  primaryAuthorities: AuthorityId[];
}

export interface DutchAuthority {
  id: AuthorityId;
  name: string;
  englishLabel: string;
  scope: string;
  bestFor: string[];
  url: string;
  actionLabel: string;
  urgent?: boolean;
}
