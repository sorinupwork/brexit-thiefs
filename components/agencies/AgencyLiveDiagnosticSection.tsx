"use client";

import { useEffect, useState } from "react";
import { AgencyDiagnosticQuiz } from "@/components/agencies/AgencyDiagnosticQuiz";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useSyncedUserVotes } from "@/lib/client-storage";
import { UI_TEXT } from "@/lib/i18n-ui";
import type { PollState, UserVotesState } from "@/lib/types";

interface AgencyLiveDiagnosticClientProps {
  agencySlug: string;
  agencyName: string;
  registryChecklistNote?: string;
  initialPolls: PollState;
  initialUserVotes: UserVotesState;
}

export function AgencyLiveDiagnosticClient({
  agencySlug,
  agencyName,
  registryChecklistNote,
  initialPolls,
  initialUserVotes,
}: AgencyLiveDiagnosticClientProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agencyVisualizer;

  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [userVotes, updateUserVotes] = useSyncedUserVotes(initialUserVotes);

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

  return (
    <section className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rose-700">
          {copy.diagnosticSectionEyebrow}
        </p>
        <AgencyDiagnosticQuiz
          agencySlug={agencySlug}
          agencyName={agencyName}
          registryChecklistNote={registryChecklistNote}
          polls={polls}
          userVotes={userVotes}
          onPollsUpdated={setPolls}
          onUserVotesUpdated={updateUserVotes}
          mode="agency-page"
          id="agency-diagnostic"
          className="mt-4"
        />
      </div>
    </section>
  );
}
