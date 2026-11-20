"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { CATEGORY_META, EVIDENCE_LABELS, NL_REGIONS } from "@/lib/data";
import {
  formatLocalizedLegalBrief,
  getLocalizedAuthority,
  getLocalizedBrusselsChannels,
  getLocalizedCategory,
  getLocalizedEvidenceLabel,
  getLocalizedReport,
  getLocalizedStages,
} from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";
import type {
  EvidenceItemType,
  IssueCategory,
  LifecycleStageId,
  PollState,
  WorkerReport,
} from "@/lib/types";

interface ReportsPortalProps {
  initialReports: WorkerReport[];
  initialPolls: PollState;
}

const EVIDENCE_OPTIONS = Object.keys(EVIDENCE_LABELS) as EvidenceItemType[];
const CATEGORY_OPTIONS = Object.keys(CATEGORY_META) as IssueCategory[];
const FLAG_EVENT = "werkrecht-report-flag-storage";

function subscribeFlagStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FLAG_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FLAG_EVENT, callback);
  };
}

function useFlaggedReports(): string[] {
  const raw = useSyncExternalStore(
    subscribeFlagStorage,
    () => {
      try {
        return window.localStorage.getItem("werkrecht_flagged_reports") ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]"
  );
  return useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  }, [raw]);
}

export function ReportsPortal({
  initialReports,
  initialPolls,
}: ReportsPortalProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].reports;
  const stages = getLocalizedStages(locale);
  const brusselsChannels = getLocalizedBrusselsChannels(locale);

  const [reports, setReports] = useState<WorkerReport[]>(initialReports);
  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(
    initialReports[0]?.id ?? null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flaggingId, setFlaggingId] = useState<string | null>(null);

  const flaggedIds = useFlaggedReports();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IssueCategory>("wage-deduction");
  const [stage, setStage] = useState<LifecycleStageId>("payroll");
  const [region, setRegion] = useState(NL_REGIONS[1]);
  const [agencyName, setAgencyName] = useState("");
  const [originCorridor, setOriginCorridor] = useState("");
  const [weeksWorked, setWeeksWorked] = useState("");
  const [disputedAmountEur, setDisputedAmountEur] = useState("");
  const [authorAlias, setAuthorAlias] = useState("");
  const [summary, setSummary] = useState("");
  const [timelineNotes, setTimelineNotes] = useState("");
  const [evidenceHeld, setEvidenceHeld] = useState<EvidenceItemType[]>([
    "payslips",
    "contract",
  ]);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    function onPollsUpdated(e: Event) {
      const custom = e as CustomEvent<PollState>;
      if (custom.detail) setPolls(custom.detail);
    }
    function onPrefillReport(e: Event) {
      const custom = e as CustomEvent<{
        category?: IssueCategory;
        stage?: LifecycleStageId;
        agencyName?: string;
        summary?: string;
      }>;
      if (!custom.detail) return;
      if (custom.detail.category) setCategory(custom.detail.category);
      if (custom.detail.stage) setStage(custom.detail.stage);
      if (custom.detail.agencyName) setAgencyName(custom.detail.agencyName);
      if (custom.detail.summary) setSummary(custom.detail.summary);
    }
    window.addEventListener("werkrecht-polls-updated", onPollsUpdated);
    window.addEventListener("werkrecht-prefill-report", onPrefillReport);
    return () => {
      window.removeEventListener("werkrecht-polls-updated", onPollsUpdated);
      window.removeEventListener("werkrecht-prefill-report", onPrefillReport);
    };
  }, []);

  const localizedReports = useMemo(
    () => reports.map((r) => getLocalizedReport(r, locale)),
    [reports, locale]
  );

  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return localizedReports.filter((report) => {
      if (selectedCategory !== "all" && report.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        report.title.toLowerCase().includes(q) ||
        report.summary.toLowerCase().includes(q) ||
        report.region.toLowerCase().includes(q) ||
        report.caseNumber.toLowerCase().includes(q) ||
        (report.agencyName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [localizedReports, selectedCategory, searchQuery]);

  const suggestedAuthorities = CATEGORY_META[category].authorities.map((id) =>
    getLocalizedAuthority(id, locale)
  );

  function toggleEvidence(item: EvidenceItemType) {
    setEvidenceHeld((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  async function handleFlagForBrussels(reportId: string) {
    if (flaggedIds.includes(reportId)) return;
    setFlaggingId(reportId);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "report-flag", targetId: reportId }),
      });
      const payload = (await res.json()) as { polls?: PollState };
      if (res.ok && payload.polls) {
        setPolls(payload.polls);
        try {
          const nextIds = [...flaggedIds, reportId];
          window.localStorage.setItem(
            "werkrecht_flagged_reports",
            JSON.stringify(nextIds)
          );
        } catch {
          // Ignore storage error
        }
        window.dispatchEvent(new Event(FLAG_EVENT));
        window.dispatchEvent(
          new CustomEvent("werkrecht-polls-updated", { detail: payload.polls })
        );
      }
    } finally {
      setFlaggingId(null);
    }
  }

  async function handleCopyBrief(report: WorkerReport) {
    try {
      await navigator.clipboard.writeText(
        formatLocalizedLegalBrief(report, locale)
      );
      setCopiedId(report.id);
      setTimeout(
        () => setCopiedId((curr) => (curr === report.id ? null : curr)),
        2200
      );
    } catch {
      handleDownloadBrief(report);
    }
  }

  function handleDownloadBrief(report: WorkerReport) {
    const text = formatLocalizedLegalBrief(report, locale);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.caseNumber.toLowerCase()}-external-eu-brief.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!privacyConfirmed) {
      setFormError(copy.privacyError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          stage,
          region,
          agencyName,
          originCorridor,
          weeksWorked: weeksWorked === "" ? null : Number(weeksWorked),
          disputedAmountEur:
            disputedAmountEur === "" ? null : Number(disputedAmountEur),
          authorAlias:
            authorAlias.trim() ||
            (locale === "nl" ? "Anonieme Uitzendkracht" : "Anonymous Worker"),
          summary,
          timelineNotes,
          evidenceHeld,
        }),
      });

      const payload = (await res.json()) as {
        report?: WorkerReport;
        error?: string;
      };

      if (!res.ok || !payload.report) {
        setFormError(payload.error ?? copy.saveErrorFallback);
        return;
      }

      setReports((prev) => [payload.report!, ...prev]);
      window.dispatchEvent(
        new CustomEvent("werkrecht-report-added", { detail: payload.report })
      );
      setExpandedId(payload.report.id);
      setTitle("");
      setAgencyName("");
      setOriginCorridor("");
      setWeeksWorked("");
      setDisputedAmountEur("");
      setAuthorAlias("");
      setSummary("");
      setTimelineNotes("");
      setPrivacyConfirmed(false);
      setFormSuccess(
        `${copy.successPrefix} ${payload.report.caseNumber}. ${copy.successSuffix}`
      );
    } catch {
      setFormError(copy.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reports" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: External Case Feed */}
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {copy.intro}
            </p>

            {/* Filter & Search Bar */}
            <div className="mt-6 flex flex-col gap-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                aria-label="Search worker reports"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {copy.allFilter} ({reports.length})
                </button>
                {CATEGORY_OPTIONS.map((catId) => {
                  const active = selectedCategory === catId;
                  const cat = getLocalizedCategory(catId, locale);
                  return (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => setSelectedCategory(catId)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {cat.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reports List */}
            <div className="mt-6 space-y-4">
              {filteredReports.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    {copy.emptyTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{copy.emptySub}</p>
                </div>
              ) : (
                filteredReports.map((report) => {
                  const cat = getLocalizedCategory(report.category, locale);
                  const isOpen = expandedId === report.id;
                  const flagCount = polls.reportFlags[report.id] ?? 0;
                  const isFlagged = flaggedIds.includes(report.id);

                  return (
                    <article
                      key={report.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {report.caseNumber}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cat.badgeClass}`}
                          >
                            {cat.shortLabel}
                          </span>
                          {report.disputedAmountEur !== null && (
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-800">
                              {copy.minusBadgePrefix} -€
                              {report.disputedAmountEur.toLocaleString(
                                locale === "nl" ? "nl-NL" : "en-IE"
                              )}
                            </span>
                          )}
                          {report.isSample && (
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-600">
                              {copy.sampleBadge}
                            </span>
                          )}
                        </div>
                        <time
                          dateTime={report.createdAt}
                          className="font-mono text-[11px] text-slate-500"
                        >
                          {report.createdAt.slice(0, 10)}
                        </time>
                      </div>

                      <h3 className="mt-3 text-base font-semibold leading-snug text-slate-950">
                        {report.title}
                      </h3>

                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
                        <span>
                          {copy.regionLabel} {report.region}
                        </span>
                        <span>
                          {copy.stageLabel} {report.stage}
                        </span>
                        {report.agencyName && (
                          <span className="font-semibold text-slate-700">
                            {report.agencyName}
                          </span>
                        )}
                        {report.originCorridor && (
                          <span>{report.originCorridor}</span>
                        )}
                        {report.weeksWorked !== null && (
                          <span>
                            {copy.durationLabel} {report.weeksWorked}{" "}
                            {copy.weeksSuffix}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        {report.summary}
                      </p>

                      {isOpen && (
                        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                          {report.timelineNotes && (
                            <div>
                              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                {copy.timelineHeading}
                              </h4>
                              <pre className="mt-1.5 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700">
                                {report.timelineNotes}
                              </pre>
                            </div>
                          )}

                          <div>
                            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              {copy.evidenceHeading}
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {report.evidenceHeld.length > 0 ? (
                                report.evidenceHeld.map((ev) => (
                                  <span
                                    key={ev}
                                    className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-900"
                                  >
                                    ✓ {getLocalizedEvidenceLabel(ev, locale)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500">
                                  {copy.noEvidence}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              {copy.authoritiesHeading}
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {report.recommendedAuthorities.map((authId) => {
                                const auth = getLocalizedAuthority(
                                  authId,
                                  locale
                                );
                                return (
                                  <a
                                    key={auth.id}
                                    href={auth.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 hover:border-[#D95D24] hover:text-[#D95D24]"
                                  >
                                    {auth.name} ↗
                                  </a>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-800">
                              {copy.brusselsChannelsHeading}
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {brusselsChannels.map((ch) => (
                                <a
                                  key={ch.id}
                                  href={ch.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-900 hover:border-sky-500"
                                >
                                  {ch.name} ↗
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                        <span className="text-xs text-slate-500">
                          {report.authorAlias}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isFlagged || flaggingId === report.id}
                            onClick={() => handleFlagForBrussels(report.id)}
                            className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                              isFlagged
                                ? "border-rose-300 bg-rose-50 text-rose-800"
                                : "border-rose-200 bg-white text-rose-700 hover:border-rose-500 hover:bg-rose-50"
                            }`}
                          >
                            🚩{" "}
                            {isFlagged
                              ? copy.flaggedBrusselsBtn
                              : copy.flagBrusselsBtn}{" "}
                            ({flagCount})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isOpen ? null : report.id)
                            }
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950"
                          >
                            {isOpen ? copy.hideDetails : copy.inspectTimeline}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyBrief(report)}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                          >
                            {copiedId === report.id
                              ? copy.copiedBrief
                              : copy.copyBrief}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadBrief(report)}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#D95D24] hover:text-[#D95D24]"
                          >
                            {copy.downloadTxt}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Submit External Case Report */}
          <div id="submit-report" className="scroll-mt-24 lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#D95D24]">
                  {copy.formTag}
                </span>
                <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 font-mono text-[10px] font-medium text-slate-700">
                  {copy.phaseBadge}
                </span>
              </div>
              <h3 className="mt-1.5 text-xl font-semibold text-slate-950">
                {copy.formTitle}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {copy.formIntro}
              </p>

              {/* Privacy / GDPR Notice */}
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs leading-relaxed text-amber-950">
                <strong>{copy.gdprTitle}</strong> {copy.gdprBody}
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="report-title"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.titleLabel}
                  </label>
                  <input
                    id="report-title"
                    type="text"
                    required
                    minLength={8}
                    maxLength={160}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={copy.titlePlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="report-category"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.categoryLabel}
                    </label>
                    <select
                      id="report-category"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as IssueCategory)
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    >
                      {CATEGORY_OPTIONS.map((catId) => (
                        <option key={catId} value={catId}>
                          {getLocalizedCategory(catId, locale).shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="report-stage"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.stageFieldLabel}
                    </label>
                    <select
                      id="report-stage"
                      value={stage}
                      onChange={(e) =>
                        setStage(e.target.value as LifecycleStageId)
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    >
                      {stages.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.stepNumber} · {st.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="report-agency"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.agencySelectLabel}
                    </label>
                    <input
                      id="report-agency"
                      type="text"
                      maxLength={80}
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder={copy.agencySelectPlaceholder}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="report-corridor"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.corridorLabel}
                    </label>
                    <input
                      id="report-corridor"
                      type="text"
                      maxLength={60}
                      value={originCorridor}
                      onChange={(e) => setOriginCorridor(e.target.value)}
                      placeholder={copy.corridorPlaceholder}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="report-weeks"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.weeksFieldLabel}
                    </label>
                    <input
                      id="report-weeks"
                      type="number"
                      min={0}
                      max={520}
                      value={weeksWorked}
                      onChange={(e) => setWeeksWorked(e.target.value)}
                      placeholder="10"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="report-amount"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.amountFieldLabel}
                    </label>
                    <input
                      id="report-amount"
                      type="number"
                      min={0}
                      max={500000}
                      value={disputedAmountEur}
                      onChange={(e) => setDisputedAmountEur(e.target.value)}
                      placeholder="1250"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="report-region"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.regionFieldLabel}
                    </label>
                    <select
                      id="report-region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    >
                      {NL_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="report-alias"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.aliasLabel}
                  </label>
                  <input
                    id="report-alias"
                    type="text"
                    maxLength={80}
                    value={authorAlias}
                    onChange={(e) => setAuthorAlias(e.target.value)}
                    placeholder={copy.aliasPlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="report-summary"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.summaryLabel}
                  </label>
                  <textarea
                    id="report-summary"
                    required
                    rows={3}
                    minLength={25}
                    maxLength={3000}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={copy.summaryPlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="report-timeline"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.timelineLabel}
                  </label>
                  <textarea
                    id="report-timeline"
                    rows={3}
                    maxLength={4000}
                    value={timelineNotes}
                    onChange={(e) => setTimelineNotes(e.target.value)}
                    placeholder={copy.timelinePlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                {/* Evidence Checklist */}
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    {copy.evidenceCheckHeading}
                  </span>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {EVIDENCE_OPTIONS.map((ev) => {
                      const checked = evidenceHeld.includes(ev);
                      return (
                        <label
                          key={ev}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors ${
                            checked
                              ? "border-slate-900 bg-white text-slate-950"
                              : "border-slate-200 bg-white/60 text-slate-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEvidence(ev)}
                            className="h-3.5 w-3.5 accent-slate-900"
                          />
                          <span>{getLocalizedEvidenceLabel(ev, locale)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 2 Blob Storage Slot */}
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase text-slate-700">
                      {copy.vaultTitle}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                      lib/storage.ts
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {copy.vaultDesc}
                  </p>
                </div>

                {/* Auto-matched Authorities Preview */}
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {copy.autoMatchHeading}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {suggestedAuthorities.map((auth) => (
                      <span
                        key={auth.id}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-800"
                      >
                        {auth.name}
                      </span>
                    ))}
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[11px] font-medium text-sky-900">
                      ELA / EU Brussels
                    </span>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={privacyConfirmed}
                    onChange={(e) => setPrivacyConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#D95D24]"
                  />
                  <span>{copy.privacyConfirm}</span>
                </label>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800"
                  >
                    {formError}
                  </p>
                )}

                {formSuccess && (
                  <p
                    role="status"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"
                  >
                    {formSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#D95D24] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? copy.submittingBtn : copy.submitBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
