"use client";

import { useEffect, useMemo, useState } from "react";
import { submitVoteAction } from "@/actions/votes";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  mergeUniqueIds,
  useLocalStorageList,
  useSyncedUserVotes,
  writeLocalStorageList,
} from "@/lib/client-storage";
import { UI_TEXT } from "@/lib/i18n-ui";
import type { PollState, UserVotesState } from "@/lib/types";

const AGENCY_FLAG_EVENT = "werkrecht-agency-flag-storage";

interface AgencyHeaderFlagButtonProps {
  agencySlug: string;
  initialPolls: PollState;
  initialUserVotes: UserVotesState;
}

export function AgencyHeaderFlagButton({
  agencySlug,
  initialPolls,
  initialUserVotes,
}: AgencyHeaderFlagButtonProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agencyVisualizer;

  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [userVotes, updateUserVotes] = useSyncedUserVotes(initialUserVotes);
  const [flagging, setFlagging] = useState(false);

  const localFlaggedSlugs = useLocalStorageList(
    "werkrecht_flagged_agencies",
    AGENCY_FLAG_EVENT
  );
  const flaggedSlugs = useMemo(
    () => mergeUniqueIds(userVotes.flaggedAgencies, localFlaggedSlugs),
    [userVotes.flaggedAgencies, localFlaggedSlugs]
  );

  useEffect(() => {
    function onPollsUpdated(e: Event) {
      const custom = e as CustomEvent<PollState>;
      if (custom.detail) setPolls(custom.detail);
    }
    window.addEventListener("werkrecht-polls-updated", onPollsUpdated);
    return () => {
      window.removeEventListener("werkrecht-polls-updated", onPollsUpdated);
    };
  }, []);

  const agencyFlags = polls.agencyFlags?.[agencySlug] ?? 0;
  const agencyAudits =
    polls.agencyDiagnostics?.[agencySlug]?.submissions ?? 0;
  const isAgencyFlagged = flaggedSlugs.includes(agencySlug);

  async function handleFlagAgency() {
    if (isAgencyFlagged || flagging) return;
    setFlagging(true);
    try {
      const result = await submitVoteAction({
        kind: "agency-flag",
        targetId: agencySlug,
      });
      if (result.ok && result.polls) {
        setPolls(result.polls);
        if (result.userVotes) {
          updateUserVotes(result.userVotes);
        }
        writeLocalStorageList(
          "werkrecht_flagged_agencies",
          mergeUniqueIds(flaggedSlugs, [agencySlug]),
          AGENCY_FLAG_EVENT
        );
        window.dispatchEvent(
          new CustomEvent("werkrecht-polls-updated", { detail: result.polls })
        );
      }
    } finally {
      setFlagging(false);
    }
  }

  return (
    <>
      <a
        href="#agency-diagnostic"
        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700"
      >
        {copy.verifyRegistriesBtn}
        {agencyAudits > 0 && (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">
            {agencyAudits}
          </span>
        )}
      </a>
      <button
        type="button"
        disabled={isAgencyFlagged || flagging}
        onClick={handleFlagAgency}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
          isAgencyFlagged
            ? "border-rose-300 bg-rose-100 text-rose-900"
            : "border-rose-300 bg-rose-50 text-rose-900 hover:border-rose-500 hover:bg-rose-100"
        }`}
      >
        🚩 {isAgencyFlagged ? copy.flaggedAgencyBtn : copy.flagAgencyBtn} (
        {agencyFlags})
      </button>
    </>
  );
}
