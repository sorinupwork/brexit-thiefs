"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { WarningWatermarkOverlay } from "@/components/shared/WarningWatermarkOverlay";
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
  const [userPaused, setUserPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isManualScrollingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const visibleCompanies = useMemo(() => {
    if (regionFilter === "all") return companies;
    if (regionFilter === "agency" && agencySlug) {
      return companies.filter((c) => c.agencySlugs.includes(agencySlug));
    }
    return companies.filter((c) => c.regionGroup === regionFilter);
  }, [companies, regionFilter, agencySlug]);

  const shouldLoop = visibleCompanies.length >= 3;

  const renderedCompanies = useMemo(() => {
    if (!shouldLoop) {
      return visibleCompanies.map((company) => ({
        company,
        renderKey: company.id,
      }));
    }
    return [
      ...visibleCompanies.map((company) => ({
        company,
        renderKey: `${company.id}-a`,
      })),
      ...visibleCompanies.map((company) => ({
        company,
        renderKey: `${company.id}-b`,
      })),
    ];
  }, [visibleCompanies, shouldLoop]);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (shouldLoop) {
      setCanScrollPrev(true);
      setCanScrollNext(true);
      return;
    }
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [shouldLoop]);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.scrollTo({ left: 0 });
      scrollPosRef.current = 0;
    }
    const raf = window.requestAnimationFrame(updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [visibleCompanies, updateScrollButtons]);

  useEffect(() => {
    if (!shouldLoop || userPaused) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;
    let lastTime = performance.now();
    const SPEED_PX_PER_SEC = 24;

    const tick = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;

      const el = trackRef.current;
      if (el && !isHoveringRef.current && !isManualScrollingRef.current) {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > el.clientWidth / 2) {
          scrollPosRef.current += (SPEED_PX_PER_SEC * dt) / 1000;
          if (scrollPosRef.current >= halfWidth) {
            scrollPosRef.current -= halfWidth;
          }
          el.scrollLeft = scrollPosRef.current;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [shouldLoop, userPaused, visibleCompanies]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  function pauseTemporarily(durationMs = 1400) {
    isManualScrollingRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      const el = trackRef.current;
      if (el) {
        scrollPosRef.current = el.scrollLeft;
      }
      isManualScrollingRef.current = false;
      resumeTimerRef.current = null;
    }, durationMs);
  }

  function handleTrackScroll() {
    const el = trackRef.current;
    if (!el) return;
    if (
      isHoveringRef.current ||
      isManualScrollingRef.current ||
      userPaused ||
      !shouldLoop
    ) {
      scrollPosRef.current = el.scrollLeft;
    }
    updateScrollButtons();
  }

  function scrollSlider(direction: "prev" | "next") {
    const el = trackRef.current;
    if (!el) return;
    pauseTemporarily(1100);
    const distance = Math.max(300, Math.round(el.clientWidth * 0.72));

    if (shouldLoop) {
      const halfWidth = el.scrollWidth / 2;
      if (direction === "prev" && el.scrollLeft < distance) {
        el.scrollLeft = el.scrollLeft + halfWidth;
        scrollPosRef.current = el.scrollLeft;
      } else if (
        direction === "next" &&
        el.scrollLeft + distance > halfWidth * 1.6
      ) {
        el.scrollLeft = Math.max(0, el.scrollLeft - halfWidth);
        scrollPosRef.current = el.scrollLeft;
      }
    }

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
            {shouldLoop && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-900 hover:text-slate-950"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${userPaused ? "bg-slate-400" : "bg-rose-600 animate-pulse"
                    }`}
                />
                {userPaused ? copy.sliderPlayLabel : copy.sliderPauseLabel}
              </button>
            )}
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
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Buttery-Smooth Horizontal Carousel with Edge Fade Masks */}
        <div
          className="relative mt-6"
          onMouseEnter={() => {
            isHoveringRef.current = true;
          }}
          onMouseLeave={() => {
            const el = trackRef.current;
            if (el) scrollPosRef.current = el.scrollLeft;
            isHoveringRef.current = false;
          }}
          onFocusCapture={() => {
            isHoveringRef.current = true;
          }}
          onBlurCapture={() => {
            const el = trackRef.current;
            if (el) scrollPosRef.current = el.scrollLeft;
            isHoveringRef.current = false;
          }}
          onPointerDown={() => pauseTemporarily(2200)}
        >
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="no-scrollbar flex gap-5 overflow-x-auto py-2 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]"
          >
            {renderedCompanies.map(({ company, renderKey }) => (
              <article
                key={renderKey}
                className="group relative flex w-[86%] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-rose-200/80 bg-white p-5 shadow-2xs transition-all duration-700 ease-out hover:-translate-y-0.5 hover:border-rose-400/90 hover:shadow-md sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                {/* Slow-breathing architectural X & AVOID watermark background */}
                <WarningWatermarkOverlay
                  stampText={copy.warehouseStamp}
                  tone="light"
                  stampPlacement="center"
                />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-200">
                      {copy.warehouseWarningBadge}
                    </span>
                    <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                      {company.corridorLabel}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-slate-200 bg-slate-50/90 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700">
                      {company.sector}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-slate-950">
                    {company.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    📍 {company.location}
                  </p>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-700">
                    {company.summary}
                  </p>

                  <div className="mt-3 rounded-lg border border-rose-200/90 bg-rose-50/80 px-3 py-2 font-mono text-[10px] font-semibold text-rose-950 backdrop-blur-[1px]">
                    {company.agencyNote}
                  </div>
                </div>

                <div className="relative z-10 mt-4 flex items-center gap-2 border-t border-rose-100/90 pt-3.5">
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                  >
                    {copy.companySiteBtn} ↗
                  </a>
                  <a
                    href={company.linkedInSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-xs font-semibold text-[#0A66C2] transition-colors hover:border-[#0A66C2]"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          {copy.sliderNote}
        </p>
      </div>
    </section>
  );
}
