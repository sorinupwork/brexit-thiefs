"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const variant =
    pathname === "/agencies"
      ? "agencies"
      : pathname.startsWith("/agencies/")
        ? "agency-detail"
        : "home";

  const { locale } = useLanguage();
  const f = UI_TEXT[locale].footer;

  const title = variant === "agencies" ? f.agenciesTitle : f.mainTitle;
  const description =
    variant === "agencies"
      ? f.agenciesDesc
      : variant === "agency-detail"
        ? f.agencyDetailDesc
        : f.mainDesc;

  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 text-xs sm:flex-row sm:items-center sm:px-6">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 max-w-2xl leading-relaxed">{description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-4 font-mono text-[11px] text-slate-400">
          {variant === "home" ? (
            <>
              <Link href="/agencies" className="text-slate-300 hover:text-white">
                {f.agenciesLink}
              </Link>
              <span>{f.phaseNote}</span>
            </>
          ) : (
            <>
              <Link
                href={variant === "agency-detail" ? "/agencies" : "/"}
                className="text-slate-300 hover:text-white"
              >
                {variant === "agency-detail" ? f.allAgencies : f.backPortal}
              </Link>
              <Link
                href="/#verify-agency"
                className="text-amber-400 hover:underline"
              >
                {f.redFlagsLink}
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
