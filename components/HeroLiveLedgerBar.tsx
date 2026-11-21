"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";
import type { PollState, WorkerReport } from "@/lib/types";

interface HeroLiveLedgerBarProps {
  initialStolenEur: number;
  initialCasesCount: number;
  initialVotesCount: number;
  initialCommentsCount: number;
}

function countAllVotes(polls: PollState): number {
  const sumObj = (obj?: Record<string, number>) =>
    Object.values(obj ?? {}).reduce((s, n) => s + n, 0);
  return (
    sumObj(polls.redFlagVotes) +
    sumObj(polls.instituteActionVotes) +
    sumObj(polls.brusselsActionVotes) +
    sumObj(polls.reportFlags) +
    sumObj(polls.agencyFlags) +
    (polls.diagnosticConfirmations ?? 0)
  );
}

export function HeroLiveLedgerBar({
  initialStolenEur,
  initialCasesCount,
  initialVotesCount,
  initialCommentsCount,
}: HeroLiveLedgerBarProps) {
  const { locale } = useLanguage();
  const h = UI_TEXT[locale].home;

  const [stolenEur, setStolenEur] = useState(initialStolenEur);
  const [casesCount, setCasesCount] = useState(initialCasesCount);
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  useEffect(() => {
    setStolenEur(initialStolenEur);
    setCasesCount(initialCasesCount);
    setVotesCount(initialVotesCount);
    setCommentsCount(initialCommentsCount);
  }, [
    initialStolenEur,
    initialCasesCount,
    initialVotesCount,
    initialCommentsCount,
  ]);

  useEffect(() => {
    function onReportAdded(e: Event) {
      const custom = e as CustomEvent<WorkerReport>;
      if (!custom.detail) return;
      setCasesCount((c) => c + 1);
      setStolenEur((s) => s + (custom.detail.disputedAmountEur ?? 0));
    }
    function onPollsUpdated(e: Event) {
      const custom = e as CustomEvent<PollState>;
      if (!custom.detail) return;
      setVotesCount(countAllVotes(custom.detail));
    }
    function onCommentAdded() {
      setCommentsCount((c) => c + 1);
    }
    function onCommentConfirmed() {
      setVotesCount((v) => v + 1);
    }

    window.addEventListener("werkrecht-report-added", onReportAdded);
    window.addEventListener("werkrecht-polls-updated", onPollsUpdated);
    window.addEventListener("werkrecht-comment-added", onCommentAdded);
    window.addEventListener("werkrecht-comment-confirmed", onCommentConfirmed);
    return () => {
      window.removeEventListener("werkrecht-report-added", onReportAdded);
      window.removeEventListener("werkrecht-polls-updated", onPollsUpdated);
      window.removeEventListener("werkrecht-comment-added", onCommentAdded);
      window.removeEventListener(
        "werkrecht-comment-confirmed",
        onCommentConfirmed
      );
    };
  }, []);

  return (
    <div className="mt-5 rounded-2xl border border-slate-300 bg-slate-950 p-4 text-white shadow-sm sm:px-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {h.heroLedgerTitle}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          <div>
            <dt className="font-mono text-[10px] uppercase text-slate-400">
              {h.heroStolenLabel}
            </dt>
            <dd className="mt-0.5 text-lg font-bold text-rose-400 sm:text-xl">
              -€
              {stolenEur.toLocaleString(locale === "nl" ? "nl-NL" : "en-IE")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-slate-400">
              {h.heroCasesLabel}
            </dt>
            <dd className="mt-0.5 text-lg font-bold text-white sm:text-xl">
              {casesCount}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-slate-400">
              {h.heroVotesLabel}
            </dt>
            <dd className="mt-0.5 text-lg font-bold text-amber-300 sm:text-xl">
              {votesCount}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-slate-400">
              {h.heroCommentsLabel}
            </dt>
            <dd className="mt-0.5 text-lg font-bold text-sky-300 sm:text-xl">
              {commentsCount}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
