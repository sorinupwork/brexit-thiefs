import type { Locale } from "./types";
import {
  BRUSSELS_CHANNELS,
  CATEGORY_META,
  DUTCH_AUTHORITIES,
  EVIDENCE_LABELS,
  LIFECYCLE_STAGES,
  formatLegalBrief,
  type BrusselsChannel,
} from "./data";
import type {
  AuthorityId,
  CommentTopicId,
  CommunityComment,
  DutchAuthority,
  EvidenceItemType,
  IssueCategory,
  LifecycleStageId,
  LifecycleStageInfo,
  WorkerReport,
} from "./types";
import type {
  AgencyDepartmentNode,
  AgencyRecord,
  AgencyTeamMember,
} from "./agency-team";

const CATEGORY_NL: Record<IssueCategory, { label: string; shortLabel: string }> = {
  "wage-deduction": {
    label: "Looninhouding / Terugwerkende Correctie",
    shortLabel: "Looninhouding",
  },
  "transport-fuel": {
    label: "Vervoer, Woon-Werk & Brandstof-terugvordering",
    shortLabel: "Vervoer / Brandstof",
  },
  "contract-cao": {
    label: "Contract- & CAO-afwijking (Inlenersbeloning)",
    shortLabel: "Contract / CAO",
  },
  "accommodation-snf": {
    label: "Huisvesting & SNF-normen",
    shortLabel: "Huisvesting / SNF",
  },
  recruitment: {
    label: "Misleiding bij Werving & Selectie",
    shortLabel: "Werving",
  },
  "hours-overtime": {
    label: "Onbetaalde Uren & Overuren",
    shortLabel: "Uren & Overwerk",
  },
};

const EVIDENCE_NL: Record<EvidenceItemType, string> = {
  payslips: "Loonstroken (wekelijks / maandelijks)",
  contract: "Arbeidsovereenkomst & CAO-voorwaarden",
  "written-messages": "E-mails / WhatsApp / Portaalberichten",
  "bank-statements": "Bankafschriften (netto stortingen)",
  "fuel-transport-logs": "Tankbonnen, Autoregeling & Kilometerregistratie",
  "housing-photos": "Foto's van Huisvesting (zonder gezichten)",
  "hours-log": "Eigen Urenadministratie / Roosters",
};

const AUTHORITIES_NL: Record<
  AuthorityId,
  Pick<DutchAuthority, "englishLabel" | "scope" | "bestFor" | "actionLabel">
> = {
  arbeidsinspectie: {
    englishLabel: "Wettelijk Toezicht Arbeidsomstandigheden & Loon",
    scope:
      "Handhaving van het wettelijk minimumloon (WML), verbod op illegale looninhoudingen, onveilig werk en arbeidsuitbuiting.",
    bestFor: [
      "Terugwerkende looninhoudingen onder het wettelijk minimum",
      "Illegale inhoudingen in strijd met de Wet aanpak schijnconstructies (WAS)",
      "Onveilige werkomstandigheden of signalen van ernstige benadeling",
    ],
    actionLabel: "Melden bij Arbeidsinspectie",
  },
  sncu: {
    englishLabel: "Stichting Naleving CAO voor Uitzendkrachten",
    scope:
      "Controleert Nederlandse uitzendbureaus op naleving van de ABU- en NBBU-CAO voor Uitzendkrachten.",
    bestFor: [
      "Te laag uurloon t.o.v. de inlener (inlenersbeloning)",
      "Terugwerkende loonherberekening, ontbrekend vakantiegeld of toeslagen",
      "Onterechte boetes of eenzijdige inhoudingen op de loonstrook",
    ],
    actionLabel: "CAO-melding doen bij SNCU",
  },
  snf: {
    englishLabel: "Stichting Normering Flexwonen (Huisvesting)",
    scope:
      "Ziet toe op gecertificeerde huisvesting voor arbeidsmigranten en onderzoekt meldingen over hygiëne, ongedierte, brandveiligheid en leefruimte.",
    bestFor: [
      "Ongedierte (ratten, muizen, bedwantsen), schimmel of gebrekkig sanitair",
      "Overbewoning, brandonveiligheid of defecte verwarming/voorzieningen",
      "Uitblijvend herstel door de verhuurder na schriftelijke melding",
    ],
    actionLabel: "Huisvestingsklacht bij SNF",
  },
  "juridisch-loket": {
    englishLabel: "Gratis Eerste Juridisch Advies & Arbeidsrecht",
    scope:
      "Gratis juridisch advies in Nederland over loonvorderingen, formele sommatiebrieven en doorverwijzing naar gespecialiseerde advocaten.",
    bestFor: [
      "Opstellen van een formeel schriftelijk bezwaar tegen looninhouding",
      "Claimen van wettelijke verhoging en rente (art. 7:625 BW)",
      "Doorverwijzing naar een gespecialiseerde arbeidsrechtadvocaat",
    ],
    actionLabel: "Raadpleeg Het Juridisch Loket",
  },
  fairwork: {
    englishLabel: "Onafhankelijke Ondersteuning voor Arbeidsmigranten",
    scope:
      "Vertrouwelijke, meertalige ondersteuning voor internationale werknemers in Nederland bij oneerlijke behandeling of misstanden.",
    bestFor: [
      "Meertalige hulp bij het begrijpen van Nederlandse loonstroken en contracten",
      "Onafhankelijk advies vóór het tekenen van een vaststellingsovereenkomst",
      "Begeleiding wanneer werk en huisvesting aan elkaar gekoppeld zijn",
    ],
    actionLabel: "Contacteer FairWork NL",
  },
  politie: {
    englishLabel: "Nationale Politie (Strafrechtelijke Melding)",
    scope:
      "Aangifte of melding bij bedreiging, dwang, inname van identiteitsbewijzen, fraude of onrechtmatige uitzetting/intimidatie.",
    bestFor: [
      "Bedreiging, intimidatie of innemen van paspoort/ID-documenten",
      "Aantoonbare strafbare fraude of identiteitsmisbruik",
      "Directe fysieke onveiligheid of illegale buitensluiting uit woning",
    ],
    actionLabel: "Melden bij de Politie",
  },
};

const STAGES_NL: Record<
  LifecycleStageId,
  Omit<LifecycleStageInfo, "id" | "stepNumber" | "primaryAuthorities">
> = {
  recruitment: {
    title: "Werving & Beloften Vóór Aankomst",
    shortTitle: "Werving",
    subtitle:
      "Schriftelijke vacaturebeloften, toegezegd uurloon, huisvestingskosten en vervoersafspraken.",
    legalFramework: [
      "Burgerlijk Wetboek (art. 7:655 BW) — verplichte schriftelijke opgave arbeidsvoorwaarden",
      "EU-richtlijn transparante en voorspelbare arbeidsvoorwaarden",
    ],
    whatToVerify: [
      "Bruto uurloon, CAO-loonschaal en gegarandeerde weekuren zwart-op-wit",
      "Exacte wekelijkse huurprijs en of de locatie actief SNF-gecertificeerd is",
      "Geen verboden bemiddelingskosten in rekening gebracht (verboden onder Waadi)",
    ],
    redFlags: [
      "Mondeling beloofd hoger loon dat niet in het ondertekende contract staat",
      "Inhoudingen of borgsommen die pas ná aankomst in Nederland worden gemeld",
      "Weigering om het volledige contract vóór vertrek of startdatum te verstrekken",
    ],
    evidenceToCollect: [
      "Vacatureteksten, aanbiedingsmails en chatberichten met de recruiter",
      "Schriftelijke salarisberekeningen ontvangen vóór de eerste werkdag",
    ],
  },
  coordination: {
    title: "Onboarding, Planning & Uitzendovereenkomst",
    shortTitle: "Planning & Contract",
    subtitle:
      "ABU/NBBU CAO-fase, gelijke beloning bij de inlener (inlenersbeloning) en urenstaten.",
    legalFramework: [
      "ABU / NBBU CAO voor Uitzendkrachten — inlenersbeloning & loon bij garantie-uren",
      "Art. 7:628 BW — werkgeversrisico (verplichte doorbetaling bij geen planning)",
      "Arbowet & Waadi — verplichte kosteloze verstrekking van PBM's en werkmiddelen",
    ],
    whatToVerify: [
      "Juiste CAO-fase, gegarandeerde weekuren en functieschaal (inlenersbeloning)",
      "Schriftelijke beschikbaarheidsmelding als planning uitblijft of telefoons niet worden opgenomen",
      "Kosteloze verstrekking van werkschoenen, gereedschap, werktelefoon en vervoer",
    ],
    redFlags: [
      "Telefoontjes negeren, geen werk inplannen en je zonder garantie-uren in bureauhuisvesting laten zitten terwijl huur doorloopt",
      "Verplichten om eigen auto, eigen telefoon/data of eigen gereedschap/PBM's te gebruiken zonder vergoeding",
      "Vakwerk uitvoeren tegen instaploon of goedgekeurde uren achteraf verlagen",
    ],
    evidenceToCollect: [
      "Getekende uitzendovereenkomst met urengarantie + bel-/chatlogs van onbeantwoorde oproepen",
      "Schriftelijke beschikbaarheidsmails ('beschikbaar voor werk') + bonnetjes van eigen gemaakte kosten",
    ],
  },
  transport: {
    title: "Afdeling Vervoer, Woon-Werk & Brandstofvergoeding",
    shortTitle: "Vervoer & Brandstof",
    subtitle:
      "Uitzendauto's, tankpassen, reiskostenvergoeding en terugwerkende inhouding van brandstofkosten.",
    legalFramework: [
      "ABU / NBBU CAO (inlenersbeloning) — gelijke reiskostenvergoeding als personeel inlener",
      "Art. 7:611 BW (goed werkgeverschap) — gewekt vertrouwen bij maandenlange brandstofbetaling",
      "Art. 7:632 BW & WAS — strikt verbod op eenzijdige loonverrekening wegens 'interne fout'",
    ],
    whatToVerify: [
      "Schriftelijke vervoersregeling: wie betaalt brandstof, autokosten of €0,23/km vergoeding",
      "Of brandstofvergoeding of tankpas maandenlang zonder voorbehoud is uitgekeerd",
      "Elke vervoersinhouding vereist voorafgaande schriftelijke toestemming en mag het WML niet raken",
    ],
    redFlags: [
      "Bureau betaalt 1–2+ maanden lang brandstof, noemt het daarna een 'interne fout' en vordert alles terug uit nettoloon",
      "Werknemer achteraf opzadelen met woon-werkkosten nadat diensten al zijn gewerkt",
      "Onduidelijke autoboetes, tankpasboetes of schade-inhoudingen direct van het loon",
    ],
    evidenceToCollect: [
      "Opeenvolgende loonstroken met 2+ maanden brandstofvergoeding gevolgd door een min-regel",
      "Tankbonnen, tankpasoverzichten, kilometerlogs en berichten van de vervoerscoördinator",
      "Schriftelijk bezwaar tegen de terugwerkende brandstofinhouding met verzoek om CAO-grondslag",
    ],
  },
  payroll: {
    title: "Salarisadministratie, Loonstroken & Inhoudingen",
    shortTitle: "Salaris & Loonstrook",
    subtitle:
      "Wekelijkse/maandelijkse loonstroken, reserveringen en wettelijke grenzen aan terugvordering.",
    legalFramework: [
      "Art. 7:632 BW — strenge grenzen aan eenzijdige loonverrekening tijdens dienstverband",
      "Wet aanpak schijnconstructies (WAS) — verbod op inhoudingen onder het minimumloon",
      "Art. 7:625 BW — wettelijke verhoging (tot 50%) bij te laat betaald loon",
    ],
    whatToVerify: [
      "Elke inhoudingsregel moet een duidelijke wettelijke of getekende schriftelijke grond hebben",
      "Terugwerkende 'te veel betaald'-correcties mogen het nettoloon niet eenzijdig leegtrekken zonder transparante berekening",
      "Het wettelijk minimumloon (WML) mag nooit worden aangetast door boetes of kosten",
    ],
    redFlags: [
      "Plotselinge loonverlaging met terugwerkende kracht na weken werken ('we hebben te veel betaald')",
      "Ongespecificeerde negatieve correcties op de wekelijkse loonstrook",
      "Inhouden van eindafrekening of opgebouwd vakantiegeld na het indienen van een klacht",
    ],
    evidenceToCollect: [
      "Alle opeenvolgende loonstroken vanaf week 1",
      "Bankafschriften die het werkelijk gestorte bedrag tonen t.o.v. de loonstrook",
      "Schriftelijk bezwaar waarin je niet akkoord gaat met de terugwerkende inhouding",
    ],
  },
  accommodation: {
    title: "Bureauhuisvesting & SNF-normen",
    shortTitle: "Huisvesting",
    subtitle:
      "Hygiëne, ongediertebestrijding, leefruimte en maximale wettelijke huurinhouding.",
    legalFramework: [
      "SNF-norm (Stichting Normering Flexwonen) — eisen voor ruimte, hygiëne, veiligheid en onderhoud",
      "WAS-huisvestingsregel — huurinhouding op minimumloon max. 25% van het WML (alleen met SNF + volmacht)",
    ],
    whatToVerify: [
      "Of de huisvester actief geregistreerd staat in het openbare SNF-register",
      "Schriftelijke huurvolmacht en of huisvesting juridisch gescheiden is van ontslagdruk",
      "Snelle opvolging door ongediertebestrijding en onderhoud na schriftelijke melding",
    ],
    redFlags: [
      "Ratten/muizen, insecten, schimmel, kapotte verwarming of onveilige elektra",
      "Huurinhouding zonder geldig SNF-certificaat of boven de wettelijke 25%-grens",
      "Dreigen met directe uitzetting wanneer je vragen stelt over loon of gebreken meldt",
    ],
    evidenceToCollect: [
      "Gedateerde foto's/video's van de gebreken (ongedierte, vocht, defecten — geen personen)",
      "Schriftelijke onderhoudsmeldingen aan de huisvestingsdesk en de reacties daarop",
      "Loonstroken met daarop de wekelijkse huurinhoudingen",
    ],
  },
  escalation: {
    title: "Gestructureerde Escalatie & Juridisch Beroep",
    shortTitle: "Juridisch Beroep",
    subtitle:
      "Feitelijke tijdlijnen en bewijs bundelen voor Nederlandse toezichthouders en arbeidsrechtadvocaten.",
    legalFramework: [
      "Formele ingebrekestelling / sommatiebrief voor behoud van loonaanspraken",
      "Gelijktijdige meldingen: Arbeidsinspectie + SNCU + SNF + Arbeidsrechtadvocaat",
    ],
    whatToVerify: [
      "Alle feiten zijn chronologisch, controleerbaar en vrij van onbewezen persoonlijke aanvallen",
      "Elke claim verwijst naar een document (loonstrookdatum, eurobedrag, schriftelijk bericht)",
      "Klachten worden ingediend bij de juiste instantie met wettelijke bevoegdheid",
    ],
    redFlags: [
      "Een vaststellingsovereenkomst (VSO) tekenen voor 'finale kwijting' zonder juridische check",
      "Privéfoto's of lasterlijke beschuldigingen over individuele medewerkers publiceren (juridisch risico)",
      "Maandenlang wachten zonder schriftelijk bezwaar te maken tegen een onterechte looninhouding",
    ],
    evidenceToCollect: [
      "Chronologisch zaakoverzicht van één pagina (direct te exporteren via dit portaal)",
      "Geordende map met loonstroken, contract, bankafschriften en foto's van gebreken",
    ],
  },
};

const SAMPLE_REPORTS_NL: Record<
  string,
  Pick<WorkerReport, "title" | "authorAlias" | "summary" | "timelineNotes">
> = {
  "sample-wr-001": {
    title:
      "Looninhouding met terugwerkende kracht toegepast na 10 weken technische plaatsing",
    authorAlias: "Voorbeeldzaak · Technisch / Software Specialist",
    summary:
      "Illustratieve geanonimiseerde zaak: Na 10 opeenvolgende loonstroken uitbetaald tegen het bij onboarding afgesproken tarief, paste de salarisadministratie eenzijdig een negatieve correctie toe wegens een interne herindeling, zonder voorafgaande schriftelijke toestemming.",
    timelineNotes:
      "Week 1: Plaatsingsbevestiging getekend en gestart in technische functie.\nWeek 1–10: Wekelijkse loonstroken consistent uitbetaald tegen afgesproken uurloon.\nWeek 11: Negatieve correctie met terugwerkende kracht op de loonstrook zonder ondertekend addendum.\nActie ondernomen: Schriftelijk bezwaar gestuurd met verzoek om CAO-berekening en dossier voor SNCU + Arbeidsinspectie voorbereid.",
  },
  "sample-wr-002": {
    title:
      "Twee maanden betaalde woon-werk brandstof achteraf teruggevorderd uit verdiend loon",
    authorAlias: "Voorbeeldzaak · Forensende Technisch Medewerker",
    summary:
      "Illustratieve geanonimiseerde zaak: Twee maanden lang vergoedden vervoer en salarisadministratie de woon-werk brandstofkosten zonder voorbehoud. Nadat de diensten waren gewerkt, verklaarde het bureau de vergoedingen een 'interne fout' en hield het volledige bedrag in op het nettoloon.",
    timelineNotes:
      "Maand 1–2: Brandstof-/reiskosten consequent vergoed tijdens ritten naar de werklocatie.\nMaand 3: Vervoer/payroll bestempelde eerdere uitbetalingen als fout en verrekende het totaalbedrag ineens met het nettoloon.\nActie ondernomen: Alle loonstroken, tankbonnen en berichten bewaard; beroep gedaan op art. 7:611 BW (goed werkgeverschap) en art. 7:632 BW (loonverrekening) voor SNCU & advocaat.",
  },
  "sample-wr-003": {
    title:
      "Rattenoverlast en onopgeloste hygiënegebreken in via loon ingehouden huisvesting",
    authorAlias: "Voorbeeldzaak · Logistiek & Magazijnmedewerker",
    summary:
      "Illustratieve geanonimiseerde zaak: Wekelijkse huur werd rechtstreeks van het salaris ingehouden terwijl gedeelde keuken en slaapkamers op de begane grond sporen van knaagdieren en vocht vertoonden. Schriftelijke meldingen bleven ruim drie weken onopgelost.",
    timelineNotes:
      "Week 4: Eerste schriftelijke melding met gedateerde foto's van keuken/sanitair gestuurd naar huisvestingsportaal.\nWeek 6: Tweede melding verzonden nadat geen ongediertebestrijding was geweest.\nWeek 8: SNF-registratie gecontroleerd en SNF-klacht + WAS 25%-inhoudingscheck samengesteld.",
  },
  "sample-wr-004": {
    title:
      "Verschil tussen geadverteerd bruto uurloon en loonschaal in Fase A-contract",
    authorAlias: "Voorbeeldzaak · Industrieel Technicus",
    summary:
      "Illustratieve geanonimiseerde zaak: Werving verwees naar de vakschaal van de inlener, maar het contract bij aankomst plaatste de werknemer twee treden lager zonder opgave van de inlenersbeloning.",
    timelineNotes:
      "Vóór aankomst: Schriftelijk functieoverzicht met richtuurloon ontvangen.\nDag 1: Digitaal contract onder tijdsdruk getekend; schaal week af van directe collega's bij de inlener.\nWeek 6: Formeel overzicht van de inlenersbeloning opgevraagd onder ABU/NBBU CAO en Het Juridisch Loket geraadpleegd.",
  },
  "sample-wr-005": {
    title:
      "ADV-uren overgeslagen terwijl vakantie-uren in de min zijn gezet (-€890) om doorwerken af te dwingen",
    authorAlias: "Voorbeeldzaak · Technisch / Bouw Vakkracht",
    summary:
      "Illustratieve geanonimiseerde zaak: Op ADV-/sluitingsdagen bij de inlener of bij minder uren boekte het uitzendbureau geen ADV-uren uit de inlenersbeloning, maar zette wettelijke vakantie-uren in de min. Zo ontstaat een kunstmatige schuld om vertrek te ontmoedigen of de eindafrekening te verlagen.",
    timelineNotes:
      "Week 1–12: Volledig technisch rooster gewerkt terwijl vast personeel bij de inlener ADV-uren opbouwde/opnam.\nWeek 13–16: Loonstrook toonde een negatief saldo vakantie-uren zonder schriftelijk verlofverzoek van de werknemer.\nJuridische check: Beroep gedaan op art. 7:638 BW (vakantie volgens wens werknemer), art. 7:628 BW (werkgeversrisico), art. 7:632 BW (verrekeningsverbod) en ABU/NBBU CAO ADV-gelijkheid voor SNCU & advocaat.",
  },
  "sample-wr-006": {
    title:
      "Telefoon genegeerd, geen planning & garantie-uren onbetaald in woning + eigen spullen gebruikt (-€1.150)",
    authorAlias: "Voorbeeldzaak · Internationale Uitzendkracht",
    summary:
      "Illustratieve geanonimiseerde zaak: Ondanks schriftelijke urengarantie plande het uitzendbureau geen diensten meer in, nam telefoons niet op, liet de werknemer onbetaald in de woning zitten terwijl huur doorliep, en dwong eerder gebruik van eigen telefoon, auto en gereedschap af.",
    timelineNotes:
      "Week 1–3: Diensten gewerkt met gebruik van eigen telefoon/auto en eigen werkmiddelen zonder vergoeding.\nWeek 4–5: Planning stopte en oproepen bleven onbeantwoord terwijl huisvestingskosten doorliepen.\nJuridische check: Schriftelijke beschikbaarheidsmelding verstuurd o.g.v. art. 7:628 BW (loondoorbetaling) + Arbowet-claim richting SNCU, Arbeidsinspectie & Juridisch Loket.",
  },
};

export function getLocalizedCategory(
  category: IssueCategory,
  locale: Locale
) {
  const base = CATEGORY_META[category];
  if (locale === "en") return base;
  return {
    ...base,
    label: CATEGORY_NL[category].label,
    shortLabel: CATEGORY_NL[category].shortLabel,
  };
}

export function getLocalizedEvidenceLabel(
  item: EvidenceItemType,
  locale: Locale
): string {
  return locale === "nl" ? EVIDENCE_NL[item] : EVIDENCE_LABELS[item];
}

export function getLocalizedAuthorities(locale: Locale): DutchAuthority[] {
  const values = Object.values(DUTCH_AUTHORITIES);
  if (locale === "en") return values;
  return values.map((auth) => ({
    ...auth,
    ...AUTHORITIES_NL[auth.id],
  }));
}

export function getLocalizedAuthority(
  id: AuthorityId,
  locale: Locale
): DutchAuthority {
  const base = DUTCH_AUTHORITIES[id];
  if (locale === "en") return base;
  return {
    ...base,
    ...AUTHORITIES_NL[id],
  };
}

export function getLocalizedStages(locale: Locale): LifecycleStageInfo[] {
  if (locale === "en") return LIFECYCLE_STAGES;
  return LIFECYCLE_STAGES.map((stage) => ({
    ...stage,
    ...STAGES_NL[stage.id],
  }));
}

export function getLocalizedReport(
  report: WorkerReport,
  locale: Locale
): WorkerReport {
  if (locale === "en" || !report.isSample) return report;
  const nlPatch = SAMPLE_REPORTS_NL[report.id];
  if (!nlPatch) return report;
  return {
    ...report,
    ...nlPatch,
  };
}

export function getLocalizedBrusselsChannels(
  locale: Locale
): BrusselsChannel[] {
  if (locale === "en") return BRUSSELS_CHANNELS;
  return [
    {
      id: "ep-petitions",
      name: "Europees Parlement Verzoekschriften (PETI)",
      shortTag: "1 Europa · Verbod Vacatures & Marktuitzetting",
      scope:
        "Dien collectieve petities in bij het Europees Parlement voor een EU-breed verbod op misleidende vacatures en intrekking van grensoverschrijdende vergunningen van foute bureaus.",
      url: "https://www.europarl.europa.eu/petitions/en/home",
      actionLabel: "Petitie EU-Parlement (PETI) ↗",
    },
    {
      id: "ela",
      name: "Europese Arbeidsautoriteit (ELA)",
      shortTag: "EU-Brede Gezamenlijke Inspecties",
      scope:
        "Coördineert grensoverschrijdende inspecties tussen NL, België, Duitsland, Polen, Roemenië & Hongarije wanneer nationale aanpak faalt.",
      url: "https://www.ela.europa.eu/",
      actionLabel: "Bezoek ELA (EU) ↗",
    },
    {
      id: "eu-commission",
      name: "Europese Commissie · Klacht Schending EU-Recht",
      shortTag: "Brussel Inbreukprocedure",
      scope:
        "Officieel loket in Brussel om structureel falen van nationale instanties, belangenverstrengeling of schending van EU-arbeidsrichtlijnen te melden.",
      url: "https://commission.europa.eu/about-european-commission/contact/problems-and-complaints/complaints-about-breaches-eu-law-member-countries_en",
      actionLabel: "Meld Schending EU-Recht ↗",
    },
    {
      id: "solvit",
      name: "SOLVIT (EU Internemarkt-netwerk)",
      shortTag: "Grensoverschrijdende Rechten",
      scope:
        "Gratis EU-netwerk dat ingrijpt wanneer nationale overheden EU-werknemersrechten en gelijke behandeling niet handhaven.",
      url: "https://solvit.ec.europa.eu/",
      actionLabel: "Open SOLVIT EU ↗",
    },
    {
      id: "germany-zoll",
      name: "Duitsland · Zoll (FKS Arbeidshandhaving)",
      shortTag: "DE Grensoverschrijdende Looncontrole",
      scope:
        "Duitse federale arbeidsinspectie (Finanzkontrolle Schwarzarbeit) bij grensoverschrijdend werk, minimumloonfraude en onwettige inhoudingen langs DE/NL.",
      url: "https://www.zoll.de/EN/Businesses/Work/work_node.html",
      actionLabel: "Duitsland Zoll (FKS) ↗",
    },
    {
      id: "belgium-siod",
      name: "België · SIOD / Meldpunt Sociale Fraude",
      shortTag: "BE Grensoverschrijdend Fraudemeldpunt",
      scope:
        "Officieel Belgisch meldpunt (Sociale Inlichtingen- en Opsporingsdienst) voor sociale dumping, loondiefstal en uitbuiting over de BE/NL-grens.",
      url: "https://www.meldpuntsocialefraude.belgie.be/",
      actionLabel: "België Fraudemeldpunt ↗",
    },
  ];
}

export function formatLocalizedLegalBrief(
  report: WorkerReport,
  locale: Locale
): string {
  if (locale === "en") return formatLegalBrief(report);

  const localizedReport = getLocalizedReport(report, "nl");
  const cat = getLocalizedCategory(localizedReport.category, "nl");
  const authorityNames = localizedReport.recommendedAuthorities
    .map((id) => `${DUTCH_AUTHORITIES[id].name} (${DUTCH_AUTHORITIES[id].url})`)
    .join("\n  - ");
  const brusselsNames = getLocalizedBrusselsChannels("nl")
    .map((ch) => `${ch.name} (${ch.url})`)
    .join("\n  - ");
  const evidenceList =
    localizedReport.evidenceHeld.length > 0
      ? localizedReport.evidenceHeld
          .map((e) => `  - [x] ${getLocalizedEvidenceLabel(e, "nl")}`)
          .join("\n")
      : "  - (Nog geen bewijsstukken aangevinkt)";
  const attachmentList =
    localizedReport.attachments.length > 0
      ? localizedReport.attachments
          .map(
            (att) =>
              `  - [BESTAND] ${att.fileName} (${getLocalizedEvidenceLabel(att.type, "nl")}) -> Kluis: ${att.blobUrl}`
          )
          .join("\n")
      : "  - (Geen bestanden geüpload)";

  return [
    "================================================================",
    "EXTERN EU- & NL-ZAAKDOSSIER (NEDERLAND + BRUSSEL ESCALATIE)",
    "================================================================",
    `Zaakreferentie:   ${localizedReport.caseNumber}`,
    `Datum gemeld:     ${localizedReport.createdAt ? localizedReport.createdAt.slice(0, 10) : "N.v.t."}`,
    `Categorie:        ${cat.label}`,
    `Levensfase:       ${localizedReport.stage.toUpperCase()}`,
    `Regio (NL):       ${localizedReport.region}`,
    ...(localizedReport.agencyName
      ? [`Uitzendbureau:    ${localizedReport.agencyName}`]
      : []),
    ...(localizedReport.originCorridor
      ? [`EU-corridor:      ${localizedReport.originCorridor}`]
      : []),
    `Weken gewerkt:    ${localizedReport.weeksWorked ?? "Niet opgegeven"}`,
    `Bedrag in de min: ${localizedReport.disputedAmountEur !== null ? `-EUR ${localizedReport.disputedAmountEur.toLocaleString("nl-NL")}` : "Niet opgegeven"}`,
    `Ingediend door:   ${localizedReport.authorAlias}`,
    "",
    "1. FEITELIJKE SAMENVATTING",
    "----------------------------------------------------------------",
    localizedReport.summary,
    "",
    "2. CHRONOLOGISCHE TIJDLIJN",
    "----------------------------------------------------------------",
    localizedReport.timelineNotes || "(Geen chronologische tijdlijn opgegeven)",
    "",
    "3. BESCHIKBAAR BEWIJSMATERIAAL (VOOR DIRECTE INDIENING)",
    "----------------------------------------------------------------",
    evidenceList,
    "",
    "3B. PRIVE BEWIJSKLUIS BESTANDEN",
    "----------------------------------------------------------------",
    attachmentList,
    "",
    "4. BEVOEGDE NEDERLANDSE TOEZICHTHOUDERS",
    "----------------------------------------------------------------",
    `  - ${authorityNames}`,
    "",
    "5. EXTERNE BRUSSEL / EU-ESCALATIEKANALEN",
    "----------------------------------------------------------------",
    `  - ${brusselsNames}`,
    "",
    "OPMERKING: Dit dossier is opgesteld voor externe toezichthouders,",
    "advocaten en Europese instanties. Persoonsgegevens van derden horen",
    "niet in openbare meldingen en worden alleen op formeel verzoek met",
    "een advocaat of bevoegde instantie gedeeld.",
    "================================================================",
  ].join("\n");
}

const SEEDED_COMMENTS_NL: Record<
  string,
  Pick<CommunityComment, "authorAlias" | "body">
> = {
  "comment-seed-001": {
    authorAlias: "Voorbeeldgetuigenis · Logistiek Medewerker",
    body: "Voorbeeld: Op het onboardingkantoor werden Nederlandse contracten haastig doorgedrukt zonder vertaling van brandstof- en inhoudingsregels, en weken later werd geld van het nettoloon gehaald. Teken nooit blind—bewaar berichten en eis alles zwart-op-wit voor SNCU & Arbeidsinspectie.",
  },
  "comment-seed-002": {
    authorAlias: "Voorbeeldgetuigenis · Technisch Vakkracht",
    body: "Voorbeeld: In plaats van ADV-uren volgens de inlener toe te passen, zette de administratie wettelijke vakantie-uren in de min (-€890) en probeerde eerdere brandstof terug te vorderen. Op basis van art. 7:638, 7:628 & 7:632 BW kun je volledig loon terugvorderen bij SNCU en advocaat.",
  },
  "comment-seed-003": {
    authorAlias: "Voorbeeldgetuigenis · Magazijnmedewerker",
    body: "Voorbeeld: Planning nam de telefoon niet meer op, liet mensen zonder diensten of garantie-uren in de woning zitten terwijl de huur doorliep, en eiste gebruik van eigen telefoon en auto. Stuur een schriftelijke beschikbaarheidsmelding (art. 7:628 BW) met bel-logs naar Arbeidsinspectie.",
  },
  "comment-seed-004": {
    authorAlias: "Voorbeeldgetuigenis · Eerlijk Werk Community",
    body: "Voorbeeld: Bureaus rekenen erop dat buitenlandse werknemers stil blijven of zonder aangifte vertrekken. Als we onze stemmen, reacties en loonstroken bundelen, krijgen Nederlandse Arbeidsinspectie, SNCU, Politie en ELA onweerlegbaar collectief bewijs.",
  },
};

export function getLocalizedComment(
  comment: CommunityComment,
  locale: Locale
): CommunityComment {
  if (locale === "en" || !comment.isSeeded) return comment;
  const nlPatch = SEEDED_COMMENTS_NL[comment.id];
  if (!nlPatch) return comment;
  return {
    ...comment,
    ...nlPatch,
  };
}

export function getLocalizedCommentTopicLabel(
  topic: CommentTopicId,
  locale: Locale
): string {
  const map: Record<CommentTopicId, { nl: string; en: string }> = {
    "wage-money-back": {
      nl: "Geld Terug / Loon & Brandstof",
      en: "Money Back / Wage & Fuel",
    },
    "onboarding-lies": {
      nl: "Onboarding Leugens & Contract",
      en: "Onboarding Lies & Contract",
    },
    "housing-snf": {
      nl: "Huisvesting, Ratten & Op Straat",
      en: "Housing, Pests & Street Crisis",
    },
    "ignored-hours": {
      nl: "Geen Planning / Telefoon Genegeerd",
      en: "No Planning / Ignored Calls",
    },
    "rights-lawsuit": {
      nl: "Rechten, Politie & Rechtszaak",
      en: "Rights, Police & Lawsuit",
    },
  };
  return map[topic][locale];
}

// --- Multi-agency localization ---

const CHARLIE_DEPT_NL: Record<
  string,
  Pick<
    AgencyDepartmentNode,
    | "code"
    | "title"
    | "dutchLabel"
    | "location"
    | "scope"
    | "redFlagFocus"
    | "whatToDocument"
    | "portalStageLabel"
    | "portalRedFlagLabel"
  >
> = {
  "regional-management": {
    code: "UNIT 01",
    title: "Regio- & Accountmanagement",
    dutchLabel: "Regio Management & Opdrachtgevers",
    location: "Nederland (Regionale vestigingen & HQ)",
    scope:
      "Coördineert opdrachtgevers (inleners), regionale personeelsplanning en continuïteit van plaatsingen in Nederlandse regio's.",
    redFlagFocus:
      "Controleer de inlenersbeloning, de exacte CAO-functiegroep en schriftelijke plaatsingsvoorwaarden.",
    whatToDocument: [
      "Schriftelijke bevestiging van de functieschaal en het uurloon bij de inlener",
      "Ondertekende uitzendbevestiging passend bij je feitelijke werk",
      "Elke wijziging van uurtarief of dienstrooster zwart-op-wit",
    ],
    portalStageLabel: "Bekijk Fase 02 · Planning",
    portalRedFlagLabel: "Check Rode Vlaggen Planning",
  },
  recruitment: {
    code: "UNIT 02",
    title: "Internationale Werving & Selectie",
    dutchLabel: "Werving & Selectie (NL & EU)",
    location: "Den Haag · Gyula (HU) · Centraal-Europa",
    scope:
      "Werft en screent internationale kandidaten, licht vacature-aanbiedingen toe en begeleidt instroom vóór aankomst.",
    redFlagFocus:
      "Zorg dat geadverteerd brutoloon, weekuren, huurkosten en vervoersregels letterlijk in het ondertekende contract staan.",
    whatToDocument: [
      "Screenshots van vacatures en chatberichten over bruto/netto salaris",
      "Volledig Nederlands + vertaald contract ontvangen vóór vertrek",
      "Schriftelijke opgave van wekelijkse huurinhouding & SNF-status",
    ],
    portalStageLabel: "Bekijk Fase 01 · Werving",
    portalRedFlagLabel: "Check Rode Vlaggen Werving",
  },
  "operations-staff": {
    code: "UNIT 03",
    title: "Interne Operatie & Vermelde Staf",
    dutchLabel: "Operationeel Team & Interne Staf",
    location: "Nederland",
    scope:
      "Interne medewerkers en teamleden uit publieke teamcommunicatie. Individuele functietitels blijven neutraal zolang ze niet openbaar zijn bevestigd.",
    redFlagFocus:
      "Vraag bij salaris-, vervoer- en huisvestingsdesks altijd om gespecificeerde loonstroken, schriftelijke toestemming en SNF-checks.",
    whatToDocument: [
      "Opeenvolgende wekelijkse loonstroken en bankafschriften",
      "Schriftelijke vervoers- en brandstofregeling vóór gebruik van bedrijfsauto of tankpas",
      "Gedateerde onderhoudsmeldingen van de woning (zonder foto's van staf in openbare meldingen)",
    ],
    portalStageLabel: "Bekijk Juridische Escalatie",
    portalRedFlagLabel: "Stel Bezwaarbrief Op",
  },
};

const CHARLIE_MEMBERS_NL: Record<
  string,
  Pick<
    AgencyTeamMember,
    | "role"
    | "roleBadgeLabel"
    | "departmentLabel"
    | "location"
    | "headline"
    | "summary"
    | "sourceNote"
    | "linkedInButtonLabel"
    | "relatedDisputeArea"
    | "portalLinkLabel"
  >
> = {
  "anil-krishan": {
    role: "Regio Manager Noord",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Regio- & Accountmanagement",
    location: "Nederland · Regio Noord",
    headline: "Regio Manager Noord · Charlie works",
    summary:
      "Openbaar vermeld via The Org als Regio Manager Noord bij Charlie works voor regionale projecten en klantrelaties, en uitgelicht in teamcommunicatie van Charlie works.",
    sourceNote: "Bron: Openbaar geïndexeerd op The Org & charlieworks.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea: "Planning & Gelijke Beloning (Inlenersbeloning)",
    portalLinkLabel: "Check CAO & Planning Rode Vlaggen",
  },
  "anita-fabian": {
    role: "Recruiter",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Internationale Werving",
    location: "Gyula, Hongarije · Internationaal Bureau",
    headline: "Recruiter · Charlie works (Gyula / Internationale Werving)",
    summary:
      "Openbaar vermeld op charlieworks.eu als recruiter die kandidaten uit Hongarije en Centraal-Europa begeleidt naar functies in logistiek, productie en tuinbouw in Nederland.",
    sourceNote: "Bron: Openbaar vermeld op charlieworks.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea: "Wervingsbeloften & Voorwaarden Vóór Aankomst (art. 7:655 BW)",
    portalLinkLabel: "Check Rode Vlaggen Werving",
  },
  "auke-van-de-beek": {
    role: "Teamlid Uitzendbureau",
    roleBadgeLabel: "Neutraal · Functie Onbevestigd",
    departmentLabel: "Operatie & Teamoverzicht",
    location: "Nederland",
    headline: "Teamlid · Charlie works (Exacte functietitel niet publiek bevestigd)",
    summary:
      "Uitgelicht in teamcampagnes op charlieworks.eu. De exacte functietitel en een openbaar LinkedIn-profiel zijn in open zoekresultaten niet bevestigd.",
    sourceNote: "Bron: Foto aangeleverd in werkruimte · Voornaam op charlieworks.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea: "Salaris-, Vervoer- & Pre-Signing Checklist",
    portalLinkLabel: "Open Pre-Signing Checklist",
  },
  "mirjam-hooft": {
    role: "Teamlid Uitzendbureau",
    roleBadgeLabel: "Neutraal · Functie Onbevestigd",
    departmentLabel: "Operatie & Teamoverzicht",
    location: "Nederland",
    headline: "Teamlid · Bureau-overzicht (Exacte functietitel niet publiek bevestigd)",
    summary:
      "Opgenomen in de aangeleverde teamfotoset. Openbare functietitel, vestiging en LinkedIn-URL zijn niet gevonden in publieke registers en blijven neutraal.",
    sourceNote: "Bron: Foto aangeleverd in werkruimte · Functie niet publiek bevestigd",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea: "Afdelingsrisico's & Officiële NL Registers",
    portalLinkLabel: "Bekijk Afdelingsrisico's",
  },
  nina: {
    role: "Teamlid Uitzendbureau",
    roleBadgeLabel: "Neutraal · Achternaam & Functie Onbevestigd",
    departmentLabel: "Operatie & Teamoverzicht",
    location: "Nederland",
    headline: "Teamlid · Charlie works (Achternaam & functietitel niet bevestigd)",
    summary:
      "Vermeld als 'Nina' in teamopstellingen op charlieworks.eu. Volledige achternaam, specifieke afdeling en LinkedIn-URL zijn niet publiek bevestigd.",
    sourceNote: "Bron: Foto aangeleverd in werkruimte · Voornaam op charlieworks.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea: "Controlepunten & Juridische Escalatie",
    portalLinkLabel: "Open Advocaat Escalatiediagram",
  },
};

const DIT_LAREX_DEPT_NL: Record<
  string,
  Pick<
    AgencyDepartmentNode,
    | "code"
    | "title"
    | "dutchLabel"
    | "location"
    | "scope"
    | "redFlagFocus"
    | "whatToDocument"
    | "portalStageLabel"
    | "portalRedFlagLabel"
  >
> = {
  "regional-management": {
    code: "UNIT 01",
    title: "Directie & Regiomanagement",
    dutchLabel: "Directie & Regiomanagement (Techniek, Metaal & Bouw)",
    location: "Waardenburg HQ · Deventer · NL Regio's",
    scope:
      "Commerciële directie en regiomanagement binnen DIT Holding, Larex Techniek/Metaal en Larex Bouw.",
    redFlagFocus:
      "Controleer de geldende CAO-loonschaal bij de inlener (Bouw / Metaal / Techniek inlenersbeloning) en laat tarieven vóór aanvang schriftelijk bevestigen.",
    whatToDocument: [
      "Ondertekende plaatsingsbevestiging met exacte functiegroep bij de inlener",
      "Schriftelijke afspraken over vaktoeslagen, gereedschap en reiskosten",
      "Elke tariefs- of functiewijziging tussentijds zwart-op-wit",
    ],
    portalStageLabel: "Bekijk Fase 02 · Planning",
    portalRedFlagLabel: "Check Rode Vlaggen Planning",
  },
  recruitment: {
    code: "UNIT 02",
    title: "Accountmanagement & EU-Bemiddeling",
    dutchLabel: "Accountmanagement Techniek & Internationale Werving",
    location: "Deventer (NL) · Kantoren Polen & Roemenië",
    scope:
      "Koppelt Europese en Nederlandse technische vakkrachten aan bouw-, metaal- en techniekprojecten en begeleidt de instroom.",
    redFlagFocus:
      "Controleer of beloofde uurlonen, brandstof- of reiskostenvergoedingen en SNF-huurkosten letterlijk in de Nederlandse arbeidsovereenkomst staan.",
    whatToDocument: [
      "Vacature-aanbod, tariefopgave en berichten vanuit NL/PL/RO-desks",
      "Volledig Nederlands + vertaald uitzendcontract ontvangen vóór vertrek",
      "Schriftelijke tankpas- of vervoersregeling zonder terugwerkende inhoudingen",
    ],
    portalStageLabel: "Bekijk Fase 01 · Werving",
    portalRedFlagLabel: "Check Rode Vlaggen Werving",
  },
  "operations-staff": {
    code: "UNIT 03",
    title: "Salarisadministratie, Vervoer & SNF-Huisvesting",
    dutchLabel: "Salarisadministratie, Vervoer & Huisvesting",
    location: "Deventer / Waardenburg",
    scope:
      "Verzorgt wekelijkse loonstroken, reiskosten-/brandstofvergoedingen en huisvesting. Voeg hieronder gezamenlijk contactrollen toe.",
    redFlagFocus:
      "Let scherp op terugwerkende loon- of brandstofinhoudingen én op het in de min zetten van vakantie-uren in plaats van het toepassen van ADV/ATV-uren (art. 7:638 / 7:628 BW) om doorwerken af te dwingen.",
    whatToDocument: [
      "Alle wekelijkse loonstroken met ADV-reserveringen vs. negatieve vakantie-uren",
      "Tankbonnen, kilometerregistratie en schriftelijke auto-/tankpasafspraken",
      "Schriftelijk bezwaar o.g.v. art. 7:638, 7:628 & 7:632 BW tegen opgelegde min-uren",
    ],
    portalStageLabel: "Stel Bezwaarbrief Op",
    portalRedFlagLabel: "Bekijk Juridische Escalatie",
  },
};

const DIT_LAREX_MEMBERS_NL: Record<
  string,
  Pick<
    AgencyTeamMember,
    | "role"
    | "roleBadgeLabel"
    | "departmentLabel"
    | "location"
    | "headline"
    | "summary"
    | "sourceNote"
    | "linkedInButtonLabel"
    | "relatedDisputeArea"
    | "portalLinkLabel"
  >
> = {
  "daniel-keurntjes": {
    role: "Commercieel Directeur",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Directie & Regiomanagement",
    location: "Waardenburg / Deventer · DIT Holding & Larex",
    headline: "Commercieel Directeur · DIT Holding (DIT Personeel & Larex)",
    summary:
      "Openbaar vermeld op larex.eu en ditholding.nl als Commercieel Directeur bij DIT Holding (moederbedrijf van DIT Personeel en Larex), gestart bij Larex in 2021.",
    sourceNote: "Bron: Openbaar vermeld op larex.eu & ditholding.nl",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea:
      "Directie, CAO-naleving & Bescherming tegen Looninhouding (art. 7:632 BW)",
    portalLinkLabel: "Check Registers & Rode Vlaggen",
  },
  "bastian-de-weerd": {
    role: "Regiomanager Techniek en Metaal",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Directie & Regiomanagement",
    location: "Nederland · Team Techniek & Metaal",
    headline: "Regiomanager Techniek en Metaal · Larex (DIT Holding)",
    summary:
      "Openbaar vermeld op larex.eu als Regiomanager Techniek en Metaal, verantwoordelijk voor de regionale teams voor technische en metaalvakkrachten in Nederland.",
    sourceNote: "Bron: Openbaar vermeld op larex.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea:
      "Techniek & Metaal Loonschalen (Inlenersbeloning) & Urenstaten",
    portalLinkLabel: "Check CAO & Planning Rode Vlaggen",
  },
  "jan-jaap-muller": {
    role: "Regiomanager Bouw",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Directie & Regiomanagement",
    location: "Nederland · Team Bouw",
    headline: "Regiomanager Bouw · Larex (DIT Holding)",
    summary:
      "Openbaar vermeld op larex.eu als Regiomanager Bouw voor het aansturen van operationele bouwteams en plaatsingen op Nederlandse bouwprojecten.",
    sourceNote: "Bron: Openbaar vermeld op larex.eu",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea:
      "CAO Bouw Inlenersbeloning, Reiskosten & Overuren Controle",
    portalLinkLabel: "Bekijk Stappenplan Fase 02–04",
  },
  "georgiana-constantinescu": {
    role: "Accountmanager Techniek",
    roleBadgeLabel: "Openbare Functie Bekend",
    departmentLabel: "Accountmanagement & EU-Bemiddeling",
    location: "Deventer / EU Technische Bemiddeling · Larex",
    headline: "Accountmanager Techniek · Larex (DIT Holding)",
    summary:
      "Openbaar vermeld op larex.eu als Accountmanager Techniek voor het begeleiden van technische klantplaatsingen en internationale vakkrachten in Nederland.",
    sourceNote: "Bron: Openbaar vermeld op larex.eu · Aangeleverde foto",
    linkedInButtonLabel: "Zoek op LinkedIn",
    relatedDisputeArea:
      "Juridische Check Vóór Tekenen: ADV vs. Vakantie-uren, Inlenersbeloning & Vervoer (art. 7:655 / 7:638 BW)",
    portalLinkLabel: "Controleer Wettelijke Feiten Vóór Tekenen",
  },
};

export function getLocalizedAgency(
  agency: AgencyRecord,
  locale: Locale
): AgencyRecord {
  if (locale === "en") return agency;

  const isCharlie = agency.slug === "charlie-works";
  const isDitLarex = agency.slug === "dit-larex";

  const deptMap = isCharlie
    ? CHARLIE_DEPT_NL
    : isDitLarex
      ? DIT_LAREX_DEPT_NL
      : undefined;
  const memberMap = isCharlie
    ? CHARLIE_MEMBERS_NL
    : isDitLarex
      ? DIT_LAREX_MEMBERS_NL
      : undefined;

  return {
    ...agency,
    tagline: isCharlie
      ? "Europees Uitzendbureau · Logistiek, Productie & Tuinbouw"
      : isDitLarex
        ? "DIT Holding (DIT Personeel & Larex) · Technische, Bouw- & Metaalvakkrachten"
        : agency.tagline,
    regionalHubs: isCharlie
      ? ["Den Haag (NL HQ)", "Gyula (Hongarije)", "Kantoren in Polen & Slowakije"]
      : isDitLarex
        ? [
            "Deventer (Larex NL)",
            "Waardenburg (DIT Holding HQ)",
            "Opole (Polen)",
            "Galați & Ploiești (Roemenië)",
          ]
        : agency.regionalHubs,
    sectors: isCharlie
      ? [
          "Logistiek & Magazijn",
          "Voeding & Productie",
          "Tuinbouw",
          "Technische / Regionale Projecten",
        ]
      : isDitLarex
        ? [
            "Techniek & Metaal",
            "Bouw & Infra",
            "Elektro & Installatietechniek",
            "Industrie & Vakmanschap",
          ]
        : agency.sectors,
    scamPreventionFocus: isCharlie
      ? "Controleer vóór ondertekening altijd de schriftelijke inlenersbeloning, getekende vervoers-/brandstofregels (geen terugvordering achteraf) en actief SNF-certificaat van de woning."
      : isDitLarex
        ? "Controleer bij technische, metaal- en bouwplaatsingen altijd de geldende inlenersbeloning (CAO Bouw / Metaal incl. ADV/ATV-uren vs. vakantie-uren — accepteer nooit min-uren op vakantie om je vast te zetten), schriftelijke reiskosten- en brandstofafspraken en SNF-certificering."
        : agency.scamPreventionFocus,
    registryChecklistNote: isCharlie
      ? "Controleer vóór aanvang de KvK Waadi-registratie, SNA-keurmerk, ABU/NBBU-lidmaatschap en het SNF-register."
      : isDitLarex
        ? "Controleer de KvK Waadi-registratie van de exacte contractpartij (DIT Personeel / Larex), SNA NEN 4400-1 keurmerk, NBBU CAO-regels en het SNF-register."
        : agency.registryChecklistNote,
    departments: agency.departments.map((dept) => {
      const nlDept = deptMap?.[dept.id];
      return nlDept ? { ...dept, ...nlDept } : dept;
    }),
    members: agency.members.map((member) => {
      const nlMember = memberMap?.[member.id];
      if (nlMember) {
        return { ...member, ...nlMember };
      }
      return {
        ...member,
        roleBadgeLabel:
          member.roleBadgeLabel === "Community Contributed"
            ? "Door Gemeenschap Toegevoegd"
            : member.roleBadgeLabel,
        linkedInButtonLabel: "Zoek op LinkedIn",
      };
    }),
  };
}
