import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
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
  title:
    "WerkRecht NL · Rechten voor Uitzendkrachten & Klachtvoorbereiding | Temp-Worker Rights",
  description:
    "Onafhankelijk Nederlands documentatie- en transparantieportaal (NL / EN) voor uitzendkrachten bij looninhoudingen, CAO-afwijkingen, huisvestingsgebreken en uitzendbureau-controle.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-slate-900">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
