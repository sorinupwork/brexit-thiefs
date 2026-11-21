"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, type Locale } from "@/components/layout/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";

const LOCALES: readonly Locale[] = ["nl", "en"];

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const isAgenciesPage =
    pathname === "/agencies" || pathname.startsWith("/agencies/");
  const { locale, setLocale } = useLanguage();
  const copy = UI_TEXT[locale].navbar;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectionLinks = [
    { step: "01", href: "/#agency-spotlight", label: copy.spotlight },
    { step: "02", href: "/#objection-letter", label: copy.objection },
    { step: "03", href: "/#reports", label: copy.reports },
    { step: "04", href: "/#community-action", label: copy.community },
    { step: "05", href: "/#verify-agency", label: copy.verify },
    { step: "07", href: "/#authorities", label: copy.lawyer },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-3.5">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs transition-colors group-hover:bg-[#D95D24] sm:h-9 sm:w-9">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 sm:h-5 sm:w-5"
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
          className="hidden items-center gap-2.5 text-xs font-medium text-slate-600 lg:flex xl:gap-3.5"
        >
          {sectionLinks.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/agencies"
            aria-current={isAgenciesPage ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 transition-colors ${
              isAgenciesPage
                ? "bg-[#0A66C2]/10 font-semibold text-[#0A66C2]"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0A66C2]" />
            {copy.agencies}
          </Link>
          {sectionLinks.slice(3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* NL / EN Switcher */}
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 p-0.5 font-mono text-[11px]"
          >
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`rounded-md px-1.5 py-1 font-semibold uppercase transition-colors sm:px-2 ${
                  locale === code
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            href="/agencies"
            aria-current={isAgenciesPage ? "page" : undefined}
            className={`hidden items-center gap-1 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors sm:inline-flex lg:hidden ${
              isAgenciesPage
                ? "border-[#0A66C2] bg-[#0A66C2] text-white"
                : "border-slate-300 bg-white text-slate-800 hover:border-[#0A66C2] hover:text-[#0A66C2]"
            }`}
          >
            {copy.agenciesMobile}
          </Link>

          <Link
            href="/#submit-report"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#D95D24] sm:px-3 sm:py-2"
          >
            {copy.logCase}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileMenuOpen
                ? locale === "nl"
                  ? "Sluit navigatiemenu"
                  : "Close navigation menu"
                : locale === "nl"
                  ? "Open navigatiemenu"
                  : "Open navigation menu"
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 transition-colors hover:border-slate-900 sm:h-9 sm:w-9 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Section Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          <div className="mx-auto max-w-6xl space-y-2">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {sectionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-900 hover:bg-white"
                >
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                    {item.step}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
              <Link
                href="/agencies"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isAgenciesPage ? "page" : undefined}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  isAgenciesPage
                    ? "border-[#0A66C2] bg-[#0A66C2] text-white"
                    : "border-[#0A66C2]/40 bg-[#0A66C2]/5 text-[#0A66C2]"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {copy.agencies}
              </Link>
              <Link
                href="/#submit-report"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#D95D24] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
              >
                {copy.logCase}
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
