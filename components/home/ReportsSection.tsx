import { ReportsPortal } from "@/components/home/ReportsPortal";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import { getPolls, getReports, getUserVotes, getVoterId } from "@/lib/queries";

export async function ReportsSection() {
  const voterId = await getVoterId();
  const [reports, polls, userVotes] = await Promise.all([
    getReports(),
    getPolls(),
    getUserVotes(voterId),
  ]);

  return (
    <ReportsPortal
      initialReports={reports}
      initialPolls={polls}
      initialUserVotes={userVotes}
    />
  );
}

export function ReportsFallback() {
  return (
    <SectionSkeleton
      sectionClassName="border-b border-slate-200 bg-white py-16"
      cardClassName="h-72 border-slate-200 bg-slate-100"
    />
  );
}
