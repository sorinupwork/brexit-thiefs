"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  getLocalizedAuthorities,
  getLocalizedBrusselsChannels,
} from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";

export function LawyerSchematic() {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].lawyer;
  const authorities = getLocalizedAuthorities(locale);
  const euChannels = getLocalizedBrusselsChannels(locale);

  return (
    <section
      id="authorities"
      className="scroll-mt-20 border-b border-slate-200 bg-slate-50 py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
            {copy.authEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {copy.authHeading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {copy.authIntro}
          </p>
        </div>

        {/* Warning on Passive / Fee-Charging Intermediaries & Why 1-Europe Escalation Matters */}
        <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 shadow-2xs">
          <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-amber-950">
            {copy.cautionBannerTitle}
          </span>
          <p className="mt-1.5 text-xs leading-relaxed text-amber-950 sm:text-sm">
            {copy.cautionBannerBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {euChannels.map((ch) => (
              <a
                key={ch.id}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#D95D24] hover:bg-[#D95D24]"
              >
                {ch.actionLabel}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {authorities.map((auth) => (
            <div
              key={auth.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      {auth.name}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-500">
                      {auth.englishLabel}
                    </p>
                  </div>
                  {auth.urgent && (
                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
                      {copy.primaryBadge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {auth.scope}
                </p>
                <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-700">
                  {auth.bestFor.map((item) => (
                    <li key={item} className="flex gap-2 leading-relaxed">
                      <span className="text-[#D95D24]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={auth.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#D95D24] hover:bg-[#D95D24]"
              >
                {auth.actionLabel}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
