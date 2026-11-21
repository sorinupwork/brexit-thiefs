import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://werkrecht-nl.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/agencies", "/agencies/"],
      disallow: ["/api/evidence", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
