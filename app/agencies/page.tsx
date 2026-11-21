import type { Metadata } from "next";
import { AgenciesDirectory } from "@/components/AgenciesDirectory";
import { AGENCIES } from "@/lib/agency-team";

export const metadata: Metadata = {
  title: "Uitzendbureaus & Teams Gids · WerkRecht NL | Multi-Agency Directory",
  description:
    "Overzicht voor samenwerking tussen meerdere uitzendbureaus en teams: bekijk organigrammen, controleer registers en voorkom samen misstanden en oplichting.",
};

export default function AgenciesPage() {
  return <AgenciesDirectory initialAgencies={AGENCIES} />;
}
