import { Suspense } from "react";
import type { Metadata } from "next";
import {
  AgencyDetailFallback,
  AgencyDetailSection,
} from "@/components/agencies/AgencyDetailSection";
import {
  AGENCIES,
  formatSlugTitle,
  getAgencyBySlug,
} from "@/lib/agency-team";

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
