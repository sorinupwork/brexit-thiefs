import { EuropeFairWorkSpotlight } from "@/components/home/EuropeFairWorkSpotlight";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import {
  getComments,
  getPolls,
  getUserVotes,
  getVoterId,
} from "@/lib/queries";

export async function CommunityActionSection() {
  const voterId = await getVoterId();
  const [polls, comments, userVotes] = await Promise.all([
    getPolls(),
    getComments(),
    getUserVotes(voterId),
  ]);

  return (
    <EuropeFairWorkSpotlight
      initialPolls={polls}
      initialComments={comments}
      initialUserVotes={userVotes}
    />
  );
}

export function SpotlightFallback() {
  return (
    <SectionSkeleton
      sectionClassName="border-b border-slate-200 bg-slate-950 py-16"
      cardClassName="h-64 border-slate-800 bg-slate-900"
    />
  );
}
