"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollaboratingCompaniesSlider } from "@/components/agencies/CollaboratingCompaniesSlider";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getInitials, type AgencyRecord } from "@/lib/agency-team";
import { getLocalizedAgency } from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";

interface AgenciesDirectoryProps {
  initialAgencies: AgencyRecord[];
}

export function AgenciesDirectory({ initialAgencies }: AgenciesDirectoryProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agenciesDir;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "with-photos">("all");

  const localizedAgencies = useMemo(
    () => initialAgencies.map((a) => getLocalizedAgency(a, locale)),
    [initialAgencies, locale]
  );

  const filteredAgencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return localizedAgencies.filter((agency) => {
      if (
        filterMode === "with-photos" &&
        !agency.members.some((m) => m.photoPath !== null)
      ) {
        return false;
      }
      if (!q) return true;
      const memberMatch = agency.members.some(
        (m) =>
          m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
      );
      return (
        agency.name.toLowerCase().includes(q) ||
        agency.hqLocation.toLowerCase().includes(q) ||
        agency.sectors.some((s) => s.toLowerCase().includes(q)) ||
        agency.scamPreventionFocus.toLowerCase().includes(q) ||
        memberMatch
      );
    });
  }, [localizedAgencies, filterMode, searchQuery]);

  return (
    <div className="bg-[#f8f9fa]">
      {/* Directory Grid */}
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
                {copy.section1Eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {copy.section1Title}
              </h1>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label="Search agencies"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none sm:max-w-sm"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  filterMode === "all"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {copy.allBtn} ({localizedAgencies.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("with-photos")}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  filterMode === "with-photos"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {copy.withPhotosBtn}
              </button>
            </div>
          </div>

          {/* Agency Cards */}
          <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredAgencies.length === 0 ? (
              <div className="lg:col-span-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">
                  {copy.emptyTitle}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {copy.emptySub}
                </p>
              </div>
            ) : (
                  filteredAgencies.map((agency) => (
                    <article
                      key={agency.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition-all hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-slate-900 to-[#D95D24]/90 px-5 py-4 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 font-mono text-base font-bold text-white ring-1 ring-white/25">
                              {agency.monogram}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold leading-tight">
                                {agency.name}
                              </h3>
                              <p className="text-xs text-slate-300">
                                {agency.hqLocation}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-200">
                              {agency.members.length}{" "}
                              {agency.members.length === 1
                                ? copy.profilesSingular
                                : copy.profilesPlural}
                            </span>
                            {agency.members.some((m) => m.photoPath !== null) && (
                              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-100">
                                {copy.photoRosterBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {agency.sectors.map((sector) => (
                            <span
                              key={sector}
                              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 rounded-xl border border-rose-200/80 bg-rose-50/50 p-3.5">
                          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-900">
                            {copy.scamCheckLabel}
                          </span>
                          <p className="mt-1 text-xs leading-relaxed text-slate-800">
                            {agency.scamPreventionFocus}
                          </p>
                        </div>

                        {/* Team Avatars Preview */}
                        <div className="mt-4">
                          <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            {copy.previewLabel}
                          </span>
                          {agency.members.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {agency.members.map((member) => (
                                <div
                                  key={member.id}
                                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3"
                                >
                                  {member.photoPath ? (
                                    <div className="relative h-7 w-7 overflow-hidden rounded-full bg-slate-200">
                                      <Image
                                        src={member.photoPath}
                                        alt={member.photoAlt}
                                        fill
                                        sizes="28px"
                                        className={`object-cover ${member.objectPosition}`}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] font-bold text-white">
                                      {getInitials(member.name)}
                                    </div>
                                  )}
                                  <div className="leading-tight">
                                    <span className="block text-xs font-semibold text-slate-900">
                                      {member.name}
                                    </span>
                                    <span className="block font-mono text-[10px] text-slate-500">
                                      {member.role}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-1.5 text-xs text-slate-500">
                              {copy.noMembersYet}
                            </p>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={agency.linkedInPeopleSearchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0A66C2] transition-colors hover:border-[#0A66C2]"
                            >
                              {copy.linkedInSearchBtn}
                            </a>
                            <a
                              href={agency.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-900"
                            >
                              {copy.siteRegistryBtn}
                            </a>
                          </div>

                          <Link
                            href={`/agencies/${agency.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#D95D24]"
                          >
                            {copy.openPageBtn}
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
        </div>
      </section>

      {/* Collaborating Warehouses & Host Companies Slider */}
      <CollaboratingCompaniesSlider />
    </div>
  );
}
