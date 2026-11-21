import { AgencyCorruptionVisualizer } from "@/components/home/AgencyCorruptionVisualizer";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import { AGENCIES } from "@/lib/agency-team";
import { getPolls, getUserVotes, getVoterId } from "@/lib/queries";

export async function AgencySpotlightSection() {
  const voterId = await getVoterId();
  const [polls, userVotes] = await Promise.all([
    getPolls(),
    getUserVotes(voterId),
  ]);

  return (
    <AgencyCorruptionVisualizer
      initialAgencies={AGENCIES}
      initialPolls={polls}
      initialUserVotes={userVotes}
    />
  );
}

export function AgencySpotlightFallback() {
  return (
    <SectionSkeleton
      sectionClassName="border-b border-slate-200 bg-white py-16"
      cardClassName="h-80 border-slate-200 bg-slate-100"
    />
  );
}
