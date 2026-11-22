import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AgencyHeaderFlagButton } from "@/components/agencies/AgencyHeaderFlagButton";
import { AgencyLiveDiagnosticClient } from "@/components/agencies/AgencyLiveDiagnosticSection";
import { AgencyTeamVisualizer } from "@/components/agencies/AgencyTeamVisualizer";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import { getAgencyBySlug, getAgencySummaries } from "@/lib/agency-team";
import { getPolls, getUserVotes, getVoterId } from "@/lib/queries";

async function AgencyHeaderLiveActions({
  agencySlug,
}: {
  agencySlug: string;
}) {
  const voterId = await getVoterId();
  const [polls, userVotes] = await Promise.all([
    getPolls(),
    getUserVotes(voterId),
  ]);

  return (
    <AgencyHeaderFlagButton
      agencySlug={agencySlug}
      initialPolls={polls}
      initialUserVotes={userVotes}
    />
  );
}

function AgencyHeaderLiveActionsFallback() {
  return (
    <a
      href="#agency-diagnostic"
      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700"
    >
      6-Question Audit &amp; Tally ↓
    </a>
  );
}

async function AgencyLiveDiagnosticServer({
  agencySlug,
  agencyName,
  registryChecklistNote,
}: {
  agencySlug: string;
  agencyName: string;
  registryChecklistNote: string;
}) {
  const voterId = await getVoterId();
  const [polls, userVotes] = await Promise.all([
    getPolls(),
    getUserVotes(voterId),
  ]);

  return (
    <AgencyLiveDiagnosticClient
      agencySlug={agencySlug}
      agencyName={agencyName}
      registryChecklistNote={registryChecklistNote}
      initialPolls={polls}
      initialUserVotes={userVotes}
    />
  );
}

function AgencyLiveDiagnosticFallback() {
  return (
    <section
      id="agency-diagnostic"
      className="scroll-mt-24 border-b border-slate-200 bg-white py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-950/90" />
      </div>
    </section>
  );
}

export async function AgencyDetailSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  return (
    <AgencyTeamVisualizer
      key={agency.id}
      initialAgency={agency}
      allAgencies={getAgencySummaries()}
      headerLiveActions={
        <Suspense fallback={<AgencyHeaderLiveActionsFallback />}>
          <AgencyHeaderLiveActions agencySlug={agency.slug} />
        </Suspense>
      }
      diagnosticSection={
        <Suspense fallback={<AgencyLiveDiagnosticFallback />}>
          <AgencyLiveDiagnosticServer
            agencySlug={agency.slug}
            agencyName={agency.name}
            registryChecklistNote={agency.registryChecklistNote}
          />
        </Suspense>
      }
    />
  );
}

export function AgencyDetailFallback() {
  return (
    <SectionSkeleton
      sectionClassName="bg-[#f8f9fa] py-16"
      cardClassName="h-96 border-slate-200 bg-white"
    />
  );
}
