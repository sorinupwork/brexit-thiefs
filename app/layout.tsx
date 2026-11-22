import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "WerkRecht NL · Stop Temp-Agency Exploitation, Reclaim Wages & Escalate Across 1 Europe",
    template: "%s | WerkRecht NL",
  },
  description:
    "Open community worker-protection & evidence platform (NL / EN). Expose corrupt staffing agency practices, collect votes & comments, recover withheld wages, fuel & ADV hours, and submit proof to EU Parliament (PETI), ELA, Belgium SIOD, Germany Zoll, Arbeidsinspectie, SNCU, SNF & Politie.",
  keywords: [
    "uitzendbureau klachten",
    "temp worker rights netherlands",
    "looninhouding uitzendbureau",
    "ADV vakantie-uren min",
    "inlenersbeloning",
    "SNF housing complaints",
    "European Labour Authority ELA",
    "European Parliament PETI petition",
    "arbeidsinspectie melden",
    "SNCU melden",
    "Belgium SIOD social fraud",
    "Germany Zoll FKS",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "WerkRecht NL · 1 Europe Fair Work",
    title:
      "WerkRecht NL · Take Back Your Money, Rights & Dignity Across Europe",
    description:
      "Community evidence platform exposing corrupt temp-agency teams, collecting real votes, comments & reimbursable euro claims for EU Parliament, ELA, NL, Belgium & Germany authorities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WerkRecht NL · Stop Temp-Agency Exploitation in Europe",
    description:
      "Expose corrupt staffing agencies, document withheld pay & onboarding lies, vote & comment, and escalate across 1 Europe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-slate-900">
        <LanguageProvider>
          <div id="top" className="flex min-h-screen flex-col">
            <Suspense
              fallback={
                <header className="h-16 border-b border-slate-200/90 bg-white/95" />
              }
            >
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={null}>
              <SiteFooter />
            </Suspense>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
