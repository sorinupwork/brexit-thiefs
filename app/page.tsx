import { Suspense } from "react";
import { AgencyCorruptionVisualizer } from "@/components/AgencyCorruptionVisualizer";
import { AgencyVerification } from "@/components/AgencyVerification";
import { EuropeFairWorkSpotlight } from "@/components/EuropeFairWorkSpotlight";
import { HeroLiveLedgerBar } from "@/components/HeroLiveLedgerBar";
import { HomeHero } from "@/components/HomeHero";
import { LawyerSchematic } from "@/components/LawyerSchematic";
import { ObjectionGenerator } from "@/components/ObjectionGenerator";
import { ReportsPortal } from "@/components/ReportsPortal";
import { StageSchematic } from "@/components/StageSchematic";
import { AGENCIES } from "@/lib/agency-team";
import { readComments } from "@/lib/comments-store";
import { readPolls, readUserVotes } from "@/lib/polls-store";
import { readReports } from "@/lib/reports-store";
import type { PollState } from "@/lib/types";
import { getVoterIdFromCookie } from "@/lib/voter-cookie";

function sumAllPollVotes(polls: PollState): number {
  const sumObj = (obj?: Record<string, number>) =>
    Object.values(obj ?? {}).reduce((s, n) => s + n, 0);
  return (
    sumObj(polls.redFlagVotes) +
    sumObj(polls.instituteActionVotes) +
    sumObj(polls.brusselsActionVotes) +
    sumObj(polls.reportFlags) +
    sumObj(polls.agencyFlags) +
    (polls.diagnosticConfirmations ?? 0)
  );
}

async function HeroLiveLedgerSection() {
  const [reports, polls, comments] = await Promise.all([
    readReports(),
    readPolls(),
    readComments(),
  ]);

  const totalStolenEur = reports.reduce(
    (sum, r) => sum + (r.disputedAmountEur ?? 0),
    0
  );
  const commentConfirmations = comments.reduce(
    (sum, c) => sum + (c.confirmations ?? 0),
    0
  );
  const totalVotes = sumAllPollVotes(polls) + commentConfirmations;

  return (
    <HeroLiveLedgerBar
      initialStolenEur={totalStolenEur}
      initialCasesCount={reports.length}
      initialVotesCount={totalVotes}
      initialCommentsCount={comments.length}
    />
  );
}

function HeroLiveLedgerFallback() {
  return (
    <div className="mt-5 h-20 animate-pulse rounded-2xl border border-slate-300 bg-slate-900" />
  );
}

async function AgencySpotlightSection() {
  const voterId = await getVoterIdFromCookie();
  const [polls, userVotes] = await Promise.all([
    readPolls(),
    readUserVotes(voterId),
  ]);
  return (
    <AgencyCorruptionVisualizer
      initialAgencies={AGENCIES}
      initialPolls={polls}
      initialUserVotes={userVotes}
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
  const voterId = await getVoterIdFromCookie();
  const [reports, polls, comments, userVotes] = await Promise.all([
    readReports(),
    readPolls(),
    readComments(),
    readUserVotes(voterId),
  ]);
  return (
    <EuropeFairWorkSpotlight
      initialReports={reports}
      initialPolls={polls}
      initialComments={comments}
      initialUserVotes={userVotes}
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
  const voterId = await getVoterIdFromCookie();
  const [reports, polls, userVotes] = await Promise.all([
    readReports(),
    readPolls(),
    readUserVotes(voterId),
  ]);
  return (
    <ReportsPortal
      initialReports={reports}
      initialPolls={polls}
      initialUserVotes={userVotes}
    />
  );
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://werkrecht-nl.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "WerkRecht NL · 1 Europe Fair Work",
        url: siteUrl,
        description:
          "Open community worker-protection & evidence platform exposing corrupt staffing agencies, tracking real reimbursable euro losses, and routing petitions & evidence to EU Parliament (PETI), ELA, Belgium SIOD, Germany Zoll, Arbeidsinspectie, SNCU, SNF & Politie.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can a Dutch temp agency deduct fuel or wages retroactively as an internal mistake?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Dutch Civil Code Art. 7:632 BW (verrekeningsverbod), Art. 7:611 BW (good employership), and the Wet aanpak schijnconstructies (WAS), unilateral retroactive wage or fuel clawbacks without prior written agreement are strictly restricted.",
            },
          },
          {
            "@type": "Question",
            name: "Can an agency put statutory holiday hours (vakantie-uren) into minus instead of applying ADV hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Under Art. 7:638 BW holiday hours are scheduled in accordance with the employee's request, Art. 7:628 BW places scheduling shortages on the employer, and ABU/NBBU CAO inlenersbeloning requires host-company ADV parity.",
            },
          },
          {
            "@type": "Question",
            name: "Where can cross-border EU workers escalate beyond national Dutch institutes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Workers can escalate across 1 Europe to European Parliament Petitions (PETI) to demand EU-wide job-offer bans, the European Labour Authority (ELA), European Commission, SOLVIT, Germany Zoll (FKS), and Belgium SIOD (Meldpunt Sociale Fraude).",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <HomeHero
        liveLedgerSlot={
          <Suspense fallback={<HeroLiveLedgerFallback />}>
            <HeroLiveLedgerSection />
          </Suspense>
        }
      />
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
    </>
  );
}
