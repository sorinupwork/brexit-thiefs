export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://werkrecht-nl.vercel.app";

/**
 * Builds Schema.org JSON-LD structured data for the homepage WebSite + FAQ graph.
 */
export function getHomeJsonLd(siteUrl: string = SITE_URL) {
  return {
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
}

/**
 * Escapes `<` before injecting JSON-LD inside a `<script>` tag to prevent XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
