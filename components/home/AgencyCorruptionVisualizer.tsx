"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { submitVoteAction } from "@/actions/votes";
import { AgencyDiagnosticQuiz } from "@/components/agencies/AgencyDiagnosticQuiz";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { MemberPhotoModal } from "@/components/shared/MemberPhotoModal";
import {
  PortraitDenyOverlay,
  WarningWatermarkOverlay,
} from "@/components/shared/WarningWatermarkOverlay";
import {
  getInitials,
  type AgencyRecord,
  type AgencyTeamMember,
} from "@/lib/agency-team";
import {
  mergeUniqueIds,
  useLocalStorageList,
  useSyncedUserVotes,
  writeLocalStorageList,
} from "@/lib/client-storage";
import { getLocalizedAgency } from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";
import type { PollState, UserVotesState } from "@/lib/types";

interface AgencyCorruptionVisualizerProps {
  initialAgencies: AgencyRecord[];
  initialPolls: PollState;
  initialUserVotes: UserVotesState;
}

const AGENCY_FLAG_EVENT = "werkrecht-agency-flag-storage";

export function AgencyCorruptionVisualizer({
  initialAgencies,
  initialPolls,
  initialUserVotes,
}: AgencyCorruptionVisualizerProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agencySpotlight;
  const closeLabel = UI_TEXT[locale].agencyVisualizer.closeBtn;

  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialAgencies[0]?.slug ?? ""
  );
  const [polls, setPolls] = useState<PollState>(initialPolls);
  const [userVotes, updateUserVotes] = useSyncedUserVotes(initialUserVotes);
  const [flaggingSlug, setFlaggingSlug] = useState<string | null>(null);
  const [inspectedMember, setInspectedMember] =
    useState<AgencyTeamMember | null>(null);

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

  const localizedAgencies = useMemo(
    () => initialAgencies.map((a) => getLocalizedAgency(a, locale)),
    [initialAgencies, locale]
  );

  const selectedAgency = useMemo(
    () =>
      localizedAgencies.find((a) => a.slug === selectedSlug) ??
      localizedAgencies[0],
    [localizedAgencies, selectedSlug]
  );

  async function handleFlagAgency(slug: string) {
    if (flaggedSlugs.includes(slug)) return;
    setFlaggingSlug(slug);
    try {
      const result = await submitVoteAction({
        kind: "agency-flag",
        targetId: slug,
      });
      if (result.ok && result.polls) {
        setPolls(result.polls);
        if (result.userVotes) {
          updateUserVotes(result.userVotes);
        }
        writeLocalStorageList(
          "werkrecht_flagged_agencies",
          mergeUniqueIds(flaggedSlugs, [slug]),
          AGENCY_FLAG_EVENT
        );
        window.dispatchEvent(
          new CustomEvent("werkrecht-polls-updated", { detail: result.polls })
        );
      }
    } finally {
      setFlaggingSlug(null);
    }
  }

  if (!selectedAgency) return null;

  const currentAgencyFlags = polls.agencyFlags?.[selectedAgency.slug] ?? 0;
  const currentAgencyAudits =
    polls.agencyDiagnostics?.[selectedAgency.slug]?.submissions ?? 0;
  const isAgencyFlagged = flaggedSlugs.includes(selectedAgency.slug);

  return (
    <section
      id="agency-spotlight"
      className="scroll-mt-20 border-b border-slate-200 bg-white py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Part 1 Header: Visualize Agency Teams & Corrupt Department Patterns */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rose-700">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {copy.intro}
            </p>
          </div>
          <Link
            href="/agencies"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#0A66C2]/40 bg-[#0A66C2]/5 px-4 py-2.5 text-xs font-semibold text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white"
          >
            {copy.fullDirCta}
          </Link>
        </div>

        {/* Agency Switcher Tabs */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
            <div>
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {copy.agencySelectorLabel}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {localizedAgencies.map((agency) => {
                  const active = agency.slug === selectedAgency.slug;
                  const flags = polls.agencyFlags?.[agency.slug] ?? 0;
                  const audits =
                    polls.agencyDiagnostics?.[agency.slug]?.submissions ?? 0;
                  return (
                    <button
                      key={agency.id}
                      type="button"
                      onClick={() => setSelectedSlug(agency.slug)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                        active
                          ? "border-slate-950 bg-slate-950 text-white shadow-xs"
                          : "border-slate-300 bg-white text-slate-800 hover:border-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-bold ${
                          active
                            ? "bg-[#D95D24] text-white"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {agency.monogram}
                      </span>
                      <span>{agency.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          active
                            ? "bg-rose-500/25 text-rose-200"
                            : "bg-rose-50 text-rose-800"
                        }`}
                      >
                        🚩 {flags}
                      </span>
                      {audits > 0 && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            active
                              ? "bg-amber-400/20 text-amber-200"
                              : "bg-amber-50 text-amber-900"
                          }`}
                        >
                          ✓ {audits}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isAgencyFlagged || flaggingSlug === selectedAgency.slug}
                onClick={() => handleFlagAgency(selectedAgency.slug)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  isAgencyFlagged
                    ? "border-rose-300 bg-rose-100 text-rose-900"
                    : "border-rose-600 bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                🚩{" "}
                {isAgencyFlagged ? copy.flaggedAgencyBtn : copy.flagAgencyBtn} (
                {currentAgencyFlags})
              </button>
              <Link
                href={`/agencies/${selectedAgency.slug}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-950"
              >
                {copy.openFullPage}
              </Link>
            </div>
          </div>

          {/* Selected Agency Summary + Why Watch Out / Avoid Traps by Department */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="group relative overflow-hidden rounded-xl border border-rose-200/80 bg-white p-5 lg:col-span-5">
              <WarningWatermarkOverlay
                stampText={copy.avoidStamp}
                tone="light"
                stampPlacement="top-right"
                compact
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-mono text-lg font-bold text-[#F59E0B] ring-1 ring-rose-500/40">
                    {selectedAgency.monogram}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {selectedAgency.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {selectedAgency.hqLocation}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedAgency.regionalHubs.map((hub) => (
                    <span
                      key={hub}
                      className="rounded-md border border-slate-200 bg-slate-50/90 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700"
                    >
                      📍 {hub}
                    </span>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 backdrop-blur-[1px]">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-rose-900">
                    {copy.whyAvoidHeading}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-rose-950">
                    {selectedAgency.scamPreventionFocus}
                  </p>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-2.5">
                    <dt className="font-mono text-[10px] text-slate-500">
                      {copy.profilesLabel}
                    </dt>
                    <dd className="mt-0.5 text-base font-bold text-slate-950">
                      {selectedAgency.members.length}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-2.5">
                    <dt className="font-mono text-[10px] text-rose-700">
                      {copy.flagsLabel}
                    </dt>
                    <dd className="mt-0.5 text-base font-bold text-rose-900">
                      {currentAgencyFlags}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5">
                    <dt className="font-mono text-[10px] text-amber-800">
                      {copy.tallyStatsSubmissions}
                    </dt>
                    <dd className="mt-0.5 text-base font-bold text-amber-950">
                      {currentAgencyAudits}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 3 Department "Why Watch Out / Avoid" Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-7">
              {copy.deptWarnings.map((warn) => (
                <div
                  key={warn.deptKey}
                  className="flex flex-col justify-between rounded-xl border border-rose-200/80 bg-white p-4 shadow-2xs"
                >
                  <div>
                    <span className="inline-block rounded bg-rose-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-900">
                      {warn.badge}
                    </span>
                    <h4 className="mt-2 text-sm font-semibold text-slate-950">
                      {warn.whyTitle}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {warn.whyText}
                    </p>
                  </div>
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-[11px] leading-snug text-amber-950">
                    <strong>✓ </strong>
                    {warn.avoidTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Team Roster Cards with Real Photos + Subtle Professional X / AVOID Treatment */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h4 className="text-sm font-semibold text-slate-950">
                  {selectedAgency.name} · {copy.rosterSubheading}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  {copy.rosterNote}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {selectedAgency.members.map((member) => {
                const isVerified = member.roleStatus === "verified";
                return (
                  <div
                    key={member.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-rose-200/80 bg-white p-3.5 shadow-2xs transition-all duration-700 ease-out hover:-translate-y-0.5 hover:border-rose-400/90 hover:shadow-md"
                  >
                    <WarningWatermarkOverlay
                      stampText={copy.avoidStamp}
                      tone="light"
                      stampPlacement="bottom-right"
                      compact
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-2">
                        {member.photoPath ? (
                          <button
                            type="button"
                            onClick={() => setInspectedMember(member)}
                            aria-label={`${copy.zoomBtn}: ${member.name}`}
                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-rose-300/80 bg-slate-900 shadow-2xs"
                          >
                            <Image
                              src={member.photoPath}
                              alt={member.photoAlt}
                              fill
                              sizes="56px"
                              className={`object-cover contrast-[1.03] saturate-[0.82] transition-transform duration-700 ease-out group-hover:scale-105 ${member.objectPosition}`}
                            />
                            <PortraitDenyOverlay
                              label={
                                locale === "nl" ? "VERMIJDEN" : "AVOID"
                              }
                            />
                          </button>
                        ) : (
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rose-400/50 bg-slate-950 font-mono text-base font-bold text-white">
                            <span className="relative z-10">
                              {getInitials(member.name)}
                            </span>
                            <PortraitDenyOverlay
                              label={
                                locale === "nl" ? "VERMIJDEN" : "AVOID"
                              }
                            />
                          </div>
                        )}

                        <div className="flex flex-col items-end gap-1">
                          <span className="rounded-md border border-rose-500/40 bg-rose-950 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-rose-200">
                            {copy.avoidBadge}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                              isVerified
                                ? "bg-amber-50 text-amber-900 ring-1 ring-amber-300/70"
                                : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                            }`}
                          >
                            {member.roleBadgeLabel}
                          </span>
                        </div>
                      </div>

                      <h5 className="mt-2.5 text-sm font-semibold text-slate-950">
                        {member.name}
                      </h5>
                      <p className="text-[11px] font-semibold text-rose-800">
                        {member.role}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                        {member.departmentLabel}
                      </p>
                      <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-slate-600">
                        {member.summary}
                      </p>
                    </div>

                    <div className="relative z-10 mt-3 flex items-center justify-between gap-2 border-t border-rose-100 pt-2.5">
                      <a
                        href={member.linkedInSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] font-semibold text-[#0A66C2] hover:underline"
                      >
                        LinkedIn ↗
                      </a>
                      <Link
                        href={`/agencies/${selectedAgency.slug}#agency-diagnostic`}
                        className="font-mono text-[10px] font-semibold text-rose-700 hover:underline"
                      >
                        Audit →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Part 2: Per-Agency 6-Question Diagnostic & Live Firestore Community Tally */}
        <AgencyDiagnosticQuiz
          agencySlug={selectedAgency.slug}
          agencyName={selectedAgency.name}
          polls={polls}
          userVotes={userVotes}
          onPollsUpdated={setPolls}
          onUserVotesUpdated={updateUserVotes}
          mode="home"
          id="confirm-questions"
        />
      </div>

      <MemberPhotoModal
        member={inspectedMember}
        titleId="home-inspected-member-title"
        closeLabel={closeLabel}
        onClose={() => setInspectedMember(null)}
        footerAction={
          <Link
            href={`/agencies/${selectedAgency.slug}`}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#D95D24]"
          >
            {copy.openFullPage}
          </Link>
        }
      />
    </section>
  );
}
