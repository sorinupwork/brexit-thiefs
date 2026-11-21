import { notFound } from "next/navigation";
import { AgencyTeamVisualizer } from "@/components/agencies/AgencyTeamVisualizer";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import { getAgencyBySlug, getAgencySummaries } from "@/lib/agency-team";

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
