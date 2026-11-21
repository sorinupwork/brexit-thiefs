"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { DEPARTMENT_RED_FLAGS_BY_LOCALE, UI_TEXT } from "@/lib/i18n-ui";

export function AgencyVerification() {
  const { locale } = useLanguage();

  const copy = UI_TEXT[locale].verify;
  const redFlags = DEPARTMENT_RED_FLAGS_BY_LOCALE[locale];

  return (
    <section
      id="verify-agency"
      className="scroll-mt-20 border-b border-slate-200 bg-[#f8f9fa] py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
      </div>
    </section>
  );
}
