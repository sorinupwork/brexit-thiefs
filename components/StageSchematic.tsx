"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getLocalizedAuthority,
  getLocalizedStages,
} from "@/lib/i18n-data";
import { UI_TEXT } from "@/lib/i18n-ui";
import type { LifecycleStageId } from "@/lib/types";

function StageIllustration({ stageId }: { stageId: LifecycleStageId }) {
  switch (stageId) {
    case "recruitment":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <rect x="8" y="10" width="44" height="52" rx="6" className="fill-slate-100 stroke-slate-400" strokeWidth="1.5" />
          <line x1="16" y1="22" x2="44" y2="22" className="stroke-slate-500" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="31" x2="38" y2="31" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="40" x2="42" y2="40" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="48" width="18" height="6" rx="2" className="fill-[#D95D24]/20 stroke-[#D95D24]" strokeWidth="1.2" />
          <path d="M58 36h18m0 0l-5-5m5 5l-5 5" className="stroke-[#D95D24]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="96" cy="28" r="10" className="fill-white stroke-slate-700" strokeWidth="1.5" />
          <path d="M82 56c2-9 26-9 28 0" className="stroke-slate-700" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "coordination":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <rect x="10" y="14" width="32" height="44" rx="5" className="fill-white stroke-slate-700" strokeWidth="1.5" />
          <rect x="78" y="14" width="32" height="44" rx="5" className="fill-slate-100 stroke-slate-500" strokeWidth="1.5" />
          <circle cx="60" cy="36" r="11" className="fill-[#D95D24]/15 stroke-[#D95D24]" strokeWidth="1.5" />
          <path d="M42 36h7m22 0h7" className="stroke-slate-500" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M56 36l3 3 6-6" className="stroke-[#D95D24]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17" y1="26" x2="35" y2="26" className="stroke-slate-400" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="35" x2="31" y2="35" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
          <line x1="85" y1="26" x2="103" y2="26" className="stroke-slate-400" strokeWidth="2" strokeLinecap="round" />
          <line x1="85" y1="35" x2="99" y2="35" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "transport":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <path d="M16 44h58l-4-14a6 6 0 00-5.8-4.4H29.8A6 6 0 0024 30l-4 14z" className="fill-white stroke-slate-700" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="14" y="42" width="62" height="12" rx="4" className="fill-slate-100 stroke-slate-700" strokeWidth="1.5" />
          <circle cx="28" cy="54" r="6" className="fill-white stroke-slate-800" strokeWidth="1.6" />
          <circle cx="62" cy="54" r="6" className="fill-white stroke-slate-800" strokeWidth="1.6" />
          <rect x="86" y="18" width="18" height="32" rx="3" className="fill-amber-50 stroke-[#D95D24]" strokeWidth="1.5" />
          <rect x="90" y="23" width="10" height="8" rx="1.5" className="fill-white stroke-[#D95D24]" strokeWidth="1.1" />
          <path d="M104 24l5 4v14a3 3 0 01-5 2" className="stroke-[#D95D24]" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "payroll":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <rect x="14" y="10" width="92" height="52" rx="6" className="fill-white stroke-slate-700" strokeWidth="1.5" />
          <text x="24" y="34" className="fill-slate-800 font-mono text-[16px] font-bold">
            €
          </text>
          <line x1="42" y1="24" x2="92" y2="24" className="stroke-slate-400" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="34" x2="78" y2="34" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
          <rect x="24" y="44" width="72" height="10" rx="3" className="fill-amber-50 stroke-[#D95D24]" strokeWidth="1.2" />
          <line x1="32" y1="49" x2="66" y2="49" className="stroke-[#D95D24]" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="88" cy="49" r="2.5" className="fill-[#D95D24]" />
        </svg>
      );
    case "accommodation":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <path d="M22 34L60 12l38 22" className="stroke-slate-800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="34" width="60" height="28" rx="2" className="fill-white stroke-slate-700" strokeWidth="1.5" />
          <rect x="52" y="44" width="16" height="18" className="fill-slate-100 stroke-slate-500" strokeWidth="1.3" />
          <rect x="36" y="40" width="10" height="10" className="fill-slate-50 stroke-slate-400" strokeWidth="1.2" />
          <rect x="74" y="40" width="10" height="10" className="fill-slate-50 stroke-slate-400" strokeWidth="1.2" />
          <circle cx="94" cy="20" r="9" className="fill-rose-50 stroke-[#D95D24]" strokeWidth="1.4" />
          <path d="M94 16v5m0 3h.01" className="stroke-[#D95D24]" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "escalation":
      return (
        <svg viewBox="0 0 120 72" fill="none" className="h-14 w-24" aria-hidden="true">
          <rect x="10" y="22" width="30" height="28" rx="4" className="fill-slate-100 stroke-slate-600" strokeWidth="1.5" />
          <path d="M40 36h18m0 0l14-16m-14 16l14 0m-14 0l14 16" className="stroke-[#D95D24]" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="74" y="12" width="36" height="14" rx="3" className="fill-white stroke-slate-700" strokeWidth="1.3" />
          <rect x="74" y="29" width="36" height="14" rx="3" className="fill-white stroke-slate-700" strokeWidth="1.3" />
          <rect x="74" y="46" width="36" height="14" rx="3" className="fill-white stroke-slate-700" strokeWidth="1.3" />
          <line x1="80" y1="19" x2="104" y2="19" className="stroke-slate-500" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="80" y1="36" x2="104" y2="36" className="stroke-slate-500" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="80" y1="53" x2="104" y2="53" className="stroke-slate-500" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function StageSchematic() {
  const { locale } = useLanguage();
  const [activeId, setActiveId] = useState<LifecycleStageId>("payroll");

  const copy = UI_TEXT[locale].stage;
  const stages = getLocalizedStages(locale);
  const activeStage =
    stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <section id="schematic" className="scroll-mt-20 border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {copy.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {copy.intro}
          </p>
        </div>

        {/* Interactive 6-stage visual pipeline */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => {
            const isSelected = stage.id === activeId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveId(stage.id)}
                className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                    : "border-slate-200 bg-slate-50/70 text-slate-900 hover:border-slate-400 hover:bg-white"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isSelected ? "text-[#F59E0B]" : "text-[#D95D24]"
                    }`}
                  >
                    {copy.stagePrefix} {stage.stepNumber}
                  </span>
                  {index < stages.length - 1 && (
                    <span
                      className={`hidden font-mono text-xs lg:inline ${
                        isSelected ? "text-slate-400" : "text-slate-300"
                      }`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </div>
                <div className="my-3 flex w-full justify-center rounded-lg bg-white/95 p-2 ring-1 ring-slate-200/80">
                  <StageIllustration stageId={stage.id} />
                </div>
                <span className="text-sm font-semibold leading-snug">
                  {stage.shortTitle}
                </span>
                <span
                  className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
                    isSelected ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {stage.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Blueprint Detail Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#D95D24]">
                {copy.blueprintTitle} {activeStage.stepNumber}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                {activeStage.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{activeStage.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeStage.primaryAuthorities.map((authId) => {
                const auth = getLocalizedAuthority(authId, locale);
                return (
                  <a
                    key={auth.id}
                    href={auth.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-[#D95D24] hover:text-[#D95D24]"
                  >
                    {auth.name}
                    <span aria-hidden="true">↗</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                {copy.lawHeading}
              </h4>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-800">
                {activeStage.legalFramework.map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                {copy.evidenceHeading}
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
                {activeStage.evidenceToCollect.map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span className="font-mono text-xs text-emerald-700">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-800">
                {copy.verifyHeading}
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                {activeStage.whatToVerify.map((item) => (
                  <li key={item} className="flex gap-2.5 leading-relaxed">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-mono text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-5">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-900">
                {copy.redFlagsHeading}
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-800">
                {activeStage.redFlags.map((item) => (
                  <li key={item} className="flex gap-2.5 leading-relaxed">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 font-mono text-[10px] font-bold text-amber-900 ring-1 ring-amber-300">
                      !
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
