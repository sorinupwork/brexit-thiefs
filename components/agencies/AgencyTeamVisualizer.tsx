"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollaboratingCompaniesSlider } from "@/components/agencies/CollaboratingCompaniesSlider";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { MemberPhotoModal } from "@/components/shared/MemberPhotoModal";
import {
  PortraitDenyOverlay,
  WarningWatermarkOverlay,
} from "@/components/shared/WarningWatermarkOverlay";
import {
  getInitials,
  type AgencyDepartmentId,
  type AgencyRecord,
  type AgencySummaryLink,
  type AgencyTeamMember,
} from "@/lib/agency-team";
import { getLocalizedAgency } from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";

type FilterOption = "all" | "verified" | "unverified" | AgencyDepartmentId;

interface AgencyTeamVisualizerProps {
  initialAgency: AgencyRecord;
  allAgencies: AgencySummaryLink[];
  headerLiveActions?: ReactNode;
  diagnosticSection?: ReactNode;
}

function LinkedInIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function AgencyTeamVisualizer({
  initialAgency,
  allAgencies,
  headerLiveActions,
  diagnosticSection,
}: AgencyTeamVisualizerProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agencyVisualizer;

  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedMember, setInspectedMember] =
    useState<AgencyTeamMember | null>(null);

  const agency = useMemo(
    () => getLocalizedAgency(initialAgency, locale),
    [initialAgency, locale]
  );

  const verifiedCount = useMemo(
    () => agency.members.filter((m) => m.roleStatus === "verified").length,
    [agency.members]
  );
  const unverifiedCount = agency.members.length - verifiedCount;

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agency.members.filter((member) => {
      if (activeFilter === "verified" && member.roleStatus !== "verified") {
        return false;
      }
      if (activeFilter === "unverified" && member.roleStatus !== "unverified") {
        return false;
      }
      if (
        (activeFilter === "regional-management" ||
          activeFilter === "recruitment" ||
          activeFilter === "operations-staff") &&
        member.departmentId !== activeFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.departmentLabel.toLowerCase().includes(q) ||
        member.location.toLowerCase().includes(q) ||
        member.summary.toLowerCase().includes(q)
      );
    });
  }, [agency.members, activeFilter, searchQuery]);

  return (
    <div className="bg-[#f8f9fa]">
      {/* Multi-Agency Switcher Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-900"
            >
              ← {copy.allAgencies} ({allAgencies.length})
            </Link>

            <div className="flex flex-wrap items-center gap-1.5">
              {allAgencies.map((item) => {
                const isCurrent = item.slug === agency.slug;
                return (
                  <Link
                    key={item.id}
                    href={`/agencies/${item.slug}`}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"
                    }`}
                  >
                    {item.name} ({item.memberCount})
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Agency Profile Header with Subtle Editorial X / AVOID Banner */}
      <section className="blueprint-grid border-b border-slate-200 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 font-mono text-[11px] font-medium text-slate-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              {copy.dedicatedBadge} · /agencies/{agency.slug}
            </div>
            <Link
              href="/#verify-agency"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-[#D95D24]"
            >
              {copy.backRedFlags}
            </Link>
          </div>

          <div className="group overflow-hidden rounded-2xl border border-rose-200/80 bg-white shadow-sm">
            {/* Cover Banner with Slow-Breathing X & AVOID Watermark */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-r from-slate-950 via-rose-950/90 to-slate-900 sm:h-40">
              <WarningWatermarkOverlay
                stampText={copy.avoidStamp}
                tone="dark"
                stampPlacement="center"
              />
              <div className="relative z-10 flex h-full items-start justify-between p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-rose-400/40 bg-rose-950/80 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-xs">
                    {copy.deniedBadge}
                  </span>
                  <span className="hidden rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 font-mono text-[11px] font-semibold text-amber-300 backdrop-blur-xs md:inline-flex">
                    {copy.bannerTag}
                  </span>
                </div>
                <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-xs sm:inline-flex">
                  {agency.members.length} {copy.profilesWord} ·{" "}
                  {agency.departments.length} {copy.unitsWord}
                </span>
              </div>
            </div>

            {/* Company Identity Block */}
            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-10 flex flex-col justify-between gap-5 sm:-mt-12 md:flex-row md:items-end">
                <div className="flex items-end gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-950 text-2xl font-bold tracking-tight text-amber-400 shadow-md ring-1 ring-rose-500/40 sm:h-24 sm:w-24">
                    <span className="relative z-10">{agency.monogram}</span>
                    <PortraitDenyOverlay label={copy.memberAvoidMini} />
                  </div>
                  <div className="pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {agency.name}
                      </h1>
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-rose-900">
                        {copy.agencyTypeBadge}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {agency.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {headerLiveActions}
                  <a
                    href={agency.linkedInPeopleSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#004182]"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                    {copy.searchLinkedInTeam}
                  </a>
                  <a
                    href={agency.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-900"
                  >
                    {copy.officialWebsiteBtn}
                  </a>
                </div>
              </div>

              {/* Company Key Facts Strip */}
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {copy.hqLabel}
                  </span>
                  <p className="mt-1 text-xs font-medium text-slate-900">
                    {agency.hqLocation}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {copy.hubsLabel}
                  </span>
                  <p className="mt-1 text-xs font-medium text-slate-900">
                    {agency.regionalHubs.join(" · ")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {copy.sectorsLabel}
                  </span>
                  <p className="mt-1 text-xs font-medium text-slate-900">
                    {agency.sectors.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {copy.contactLabel}
                  </span>
                  <p className="mt-1 font-mono text-xs font-medium text-slate-900">
                    {agency.contactPhone} · {agency.contactEmail}
                  </p>
                </div>
              </div>

              {/* Scam-Prevention & Transparency Banner */}
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-950">
                  <strong>{copy.scamFocusTitle}</strong>{" "}
                  {agency.scamPreventionFocus}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-amber-950">
                  <strong>{copy.factualTitle}</strong> {copy.factualBody}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Agency Team Member Profile Grid (Editorial Caution / AVOID Dossier Aesthetic) */}
      <section className="border-b border-slate-200 bg-[#f8f9fa] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rose-700">
                {copy.sec2Eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {agency.name} {copy.sec2TitleSuffix} ({filteredMembers.length}{" "}
                {copy.ofWord} {agency.members.length})
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {copy.sec2Intro}
              </p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.filterPlaceholder}
              aria-label="Filter agency team members"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none sm:max-w-xs"
            />

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", `${copy.filterAll} (${agency.members.length})`],
                  ["verified", `${copy.filterVerified} (${verifiedCount})`],
                  [
                    "unverified",
                    `${copy.filterUnverified} (${unverifiedCount})`,
                  ],
                  ["regional-management", copy.filterMgmt],
                  ["recruitment", copy.filterRecruit],
                  ["operations-staff", copy.filterOps],
                ] as const
              ).map(([value, label]) => {
                const active = activeFilter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveFilter(value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Cards Grid */}
          {filteredMembers.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {copy.emptyFiltered}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="mt-3 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                {copy.resetFilters}
              </button>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const isVerified = member.roleStatus === "verified";
                return (
                  <article
                    key={member.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-200/80 bg-white shadow-xs transition-all duration-700 ease-out hover:-translate-y-0.5 hover:border-rose-400/90 hover:shadow-md"
                  >
                    {/* Subtle slow-breathing X + AVOID watermark in card body */}
                    <WarningWatermarkOverlay
                      stampText={copy.avoidStamp}
                      tone="light"
                      stampPlacement="center"
                      compact
                    />

                    <div className="relative z-10">
                      {/* Dark Obsidian-Crimson Dossier Header */}
                      <div className="relative h-20 overflow-hidden bg-gradient-to-r from-slate-950 via-rose-950/90 to-slate-900 px-4 pt-3">
                        <WarningWatermarkOverlay tone="dark" compact />
                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-md border border-rose-400/45 bg-rose-950/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-200">
                              ✕ {copy.memberAvoidMini}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                                isVerified
                                  ? "bg-amber-500/20 text-amber-100 ring-1 ring-amber-300/40"
                                  : "bg-white/10 text-slate-200 ring-1 ring-white/20"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isVerified ? "bg-amber-300" : "bg-slate-400"
                                }`}
                              />
                              {member.roleBadgeLabel}
                            </span>
                          </div>

                          {member.photoPath && (
                            <button
                              type="button"
                              onClick={() => setInspectedMember(member)}
                              className="rounded-md bg-black/40 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs transition-colors hover:bg-black/65"
                            >
                              {copy.zoomPhoto}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="px-5 pb-4">
                        <div className="-mt-11 flex items-end justify-between gap-3">
                          {member.photoPath ? (
                            <button
                              type="button"
                              onClick={() => setInspectedMember(member)}
                              aria-label={`${copy.zoomPhoto}: ${member.name}`}
                              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-900 shadow-md ring-1 ring-rose-300/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <Image
                                src={member.photoPath}
                                alt={member.photoAlt}
                                fill
                                sizes="96px"
                                className={`object-cover contrast-[1.03] saturate-[0.82] transition-transform duration-700 ease-out group-hover:scale-105 ${member.objectPosition}`}
                              />
                              <PortraitDenyOverlay
                                label={copy.memberAvoidMini}
                              />
                            </button>
                          ) : (
                            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-900 font-mono text-2xl font-bold text-white shadow-md ring-1 ring-rose-300/80">
                              <span className="relative z-10">
                                {getInitials(member.name)}
                              </span>
                              <PortraitDenyOverlay
                                label={copy.memberAvoidMini}
                              />
                            </div>
                          )}

                          <span className="mb-1 rounded-md border border-rose-200/80 bg-rose-50/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-900">
                            {member.departmentLabel}
                          </span>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-rose-800">
                            {member.headline}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-slate-500">
                            📍 {member.location}
                          </p>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-700">
                          {member.summary}
                        </p>

                        <p className="mt-2 font-mono text-[10px] text-slate-500">
                          {member.sourceNote}
                        </p>

                        <div className="mt-4 rounded-xl border border-rose-200/70 bg-rose-50/50 p-3 backdrop-blur-[1px]">
                          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-900">
                            {copy.relatedGuideLabel}
                          </span>
                          <p className="mt-0.5 text-xs font-medium text-slate-900">
                            {member.relatedDisputeArea}
                          </p>
                          <a
                            href="#agency-diagnostic"
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline"
                          >
                            {copy.verifyRegistriesBtn}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-2 border-t border-rose-100 bg-slate-50/85 px-5 py-3">
                      <a
                        href={member.linkedInSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#004182]"
                      >
                        <LinkedInIcon className="h-3.5 w-3.5" />
                        {member.linkedInButtonLabel} ↗
                      </a>
                      <a
                        href="#agency-diagnostic"
                        className="font-mono text-[11px] font-semibold text-rose-700 hover:underline"
                      >
                        6-Q Audit ↓
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Streamed Per-Agency 6-Question Audit & Live Firestore Community Tally */}
      {diagnosticSection}

      {/* 4. Smooth Collaborating Warehouses Carousel with Subtle X / AVOID Treatment */}
      <CollaboratingCompaniesSlider
        agencySlug={agency.slug}
        agencyName={agency.name}
        sectionClassName="bg-[#f8f9fa] py-14"
      />

      <MemberPhotoModal
        member={inspectedMember}
        titleId="inspected-member-title"
        closeLabel={copy.closeBtn}
        onClose={() => setInspectedMember(null)}
        footerAction={
          inspectedMember ? (
            <a
              href={inspectedMember.linkedInSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#004182]"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
              {inspectedMember.linkedInButtonLabel} ↗
            </a>
          ) : null
        }
      />
    </div>
  );
}
