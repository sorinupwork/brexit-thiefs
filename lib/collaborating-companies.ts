import type { Locale } from "./types";

export type CompanyRegionFilter =
  | "all"
  | "amsterdam"
  | "rotterdam"
  | "zuid-holland"
  | "technical";

export interface CollaboratingCompany {
  id: string;
  name: string;
  agencySlugs: readonly string[];
  regionGroup: Exclude<CompanyRegionFilter, "all">;
  corridorLabel: string;
  location: string;
  sector: string;
  agencyNote: string;
  summary: string;
  websiteUrl: string;
  linkedInSearchUrl: string;
}

const COMPANIES_BY_LOCALE: Record<Locale, CollaboratingCompany[]> = {
  en: [
    {
      id: "fetim-group",
      name: "Fetim Group (Fetim B.V.)",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Amsterdam Westpoort",
      location: "Kaapstadweg 50, 1047 HG Amsterdam",
      sector: "Home Improvement & Flooring DC",
      agencyNote: "Amsterdam Logistics Corridor · Waadi Art. 8 Parity",
      summary:
        "~61,000 m² distribution center with 64 loading docks in Amsterdam-Westpoort (Atlaspark), handling inbound containers and WMS order fulfillment.",
      websiteUrl: "https://www.fetimgroup.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Fetim%20Group%20Amsterdam",
    },
    {
      id: "paxon",
      name: "Paxon (ex-Base Logistics)",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Rotterdam / Moerdijk",
      location: "Logistic Boulevard 5, 4791 VC Klundert",
      sector: "3PL Fulfillment & Freight",
      agencyNote: "Port of Rotterdam–Moerdijk Corridor",
      summary:
        "International 3PL logistics network (formerly Base Logistics / Bnode group) operating service-parts warehousing and freight hubs serving Rotterdam.",
      websiteUrl: "https://paxon.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Paxon%20Logistics",
    },
    {
      id: "van-der-helm",
      name: "Van der Helm Logistics",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Rotterdam / Bleiswijk",
      location: "Port of Rotterdam & Bleiswijk Corridor",
      sector: "Contract Warehousing & Transport",
      agencyNote: "Publicly referenced with Charlie works",
      summary:
        "Dutch contract logistics and warehousing operator handling container cargo, pallet storage, and distribution across the Rotterdam port area.",
      websiteUrl: "https://vanderhelmlogistics.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Van%20der%20Helm%20Logistics",
    },
    {
      id: "bs-international",
      name: "B&S International",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Dordrecht / Rotterdam",
      location: "Dordrecht / Delfzijl Logistics Hubs",
      sector: "Global Supply Chain & Warehouse",
      agencyNote: "Publicly referenced with Charlie works",
      summary:
        "International consumer-goods warehousing and distribution centers in the Rotterdam–Dordrecht region staffing warehouse and reach-truck roles.",
      websiteUrl: "https://www.bs-international.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=B%26S%20International%20Dordrecht",
    },
    {
      id: "intertoys-dc",
      name: "Intertoys Distribution Center",
      agencySlugs: ["charlie-works"],
      regionGroup: "zuid-holland",
      corridorLabel: "Waddinxveen · Zuid-Holland",
      location: "Waddinxveen, Zuid-Holland",
      sector: "National Retail Warehouse",
      agencyNote: "Cited strategic partner on charlieworks.eu",
      summary:
        "Central Dutch retail distribution warehouse in Waddinxveen utilizing seasonal and year-round agency orderpickers and outbound logistics staff.",
      websiteUrl: "https://www.intertoys.nl",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Intertoys%20Waddinxveen",
    },
    {
      id: "fm-group",
      name: "FM Group",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Aalsmeer · Schiphol Hub",
      location: "Aalsmeer, Noord-Holland",
      sector: "Floriculture & Horticulture Logistics",
      agencyNote: "Cited partner on charlieworks.eu",
      summary:
        "International flower and plant logistics export hub near Schiphol & Amsterdam where temp agencies supply order-picking and packing teams.",
      websiteUrl: "https://www.fmgroup.fm/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=FM%20Group%20Aalsmeer",
    },
    {
      id: "hellofresh-nl",
      name: "HelloFresh NL",
      agencySlugs: ["charlie-works"],
      regionGroup: "zuid-holland",
      corridorLabel: "Bleiswijk · Zuid-Holland",
      location: "Bleiswijk, Zuid-Holland",
      sector: "Food Production & Cold-Chain DC",
      agencyNote: "Publicly referenced with Charlie works",
      summary:
        "Chilled meal-kit assembly and cold-chain warehouse facilities in Zuid-Holland employing production, packing, and internal logistics flex workers.",
      websiteUrl: "https://www.hellofresh.nl",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=HelloFresh%20Bleiswijk",
    },
    {
      id: "dhl-supply-chain",
      name: "DHL Supply Chain NL",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Amsterdam · Rotterdam · NL",
      location: "Amsterdam, Rotterdam & Brabant Hubs",
      sector: "Contract Warehousing & Fulfillment",
      agencyNote: "Multi-agency flex staffing corridor",
      summary:
        "Major contract warehousing and parcel sorting sites across Dutch port and airport corridors placing agency reach-truck drivers and orderpickers.",
      websiteUrl: "https://www.dhl.com/nl-nl/home.html",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=DHL%20Supply%20Chain%20Nederland",
    },
    {
      id: "strukton",
      name: "Strukton",
      agencySlugs: ["dit-larex"],
      regionGroup: "technical",
      corridorLabel: "Utrecht · National Infra",
      location: "Westkanaaldijk 2, 3542 DA Utrecht",
      sector: "Rail, Civil & Electrical Infra",
      agencyNote: "Publicly referenced with DIT Holding / Larex",
      summary:
        "Dutch rail, civil infrastructure, and technical systems contractor collaborating with technical staffing agencies on electrical and infra projects.",
      websiteUrl: "https://strukton.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Strukton",
    },
    {
      id: "stork-bilfinger",
      name: "Stork (Bilfinger Netherlands)",
      agencySlugs: ["dit-larex"],
      regionGroup: "technical",
      corridorLabel: "Utrecht · Industrial Sites",
      location: "Utrecht & Dutch Industrial Hubs",
      sector: "Industrial Maintenance & Technical",
      agencyNote: "Publicly referenced with DIT Holding / Larex",
      summary:
        "Industrial maintenance, mechanical, and process-engineering contractor (now integrated into Bilfinger NL) placing certified technical specialists.",
      websiteUrl: "https://www.bilfinger.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Bilfinger%20Stork%20Nederland",
    },
  ],
  nl: [
    {
      id: "fetim-group",
      name: "Fetim Group (Fetim B.V.)",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Amsterdam Westpoort",
      location: "Kaapstadweg 50, 1047 HG Amsterdam",
      sector: "Bouw-, Vloer- & Woonlogistiek DC",
      agencyNote: "Logistieke Corridor Amsterdam · Waadi art. 8",
      summary:
        "Distributiecentrum van ca. 61.000 m² met 64 laaddocks in Amsterdam-Westpoort (Atlaspark) voor inkomende containers en WMS-orderverwerking.",
      websiteUrl: "https://www.fetimgroup.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Fetim%20Group%20Amsterdam",
    },
    {
      id: "paxon",
      name: "Paxon (vh. Base Logistics)",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Rotterdam / Moerdijk",
      location: "Logistic Boulevard 5, 4791 VC Klundert",
      sector: "3PL Fulfillment & Vrachtlogistiek",
      agencyNote: "Havengebied Rotterdam–Moerdijk",
      summary:
        "Internationaal 3PL-logistiek netwerk (voorheen Base Logistics / Bnode-groep) met warehousing en service-parts distributie nabij Rotterdam.",
      websiteUrl: "https://paxon.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Paxon%20Logistics",
    },
    {
      id: "van-der-helm",
      name: "Van der Helm Logistics",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Rotterdam / Bleiswijk",
      location: "Regio Haven Rotterdam & Bleiswijk",
      sector: "Contract Warehousing & Transport",
      agencyNote: "Publiek genoemd bij Charlie works",
      summary:
        "Nederlandse logistiek dienstverlener voor containerafhandeling, op- en overslag en distributie rond de haven van Rotterdam.",
      websiteUrl: "https://vanderhelmlogistics.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Van%20der%20Helm%20Logistics",
    },
    {
      id: "bs-international",
      name: "B&S International",
      agencySlugs: ["charlie-works"],
      regionGroup: "rotterdam",
      corridorLabel: "Dordrecht / Rotterdam",
      location: "Dordrecht / Delfzijl Magazijnen",
      sector: "Internationale Distributie & Magazijn",
      agencyNote: "Publiek genoemd bij Charlie works",
      summary:
        "Grote distributiecentra in de regio Rotterdam–Dordrecht waar uitzendkrachten werken als magazijnmedewerker en reachtruckchauffeur.",
      websiteUrl: "https://www.bs-international.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=B%26S%20International%20Dordrecht",
    },
    {
      id: "intertoys-dc",
      name: "Intertoys Distributiecentrum",
      agencySlugs: ["charlie-works"],
      regionGroup: "zuid-holland",
      corridorLabel: "Waddinxveen · Zuid-Holland",
      location: "Waddinxveen, Zuid-Holland",
      sector: "Landelijk Retail Warehouse",
      agencyNote: "Strategisch partner genoemd op charlieworks.eu",
      summary:
        "Centraal distributiecentrum in Waddinxveen waar flexwerkers worden ingezet voor orderpicking, inpakken en winkelbevoorrading.",
      websiteUrl: "https://www.intertoys.nl",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Intertoys%20Waddinxveen",
    },
    {
      id: "fm-group",
      name: "FM Group",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Aalsmeer · Regio Schiphol",
      location: "Aalsmeer, Noord-Holland",
      sector: "Sierteelt & Export Logistiek",
      agencyNote: "Partner genoemd op charlieworks.eu",
      summary:
        "Internationaal bloemen- en plantenexportcentrum bij Schiphol en Amsterdam waar uitzendbureaus teams voor verwerking en logistiek plaatsen.",
      websiteUrl: "https://www.fmgroup.fm/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=FM%20Group%20Aalsmeer",
    },
    {
      id: "hellofresh-nl",
      name: "HelloFresh NL",
      agencySlugs: ["charlie-works"],
      regionGroup: "zuid-holland",
      corridorLabel: "Bleiswijk · Zuid-Holland",
      location: "Bleiswijk, Zuid-Holland",
      sector: "Voedselproductie & Koelmagazijn",
      agencyNote: "Publiek genoemd bij Charlie works",
      summary:
        "Gekoelde productie- en maaltijdbox-distributiecentra in Zuid-Holland waar uitzendkrachten werken in productie, verpakking en logistiek.",
      websiteUrl: "https://www.hellofresh.nl",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=HelloFresh%20Bleiswijk",
    },
    {
      id: "dhl-supply-chain",
      name: "DHL Supply Chain NL",
      agencySlugs: ["charlie-works"],
      regionGroup: "amsterdam",
      corridorLabel: "Amsterdam · Rotterdam · NL",
      location: "Amsterdam, Rotterdam & Brabant",
      sector: "Contract Warehousing & Pakketten",
      agencyNote: "Landelijke uitzendcorridor logistiek",
      summary:
        "Grote logistieke distributie- en sorteercentra rond Nederlandse havens en luchthavens waar uitzendbureaus magazijnpersoneel leveren.",
      websiteUrl: "https://www.dhl.com/nl-nl/home.html",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=DHL%20Supply%20Chain%20Nederland",
    },
    {
      id: "strukton",
      name: "Strukton",
      agencySlugs: ["dit-larex"],
      regionGroup: "technical",
      corridorLabel: "Utrecht · Landelijke Infra",
      location: "Westkanaaldijk 2, 3542 DA Utrecht",
      sector: "Spoor, Civiel & Elektrotechniek",
      agencyNote: "Publiek genoemd bij DIT Holding / Larex",
      summary:
        "Nederlandse spoor-, infra- en techniekaannemer die samenwerkt met technische uitzendbureaus voor elektro- en infraprojecten.",
      websiteUrl: "https://strukton.com/",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Strukton",
    },
    {
      id: "stork-bilfinger",
      name: "Stork (Bilfinger Nederland)",
      agencySlugs: ["dit-larex"],
      regionGroup: "technical",
      corridorLabel: "Utrecht · Industrie NL",
      location: "Utrecht & Nederlandse Industriehubs",
      sector: "Industrieel Onderhoud & Techniek",
      agencyNote: "Publiek genoemd bij DIT Holding / Larex",
      summary:
        "Technisch dienstverlener voor industrieel onderhoud, werktuigbouw en procestechniek (onderdeel van Bilfinger NL) met technisch vakpersoneel.",
      websiteUrl: "https://www.bilfinger.com",
      linkedInSearchUrl:
        "https://www.linkedin.com/search/results/companies/?keywords=Bilfinger%20Stork%20Nederland",
    },
  ],
};

export function getCollaboratingCompanies(
  locale: Locale
): CollaboratingCompany[] {
  return COMPANIES_BY_LOCALE[locale];
}
