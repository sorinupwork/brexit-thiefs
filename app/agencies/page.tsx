import { Suspense } from "react";
import type { Metadata } from "next";
import { AgenciesDirectory } from "@/components/AgenciesDirectory";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { readAgencies } from "@/lib/agencies-store";

export const metadata: Metadata = {
  title: "Uitzendbureaus & Teams Gids · WerkRecht NL | Multi-Agency Directory",
  description:
    "Overzicht voor samenwerking tussen meerdere uitzendbureaus en teams: bekijk organigrammen, controleer registers en voorkom samen misstanden en oplichting.",
};

async function AgenciesDirectorySection() {
  const agencies = await readAgencies();
  return <AgenciesDirectory initialAgencies={agencies} />;
}

function AgenciesFallback() {
  return (
    <section className="bg-[#f8f9fa] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}

export default function AgenciesPage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Navbar activePage="agencies" />

      <main className="flex-1">
        <Suspense fallback={<AgenciesFallback />}>
          <AgenciesDirectorySection />
        </Suspense>
      </main>

      <SiteFooter variant="agencies" />
    </div>
  );
}
