import { Suspense } from "react";
import {
  AgencySpotlightFallback,
  AgencySpotlightSection,
} from "@/components/home/AgencySpotlightSection";
import { AgencyVerification } from "@/components/home/AgencyVerification";
import {
  CommunityActionSection,
  SpotlightFallback,
} from "@/components/home/CommunityActionSection";
import { HomeHero } from "@/components/home/HomeHero";
import { LawyerSchematic } from "@/components/home/LawyerSchematic";
import { ObjectionGenerator } from "@/components/home/ObjectionGenerator";
import {
  ReportsFallback,
  ReportsSection,
} from "@/components/home/ReportsSection";
import { StageSchematic } from "@/components/home/StageSchematic";
import { getHomeJsonLd, serializeJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = getHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <HomeHero />
      <Suspense fallback={<AgencySpotlightFallback />}>
        <AgencySpotlightSection />
      </Suspense>
      <ObjectionGenerator />
      <Suspense fallback={<ReportsFallback />}>
        <ReportsSection />
      </Suspense>
      <Suspense fallback={<SpotlightFallback />}>
        <CommunityActionSection />
      </Suspense>
      <AgencyVerification />
      <StageSchematic />
      <LawyerSchematic />
    </>
  );
}
