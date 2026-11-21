"use client";

import { useEffect, useMemo, useState } from "react";
import {
  confirmCommentAction,
  createCommentAction,
} from "@/actions/comments";
import { submitVoteAction } from "@/actions/votes";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  getLocalizedComment,
  getLocalizedCommentTopicLabel,
} from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";
import { sumVoteMap } from "@/lib/ledger-utils";
import type {
  BrusselsActionOptionId,
  CommentTopicId,
  CommunityComment,
  InstituteActionOptionId,
  PollState,
  RedFlagPollOptionId,
  UserVotesState,
} from "@/lib/types";
import {
  mergeUniqueIds,
  useLocalStorageList,
  useLocalStorageValue,
  useSyncedUserVotes,
  writeLocalStorageList,
  writeLocalStorageValue,
} from "@/lib/client-storage";

interface EuropeFairWorkSpotlightProps {
  initialPolls: PollState;
  initialComments: CommunityComment[];
  initialUserVotes: UserVotesState;
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

export function EuropeFairWorkSpotlight({
  initialPolls,
  initialComments,
  initialUserVotes,
}: EuropeFairWorkSpotlightProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].europeSpotlight;

  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [userVotes, updateUserVotes] = useSyncedUserVotes(initialUserVotes);
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

  const localVotedRedFlag =
    useLocalStorageValue("werkrecht_vote_red_flag", VOTE_EVENT) || null;
  const localVotedInstitute =
    useLocalStorageValue("werkrecht_vote_institute_action", VOTE_EVENT) || null;
  const localVotedBrussels =
    useLocalStorageValue("werkrecht_vote_brussels_action", VOTE_EVENT) || null;
  const localConfirmedComments = useLocalStorageList(
    "werkrecht_confirmed_comments",
    COMMENT_CONFIRM_EVENT
  );

  const votedRedFlag = userVotes.redFlagVote ?? localVotedRedFlag;
  const votedInstitute = userVotes.instituteActionVote ?? localVotedInstitute;
  const votedBrussels = userVotes.brusselsActionVote ?? localVotedBrussels;
  const confirmedComments = useMemo(
    () => mergeUniqueIds(userVotes.confirmedComments, localConfirmedComments),
    [userVotes.confirmedComments, localConfirmedComments]
  );

  useEffect(() => {
    function onPollsUpdated(e: Event) {
      const custom = e as CustomEvent<PollState>;
      if (!custom.detail) return;
      setPolls(custom.detail);
    }
    window.addEventListener("werkrecht-polls-updated", onPollsUpdated);
    return () => {
      window.removeEventListener("werkrecht-polls-updated", onPollsUpdated);
    };
  }, []);

  const totalRedFlagVotes = useMemo(
    () => sumVoteMap(polls.redFlagVotes),
    [polls.redFlagVotes]
  );

  const totalInstituteVotes = useMemo(
    () => sumVoteMap(polls.instituteActionVotes),
    [polls.instituteActionVotes]
  );

  const totalBrusselsVotes = useMemo(
    () => sumVoteMap(polls.brusselsActionVotes),
    [polls.brusselsActionVotes]
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

    const alreadySelected =
      kind === "red-flag"
        ? votedRedFlag
        : kind === "institute-action"
          ? votedInstitute
          : votedBrussels;
    if (alreadySelected) return;

    try {
      if (window.localStorage.getItem(storageKey)) return;
    } catch {
      // Allow voting if localStorage is blocked
    }

    setVotingKind(`${kind}:${targetId}`);
    try {
      const result = await submitVoteAction(
        kind === "red-flag"
          ? { kind: "red-flag", targetId: targetId as RedFlagPollOptionId }
          : kind === "institute-action"
            ? {
                kind: "institute-action",
                targetId: targetId as InstituteActionOptionId,
              }
            : {
                kind: "brussels-action",
                targetId: targetId as BrusselsActionOptionId,
              }
      );

      if (result.ok && result.polls) {
        setPolls(result.polls);
        if (result.userVotes) {
          updateUserVotes(result.userVotes);
        }
        writeLocalStorageValue(storageKey, targetId, VOTE_EVENT);
        window.dispatchEvent(
          new CustomEvent("werkrecht-polls-updated", { detail: result.polls })
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
      const result = await confirmCommentAction(commentId);
      if (result.ok && result.comments) {
        setComments(result.comments);
        if (result.userVotes) {
          updateUserVotes(result.userVotes);
        }
        writeLocalStorageList(
          "werkrecht_confirmed_comments",
          mergeUniqueIds(confirmedComments, [commentId]),
          COMMENT_CONFIRM_EVENT
        );
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
      const result = await createCommentAction({
        agencyName: commentAgency,
        topic: commentTopic,
        corridor: commentCorridor,
        authorAlias:
          commentAlias.trim() ||
          (locale === "nl" ? "Anonieme Werknemer" : "Anonymous Worker"),
        body: commentBody,
      });

      if (!result.ok || !result.comment) {
        setCommentError(result.error ?? copy.commentNetworkError);
        return;
      }

      setComments((prev) => [result.comment!, ...prev]);
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

  return (
    <section
      id="community-action"
      className="scroll-mt-20 border-b border-slate-200 bg-slate-950 py-16 text-slate-100"
    >
      <div id="europe-fairness" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 3 Interactive Community Polls (Server Actions -> Data Store) */}
        <div
          id="community-polls"
          className="grid scroll-mt-24 grid-cols-1 gap-5 lg:grid-cols-3"
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

          {/* Poll 2: Cross-Border National & Regional Actions */}
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

          {/* Poll 3: European Parliament & Brussels 1-Europe Action */}
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

        {/* Community Comments & Testimony Board (Server Actions -> Data Store) */}
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
                {filteredComments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
                    <p className="text-xs font-semibold text-slate-200">
                      {copy.commentsEmptyTitle}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {copy.commentsEmptySub}
                    </p>
                  </div>
                ) : (
                  filteredComments.map((comment) => {
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
                          </div>
                          {comment.createdAt && (
                            <time
                              dateTime={comment.createdAt}
                              className="font-mono text-[10px] text-slate-500"
                            >
                              {comment.createdAt.slice(0, 10)}
                            </time>
                          )}
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
                  })
                )}
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
      </div>
    </section>
  );
}
