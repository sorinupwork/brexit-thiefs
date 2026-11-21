import type { MetadataRoute } from "next";
import { AGENCIES } from "@/lib/agency-team";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: "2026-11-20",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/agencies`,
      lastModified: "2026-11-20",
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const agencyRoutes: MetadataRoute.Sitemap = AGENCIES.map((agency) => ({
    url: `${SITE_URL}/agencies/${agency.slug}`,
    lastModified: "2026-11-20",
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...agencyRoutes];
}
