"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";

interface NavbarProps {
  activePage?: "home" | "agencies";
}

export function Navbar({ activePage = "home" }: NavbarProps) {
  const { locale, setLocale } = useLanguage();
  const copy = UI_TEXT[locale].navbar;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs transition-colors group-hover:bg-[#D95D24]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18m-7-9h14M6 6l-2 6h4L6 6zm12 0l-2 6h4l-2-6zM8 21h8"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-slate-900">
              WerkRecht NL
            </span>
            <span className="hidden font-mono text-[10px] text-slate-500 sm:block">
              {copy.subtitle}
            </span>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-3.5 text-xs font-medium text-slate-600 lg:flex"
        >
          <Link
            href="/#agency-spotlight"
            className="transition-colors hover:text-slate-950"
          >
            {copy.spotlight}
          </Link>
          <Link
            href="/#community-action"
            className="transition-colors hover:text-slate-950"
          >
            {copy.community}
          </Link>
          <Link
            href="/#verify-agency"
            className="transition-colors hover:text-slate-950"
          >
            {copy.verify}
          </Link>
          <Link
            href="/agencies"
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors ${
              activePage === "agencies"
                ? "bg-[#0A66C2]/10 font-semibold text-[#0A66C2]"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0A66C2]" />
            {copy.agencies}
          </Link>
          <Link
            href="/#lawyer-matrix"
            className="transition-colors hover:text-slate-950"
          >
            {copy.lawyer}
          </Link>
          <Link
            href="/#objection-letter"
            className="transition-colors hover:text-slate-950"
          >
            {copy.objection}
          </Link>
          <Link
            href="/#reports"
            className="transition-colors hover:text-slate-950"
          >
            {copy.reports}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* NL / EN Switcher */}
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 p-0.5 font-mono text-[11px]"
          >
            <button
              type="button"
              onClick={() => setLocale("nl")}
              aria-pressed={locale === "nl"}
              className={`rounded-md px-2 py-1 font-semibold transition-colors ${
                locale === "nl"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              NL
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`rounded-md px-2 py-1 font-semibold transition-colors ${
                locale === "en"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            href="/agencies"
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors lg:hidden ${
              activePage === "agencies"
                ? "border-[#0A66C2] bg-[#0A66C2] text-white"
                : "border-slate-300 bg-white text-slate-800 hover:border-[#0A66C2] hover:text-[#0A66C2]"
            }`}
          >
            {copy.agenciesMobile}
          </Link>

          <Link
            href="/#submit-report"
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#D95D24]"
          >
            {copy.logCase}
          </Link>
        </div>
      </div>
    </header>
  );
}
