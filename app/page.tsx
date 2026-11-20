import { Suspense } from "react";
import { AgencyCorruptionVisualizer } from "@/components/AgencyCorruptionVisualizer";
import { AgencyVerification } from "@/components/AgencyVerification";
import { EuropeFairWorkSpotlight } from "@/components/EuropeFairWorkSpotlight";
import { HomeHero } from "@/components/HomeHero";
import { LawyerSchematic } from "@/components/LawyerSchematic";
import { Navbar } from "@/components/Navbar";
import { ObjectionGenerator } from "@/components/ObjectionGenerator";
import { ReportsPortal } from "@/components/ReportsPortal";
import { SiteFooter } from "@/components/SiteFooter";
import { StageSchematic } from "@/components/StageSchematic";
import { readAgencies } from "@/lib/agencies-store";
import { readComments } from "@/lib/comments-store";
import { readPolls } from "@/lib/polls-store";
import { readReports } from "@/lib/reports-store";

async function AgencySpotlightSection() {
  const [agencies, polls] = await Promise.all([readAgencies(), readPolls()]);
  return (
    <AgencyCorruptionVisualizer
      initialAgencies={agencies}
      initialPolls={polls}
    />
  );
}

function AgencySpotlightFallback() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    </section>
  );
}

async function CommunityActionSection() {
  const [reports, polls, comments] = await Promise.all([
    readReports(),
    readPolls(),
    readComments(),
  ]);
  return (
    <EuropeFairWorkSpotlight
      initialReports={reports}
      initialPolls={polls}
      initialComments={comments}
    />
  );
}

function SpotlightFallback() {
  return (
    <section className="bg-slate-950 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
      </div>
    </section>
  );
}

async function ReportsSection() {
  const [reports, polls] = await Promise.all([readReports(), readPolls()]);
  return <ReportsPortal initialReports={reports} initialPolls={polls} />;
}

function ReportsFallback() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Navbar activePage="home" />

      <main className="flex-1">
        <HomeHero />
        <Suspense fallback={<AgencySpotlightFallback />}>
          <AgencySpotlightSection />
        </Suspense>
        <Suspense fallback={<SpotlightFallback />}>
          <CommunityActionSection />
        </Suspense>
        <AgencyVerification />
        <StageSchematic />
        <LawyerSchematic />
        <ObjectionGenerator />
        <Suspense fallback={<ReportsFallback />}>
          <ReportsSection />
        </Suspense>
      </main>

      <SiteFooter variant="home" />
    </div>
  );
}
