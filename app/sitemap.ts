import type { MetadataRoute } from "next";
import { AGENCIES } from "@/lib/agency-team";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://werkrecht-nl.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: "2026-11-20",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: "2026-11-20",
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const agencyRoutes: MetadataRoute.Sitemap = AGENCIES.map((agency) => ({
    url: `${baseUrl}/agencies/${agency.slug}`,
    lastModified: "2026-11-20",
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...agencyRoutes];
}
