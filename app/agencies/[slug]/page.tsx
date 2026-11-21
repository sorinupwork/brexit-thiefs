import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgencyTeamVisualizer } from "@/components/AgencyTeamVisualizer";
import { AGENCIES, getAgencyBySlug } from "@/lib/agency-team";

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateStaticParams() {
  return AGENCIES.map((agency) => ({ slug: agency.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const matched = getAgencyBySlug(slug);
  const label = matched?.name ?? formatSlugTitle(slug);
  return {
    title: `${label} · Teamoverzicht & Organigram | WerkRecht NL`,
    description: `Visueel teamoverzicht in LinkedIn-stijl, interactief organigram en fraudepreventie-checklist voor ${label}.`,
  };
}

async function AgencyDetailSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  const allAgencies = AGENCIES.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    hqLocation: a.hqLocation,
    memberCount: a.members.length,
  }));

  return (
    <AgencyTeamVisualizer
      key={agency.id}
      initialAgency={agency}
      allAgencies={allAgencies}
    />
  );
}

function AgencyDetailFallback() {
  return (
    <section className="bg-[#f8f9fa] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}

export default function AgencyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<AgencyDetailFallback />}>
      <AgencyDetailSection params={params} />
    </Suspense>
  );
}
