"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  getCollaboratingCompanies,
  type CompanyRegionFilter,
} from "@/lib/collaborating-companies";
import { UI_TEXT } from "@/lib/i18n-ui";

interface CollaboratingCompaniesSliderProps {
  agencySlug?: string;
  agencyName?: string;
  sectionClassName?: string;
}

type SliderFilter = CompanyRegionFilter | "agency";

export function CollaboratingCompaniesSlider({
  agencySlug,
  agencyName,
  sectionClassName = "bg-[#f8f9fa] py-14",
}: CollaboratingCompaniesSliderProps) {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].agenciesDir;

  const companies = useMemo(() => {
    const list = getCollaboratingCompanies(locale);
    if (!agencySlug) return list;
    return [...list].sort((a, b) => {
      const aMatch = a.agencySlugs.includes(agencySlug) ? 0 : 1;
      const bMatch = b.agencySlugs.includes(agencySlug) ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [locale, agencySlug]);

  const agencyMatchCount = useMemo(
    () =>
      agencySlug
        ? companies.filter((c) => c.agencySlugs.includes(agencySlug)).length
        : 0,
    [companies, agencySlug]
  );

  const [regionFilter, setRegionFilter] = useState<SliderFilter>("all");
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const visibleCompanies = useMemo(() => {
    if (regionFilter === "all") return companies;
    if (regionFilter === "agency" && agencySlug) {
      return companies.filter((c) => c.agencySlugs.includes(agencySlug));
    }
    return companies.filter((c) => c.regionGroup === regionFilter);
  }, [companies, regionFilter, agencySlug]);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.scrollTo({ left: 0 });
    }
    const raf = window.requestAnimationFrame(updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [visibleCompanies, updateScrollButtons]);

  function scrollSlider(direction: "prev" | "next") {
    const el = trackRef.current;
    if (!el) return;
    const distance = Math.max(280, Math.round(el.clientWidth * 0.8));
    el.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  }

  const filterOptions: [SliderFilter, string][] = [
    ["all", `${copy.sliderFilterAll} (${companies.length})`],
    ...(agencySlug && agencyName && agencyMatchCount > 0
      ? ([["agency", `${agencyName} (${agencyMatchCount})`]] as [
          SliderFilter,
          string,
        ][])
      : []),
    ["amsterdam", "Amsterdam / Schiphol"],
    ["rotterdam", "Rotterdam / Moerdijk"],
    ["zuid-holland", "Zuid-Holland"],
    ["technical", locale === "nl" ? "Techniek & Infra" : "Technical & Infra"],
  ];

  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-rose-700">
              {copy.sliderEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {copy.sliderTitle}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {copy.sliderIntro}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider("prev")}
              disabled={!canScrollPrev}
              aria-label={copy.sliderPrevLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 shadow-2xs transition-colors hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("next")}
              disabled={!canScrollNext}
              aria-label={copy.sliderNextLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 shadow-2xs transition-colors hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        {/* Region Corridor Chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {filterOptions.map(([value, label]) => {
            const active = regionFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRegionFilter(value)}
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

        {/* Horizontal Scroll-Snap Slider */}
        <div
          ref={trackRef}
          onScroll={updateScrollButtons}
          className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {visibleCompanies.map((company) => (
            <article
              key={company.id}
              className="flex w-[86%] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-md sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                    {company.corridorLabel}
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700">
                    {company.sector}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-950">
                  {company.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-slate-500">
                  📍 {company.location}
                </p>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  {company.summary}
                </p>

                <div className="mt-3 rounded-lg border border-sky-200/80 bg-sky-50/60 px-3 py-2 font-mono text-[10px] font-semibold text-sky-900">
                  {company.agencyNote}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5">
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#D95D24]"
                >
                  {copy.companySiteBtn} ↗
                </a>
                <a
                  href={company.linkedInSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#0A66C2] transition-colors hover:border-[#0A66C2]"
                >
                  LinkedIn ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          {copy.sliderNote}
        </p>
      </div>
    </section>
  );
}
