"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";

export function HomeHero() {
  const { locale } = useLanguage();
  const h = UI_TEXT[locale].home;

  return (
    <section className="blueprint-grid border-b border-slate-200 bg-[#f8f9fa] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
              {h.eyebrow}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.08]">
              {h.h1Prefix}
              <span className="text-[#D95D24]">{h.h1Highlight}</span>
              {h.h1Suffix}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
              {h.introBefore}
              <strong className="font-semibold text-slate-950">
                European Parliament (PETI), ELA, Belgium SIOD, Germany Zoll
              </strong>
              ,{" "}
              <strong className="font-semibold text-slate-950">
                Nederlandse Arbeidsinspectie, SNCU, Politie
              </strong>
              {h.introAnd}
            </p>

            {/* Primary CTAs */}
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#agency-spotlight"
                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#D95D24] sm:w-auto"
              >
                {h.ctaPrimary}
              </a>
              <a
                href="#objection-letter"
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#D95D24] bg-white px-5 py-3 text-center text-sm font-semibold text-[#D95D24] transition-colors hover:bg-[#D95D24] hover:text-white sm:w-auto"
              >
                {h.ctaSecondary}
              </a>
              <a
                href="#community-action"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:border-slate-900 hover:text-slate-950 sm:w-auto"
              >
                {h.ctaCommunity}
              </a>
            </div>

            {/* Proven Field Reality Callout: Wage Theft & Street Abandonment Fuel Crime */}
            <div className="mt-6 rounded-xl border-2 border-rose-300 bg-rose-50/90 p-4 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 font-mono text-xs font-bold text-white">
                  !
                </span>
                <div>
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-rose-900">
                    {h.crisisBannerTitle}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-rose-950 sm:text-sm">
                    {h.crisisBannerBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: 4-Step Human Needs, Money Back, Rights Back, Explain & Prove */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <dl className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-rose-200 bg-rose-50/75 p-3.5">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    {h.stat1Label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-rose-950">
                    {h.stat1Value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-rose-900">
                    {h.stat1Sub}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    {h.stat2Label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-950">
                    {h.stat2Value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-slate-700">
                    {h.stat2Sub}
                  </p>
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-900">
                    {h.stat3Label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-950">
                    {h.stat3Value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-slate-700">
                    {h.stat3Sub}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    {h.stat4Label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-950">
                    {h.stat4Value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-slate-600">
                    {h.stat4Sub}
                  </p>
                </div>
              </dl>

            </div>
          </div>
        </div>

        {/* Immediate Human-Needs Emergency Strip right at the top */}
        <div className="mt-8 rounded-2xl border border-emerald-300/80 bg-white p-4 shadow-2xs sm:px-6">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-900">
              {h.emergencyStripLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {h.emergencyStripLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition-colors hover:border-emerald-600 hover:bg-emerald-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
