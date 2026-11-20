"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  DEPARTMENT_RED_FLAGS_BY_LOCALE,
  ONBOARDING_DUTIES_BY_LOCALE,
  UI_TEXT,
} from "@/lib/i18n-ui";

type DutyStatus = "kept" | "violated";

export function AgencyVerification() {
  const { locale } = useLanguage();
  const [dutyStates, setDutyStates] = useState<Record<string, DutyStatus>>({});

  const copy = UI_TEXT[locale].verify;
  const redFlags = DEPARTMENT_RED_FLAGS_BY_LOCALE[locale];
  const duties = ONBOARDING_DUTIES_BY_LOCALE[locale];

  function setDuty(id: string, next: DutyStatus) {
    setDutyStates((prev) => {
      if (prev[id] === next) {
        const copyMap = { ...prev };
        delete copyMap[id];
        return copyMap;
      }
      return { ...prev, [id]: next };
    });
  }

  const violatedCount = Object.values(dutyStates).filter(
    (s) => s === "violated"
  ).length;
  const totalCount = duties.length;

  return (
    <section
      id="verify-agency"
      className="scroll-mt-20 border-b border-slate-200 bg-[#f8f9fa] py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Part A: KEEP ALL RED FLAGS & PROOF TO SUE THEM */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
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
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#0A66C2]/30 bg-white px-4 py-3 text-xs font-semibold text-slate-900 shadow-2xs transition-all hover:border-[#0A66C2] hover:text-[#0A66C2] hover:shadow-sm"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0A66C2] font-mono text-[11px] font-bold text-white">
              in
            </span>
            <span>
              <span className="block">{copy.ctaTitle}</span>
              <span className="block font-mono text-[10px] font-normal text-slate-500">
                {copy.ctaSub}
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {redFlags.map((flag) => (
            <div
              key={flag.department}
              className="flex flex-col justify-between rounded-xl border-2 border-rose-200/90 bg-white p-5 shadow-2xs transition-colors hover:border-rose-400"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {flag.severity}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-rose-800">
                    {flag.department}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold leading-snug text-slate-950">
                  {flag.pattern}
                </h3>

                <p className="mt-1.5 font-mono text-[11px] font-medium text-rose-700">
                  {flag.lawRef}
                </p>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-700">
                  {flag.summary}
                </p>

                <div className="mt-3.5 rounded-lg border border-rose-100 bg-rose-50/60 p-3">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-900">
                    {copy.demandLabel}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-slate-800">
                    {flag.demandInWriting}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">
                  {copy.routeLabel}
                </span>{" "}
                {flag.escalateTo}
              </div>
            </div>
          ))}
        </div>

        {/* Part B: Agency Onboarding & Legal Duties (No Heavy Pre-Application Burden on Workers) */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#D95D24]">
                {copy.dutiesEyebrow}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                {copy.dutiesTitle}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{copy.dutiesSub}</p>
            </div>

            <div className="w-full shrink-0 rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 md:w-64">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-rose-900">
                  {copy.dutiesScoreLabel}
                </span>
                <span className="font-bold text-rose-950">
                  {violatedCount} / {totalCount}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-rose-100">
                <div
                  className="h-full rounded-full bg-rose-600 transition-all duration-300"
                  style={{
                    width: `${Math.round((violatedCount / totalCount) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {duties.map((item) => {
              const status = dutyStates[item.id];
              return (
                <div key={item.id} className="py-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="max-w-3xl space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-950 sm:text-base">
                          {item.title}
                        </h4>
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                          {item.lawTag}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-emerald-950">
                        <strong className="font-semibold text-emerald-800">
                          {copy.dutiesLabel}{" "}
                        </strong>
                        {item.agencyDuty}
                      </p>

                      <p className="text-xs leading-relaxed text-rose-950">
                        <strong className="font-semibold text-rose-800">
                          {copy.lieLabel}{" "}
                        </strong>
                        {item.commonLieOrAbuse}
                      </p>

                      <p className="text-xs leading-relaxed text-slate-700">
                        <strong className="font-semibold text-slate-900">
                          {copy.proofLabel}{" "}
                        </strong>
                        {item.proofToSue}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDuty(item.id, "kept")}
                          aria-pressed={status === "kept"}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            status === "kept"
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-emerald-600"
                          }`}
                        >
                          {copy.dutiesKeptBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDuty(item.id, "violated")}
                          aria-pressed={status === "violated"}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            status === "violated"
                              ? "border-rose-600 bg-rose-600 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-rose-600"
                          }`}
                        >
                          {copy.dutiesBrokeBtn}
                        </button>
                      </div>

                      <a
                        href={item.optionalCheckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-950"
                      >
                        {item.optionalCheckLabel}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
