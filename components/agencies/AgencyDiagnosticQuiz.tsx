"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitDiagnosticAction } from "@/actions/votes";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  useLocalStorageValue,
  writeLocalStorageValue,
} from "@/lib/client-storage";
import { createEmptyAgencyDiagnosticTally } from "@/lib/diagnostic-utils";
import { UI_TEXT } from "@/lib/i18n-ui";
import type {
  DiagnosticAnswer,
  DiagnosticAnswersMap,
  DiagnosticQuestionId,
  PollState,
  UserVotesState,
} from "@/lib/types";

const AGENCY_DIAGNOSTICS_STORAGE_KEY = "werkrecht_agency_diagnostics_v2";
const AGENCY_DIAGNOSTICS_EVENT = "werkrecht-agency-diagnostics-storage";

export const PENDING_OBJECTION_STORAGE_KEY =
  "werkrecht_pending_prefill_objection";
export const PENDING_REPORT_STORAGE_KEY = "werkrecht_pending_prefill_report";

const OFFICIAL_REGISTRIES = [
  {
    id: "waadi",
    labelNl: "KvK Waadi Check ↗",
    labelEn: "KvK Waadi Check ↗",
    url: "https://www.kvk.nl/waadi-check/",
  },
  {
    id: "sna",
    labelNl: "SNA NEN 4400-1 Register ↗",
    labelEn: "SNA NEN 4400-1 Register ↗",
    url: "https://www.normeringarbeid.nl/en/register",
  },
  {
    id: "snf",
    labelNl: "SNF Huisvestingsregister ↗",
    labelEn: "SNF Housing Register ↗",
    url: "https://www.normeringflexwonen.nl/register",
  },
] as const;

interface AgencyDiagnosticQuizProps {
  agencySlug: string;
  agencyName: string;
  registryChecklistNote?: string;
  polls: PollState;
  userVotes: UserVotesState;
  onPollsUpdated: (polls: PollState) => void;
  onUserVotesUpdated: (userVotes: UserVotesState) => void;
  mode: "home" | "agency-page";
  id?: string;
  className?: string;
}

function parseStoredAgencyDiagnostics(
  raw: string
): Record<string, DiagnosticAnswersMap> {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, DiagnosticAnswersMap>;
  } catch {
    return {};
  }
}

export function AgencyDiagnosticQuiz({
  agencySlug,
  agencyName,
  registryChecklistNote,
  polls,
  userVotes,
  onPollsUpdated,
  onUserVotesUpdated,
  mode,
  id = "confirm-questions",
  className = "mt-10",
}: AgencyDiagnosticQuizProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agencySpotlight;

  const [draftAnswersByAgency, setDraftAnswersByAgency] = useState<
    Record<string, DiagnosticAnswersMap>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErrorState, setSubmitErrorState] = useState<{
    slug: string;
    message: string;
  } | null>(null);
  const [justSavedSlug, setJustSavedSlug] = useState<string | null>(null);

  const submitError =
    submitErrorState?.slug === agencySlug ? submitErrorState.message : null;

  const rawLocalDiagnostics = useLocalStorageValue(
    AGENCY_DIAGNOSTICS_STORAGE_KEY,
    AGENCY_DIAGNOSTICS_EVENT,
    "{}"
  );

  const localSubmittedByAgency = useMemo(
    () => parseStoredAgencyDiagnostics(rawLocalDiagnostics),
    [rawLocalDiagnostics]
  );

  const isSubmittedForAgency =
    userVotes.diagnosticConfirmedAgencies.includes(agencySlug) ||
    Boolean(localSubmittedByAgency[agencySlug]);

  const savedAnswersForAgency =
    userVotes.diagnosticAnswersByAgency[agencySlug] ??
    localSubmittedByAgency[agencySlug];

  const answers: DiagnosticAnswersMap = useMemo(() => {
    if (isSubmittedForAgency && savedAnswersForAgency) {
      return savedAnswersForAgency;
    }
    return draftAnswersByAgency[agencySlug] ?? {};
  }, [
    isSubmittedForAgency,
    savedAnswersForAgency,
    draftAnswersByAgency,
    agencySlug,
  ]);

  const agencyTally = useMemo(
    () =>
      polls.agencyDiagnostics?.[agencySlug] ??
      createEmptyAgencyDiagnosticTally(agencySlug, agencyName),
    [polls.agencyDiagnostics, agencySlug, agencyName]
  );

  const yesQuestions = useMemo(
    () =>
      copy.questions.filter(
        (q) => answers[q.id as DiagnosticQuestionId] === "yes"
      ),
    [copy.questions, answers]
  );
  const yesCount = yesQuestions.length;
  const answeredCount = Object.keys(answers).length;

  function setQuestionAnswer(
    questionId: DiagnosticQuestionId,
    answer: DiagnosticAnswer
  ) {
    if (isSubmittedForAgency || submitting) return;
    setSubmitErrorState(null);
    setDraftAnswersByAgency((prev) => ({
      ...prev,
      [agencySlug]: {
        ...(prev[agencySlug] ?? {}),
        [questionId]: answer,
      },
    }));
  }

  function resetAgencyDraft() {
    if (isSubmittedForAgency || submitting) return;
    setSubmitErrorState(null);
    setDraftAnswersByAgency((prev) => ({
      ...prev,
      [agencySlug]: {},
    }));
  }

  async function handleConfirmQuizToTally() {
    if (isSubmittedForAgency || answeredCount === 0 || submitting) return;
    setSubmitting(true);
    setSubmitErrorState(null);
    try {
      const result = await submitDiagnosticAction({
        agencySlug,
        agencyName,
        answers,
      });

      if (!result.ok || !result.polls) {
        setSubmitErrorState({
          slug: agencySlug,
          message: result.error ?? copy.submitErrorFallback,
        });
        return;
      }

      onPollsUpdated(result.polls);
      if (result.userVotes) {
        onUserVotesUpdated(result.userVotes);
      }

      const nextLocalMap: Record<string, DiagnosticAnswersMap> = {
        ...localSubmittedByAgency,
        [agencySlug]: answers,
      };
      writeLocalStorageValue(
        AGENCY_DIAGNOSTICS_STORAGE_KEY,
        JSON.stringify(nextLocalMap),
        AGENCY_DIAGNOSTICS_EVENT
      );

      window.dispatchEvent(
        new CustomEvent("werkrecht-polls-updated", { detail: result.polls })
      );
      setJustSavedSlug(agencySlug);
    } catch {
      setSubmitErrorState({
        slug: agencySlug,
        message: copy.submitErrorFallback,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleJumpToDemandLetter() {
    const primaryQuestion = yesQuestions[0];
    const payload = {
      disputeType: primaryQuestion?.disputeType ?? "combined",
      agencyName,
    };

    if (mode === "home") {
      window.dispatchEvent(
        new CustomEvent("werkrecht-prefill-objection", { detail: payload })
      );
      document
        .getElementById("objection-letter")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      window.sessionStorage.setItem(
        PENDING_OBJECTION_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch {
      // Ignore storage errors
    }
    router.push("/#objection-letter");
  }

  function handleJumpToReportForm() {
    const primaryQuestion = yesQuestions[0];
    const confirmedList = yesQuestions.map((q) => `- ${q.question}`).join("\n");
    const payload = {
      agencyName,
      category: primaryQuestion?.category ?? "wage-deduction",
      stage: primaryQuestion?.stage ?? "payroll",
      summary: confirmedList
        ? `Confirmed red-flag patterns (${agencyName}):\n${confirmedList}`
        : "",
    };

    if (mode === "home") {
      window.dispatchEvent(
        new CustomEvent("werkrecht-prefill-report", { detail: payload })
      );
      document
        .getElementById("submit-report")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      window.sessionStorage.setItem(
        PENDING_REPORT_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch {
      // Ignore storage errors
    }
    router.push("/#submit-report");
  }

  return (
    <div
      id={id}
      className={`${className} scroll-mt-24 rounded-2xl border-2 border-slate-900 bg-slate-950 p-6 text-slate-100 shadow-lg sm:p-8`}
    >
      {/* Header + Per-Agency Live Firestore Tally */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400">
              {copy.quizEyebrow}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {copy.auditingAgencyBadge} {agencyName}
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {copy.quizHeading}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            {copy.quizIntro}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isSubmittedForAgency && answeredCount > 0 && (
            <button
              type="button"
              onClick={resetAgencyDraft}
              className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500"
            >
              {copy.resetQuizBtn}
            </button>
          )}
        </div>
      </div>

      {/* Live Firestore Community Tally Bar for THIS Agency */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3">
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {agencyName} · {copy.tallyStatsSubmissions}
          </span>
          <span className="mt-1 block font-mono text-xl font-bold text-white">
            {agencyTally.submissions}
          </span>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/25 px-4 py-3">
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-300">
            {agencyName} · {copy.tallyStatsViolations}
          </span>
          <span className="mt-1 block font-mono text-xl font-bold text-rose-300">
            {agencyTally.totalYesFlags}
          </span>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3">
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300">
            {agencyName} · {copy.tallyStatsCritical}
          </span>
          <span className="mt-1 block font-mono text-xl font-bold text-amber-300">
            {agencyTally.criticalSubmissions}
          </span>
        </div>
      </div>

      {/* Direct Waadi / SNA / SNF Registry Quick-Check Strip (Agency Page) */}
      {registryChecklistNote && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                {copy.registryQuickCheckTitle} · {agencyName}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {registryChecklistNote}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {OFFICIAL_REGISTRIES.map((reg) => (
                <a
                  key={reg.id}
                  href={reg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-[11px] font-semibold text-slate-200 transition-colors hover:border-amber-400 hover:text-amber-300"
                >
                  {locale === "nl" ? reg.labelNl : reg.labelEn}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6 Questions Grid with Per-Agency Community Tally Bars */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {copy.questions.map((q) => {
          const qId = q.id as DiagnosticQuestionId;
          const current = answers[qId];
          const qTally = agencyTally.questions[qId] ?? {
            yes: 0,
            no: 0,
            unsure: 0,
          };
          const qTotal = qTally.yes + qTally.no + qTally.unsure;
          const yesPct = qTotal > 0 ? Math.round((qTally.yes / qTotal) * 100) : 0;
          const noPct = qTotal > 0 ? Math.round((qTally.no / qTotal) * 100) : 0;
          const unsurePct =
            qTotal > 0 ? Math.max(0, 100 - yesPct - noPct) : 0;

          return (
            <div
              key={q.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                current === "yes"
                  ? "border-rose-500/70 bg-rose-950/30"
                  : current === "no"
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : "border-slate-800 bg-slate-900/70"
              }`}
            >
              <div>
                <p className="text-sm font-semibold leading-snug text-white">
                  {q.question}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isSubmittedForAgency || submitting}
                    onClick={() => setQuestionAnswer(qId, "yes")}
                    aria-pressed={current === "yes"}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default ${
                      current === "yes"
                        ? "border-rose-500 bg-rose-600 text-white"
                        : "border-slate-700 bg-slate-950 text-slate-200 hover:border-rose-400 disabled:opacity-60"
                    }`}
                  >
                    🚩 {copy.yesBtn}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittedForAgency || submitting}
                    onClick={() => setQuestionAnswer(qId, "no")}
                    aria-pressed={current === "no"}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default ${
                      current === "no"
                        ? "border-emerald-500 bg-emerald-600 text-white"
                        : "border-slate-700 bg-slate-950 text-slate-200 hover:border-emerald-400 disabled:opacity-60"
                    }`}
                  >
                    ✓ {copy.noBtn}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittedForAgency || submitting}
                    onClick={() => setQuestionAnswer(qId, "unsure")}
                    aria-pressed={current === "unsure"}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default ${
                      current === "unsure"
                        ? "border-amber-400 bg-amber-500 text-slate-950"
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-amber-400 disabled:opacity-60"
                    }`}
                  >
                    ? {copy.unsureBtn}
                  </button>
                </div>

                {(current === "yes" || current === "unsure") && (
                  <div className="mt-3 space-y-2 border-t border-slate-800 pt-3 text-xs">
                    <p className="leading-relaxed text-rose-200">
                      <strong className="font-mono text-[10px] uppercase tracking-wider text-rose-400">
                        {copy.whyIllegalLabel}{" "}
                      </strong>
                      {q.whyIllegal}
                    </p>
                    <p className="leading-relaxed text-amber-100">
                      <strong className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                        {copy.proofNeededLabel}{" "}
                      </strong>
                      {q.proof}
                    </p>
                  </div>
                )}
              </div>

              {/* Per-Question Live Community Tally for THIS Agency */}
              <div className="mt-3.5 border-t border-slate-800/90 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                  <span className="text-slate-400">
                    {copy.questionTallyLabel}{" "}
                    <strong className="text-slate-200">{agencyName}</strong>
                  </span>
                  {qTotal > 0 ? (
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-rose-300">
                        🚩 {qTally.yes} ({yesPct}%)
                      </span>
                      <span className="text-emerald-300">
                        ✓ {qTally.no} ({noPct}%)
                      </span>
                      <span className="text-amber-300">? {qTally.unsure}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </div>

                {qTotal > 0 ? (
                  <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    {yesPct > 0 && (
                      <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${yesPct}%` }}
                      />
                    )}
                    {noPct > 0 && (
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${noPct}%` }}
                      />
                    )}
                    {unsurePct > 0 && (
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${unsurePct}%` }}
                      />
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-slate-500">
                    {copy.questionTallyEmpty}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Confirmation Verdict & Direct Action Bar */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                {copy.verdictTitle} · {agencyName}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                  yesCount >= 3
                    ? "bg-rose-600 text-white"
                    : yesCount >= 1
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                }`}
              >
                {yesCount} {copy.confirmedCountSuffix}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
              {yesCount >= 3
                ? copy.verdictCritical
                : yesCount >= 1
                  ? copy.verdictWarn
                  : copy.verdictClear}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              disabled={isSubmittedForAgency || answeredCount === 0 || submitting}
              onClick={handleConfirmQuizToTally}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                isSubmittedForAgency
                  ? "border-emerald-400 bg-emerald-600 text-white"
                  : answeredCount > 0
                    ? "border-rose-400 bg-rose-600 text-white hover:bg-rose-700"
                    : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              {submitting
                ? copy.savingToTallyBtn
                : isSubmittedForAgency
                  ? `${copy.sentToTallyBtn} (${agencyName})`
                  : answeredCount > 0
                    ? `${copy.sendToTallyBtn} (${answeredCount}/6)`
                    : `${copy.answerAtLeastOneHint} ${agencyName}`}
            </button>
            <button
              type="button"
              onClick={handleJumpToDemandLetter}
              className="rounded-lg bg-[#D95D24] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
            >
              {copy.draftDemandFromQuizBtn}
            </button>
            <button
              type="button"
              onClick={handleJumpToReportForm}
              className="rounded-lg border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white"
            >
              {copy.logCaseFromQuizBtn}
            </button>
          </div>
        </div>

        {submitError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/60 px-3.5 py-2.5 text-xs text-rose-200"
          >
            {submitError}
          </p>
        )}

        {(justSavedSlug === agencySlug || isSubmittedForAgency) && !submitError && (
          <div
            role="status"
            className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-3.5 py-2.5 text-xs text-emerald-200"
          >
            <span>
              {justSavedSlug === agencySlug
                ? `${copy.savedBannerPrefix} ${agencyName} ${copy.savedBannerSuffix}`
                : `${copy.alreadySubmittedNote} ${agencyName}. ${copy.switchAgencyHint}`}
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-300">
              {agencyTally.submissions} {copy.tallyStatsSubmissions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
