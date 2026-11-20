"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  formatBrusselsAggregatedBrief,
  getLocalizedBrusselsChannels,
  getLocalizedComment,
  getLocalizedCommentTopicLabel,
} from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";
import type {
  BrusselsActionOptionId,
  CommentTopicId,
  CommunityComment,
  InstituteActionOptionId,
  PollState,
  RedFlagPollOptionId,
  WorkerReport,
} from "@/lib/types";

interface EuropeFairWorkSpotlightProps {
  initialReports: WorkerReport[];
  initialPolls: PollState;
  initialComments: CommunityComment[];
}

const VOTE_EVENT = "werkrecht-local-vote-change";
const COMMENT_CONFIRM_EVENT = "werkrecht-comment-confirm-storage";

const COMMENT_TOPICS: CommentTopicId[] = [
  "wage-money-back",
  "onboarding-lies",
  "housing-snf",
  "ignored-hours",
  "rights-lawsuit",
];

function subscribeStorageEvent(eventName: string) {
  return (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(eventName, callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(eventName, callback);
    };
  };
}

function useVotedOption(storageKey: string): string | null {
  return useSyncExternalStore(
    subscribeStorageEvent(VOTE_EVENT),
    () => {
      try {
        return window.localStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    () => null
  );
}

function useConfirmedComments(): string[] {
  const raw = useSyncExternalStore(
    subscribeStorageEvent(COMMENT_CONFIRM_EVENT),
    () => {
      try {
        return (
          window.localStorage.getItem("werkrecht_confirmed_comments") ?? "[]"
        );
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

export function EuropeFairWorkSpotlight({
  initialReports,
  initialPolls,
  initialComments,
}: EuropeFairWorkSpotlightProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].europeSpotlight;
  const brusselsChannels = getLocalizedBrusselsChannels(locale);

  const [reports, setReports] = useState<WorkerReport[]>(initialReports);
  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [votingKind, setVotingKind] = useState<string | null>(null);

  // Community comments state
  const [commentFilter, setCommentFilter] = useState<string>("all");
  const [commentAgency, setCommentAgency] = useState("Charlie works");
  const [commentTopic, setCommentTopic] =
    useState<CommentTopicId>("wage-money-back");
  const [commentCorridor, setCommentCorridor] = useState("");
  const [commentAlias, setCommentAlias] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentGdpr, setCommentGdpr] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null);
  const [confirmingCommentId, setConfirmingCommentId] = useState<string | null>(
    null
  );

  const votedRedFlag = useVotedOption("werkrecht_vote_red_flag");
  const votedInstitute = useVotedOption("werkrecht_vote_institute_action");
  const votedBrussels = useVotedOption("werkrecht_vote_brussels_action");
  const confirmedComments = useConfirmedComments();

  useEffect(() => {
    function onReportAdded(e: Event) {
      const custom = e as CustomEvent<WorkerReport>;
      if (!custom.detail) return;
      setReports((prev) =>
        prev.some((r) => r.id === custom.detail.id)
          ? prev
          : [custom.detail, ...prev]
      );
    }
    function onPollsUpdated(e: Event) {
      const custom = e as CustomEvent<PollState>;
      if (!custom.detail) return;
      setPolls(custom.detail);
    }
    window.addEventListener("werkrecht-report-added", onReportAdded);
    window.addEventListener("werkrecht-polls-updated", onPollsUpdated);
    return () => {
      window.removeEventListener("werkrecht-report-added", onReportAdded);
      window.removeEventListener("werkrecht-polls-updated", onPollsUpdated);
    };
  }, []);

  const totalMinusEur = useMemo(
    () => reports.reduce((sum, r) => sum + (r.disputedAmountEur ?? 0), 0),
    [reports]
  );

  const totalRedFlagVotes = useMemo(
    () =>
      Object.values(polls.redFlagVotes).reduce((sum, count) => sum + count, 0),
    [polls.redFlagVotes]
  );

  const totalInstituteVotes = useMemo(
    () =>
      Object.values(polls.instituteActionVotes ?? {}).reduce(
        (sum, count) => sum + count,
        0
      ),
    [polls.instituteActionVotes]
  );

  const totalBrusselsVotes = useMemo(
    () =>
      Object.values(polls.brusselsActionVotes).reduce(
        (sum, count) => sum + count,
        0
      ),
    [polls.brusselsActionVotes]
  );

  const totalCaseFlags = useMemo(
    () =>
      Object.values(polls.reportFlags).reduce((sum, count) => sum + count, 0),
    [polls.reportFlags]
  );

  const totalAgencyFlags = useMemo(
    () =>
      Object.values(polls.agencyFlags ?? {}).reduce(
        (sum, count) => sum + count,
        0
      ),
    [polls.agencyFlags]
  );

  const totalCommentConfirmations = useMemo(
    () =>
      comments.reduce((sum, item) => sum + (item.confirmations ?? 0), 0),
    [comments]
  );

  const localizedComments = useMemo(
    () => comments.map((c) => getLocalizedComment(c, locale)),
    [comments, locale]
  );

  const filteredComments = useMemo(() => {
    if (commentFilter === "all") return localizedComments;
    return localizedComments.filter((c) => c.agencyName === commentFilter);
  }, [localizedComments, commentFilter]);

  async function castPollVote(
    kind: "red-flag" | "institute-action" | "brussels-action",
    targetId:
      | RedFlagPollOptionId
      | InstituteActionOptionId
      | BrusselsActionOptionId
  ) {
    const storageKey =
      kind === "red-flag"
        ? "werkrecht_vote_red_flag"
        : kind === "institute-action"
          ? "werkrecht_vote_institute_action"
          : "werkrecht_vote_brussels_action";

    try {
      if (window.localStorage.getItem(storageKey)) return;
    } catch {
      // Allow voting if localStorage is blocked
    }

    setVotingKind(`${kind}:${targetId}`);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, targetId }),
      });
      const payload = (await res.json()) as { polls?: PollState };
      if (res.ok && payload.polls) {
        setPolls(payload.polls);
        try {
          window.localStorage.setItem(storageKey, targetId);
        } catch {
          // Ignore storage error
        }
        window.dispatchEvent(new Event(VOTE_EVENT));
        window.dispatchEvent(
          new CustomEvent("werkrecht-polls-updated", { detail: payload.polls })
        );
      }
    } finally {
      setVotingKind(null);
    }
  }

  async function handleConfirmComment(commentId: string) {
    if (confirmedComments.includes(commentId)) return;
    setConfirmingCommentId(commentId);
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      const payload = (await res.json()) as { comments?: CommunityComment[] };
      if (res.ok && payload.comments) {
        setComments(payload.comments);
        try {
          window.localStorage.setItem(
            "werkrecht_confirmed_comments",
            JSON.stringify([...confirmedComments, commentId])
          );
        } catch {
          // Ignore storage error
        }
        window.dispatchEvent(new Event(COMMENT_CONFIRM_EVENT));
      }
    } finally {
      setConfirmingCommentId(null);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCommentError(null);
    setCommentSuccess(null);

    if (!commentGdpr) {
      setCommentError(copy.commentGdprError);
      return;
    }

    setCommentSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyName: commentAgency,
          topic: commentTopic,
          corridor: commentCorridor,
          authorAlias:
            commentAlias.trim() ||
            (locale === "nl" ? "Anonieme Werknemer" : "Anonymous Worker"),
          body: commentBody,
        }),
      });
      const payload = (await res.json()) as {
        comment?: CommunityComment;
        error?: string;
      };
      if (!res.ok || !payload.comment) {
        setCommentError(payload.error ?? copy.commentNetworkError);
        return;
      }

      setComments((prev) => [payload.comment!, ...prev]);
      setCommentCorridor("");
      setCommentAlias("");
      setCommentBody("");
      setCommentGdpr(false);
      setCommentSuccess(copy.commentSuccess);
    } catch {
      setCommentError(copy.commentNetworkError);
    } finally {
      setCommentSubmitting(false);
    }
  }

  function handleExportBrusselsDossier() {
    const text = formatBrusselsAggregatedBrief(
      reports,
      polls,
      locale,
      comments
    );
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `collective-official-institute-dossier-${locale}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const totalAllVotes =
    totalRedFlagVotes +
    totalInstituteVotes +
    totalBrusselsVotes +
    totalCaseFlags +
    totalAgencyFlags +
    totalCommentConfirmations;

  return (
    <section
      id="community-action"
      className="scroll-mt-20 border-b border-slate-200 bg-slate-950 py-16 text-slate-100"
    >
      <div id="europe-fairness" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header + Collective Community Evidence Counter */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400">
                {copy.eyebrow}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-200">
                {copy.badge}
              </span>
            </div>
            <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              {copy.intro}
            </p>
          </div>

          {/* Live Community Proof Counter Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  {copy.minusLedgerTitle}
                </span>
                <button
                  type="button"
                  onClick={handleExportBrusselsDossier}
                  className="rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 font-mono text-[10px] font-semibold text-amber-200 transition-colors hover:bg-amber-500/30"
                >
                  {copy.exportBrusselsBtn}
                </button>
              </div>

              <div className="mt-3 text-3xl font-bold tracking-tight text-rose-400 sm:text-4xl">
                -€
                {totalMinusEur.toLocaleString(
                  locale === "nl" ? "nl-NL" : "en-IE"
                )}
              </div>
              <p className="mt-1 text-xs text-slate-300">{copy.minusLedgerSub}</p>

              <dl className="mt-4 grid grid-cols-2 gap-2.5 border-t border-slate-800 pt-3.5 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-950/70 p-2.5">
                  <dt className="font-mono text-[10px] text-slate-400">
                    {copy.casesCountLabel}
                  </dt>
                  <dd className="mt-0.5 text-base font-semibold text-white">
                    {reports.length}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-2.5">
                  <dt className="font-mono text-[10px] text-slate-400">
                    {copy.votesFlagsLabel}
                  </dt>
                  <dd className="mt-0.5 text-base font-semibold text-amber-300">
                    {totalAllVotes}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-2.5">
                  <dt className="font-mono text-[10px] text-slate-400">
                    {copy.commentsCountLabel}
                  </dt>
                  <dd className="mt-0.5 text-base font-semibold text-sky-300">
                    {comments.length}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-2.5">
                  <dt className="font-mono text-[10px] text-slate-400">
                    {copy.quizConfirmsLabel}
                  </dt>
                  <dd className="mt-0.5 text-base font-semibold text-rose-300">
                    {polls.diagnosticConfirmations ?? 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* 4 Community Action Steps */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.pillars.map((pillar) => (
            <div
              key={pillar.code}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 transition-colors hover:border-slate-700"
            >
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#F59E0B]">
                  {pillar.code}
                </span>
                <h3 className="mt-1.5 text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {pillar.detail}
                </p>
              </div>

              <Link
                href={pillar.href}
                className="mt-4 inline-flex items-center text-xs font-semibold text-amber-400 hover:underline"
              >
                {pillar.linkLabel}
              </Link>
            </div>
          ))}
        </div>

        {/* 3 Interactive Community Polls (Top Violations, Dutch Official Institutes, Brussels EU) */}
        <div
          id="community-polls"
          className="mt-8 grid scroll-mt-24 grid-cols-1 gap-5 lg:grid-cols-3"
        >
          {/* Poll 1: Red Flags */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                {copy.poll1Title}
              </h3>
              <span className="font-mono text-[11px] text-amber-300">
                {totalRedFlagVotes} {copy.pollTotalVotes}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {votedRedFlag ? copy.pollVotedTag : copy.pollHint}
            </p>

            <div className="mt-4 space-y-2">
              {copy.redFlagPollOptions.map((opt) => {
                const count = polls.redFlagVotes[opt.id] ?? 0;
                const pct =
                  totalRedFlagVotes > 0
                    ? Math.round((count / totalRedFlagVotes) * 100)
                    : 0;
                const isSelected = votedRedFlag === opt.id;
                const isBusy = votingKind === `red-flag:${opt.id}`;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(votedRedFlag) || isBusy}
                    onClick={() => castPollVote("red-flag", opt.id)}
                    className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-rose-400 bg-rose-950/40"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                    } disabled:cursor-default`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-rose-500/20 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-100">
                        {isSelected ? "🚩 " : ""}
                        {opt.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-rose-300">
                        {count} ({pct}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Poll 2: Dutch Official Institutes Priority */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                {copy.poll2Title}
              </h3>
              <span className="font-mono text-[11px] text-emerald-300">
                {totalInstituteVotes} {copy.pollTotalVotes}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {votedInstitute ? copy.pollVotedTag : copy.pollHint}
            </p>

            <div className="mt-4 space-y-2">
              {copy.institutePollOptions.map((opt) => {
                const count = polls.instituteActionVotes?.[opt.id] ?? 0;
                const pct =
                  totalInstituteVotes > 0
                    ? Math.round((count / totalInstituteVotes) * 100)
                    : 0;
                const isSelected = votedInstitute === opt.id;
                const isBusy = votingKind === `institute-action:${opt.id}`;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(votedInstitute) || isBusy}
                    onClick={() => castPollVote("institute-action", opt.id)}
                    className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-950/35"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                    } disabled:cursor-default`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-500/20 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-100">
                        {isSelected ? "✓ " : ""}
                        {opt.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-emerald-300">
                        {count} ({pct}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Poll 3: Brussels / EU Action */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                {copy.poll3Title}
              </h3>
              <span className="font-mono text-[11px] text-amber-300">
                {totalBrusselsVotes} {copy.pollTotalVotes}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {votedBrussels ? copy.pollVotedTag : copy.pollHint}
            </p>

            <div className="mt-4 space-y-2">
              {copy.brusselsPollOptions.map((opt) => {
                const count = polls.brusselsActionVotes[opt.id] ?? 0;
                const pct =
                  totalBrusselsVotes > 0
                    ? Math.round((count / totalBrusselsVotes) * 100)
                    : 0;
                const isSelected = votedBrussels === opt.id;
                const isBusy = votingKind === `brussels-action:${opt.id}`;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(votedBrussels) || isBusy}
                    onClick={() => castPollVote("brussels-action", opt.id)}
                    className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-950/30"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                    } disabled:cursor-default`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#D95D24]/25 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-100">
                        {isSelected ? "✓ " : ""}
                        {opt.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-amber-300">
                        {count} ({pct}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Community Comments & Testimony Board (Persisted in data/comments.json) */}
        <div
          id="community-comments"
          className="mt-8 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Comments Feed */}
            <div className="lg:col-span-7">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-400">
                {copy.commentsEyebrow}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {copy.commentsTitle}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {copy.commentsIntro}
              </p>

              {/* Filter Chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  "all",
                  "Charlie works",
                  "DIT & Larex",
                  "Other Dutch Agency",
                  "General EU Mobility",
                ].map((tag) => {
                  const active = commentFilter === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCommentFilter(tag)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                        active
                          ? "border-amber-400 bg-amber-500 text-slate-950"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {tag === "all"
                        ? `${copy.commentFilterAll} (${comments.length})`
                        : tag}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
                {filteredComments.map((comment) => {
                  const isConfirmed = confirmedComments.includes(comment.id);
                  return (
                    <article
                      key={comment.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/90 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                            {comment.agencyName}
                          </span>
                          <span className="rounded-md bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                            {getLocalizedCommentTopicLabel(
                              comment.topic,
                              locale
                            )}
                          </span>
                          {comment.corridor && (
                            <span className="font-mono text-[10px] text-slate-400">
                              {comment.corridor}
                            </span>
                          )}
                          {comment.isSeeded && (
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] uppercase text-slate-400">
                              {copy.commentSampleBadge}
                            </span>
                          )}
                        </div>
                        <time
                          dateTime={comment.createdAt}
                          className="font-mono text-[10px] text-slate-500"
                        >
                          {comment.createdAt.slice(0, 10)}
                        </time>
                      </div>

                      <p className="mt-2.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                        {comment.body}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5">
                        <span className="text-[11px] text-slate-400">
                          {comment.authorAlias}
                        </span>
                        <button
                          type="button"
                          disabled={
                            isConfirmed || confirmingCommentId === comment.id
                          }
                          onClick={() => handleConfirmComment(comment.id)}
                          className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                            isConfirmed
                              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200"
                              : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400 hover:text-amber-300"
                          }`}
                        >
                          {isConfirmed
                            ? copy.commentConfirmedBtn
                            : copy.commentConfirmBtn}{" "}
                          ({comment.confirmations})
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Right: Add Comment Form */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 lg:col-span-5">
              <h4 className="text-base font-semibold text-white">
                {copy.commentFormTitle}
              </h4>

              <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="comment-agency"
                      className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {copy.commentAgencyLabel}
                    </label>
                    <select
                      id="comment-agency"
                      value={commentAgency}
                      onChange={(e) => setCommentAgency(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Charlie works">Charlie works</option>
                      <option value="DIT & Larex">DIT & Larex</option>
                      <option value="Other Dutch Agency">
                        Other Dutch Agency
                      </option>
                      <option value="General EU Mobility">
                        General EU Mobility
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="comment-topic"
                      className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {copy.commentTopicLabel}
                    </label>
                    <select
                      id="comment-topic"
                      value={commentTopic}
                      onChange={(e) =>
                        setCommentTopic(e.target.value as CommentTopicId)
                      }
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      {COMMENT_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {getLocalizedCommentTopicLabel(t, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="comment-corridor"
                      className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {copy.commentCorridorLabel}
                    </label>
                    <input
                      id="comment-corridor"
                      type="text"
                      maxLength={60}
                      value={commentCorridor}
                      onChange={(e) => setCommentCorridor(e.target.value)}
                      placeholder={copy.commentCorridorPlaceholder}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="comment-alias"
                      className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {copy.commentAliasLabel}
                    </label>
                    <input
                      id="comment-alias"
                      type="text"
                      maxLength={60}
                      value={commentAlias}
                      onChange={(e) => setCommentAlias(e.target.value)}
                      placeholder={copy.commentAliasPlaceholder}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="comment-body"
                    className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                  >
                    {copy.commentBodyLabel}
                  </label>
                  <textarea
                    id="comment-body"
                    required
                    minLength={12}
                    maxLength={1200}
                    rows={4}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder={copy.commentBodyPlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-slate-300">
                  <input
                    type="checkbox"
                    checked={commentGdpr}
                    onChange={(e) => setCommentGdpr(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#D95D24]"
                  />
                  <span>{copy.commentGdprLabel}</span>
                </label>

                {commentError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-3 py-2 text-xs text-rose-200"
                  >
                    {commentError}
                  </p>
                )}

                {commentSuccess && (
                  <p
                    role="status"
                    className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-3 py-2 text-xs text-emerald-200"
                  >
                    {commentSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="w-full rounded-lg bg-[#D95D24] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                >
                  {commentSubmitting
                    ? copy.commentSubmittingBtn
                    : copy.commentSubmitBtn}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Field Reality: Street Abandonment Fuels Criminality Across Europe */}
        <div className="mt-8 rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 p-5 sm:p-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-rose-300">
            {copy.socialTag}
          </span>
          <h3 className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
            {copy.socialTitle}
          </h3>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-slate-200 sm:text-sm">
            {copy.socialBody}
          </p>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              {copy.emergencyHeading}
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {copy.emergencyLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* External Brussels / EU Official Channels */}
        <div
          id="brussels-channels"
          className="mt-8 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <h3 className="text-lg font-semibold text-white">
                {copy.brusselsHeading}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {copy.brusselsSub}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportBrusselsDossier}
              className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
            >
              {copy.exportBrusselsBtn}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brusselsChannels.map((ch) => (
              <div
                key={ch.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4"
              >
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                    {ch.shortTag}
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-white">
                    {ch.name}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {ch.scope}
                  </p>
                </div>
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-colors hover:bg-sky-500/20"
                >
                  {ch.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Open Community Mandate (Explicitly NOT a company) */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            {copy.attributionLabel}
          </span>
          <p className="mt-1 text-sm font-semibold text-white">
            {copy.defaultSignature}
          </p>
        </div>
      </div>
    </section>
  );
}
