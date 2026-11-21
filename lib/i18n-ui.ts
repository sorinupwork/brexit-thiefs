import type { Locale } from "./types";

export interface PreSigningCheckItem {
  id: string;
  title: string;
  registryName: string;
  description: string;
  url: string;
  linkLabel: string;
}

export interface DepartmentRedFlagItem {
  department: string;
  severity: string;
  pattern: string;
  lawRef: string;
  summary: string;
  demandInWriting: string;
  escalateTo: string;
}

export const PRE_SIGNING_CHECKS_BY_LOCALE: Record<
  Locale,
  PreSigningCheckItem[]
> = {
  nl: [
    {
      id: "waadi",
      title: "Controleer verplichte uitzendregistratie (Waadi)",
      registryName: "KvK Waadi Check",
      description:
        "Elk bureau dat arbeidskrachten ter beschikking stelt in Nederland moet onder de Waadi geregistreerd staan bij de Kamer van Koophandel (KvK). Werken zonder Waadi-registratie leidt tot hoge wettelijke boetes.",
      url: "https://www.kvk.nl/waadi/",
      linkLabel: "Check KvK Waadi ↗",
    },
    {
      id: "sna",
      title: "Verifieer SNA / NEN 4400-1 loonbelasting- & keurmerkregistratie",
      registryName: "Stichting Normering Arbeid (SNA)",
      description:
        "Bevestigt dat het uitzendbureau periodiek wordt gecontroleerd op afdracht van loonheffingen, identiteitscontrole en naleving van het wettelijk minimumloon.",
      url: "https://www.normeringarbeid.nl/register-normering-arbeid",
      linkLabel: "Zoek in SNA-register ↗",
    },
    {
      id: "snf",
      title:
        "Check SNF-huisvestingscertificaat vóór toestemming voor huurinhouding",
      registryName: "Stichting Normering Flexwonen (SNF)",
      description:
        "Onder de WAS mag een bureau alleen huur inhouden op het minimumloon (maximaal 25% van het WML) als de woning actief SNF-gecertificeerd is én je schriftelijk hebt getekend.",
      url: "https://www.normeringflexwonen.nl/register",
      linkLabel: "Zoek in SNF-register ↗",
    },
    {
      id: "cao",
      title:
        "Controleer ABU- of NBBU-lidmaatschap & inlenersbeloning op schrift",
      registryName: "ABU / NBBU Ledenregisters",
      description:
        "Check welke CAO van toepassing is en vraag vóór dag 1 schriftelijk naar de geldende loonschaal van de inlener (inlenersbeloning) en de reiskostenregeling.",
      url: "https://www.abu.nl/leden/",
      linkLabel: "Bekijk ABU-leden ↗",
    },
    {
      id: "transport-written",
      title: "Leg vervoer, tankpas & inhoudingsregels strikt schriftelijk vast",
      registryName: "Contract- & Addendumcheck",
      description:
        "Vertrouw nooit op mondelinge beloftes over brandstof of vervoer. Laat kilometervergoeding, tankpasdekking en uitsluiting van terugwerkende terugvorderingen schriftelijk bevestigen.",
      url: "https://www.nbbu.nl/nl/leden",
      linkLabel: "Bekijk NBBU-leden ↗",
    },
  ],
  en: [
    {
      id: "waadi",
      title: "Confirm legal temp-agency registration (Waadi)",
      registryName: "KvK Waadi Check",
      description:
        "Every agency supplying temporary workers in the Netherlands must be registered in the Dutch Chamber of Commerce (KvK) under the Waadi act. Operating without Waadi registration carries steep statutory fines.",
      url: "https://www.kvk.nl/waadi/",
      linkLabel: "Check KvK Waadi ↗",
    },
    {
      id: "sna",
      title: "Verify SNA / NEN 4400-1 payroll & tax certification",
      registryName: "Stichting Normering Arbeid (SNA)",
      description:
        "Confirms the agency is periodically audited for payroll tax remittance, identity verification, and statutory minimum wage compliance.",
      url: "https://www.normeringarbeid.nl/register-normering-arbeid",
      linkLabel: "Search SNA Register ↗",
    },
    {
      id: "snf",
      title: "Check SNF housing certification before allowing rent deductions",
      registryName: "Stichting Normering Flexwonen (SNF)",
      description:
        "Under Dutch law (WAS), an agency may only deduct rent from minimum-wage earnings (capped at 25%) if the housing holds an active SNF certificate and you signed written consent.",
      url: "https://www.normeringflexwonen.nl/register",
      linkLabel: "Search SNF Register ↗",
    },
    {
      id: "cao",
      title: "Verify ABU or NBBU CAO membership & host-company pay parity",
      registryName: "ABU / NBBU Member Directories",
      description:
        "Confirm which Collective Labor Agreement applies and demand the host company's pay scale (inlenersbeloning) and travel/commute reimbursement rules in writing before Day 1.",
      url: "https://www.abu.nl/leden/",
      linkLabel: "View ABU Members ↗",
    },
    {
      id: "transport-written",
      title: "Get transport, fuel card & deduction terms strictly in writing",
      registryName: "Written Contract & Addendum Check",
      description:
        "Never rely on verbal transport or fuel promises. Confirm km allowance, fuel-card coverage, and that no retroactive clawbacks can be deducted from earned net pay.",
      url: "https://www.nbbu.nl/nl/leden",
      linkLabel: "View NBBU Members ↗",
    },
  ],
};

export const DEPARTMENT_RED_FLAGS_BY_LOCALE: Record<
  Locale,
  DepartmentRedFlagItem[]
> = {
  nl: [
    {
      department: "Salarisadministratie",
      severity: "Kritiek Loonrisico",
      pattern:
        "Terugwerkende Looninhouding ('We hebben je te veel betaald')",
      lawRef: "Art. 7:632 BW · Art. 7:625 BW · WAS",
      summary:
        "Nadat wekenlang (bijv. 8–10+ weken) het afgesproken tarief is uitbetaald, voert de administratie eenzijdig een negatieve looncorrectie door wegens een interne fout.",
      demandInWriting:
        "Gespecificeerde CAO-berekening (inlenersbeloning), ondertekende wettelijke grondslag en volledige nabetaling van het ingehouden loon.",
      escalateTo: "Nederlandse Arbeidsinspectie · SNCU · Arbeidsrechtadvocaat",
    },
    {
      department: "Vervoer & Wagenpark",
      severity: "Kritiek Loonrisico",
      pattern:
        "Terugwerkende Terugvordering van Maandenlange Brandstofkosten",
      lawRef: "Art. 7:611 BW (Goed Werkgeverschap) · Art. 7:632 BW · CAO",
      summary:
        "Bureau betaalt 2+ maanden woon-werk brandstof of tankpas uit tijdens gewerkte diensten, draait dit daarna terug en houdt het opgebouwde bedrag in op het nettoloon.",
      demandInWriting:
        "Vóór aanvang getekende vervoersregeling, tankpasoverzichten en bevestiging van de geldende reiskostenvergoeding bij de inlener.",
      escalateTo: "SNCU · Nederlandse Arbeidsinspectie · Het Juridisch Loket",
    },
    {
      department: "Huisvesting / Woonbeheer",
      severity: "Gezondheid & Veiligheid",
      pattern:
        "Ongedierte (Ratten), Onhygiënische Staat & Onrechtmatige Huurinhouding",
      lawRef: "SNF-norm · WAS 25% WML-huurplafond",
      summary:
        "Huur wordt wekelijks ingehouden terwijl de woning kampt met ratten/ongedierte, vocht, overbewoning of genegeerde schriftelijke onderhoudsmeldingen.",
      demandInWriting:
        "Actief SNF-certificaatnummer, geplande datum van ongediertebestrijding en gespecificeerde berekening van de huurinhouding.",
      escalateTo: "SNF · Nederlandse Arbeidsinspectie · FairWork",
    },
    {
      department: "Afdeling Werving",
      severity: "Contractmisleiding",
      pattern: "Hoger Loon Mondeling Beloofd vs. Lager Contract bij Aankomst",
      lawRef: "Art. 7:655 BW · Waadi · EU-Transparantierichtlijn",
      summary:
        "Recruiters adverteren met vakmanschapstarieven en gratis vervoer/woonruimte, maar bij aankomst vermeldt het contract een lagere schaal of extra inhoudingen.",
      demandInWriting:
        "Volledige Nederlandse + vertaalde arbeidsovereenkomst en wekelijkse netto raming vóór vertrek naar Nederland.",
      escalateTo: "Nederlandse Arbeidsinspectie · FairWork · Juridisch Loket",
    },
    {
      department: "Planning & Coördinatie",
      severity: "Garantie-uren & Middelen",
      pattern:
        "Geen Planning, Telefoon Genegeerd & Eigen Spullen / Auto Verplicht",
      lawRef: "Art. 7:628 BW · Arbowet · ABU/NBBU CAO",
      summary:
        "Bureaus nemen niet op, laten je zonder werk en zonder betaling van garantie-uren in de woning zitten terwijl huur doorloopt, of verplichten gebruik van eigen telefoon, auto of gereedschap.",
      demandInWriting:
        "Schriftelijke beschikbaarheidsmelding ('beschikbaar voor werk'), doorbetaling van garantie-uren (art. 7:628 BW) en kosteloze verstrekking/vergoeding van werkmiddelen en PBM's.",
      escalateTo: "SNCU · Nederlandse Arbeidsinspectie · Het Juridisch Loket",
    },
    {
      department: "Uren, ADV & Verlofsaldo",
      severity: "Onrechtmatige Min-uren",
      pattern:
        "Vakantie-uren in de Min Gezet i.p.v. ADV-uren om Doorwerken Af te Dwingen",
      lawRef: "Art. 7:638 BW · Art. 7:628 BW · Art. 7:632 BW · CAO ADV",
      summary:
        "In plaats van opgebouwde of geldende ADV-/ATV-uren in te zetten bij rooster- of sluitingsdagen, boekt het bureau wettelijke vakantie-uren in de min zodat er schuld ontstaat bij uitdiensttreding.",
      demandInWriting:
        "Volledig overzicht van ADV/ATV-opbouw o.g.v. de inlenersbeloning, schrapping van eenzijdig opgelegde negatieve vakantie-uren en uitbetaling zonder verrekening.",
      escalateTo: "SNCU · Het Juridisch Loket · Nederlandse Arbeidsinspectie",
    },
  ],
  en: [
    {
      department: "Payroll Department",
      severity: "Critical Wage Risk",
      pattern: "Retroactive Salary Clawback ('We Paid You Too Much')",
      lawRef: "BW Art. 7:632 · BW Art. 7:625 · WAS",
      summary:
        "After paying an agreed rate for weeks (e.g. 8–10+ weeks), payroll unilaterally applies a negative correction line to net wages citing an internal mistake.",
      demandInWriting:
        "Itemized CAO pay calculation (inlenersbeloning), signed legal basis for any deduction, and full repayment of withheld earned salary.",
      escalateTo: "Nederlandse Arbeidsinspectie · SNCU · Employment Lawyer",
    },
    {
      department: "Transport & Fleet Department",
      severity: "Critical Wage Risk",
      pattern: "Retroactive Multi-Month Fuel / Petrol Clawback",
      lawRef: "BW Art. 7:611 (Good Employership) · BW Art. 7:632 · CAO Reiskosten",
      summary:
        "Agency pays commute fuel or fuel-card costs for 2+ months while shifts are completed, then reverses the policy and deducts the accumulated fuel total from net wages.",
      demandInWriting:
        "Written transport policy signed prior to start, fuel-card receipts/statements, and confirmation of host-company commute reimbursement parity.",
      escalateTo: "SNCU · Nederlandse Arbeidsinspectie · Het Juridisch Loket",
    },
    {
      department: "Housing / Accommodation Desk",
      severity: "Health & Safety Alert",
      pattern: "Rodents (Rats), Unsanitary Conditions & Unlawful Rent Deductions",
      lawRef: "SNF-norm · WAS 25% Minimum-Wage Rent Cap",
      summary:
        "Rent is deducted directly from weekly salary while units suffer from rats/pests, dampness, overcrowding, or ignored written maintenance tickets.",
      demandInWriting:
        "Active SNF certificate number, timestamped pest-control dispatch date, and itemized rent deduction calculation.",
      escalateTo: "SNF · Nederlandse Arbeidsinspectie · FairWork",
    },
    {
      department: "Recruitment Department",
      severity: "Contract Misrepresentation",
      pattern: "Higher Verbal Rate Promised Abroad vs. Lower Signed Contract",
      lawRef: "BW Art. 7:655 · Waadi · EU Transparency Directive",
      summary:
        "Recruiters advertise skilled/technical hourly rates and free transport/housing, but the contract presented on arrival lowers the scale or adds new deductions.",
      demandInWriting:
        "Full Dutch + English employment contract and itemized weekly net estimate before traveling or resigning from prior work.",
      escalateTo: "Nederlandse Arbeidsinspectie · FairWork · Juridisch Loket",
    },
    {
      department: "Coordination & Planning Desk",
      severity: "Unpaid Guarantee & Gear",
      pattern:
        "No Planning, Calls Ignored in Housing & Forced Use of Personal Gear",
      lawRef: "BW Art. 7:628 · Arbowet · ABU/NBBU CAO",
      summary:
        "Agencies stop answering planning calls, leave workers idle in housing without paying guaranteed hours while rent runs on, or require personal phone, vehicle, or tools without reimbursement.",
      demandInWriting:
        "Timestamped written availability ('beschikbaar voor werk'), full payment of guaranteed hours (BW Art. 7:628), and free employer-supplied PPE/tools or written reimbursement.",
      escalateTo: "SNCU · Nederlandse Arbeidsinspectie · Het Juridisch Loket",
    },
    {
      department: "Hours, ADV & Leave Balance",
      severity: "Forced Leave Debt",
      pattern:
        "Vakantie-uren Put on Minus Instead of Using ADV Hours to Force Continued Work",
      lawRef: "BW Art. 7:638 · BW Art. 7:628 · BW Art. 7:632 · CAO ADV",
      summary:
        "Instead of applying accrued or host-company ADV/ATV hours on scheduled/closure days, the agency pushes statutory holiday hours (vakantie-uren) into minus, creating artificial debt to pressure workers to stay.",
      demandInWriting:
        "Itemized ADV/ATV ledger under host-company parity (inlenersbeloning), removal of unilateral negative vakantie-uren, and full final pay without set-off.",
      escalateTo: "SNCU · Het Juridisch Loket · Nederlandse Arbeidsinspectie",
    },
  ],
};

export const UI_TEXT = {
  nl: {
    navbar: {
      subtitle: "Community Platform · Stop Uitbuiting",
      spotlight: "Teams & Vragen",
      community: "Stemmen & Reacties",
      schematic: "Stappenplan",
      verify: "Rode Vlaggen",
      agencies: "Bureaus & Teams",
      agenciesMobile: "Bureaus",
      lawyer: "Instanties",
      objection: "Geld Terug Brief",
      reports: "Meldingen",
      phaseBadge: "Community · Geen Bedrijf",
      logCase: "Zaak Melden",
    },
    footer: {
      mainTitle:
        "WerkRecht NL · Open Community Platform tegen Arbeidscriminaliteit (Geen Bedrijf)",
      mainDesc:
        "Onafhankelijk community-platform — geen bedrijf, geen bureau en geen formeel juridisch advies. Wij bundelen feitelijk bewijs, stemmen en reacties om corrupte bureaus te dwingen eerlijk te zijn en meldingen in te dienen bij Arbeidsinspectie, SNCU, SNF, Politie en Brussel.",
      agenciesTitle:
        "WerkRecht NL · Community Transparantiegids voor Uitzendbureaus",
      agenciesDesc:
        "Feitelijke referentiegids waarmee werknemers teams en registers controleren om leugens en oplichting te voorkomen.",
      agencyDetailDesc:
        "Feitelijk referentieoverzicht op basis van publieke bedrijfsvermeldingen; onbevestigde rollen blijven neutraal.",
      agenciesLink: "Bureaus & Teams Gids",
      backPortal: "← Hoofdportaal",
      allAgencies: "← Alle Bureaus",
      redFlagsLink: "Rode Vlaggen",
      phaseNote: "Community Bewijsplatform · NL & EU",
    },
    home: {
      notCompanyPill:
        "Geen Bedrijf · Open Community Bewijs- & Meldplatform voor Eerlijk Werk",
      eyebrow: "Stop Loondiefstal, Misleiding & Arbeidscriminaliteit in Europa",
      h1Prefix: "Pak je ",
      h1Highlight: "geld, rechten & menselijke waardigheid",
      h1Suffix: " terug.",
      introBefore:
        "Stop uitzendbureau-praktijken blootleggen, de situatie uitleggen & bewijzen, stemmen en reacties bundelen, en rechtstreeks aanpakken via ",
      introAnd: ".",
      valuesBadges: [
        "1. Menselijke Behoeften Eerst",
        "2. Pak Je Geld Terug",
        "3. Pak Je Rechten Terug",
        "4. Verklaar, Bewijs & Daag Voor de Rechter",
      ],
      ctaPrimary: "Check Je Bureau & Bevestig Rode Vlaggen",
      ctaSecondary: "Pak Geld Terug (Sommatiebrief)",
      ctaCommunity: "Stemmen, Polls & Reacties voor Instanties",
      crisisBannerTitle: "VELDREALITEIT · WAAROM DIT DIRECT MOET STOPPEN:",
      crisisBannerBody:
        "Wanneer uitzendbureaus verdiend loon stelen, uren in de min zetten of buitenlandse werknemers zonder geld, eten of vervoer op straat zetten, veroorzaken zij direct dakloosheid, wanhoop en stijgende straatcriminaliteit in heel Europa. Dit is een zaak voor Politie, Gemeenten, Arbeidsinspectie en Brussel.",
      emergencyStripLabel: "Directe Hulp Nu Nodig (Eten, Onderdak, Juridisch, Politie):",
      emergencyStripLinks: [
        {
          label: "Rode Kruis Voedselhulp ↗",
          href: "https://www.rodekruis.nl/onderwerpen/voedselhulp-in-nederland/",
        },
        {
          label: "Voedselbanken NL ↗",
          href: "https://voedselbankennederland.nl",
        },
        {
          label: "FairWork (Meertalig) ↗",
          href: "https://www.fairwork.nu/",
        },
        {
          label: "Het Juridisch Loket ↗",
          href: "https://www.juridischloket.nl/",
        },
        {
          label: "Politie (Bedreiging / Straatnood) ↗",
          href: "https://www.politie.nl/aangifte-of-melding-doen",
        },
      ],
      cardHeader: "Jouw 4 Stappen naar Herstel & Gerechtigheid",
      gdprBadge: "Community · Geen Bedrijf",
      stat1Label: "STAP 01 · MENSELIJKE BEHOEFTEN",
      stat1Value: "Eten, Dak & Veiligheid Eerst",
      stat1Sub:
        "Stop uitzettingsdreiging, ratten in woningen & zonder €0 op straat gezet worden (voorkom honger en criminaliteit)",
      stat2Label: "STAP 02 · PAK JE GELD TERUG",
      stat2Value: "100% Loon, Brandstof & ADV",
      stat2Sub:
        "Vorder ingehouden salaris, 2-mnd brandstof, valse min-vakantie-uren en onbetaalde garantie-uren terug (+50% verhoging)",
      stat3Label: "STAP 03 · PAK JE RECHTEN TERUG",
      stat3Value: "Gelijke Behandeling & Eerlijke Begeleiding",
      stat3Sub:
        "Onboarding moet mensen van buitenaf helpen & instrueren — niet voorliegen, uitbuiten of verplichten eigen spullen te betalen",
      stat4Label: "STAP 04 · VERKLAAR, BEWIJS & RECHTSZAAK",
      stat4Value: "Naar Politie, Inspectie & Rechter",
      stat4Sub:
        "Beantwoord de vragenlijst, voeg reacties & bewijs samen en dien direct in bij Arbeidsinspectie, SNCU, SNF, Politie & EU",
      principleLabel: "MISSIE:",
      principleBody:
        "Geen winstoogmerk of adviesbureau: wij maken zichtbaar welke afdelingen en teams misbruik plegen zodat bureaus gedwongen worden eerlijk te handelen, en geven jou kant-en-klare bewijzen en formulieren om te procederen.",
    },
    agencySpotlight: {
      eyebrow: "01 · Visualiseer Bureauteams, Misstanden & Bevestigingsvragen",
      heading:
        "Bekijk Afdelingen & Teams per Bureau — en Test of Ze Jou Oplichten",
      intro:
        "Zie direct hoe grote uitzendbureaus zijn opgebouwd, welke afdelingen welke fouten/misbruik veroorzaken (en waarom je moet oppassen of ze moet vermijden), en beantwoord de 6 vragen rechts of onderaan om te bevestigen of dit bij jou gebeurt.",
      fullDirCta: "Alle Bureaus & Volledige Org-kaarten →",
      agencySelectorLabel: "Kies een uitzendbureau om teams & risico's te zien:",
      flagAgencyBtn: "Markeer Risicopatroon bij Dit Bureau",
      flaggedAgencyBtn: "Gemarkeerd voor Onderzoek ✓",
      flagsLabel: "Community markeringen",
      profilesLabel: "Teamprofielen",
      openFullPage: "Open Volledige Bureaupagina & Org-kaart →",
      whyAvoidHeading: "Waarom Oppassen & Wat Misgaat per Afdeling:",
      deptWarnings: [
        {
          deptKey: "recruitment",
          badge: "WERVING & ONBOARDINGKANTOOR",
          whyTitle: "Waarom misleiding hier begint",
          whyText:
            "Buitenlandse werknemers horen hoge tarieven en 'alles wordt geregeld', maar op het Nederlandse kantoor wordt het contract niet goed vertaald of uitgelegd en worden regels verzwegen.",
          avoidTip:
            "Teken niets onder druk zonder Nederlands + vertaalde kopie van loon, woonkosten en reiskosten.",
        },
        {
          deptKey: "regional-management",
          badge: "PLANNING & ACCOUNTMANAGEMENT",
          whyTitle: "Waarom mensen zonder geld op straat belanden",
          whyText:
            "Telefoons worden niet opgenomen, garantie-uren niet uitbetaald terwijl kamerhuur doorloopt, of mensen worden ineens weggestuurd — wat direct leidt tot armoede en straatcriminaliteit.",
          avoidTip:
            "Stuur bij uitblijven van diensten direct per mail/WhatsApp dat je beschikbaar bent (art. 7:628 BW).",
        },
        {
          deptKey: "operations-staff",
          badge: "SALARISADMINISTRATIE, VERVOER & WONEN",
          whyTitle: "Waarom verdiend geld verdwijnt",
          whyText:
            "Na weken werken worden 'interne fouten', 2 maanden tankkosten of negatieve vakantie-uren (i.p.v. ADV) afgetrokken, terwijl ratten of vocht in woningen genegeerd worden.",
          avoidTip:
            "Bewaar elke wekelijkse loonstrook vanaf week 1 en maak direct schriftelijk bezwaar (tot 50% extra recht).",
        },
      ],
      rosterSubheading: "Geïndexeerde Teamleden & Openbare Rollen",
      rosterNote:
        "Gebaseerd op publieke bedrijfsvermeldingen en aangeleverde teamfoto's. Onbevestigde functietitels blijven neutraal; focus ligt op controleerbare afdelingsfeiten en werknemersbescherming.",
      zoomBtn: "Vergroot",
      quizEyebrow: "02 · Bevestigingsvragen (Doet Jouw Bureau Dit Of Niet?)",
      quizHeading:
        "Beantwoord Deze 6 Vragen om te Bevestigen of Je Wordt Benadeeld",
      quizIntro:
        "Klik per vraag op JA of NEE. Je ziet meteen waarom dit wettelijk fout is, welk bewijs je moet bewaren en je kunt direct jouw sommatiebrief of melding aanmaken.",
      yesBtn: "JA, dit gebeurt",
      noBtn: "NEE",
      unsureBtn: "Weet niet",
      resetQuizBtn: "Reset antwoorden",
      whyIllegalLabel: "Waarom dit illegaal is & wettelijke basis:",
      proofNeededLabel: "Bewijs om mee te nemen naar instantie / rechter:",
      verdictTitle: "Jouw Diagnose & Volgende Stap",
      verdictClear:
        "Nog geen rode vlaggen aangevinkt. Blijf altijd je wekelijkse loonstroken, contract en tankbonnen bewaren.",
      verdictWarn:
        "Waarschuwing: 1–2 rode vlaggen bevestigd. Eis schriftelijke opheldering en stuur een bezwaarbrief voordat je meer geld verliest.",
      verdictCritical:
        "KRITIEK: Meerdere ernstige wetsovertredingen bevestigd! Je hebt sterke gronden om je geld terug te vorderen en het bureau aan te pakken via SNCU, Arbeidsinspectie, Politie en advocaat.",
      confirmedCountSuffix: "van 6 rode vlaggen bevestigd",
      sendToTallyBtn: "Bevestig & Tel Mee in Community Bewijs",
      sentToTallyBtn: "Meegeteld in Community Bewijs ✓",
      draftDemandFromQuizBtn: "Maak Direct Geld-Terug Brief →",
      logCaseFromQuizBtn: "Zet in Zaakmelding & Bewijs →",
      questions: [
        {
          id: "q-onboarding",
          disputeType: "combined",
          category: "recruitment",
          stage: "recruitment",
          question:
            "1. Beloofde de recruiter een hoger loon of goede begeleiding, maar kreeg je bij het onboardingkantoor geen duidelijke instructie/vertaling of een lager contract?",
          whyIllegal:
            "Overtreding van art. 7:655 BW & EU-richtlijn 2019/1152. Het bureau moet buitenlandse werknemers eerlijk informeren en begeleiden — niet misleiden.",
          proof:
            "Vacaturetekst, chatberichten met beloftes vóór aankomst en het getekende contract.",
        },
        {
          id: "q-clawback",
          disputeType: "combined",
          category: "transport-fuel",
          stage: "payroll",
          question:
            "2. Hebben ze weken- of maandenlang loon of brandstof/reiskosten betaald, en daarna geld teruggevorderd van je loon als zogenaamde 'interne fout'?",
          whyIllegal:
            "Verboden eenzijdige verrekening onder art. 7:632 BW, strijd met goed werkgeverschap (art. 7:611 BW) en Wet aanpak schijnconstructies (WAS).",
          proof:
            "Opeenvolgende loonstroken die eerdere betalingen + de min-inhouding tonen, tankbonnen en bankafschriften.",
        },
        {
          id: "q-adv-minus",
          disputeType: "adv-holiday-minus",
          category: "contract-cao",
          stage: "payroll",
          question:
            "3. Zijn jouw wettelijke vakantie-uren in de min gezet in plaats van ADV-uren, of dreigen ze dat je schuld hebt als je stopt?",
          whyIllegal:
            "Overtreding van art. 7:638 BW (vakantie wordt niet eenzijdig negatief opgelegd), art. 7:628 BW (werkgeversrisico) en ABU/NBBU CAO inlenersbeloning.",
          proof:
            "Loonstroken met het negatieve vakantie-urensaldo, rooster van het inleenbedrijf en schriftelijk bezwaar.",
        },
        {
          id: "q-ignored-gear",
          disputeType: "benched-guarantee-hours",
          category: "hours-overtime",
          stage: "coordination",
          question:
            "4. Wordt de telefoon niet opgenomen, krijg je geen planning/garantie-uren betaald in de woning terwijl huur doorloopt, of moet je eigen auto/telefoon/gereedschap gebruiken?",
          whyIllegal:
            "Art. 7:628 BW verplicht doorbetaling van garantie-uren als jij beschikbaar bent. De Arbowet verplicht kosteloze PBM's en werkmiddelen.",
          proof:
            "Bel- en WhatsApp-logs zonder antwoord, jouw schriftelijke beschikbaarheidsmail en bonnetjes van eigen spullen.",
        },
        {
          id: "q-housing-street",
          disputeType: "combined",
          category: "accommodation-snf",
          stage: "accommodation",
          question:
            "5. Zit je in onveilige/ratten- of schimmelwoningen (>25% huurinhouding zonder SNF), of zetten ze werknemers zonder geld op straat?",
          whyIllegal:
            "Schending SNF-norm & WAS 25%-grens. Werknemers zonder geld op straat dumpen creëert directe armoede, honger en stijgende criminaliteit in Europa.",
          proof:
            "Gedateerde foto's/video's (zonder gezichten), genegeerde reparatieverzoeken, huurinhoudingen op loonstrook.",
        },
        {
          id: "q-threats-finalpay",
          disputeType: "wage-clawback",
          category: "wage-deduction",
          stage: "escalation",
          question:
            "6. Is er sprake van discriminatie/ongelijke behandeling, intimidatie, paspoortinname, of het inhouden van je eindafrekening en vakantiegeld?",
          whyIllegal:
            "Strafrechtelijke dwang/fraude (Politie), discriminatieverbod, plus tot 50% wettelijke verhoging bij te laat loon (art. 7:625 BW).",
          proof:
            "Bewaarde berichten/opnames, eindafrekening en getuigenverklaringen voor Politie, Arbeidsinspectie & advocaat.",
        },
      ],
    },
    europeSpotlight: {
      poll1Title: "Poll 1 · Welke Misstand Moet Direct Gestopt Worden?",
      poll2Title: "Poll 2 · Nationale & Grensoverschrijdende Actie (NL / BE / DE)",
      poll3Title: "Poll 3 · Europees Parlement & Brussel Actie (1 Europa)",
      pollTotalVotes: "stemmen",
      pollVotedTag: "Jouw stem meegeteld ✓",
      pollHint: "Klik op één optie om te stemmen (opgeslagen voor officiële dossiers).",
      redFlagPollOptions: [
        {
          id: "retroactive-wage",
          label: "Terugwerkende looninhouding / 'interne fout' op loonstrook",
        },
        {
          id: "fuel-clawback",
          label: "Terugvordering van 2+ maanden brandstof- of reiskosten",
        },
        {
          id: "adv-holiday-minus",
          label: "Vakantie-uren in de min i.p.v. ADV-uren om doorwerken af te dwingen",
        },
        {
          id: "unpaid-guarantee-benched",
          label: "Geen planning, telefoon genegeerd & eigen spullen verplicht",
        },
        {
          id: "street-abandonment",
          label: "Zonder geld/eten op straat gezet — veroorzaakt wanhoop & criminaliteit",
        },
        {
          id: "contract-bait-switch",
          label: "Lager contract / leugens op onboardingkantoor vs. belofte",
        },
        {
          id: "snf-housing",
          label: "Ondermaatse SNF-huisvesting (ratten/schimmel) / >25% inhouding",
        },
        {
          id: "withheld-final-pay",
          label: "Inhouden eindafrekening / vakantiegeld na bezwaar",
        },
        {
          id: "discrimination-unequal-treatment",
          label: "Racisme, discriminatie of ongelijke behandeling o.b.v. herkomst",
        },
      ],
      institutePollOptions: [
        {
          id: "arbeidsinspectie-audit",
          label: "Nederlandse Arbeidsinspectie · Loon- & fraudeonderzoek + boetes",
        },
        {
          id: "sncu-cao-audit",
          label: "SNCU · CAO-controle op inlenersbeloning, ADV & terugbetaling",
        },
        {
          id: "snf-housing-audit",
          label: "SNF & Gemeente · Huisvestingsinspectie & intrekken keurmerk",
        },
        {
          id: "politie-fraud-report",
          label: "Politie · Melding dwang, fraude & straatuitzetting zonder geld",
        },
        {
          id: "collective-lawsuit",
          label: "Rechtbank / Arbeidsrechtadvocaat · Collectief loon terugvorderen",
        },
      ],
      brusselsPollOptions: [
        {
          id: "ela-inspection",
          label: "ELA gezamenlijke grensoverschrijdende inspectie aanvragen",
        },
        {
          id: "eu-commission-complaint",
          label: "Europese Commissie klacht over schending EU-arbeidsrecht",
        },
        {
          id: "ep-peti-petition",
          label:
            "Europees Parlement (PETI) · Verbod op vacatures & corrupte bureaus uit de EU zetten",
        },
        {
          id: "solvit-network",
          label: "SOLVIT grensoverschrijdende interventie op EU-rechten",
        },
      ],
      commentsEyebrow: "Community Reacties & Getuigenissen (Voor Officiële Dossiers)",
      commentsTitle: "Deel Wat Er Gebeurde & Bevestig Elkaars Ervaringen",
      commentsIntro:
        "Lees reacties van andere werknemers, klik op '+ Bevestig (Mij ook overkomen)' en voeg jouw feitelijke waarschuwing toe. Alle reacties worden meegeëxporteerd naar het collectieve instantie-dossier.",
      commentFilterAll: "Alle",
      commentsEmptyTitle: "Nog geen community-reacties geplaatst.",
      commentsEmptySub:
        "Deel rechts als eerste wat er bij jouw uitzendbureau gebeurde zodat anderen het kunnen bevestigen.",
      commentConfirmBtn: "Mij ook overkomen / Bevestig",
      commentConfirmedBtn: "Bevestigd ✓",
      commentSampleBadge: "Voorbeeld",
      commentFormTitle: "Plaats Een Feitelijke Reactie / Waarschuwing",
      commentAgencyLabel: "Bureau / Onderwerp",
      commentTopicLabel: "Categorie",
      commentCorridorLabel: "Corridor / Land (Optioneel)",
      commentCorridorPlaceholder: "bijv. RO / HU / PL → NL",
      commentAliasLabel: "Rol / Naam (Optioneel)",
      commentAliasPlaceholder: "bijv. Technisch Monteur of Anoniem",
      commentBodyLabel: "Wat gebeurde er / Waarom waarschuwen? *",
      commentBodyPlaceholder:
        "Beschrijf feitelijk wat bij onboarding, loonstrook, planning of huisvesting gebeurde (zonder privételefoonnummers)...",
      commentGdprLabel:
        "Ik bevestig dat deze reactie feitelijk is en GEEN privételefoonnummers of woonadressen van individuen publiceert.",
      commentGdprError:
        "Bevestig eerst dat jouw reactie feitelijk is en geen privégegevens bevat.",
      commentSubmitBtn: "Reactie Toevoegen aan Community Bewijs",
      commentSubmittingBtn: "Opslaan...",
      commentSuccess: "Reactie opgeslagen en meegeteld voor officiële dossiers ✓",
      commentNetworkError: "Fout bij opslaan van reactie.",
    },
    stage: {
      eyebrow: "06 · Verklaar & Bewijs · Volledig Stappenplan van het Uitzendtraject",
      heading: "Begrijp Precies Hoe Ze Sjoemelen — en Welk Bewijs Hen Verslaat",
      intro:
        "Elk misbruik door een Nederlands uitzendbureau vindt plaats in een van deze 6 fasen — van valse werving en slordige onboarding tot planning, brandstofinhouding, loonstrook en huisvesting. Klik op een fase om de wet, de rode vlaggen en het winnende bewijs te zien.",
      stagePrefix: "FASE",
      blueprintTitle: "Inspectie-overzicht Fase",
      lawHeading: "Toepasselijk Nederlands Recht / Norm",
      evidenceHeading: "Te Bewaren Bewijsmateriaal",
      verifyHeading: "Wat Werknemers Moeten Controleren",
      redFlagsHeading: "Rode Vlaggen om Te Bewijzen",
    },
    verify: {
      eyebrow: "05 · Bewaar Alle Rode Vlaggen om Te Procederen",
      heading: "Rode Vlaggen per Afdeling (Bewijs Voor Je Rechtszaak)",
      intro:
        "Buitenlandse werknemers horen niet vooraf zelf complexe overheidsregisters te hoeven doorzoeken voordat ze solliciteren: het bureau en het onboardingkantoor hebben de wettelijke plicht om mensen goed te begeleiden, te instrueren, niet voor te liegen en niet te stelen. Bewaar alle rode vlaggen hieronder om ze aan te klagen.",
      ctaTitle: "Bekijk Bureaus, Teams & Org-kaarten",
      ctaSub: "Vergelijk teams & voorkom samen misstanden →",
      demandLabel: "Bewijs voor Rechtszaak / Inspectie",
      routeLabel: "Meld & Dien In Bij:",
    },
    lawyer: {
      authEyebrow: "07 · Officiële Nationale & Europese Instanties (NL · BE · DE · EU)",
      authHeading: "Meld Grensoverschrijdend — En Pas Op Voor Betaalde of Passieve Loketten",
      authIntro:
        "Vertrouw nooit blind op één nationaal loket als bureaus en lokale partijen onderling verweven zijn, en betaal geen voorafgaande advieskosten als je loon is gestolen. Gebruik altijd ook de grensoverschrijdende 1-Europa kanalen (Europees Parlement PETI, ELA, België SIOD, Duitsland Zoll) om een EU-breed vacatureverbod af te dwingen.",
      cautionBannerTitle: "WAARSCHUWING VOOR PASSIEVE OF GELDVRAGENDE LOKETTEN:",
      cautionBannerBody:
        "Intern alleen klagen houdt corrupte bureaus vaak in leven omdat ze te veel verdienen. Als een bureau, advocaat of lokaal loket geld vraagt vóór hulp of je afscheept: bewaar alles en escaleer collectief naar België (SIOD), Duitsland (Zoll), ELA en het Europees Parlement (PETI) om hun wervingsvergunning in heel Europa te blokkeren.",
      primaryBadge: "Hoofdinstantie",
    },
    objection: {
      eyebrow: "02 · Pak Je Geld Terug · Privé Sommatiebrief / Bezwaar Generator",
      heading:
        "Genereer Direct Een Formele Sommatiebrief (Eis Je Loon, Brandstof & Vakantie-uren Terug)",
      intro:
        "Met een schriftelijk bezwaar behoud je direct je recht op wettelijke rente en tot 50% wettelijke verhoging (art. 7:625 BW). Alles blijft 100% privé in jouw browser — niets wordt opgeslagen.",
      disputeTypeLabel: "Wat Wil Je Terugvorderen?",
      combinedOption: "Looninhouding + 2-Maands Brandstof Terugvorderen",
      wageOption: "Terugwerkende Looninhouding Terugvorderen",
      fuelOption: "Teruggevorderde Brandstof- / Reiskosten Terugvorderen",
      advMinusOption: "Valse Min-Vakantie-uren Schrappen & ADV-uren Eisen",
      benchedOption: "Geen Planning / Bellen Genegeerd: Garantie-uren & Eigen Spullen Eisen",
      letterLangLabel: "Taal van de Brief",
      bilingualBtn: "Engels + NL Recht",
      nlBtn: "Nederlands (NL)",
      workerLabel: "Jouw Naam (Alleen Lokaal)",
      workerPlaceholder: "Jouw volledige naam",
      agencyLabel: "Uitzendbureau (Alleen Lokaal)",
      agencyPlaceholder: "Uitzendbureau B.V.",
      weeksLabel: "Weken Gewerkt",
      payslipDateLabel: "Loonstrook Datum / Week",
      payslipDatePlaceholder: "bijv. Week 46 / 2026-11-15",
      wageEurLabel: "Loon (€)",
      fuelEurLabel: "Brandstof (€)",
      deadlineLabel: "Termijn (Dagen)",
      previewTag: "Voorbeeld in Browser · Privé",
      previewNote:
        "Verstuur per e-mail + aangetekende brief of laat gratis checken door Het Juridisch Loket.",
      copyBtn: "Kopieer Brief",
      copiedBtn: "Gekopieerd ✓",
      downloadBtn: "Download .txt",
    },
    reports: {
      eyebrow: "03 · Gedocumenteerde Zaken & Zaakmeldingen",
      heading: "Openbaar Bewijsoverzicht & Eigen Zaak Toevoegen",
      intro:
        "Feitelijke zaken van werknemers met exacte eurobedragen in de min, tijdlijnen en vlaggen — exporteer elk dossier rechtstreeks voor Arbeidsinspectie, SNCU, Politie of advocaat.",
      searchPlaceholder:
        "Zoek op zaaknummer, bureau, regio of trefwoord...",
      allFilter: "Alle",
      emptyTitle: "Nog geen ingediende zaken in de database.",
      emptySub:
        "Alle getoonde bedragen zijn 100% echt — dien rechts het eerste gedocumenteerde dossier in om de terugvorderingsteller te starten.",
      sampleBadge: "Illustratief Voorbeeld",
      regionLabel: "Regio:",
      stageLabel: "Fase:",
      durationLabel: "Duur:",
      weeksSuffix: "wkn",
      disputedLabel: "Betwist:",
      timelineHeading: "Chronologische Tijdlijn",
      evidenceHeading: "Beschikbaar Bewijs",
      noEvidence: "Nog geen bewijsstukken aangevinkt.",
      authoritiesHeading: "Bevoegde Nederlandse Instanties",
      hideDetails: "Verberg Details",
      inspectTimeline: "Bekijk Tijdlijn & Bewijs",
      copyBrief: "Kopieer Dossier",
      copiedBrief: "Dossier Gekopieerd ✓",
      downloadTxt: "Download .txt",
      formTag: "Feitelijke Zaak Indienen",
      phaseBadge: "Voor Instanties & Rechter",
      formTitle: "Voeg Jouw Zaak Toe aan Het Bewijsportaal",
      formIntro:
        "Noteer controleerbare feiten, data en ingehouden eurobedragen. Jouw melding telt direct mee in het totaalbedrag en wordt exporteerbaar voor instanties.",
      gdprTitle: "AVG & Juridische Sterkte:",
      gdprBody:
        "Plaats geen privételefoonnummers, BSN-nummers of privéadressen. Noem wel de bureaunaam, afdeling/functierol, bedragen en data zodat jouw dossier juridisch waterdicht blijft.",
      titleLabel: "Zaaktitel *",
      titlePlaceholder:
        "bijv. Looninhouding met terugwerkende kracht toegepast na week 10",
      categoryLabel: "Categorie *",
      stageFieldLabel: "Fase *",
      weeksFieldLabel: "Weken Gewerkt",
      amountFieldLabel: "In de Min (€)",
      regionFieldLabel: "NL Regio",
      aliasLabel: "Rol / Pseudoniem (Optioneel)",
      aliasPlaceholder:
        "bijv. Technisch Specialist (Fase A) of Anonieme Werknemer",
      summaryLabel: "Feitelijke Samenvatting *",
      summaryPlaceholder:
        "Beschrijf de afgesproken voorwaarden, welk bedrag of recht werd afgepakt en wat het bureau schreef...",
      timelineLabel: "Chronologische Tijdlijn (Aanbevolen voor Advocaten)",
      timelinePlaceholder:
        "Week 1: Contract getekend en gestart.\nWeek 10: Terugwerkende inhouding op loonstrook.\nWeek 11: Schriftelijk bezwaar verstuurd met verzoek om berekening.",
      evidenceCheckHeading: "Bewijsstukken die je Offline Bewaart",
      vaultTitle: "Privé Bewijskluis Upload (Vercel Private Blob)",
      vaultDesc:
        "Upload loonstroken, contracten, bankafschriften of foto's van woongebreken (PDF, JPG, PNG, WebP · max 4,5 MB). Bestanden worden privé opgeslagen — zwart/blur altijd je BSN en gezichten.",
      uploadTypeLabel: "Type bewijsbestand",
      uploadFileLabel: "Kies bestand (max 4,5 MB)",
      uploadRedactedConfirm:
        "Ik bevestig dat BSN-nummers en gezichten onherkenbaar zijn gemaakt.",
      uploadErrorRedacted:
        "Bevestig eerst dat BSN en gezichten zijn verwijderd/geblurd.",
      uploadErrorGeneric: "Uploaden naar privékluis mislukt.",
      uploadBtn: "Bestand Uploaden",
      uploadingBtn: "Uploaden...",
      uploadMaxHint: "Max 5 bestanden per zaak · Privé opgeslagen",
      uploadRemoveBtn: "Verwijder",
      attachmentsHeading: "Geüploade Bestanden (Privékluis)",
      viewPrivateFileBtn: "Bekijk Bestand ↗",
      autoMatchHeading: "Gekoppelde Instanties voor Deze Categorie",
      privacyConfirm:
        "Ik bevestig dat deze melding feitelijk is en GEEN privételefoonnummers, BSN of privéadressen van individuen publiceert.",
      privacyError:
        "Bevestig eerst dat je melding feitelijk is en geen privégegevens bevat.",
      networkError:
        "Netwerkfout bij het opslaan van de melding. Probeer het opnieuw.",
      saveErrorFallback:
        "Kon melding niet opslaan. Controleer de verplichte velden.",
      successPrefix: "Opgeslagen als",
      successSuffix:
        "Je kunt het dossier nu direct kopiëren of downloaden uit het overzicht.",
      submitBtn: "Zaak Opslaan & Dossier Genereren",
      submittingBtn: "Gestructureerde Melding Opslaan...",
      minusBadgePrefix: "In de min:",
      agencySelectLabel: "Uitzendbureau (Optioneel)",
      agencySelectPlaceholder: "bijv. Charlie works, DIT & Larex, of ander bureau",
      corridorLabel: "EU-Corridor (Optioneel)",
      corridorPlaceholder: "bijv. RO / PL / HU / EU → NL",
      brusselsChannelsHeading: "Externe Brussel / EU Escalatiekanalen",
      flagBrusselsBtn: "Stem / Markeer Zaak",
      flaggedBrusselsBtn: "Gemarkeerd ✓",
    },
    agenciesDir: {
      addCta: "+ Nog een Bureau / Team Toevoegen",
      section1Eyebrow: "01 · Bureaus & Teams Gids",
      section1Title: "Kies een Bureau om de Teampagina te Bekijken",
      searchPlaceholder:
        "Zoek op bureaunaam, stad, sector of teamlid...",
      allBtn: "Alle",
      withPhotosBtn: "Met Foto's",
      emptyTitle: "Geen overeenkomende bureaus gevonden.",
      emptySub: "Wis het filter om alle vastgelegde bureaus weer te geven.",
      profilesSingular: "Profiel",
      profilesPlural: "Profielen",
      photoRosterBadge: "Foto-overzicht",
      scamCheckLabel: "Check voor Fraudepreventie & Contract",
      previewLabel: "Teamleden & Rollen Overzicht",
      noMembersYet: "Nog geen teamprofielen toegevoegd.",
      linkedInSearchBtn: "LinkedIn Zoeken ↗",
      siteRegistryBtn: "Site / Register ↗",
      openPageBtn: "Open Aparte Bureaupagina →",
      formEyebrow: "Samenwerken · Meerdere Bureaus",
      formBadge: "Maakt /agencies/[slug]",
      formTitle: "Voeg Nog een Bureau & Teampagina Toe",
      formIntro:
        "Ervaring met een ander Nederlands uitzendbureau? Voeg het bureauprofiel en optioneel een eerste teamrol toe om een aparte visualisatiepagina aan te maken en andere werknemers te helpen.",
      guardrailTitle: "Feitelijke & Anti-Laster Norm:",
      guardrailBody:
        "Noteer alleen controleerbare bureaufeiten, officiële registers en openbare of rolgebaseerde gegevens (bijv. 'Salarisadministratie'). Publiceer nooit privételefoonnummers of onbewezen strafrechtelijke aantijgingen.",
      nameLabel: "Naam Uitzendbureau *",
      namePlaceholder: "bijv. Randstad / Tempo-Team / Lokaal Flex B.V.",
      hqLabel: "Hoofdkantoor / NL Regio *",
      hqPlaceholder: "bijv. Rotterdam, Zuid-Holland",
      websiteLabel: "Officiële Website (Optioneel)",
      sectorsLabel: "Sectoren (Kommagescheiden)",
      sectorsPlaceholder: "Logistiek, Tuinbouw, Techniek",
      hubsLabel: "Vestigingen / Kantoren",
      hubsPlaceholder: "Den Haag, Polen, Roemenië",
      emailLabel: "Openbaar Kantoor E-mail (Optioneel)",
      phoneLabel: "Openbaar Kantoor Telefoon (Optioneel)",
      scamFocusLabel: "Fraudepreventie & Verificatienotitie *",
      scamFocusPlaceholder:
        "bijv. Controleer KvK Waadi-registratie, leg uurloon schriftelijk vast en check SNF-certificaat vóór betaling van borg of ondertekening.",
      optionalMemberHeading: "Optioneel Eerste Teamlid / Rol",
      memberNamePlaceholder: "Rol of openbare contactnaam",
      memberRolePlaceholder: "Functie (bijv. Recruiter / Payroll)",
      memberScopePlaceholder: "Korte feitelijke toelichting (optioneel)",
      unit1Option: "Unit 01 · Regio- & Accountmanagement",
      unit2Option: "Unit 02 · Internationale Werving",
      unit3Option: "Unit 03 · Operatie, Salaris & Huisvesting",
      confirmLabel:
        "Ik bevestig dat deze invoer alleen feitelijke verificatie-informatie bevat en GEEN privételefoonnummers of lasterlijke beweringen.",
      confirmError:
        "Bevestig eerst dat je invoer feitelijk en niet-lasterlijk is en geen privégegevens bevat.",
      networkError: "Netwerkfout bij het opslaan van het bureauprofiel.",
      saveError: "Kon bureau niet toevoegen aan de gids.",
      createdTitle: "toegevoegd aan de bureausgids!",
      createdLink: "Open Aparte Bureaupagina voor",
      submitBtn: "Maak Aparte Bureaupagina Aan",
      submittingBtn: "Bureaupagina Aanmaken...",
      sliderEyebrow: "02 · Samenwerkende Warehouses & Opdrachtgevers (Inleners)",
      sliderTitle:
        "Bedrijven & Magazijnen Waar Nederlandse Uitzendbureaus Personeel Plaatsen",
      sliderIntro:
        "Verken logistieke centra, magazijnen en opdrachtgevers (zoals Fetim Group in Amsterdam en Paxon nabij Rotterdam) om bedrijfswebsites en verplichte inlenersbeloning (Waadi art. 8) te controleren.",
      sliderFilterAll: "Alle",
      sliderPrevLabel: "Vorige bedrijven",
      sliderNextLabel: "Volgende bedrijven",
      companySiteBtn: "Website",
      sliderNote:
        "Feitelijk overzicht van logistieke en operationele opdrachtgevers in Nederland voor controle van loonschalen en reiskosten (inlenersbeloning); vermelding betekent geen beschuldiging tegen het bedrijf zelf.",
    },
    agencyVisualizer: {
      allAgencies: "Alle Bureaus",
      addAnotherAgency: "+ Nog een Bureau Toevoegen",
      dedicatedBadge: "Aparte Bureaupagina",
      backRedFlags: "← Rode Vlaggen & Controle op Hoofdportaal",
      bannerTag: "NEDERLANDS UITZENDBUREAU PROFIEL · ORG-OVERZICHT",
      profilesWord: "Teamprofielen",
      unitsWord: "Afdelingsunits",
      agencyTypeBadge: "Uitzendbureau",
      searchLinkedInTeam: "Zoek Team op LinkedIn ↗",
      officialWebsiteBtn: "Officiële Website / KvK ↗",
      verifyRegistriesBtn: "Check Waadi / SNA / SNF →",
      hqLabel: "Hoofdkantoor",
      hubsLabel: "Wervingslocaties",
      sectorsLabel: "Kernsectoren",
      contactLabel: "Openbaar Contact",
      scamFocusTitle: "Focus op Fraudepreventie:",
      factualTitle: "Feitelijke Profielstandaard:",
      factualBody:
        "Openbare functietitels zijn gebaseerd op publieke bedrijfsvermeldingen; niet-bevestigde rollen blijven gemarkeerd als Neutraal · Functie Onbevestigd in plaats van gegokt.",
      sec2Eyebrow: "01 · Mensen & Profielen in LinkedIn-stijl",
      sec2TitleSuffix: "Teamoverzicht",
      ofWord: "van",
      sec2Intro:
        "Visuele profielkaarten met aangeleverde foto's, bekende openbare functies, directe LinkedIn-zoekknoppen en links naar de relevante rechten- en controlegids.",
      toggleAddRoleShow: "+ Rol / Contact Toevoegen aan Dit Bureau",
      toggleAddRoleHide: "Verberg Formulier Rol Toevoegen",
      addRoleHeading: "Voeg een Teamrol Toe aan",
      addRoleSub:
        "Voeg openbaar verifieerbare rollen of afdelingsdesks toe (zoals 'Salarisadministratie', 'Woonbeheerder') voor betere transparantie.",
      roleNameLabel: "Naam of Desklabel *",
      roleNamePlaceholder: "bijv. Wervingsdesk NL",
      roleTitleLabel: "Functie / Rol *",
      roleTitlePlaceholder: "bijv. Wooncoördinator",
      roleUnitLabel: "Afdelingsunit *",
      roleLocationLabel: "Kantoor / Locatie",
      roleLocationPlaceholder: "bijv. Den Haag, NL",
      roleSummaryLabel: "Feitelijke Taakomschrijving / Controlepunt *",
      roleSummaryPlaceholder:
        "Beschrijf welke contracten, uren of woonzaken deze rol behandelt en wat je zwart-op-wit moet vragen...",
      roleSourceLabel: "Openbare Bronvermelding (Optioneel)",
      roleSourcePlaceholder:
        "bijv. Vermeld op bureauwebsite / LinkedIn-bedrijfspagina",
      roleConfirm:
        "Ik bevestig dat deze invoer feitelijk is en geen privételefoonnummers of lasterlijke uitingen bevat.",
      roleConfirmError:
        "Bevestig eerst dat deze teamvermelding feitelijk is en geen privégegevens of laster bevat.",
      roleSubmit: "Rol Opslaan in Teamoverzicht",
      roleSubmitting: "Opslaan...",
      filterPlaceholder:
        "Filter op naam, functie, locatie of afdeling...",
      filterAll: "Alle",
      filterVerified: "Openbare Functie",
      filterUnverified: "Neutraal / Onbevestigd",
      filterMgmt: "Regio Mgmt",
      filterRecruit: "Werving",
      filterOps: "Operatie",
      emptyFiltered: "Geen teamprofielen gevonden met dit filter.",
      resetFilters: "Filters Wissen",
      zoomPhoto: "Vergroot Foto",
      relatedGuideLabel: "Bijbehorende Rechten- & Controlegids",
      closeBtn: "Sluiten ✕",
    },
  },
  en: {
    navbar: {
      subtitle: "Community Platform · Stop Exploitation",
      spotlight: "Teams & Quiz",
      community: "Votes & Comments",
      schematic: "Explain & Prove",
      verify: "Red Flags",
      agencies: "Agencies & Teams",
      agenciesMobile: "Agencies",
      lawyer: "Institutes",
      objection: "Money Back Letter",
      reports: "Reports",
      phaseBadge: "Community · Not a Company",
      logCase: "Log a Case",
    },
    footer: {
      mainTitle:
        "WerkRecht NL · Open Community Worker-Protection Platform (Not a Company)",
      mainDesc:
        "Independent community evidence platform — not a company, not a staffing agency, and not formal legal advice. We highlight corrupt agency patterns, collect votes & comments, and route proof straight to Arbeidsinspectie, SNCU, SNF, Politie, courts & Brussels.",
      agenciesTitle:
        "WerkRecht NL · Community Staffing Agency Transparency Directory",
      agenciesDesc:
        "Factual reference directory helping workers inspect agency teams, avoid traps, and document official violations.",
      agencyDetailDesc:
        "Factual reference overview based on public corporate records; unconfirmed roles remain neutral.",
      agenciesLink: "Agencies & Teams Directory",
      backPortal: "← Main Portal",
      allAgencies: "← All Agencies",
      redFlagsLink: "Red Flags",
      phaseNote: "Community Evidence Platform · NL & EU",
    },
    home: {
      notCompanyPill:
        "Not a Company · Open Community Platform Forcing Agencies to Be Fair",
      eyebrow: "Stop Wage Theft, Onboarding Lies & Rising Street Crime Across Europe",
      h1Prefix: "Take back your ",
      h1Highlight: "money, rights & human dignity",
      h1Suffix: ".",
      introBefore:
        "Expose corrupt agency teams & practices, explain & prove what happened, collect votes and comments, and escalate straight to ",
      introAnd: ".",
      valuesBadges: [
        "1. Human Needs First",
        "2. Take Your Money Back",
        "3. Take Your Rights Back",
        "4. Explain, Prove & Sue Them",
      ],
      ctaPrimary: "Check Agency Teams & Confirm Violations",
      ctaSecondary: "Take Money Back (Demand Letter)",
      ctaCommunity: "Community Polls, Comments & Official Forms",
      crisisBannerTitle: "PROVEN FIELD REALITY · WHY THIS FUELS CRIME ACROSS EUROPE:",
      crisisBannerBody:
        "It happens on the streets right now: when temp agencies withhold earned wages, force holiday hours into minus, or dump recruited workers on the street with €0, no food, and no ticket home, desperate people are pushed into breaking the law just to survive. Stopping corrupt agencies protects human needs AND reduces preventable crime across Europe.",
      emergencyStripLabel: "Urgent Human Aid (Food, Shelter, Legal Aid, Police):",
      emergencyStripLinks: [
        {
          label: "Red Cross NL Food Aid ↗",
          href: "https://www.rodekruis.nl/onderwerpen/voedselhulp-in-nederland/",
        },
        {
          label: "Food Banks NL ↗",
          href: "https://voedselbankennederland.nl",
        },
        {
          label: "FairWork (Multilingual) ↗",
          href: "https://www.fairwork.nu/",
        },
        {
          label: "Het Juridisch Loket ↗",
          href: "https://www.juridischloket.nl/",
        },
        {
          label: "Politie (Threats / Street Crisis) ↗",
          href: "https://www.politie.nl/aangifte-of-melding-doen",
        },
      ],
      cardHeader: "4-Step Fix: Needs, Money, Rights & Proof",
      gdprBadge: "Community · Not a Company",
      stat1Label: "STEP 01 · HUMAN NEEDS FIRST",
      stat1Value: "Food, Safe Roof & Zero Eviction Threats",
      stat1Sub:
        "End rat/mold rooms, eviction blackmail & dumping workers on streets with €0 (which drives desperation & crime)",
      stat2Label: "STEP 02 · TAKE YOUR MONEY BACK",
      stat2Value: "100% Wages, Fuel & ADV",
      stat2Sub:
        "Reclaim retroactive pay cuts, 2-month fuel clawbacks, fake minus vakantie-uren & unpaid guarantee hours (+50% penalty)",
      stat3Label: "STEP 03 · TAKE YOUR RIGHTS BACK",
      stat3Value: "Equal Pay & Honest Onboarding",
      stat3Sub:
        "Agencies must guide & instruct newcomers from abroad at the onboarding office—never lie, trap, or force personal tools",
      stat4Label: "STEP 04 · EXPLAIN, PROVE & SUE",
      stat4Value: "Apply to Police, Inspectors & Court",
      stat4Sub:
        "Answer confirmation questions, add community votes & comments, and file straight with Arbeidsinspectie, SNCU, SNF, Politie & EU",
      principleLabel: "PLATFORM PURPOSE:",
      principleBody:
        "Not a business—just worker solidarity and undeniable proof: we highlight corrupt agency departments and practices to force fairness and send ready-made dossiers & forms straight to official institutes.",
    },
    agencySpotlight: {
      eyebrow: "01 · Visualize Agency Teams, Corrupt Patterns & Confirmation Questions",
      heading:
        "See Agency Departments & Teams — Why to Avoid Traps & Confirm If It Happens to You",
      intro:
        "Visualize how staffing agencies are structured, see which departments trigger wage theft, onboarding lies, or street abandonment (and why to avoid them), then answer the 6 confirmation questions below to verify your own case.",
      fullDirCta: "All Agencies & Full Org Maps →",
      agencySelectorLabel: "Select an agency to inspect its teams & red flags:",
      flagAgencyBtn: "Flag Corrupt Pattern at This Agency",
      flaggedAgencyBtn: "Flagged for Official Investigation ✓",
      flagsLabel: "Community flags",
      profilesLabel: "Team profiles",
      openFullPage: "Open Full Agency Org Page & Photos →",
      whyAvoidHeading: "Why Watch Out & How Each Department Traps Workers:",
      deptWarnings: [
        {
          deptKey: "recruitment",
          badge: "RECRUITMENT & ONBOARDING OFFICE",
          whyTitle: "Why onboarding deception starts here",
          whyText:
            "Workers recruited from abroad are promised high wages and full guidance, then rushed to sign untranslated Dutch terms at the onboarding office while deductions are hidden.",
          avoidTip:
            "Do not sign under pressure without Dutch + translated pay, housing & fuel rules in writing.",
        },
        {
          deptKey: "regional-management",
          badge: "COORDINATION & PLANNING DESK",
          whyTitle: "Why abandonment pushes people onto streets",
          whyText:
            "Planning ignores calls, stops shifts without paying guaranteed hours while rent debt grows, or dumps workers with €0—directly causing hunger and rising street crime in Europe.",
          avoidTip:
            "Send written availability immediately ('beschikbaar voor werk', BW Art. 7:628) and save call logs.",
        },
        {
          deptKey: "operations-staff",
          badge: "PAYROLL, TRANSPORT & HOUSING DESKS",
          whyTitle: "Why earned money is taken away",
          whyText:
            "After weeks/months, payroll claws back wages or 2-month fuel as an 'internal error', pushes vakantie-uren into minus instead of ADV, or deducts rent for rat-infested housing.",
          avoidTip:
            "Keep every weekly payslip from Week 1 and send a written objection right away (up to 50% late-pay uplift).",
        },
      ],
      rosterSubheading: "Indexed Team Members & Public Corporate Roles",
      rosterNote:
        "Compiled from public corporate records and workspace photos. Unconfirmed job titles remain neutral; focus stays on verifiable department patterns and worker protection.",
      zoomBtn: "Zoom",
      quizEyebrow: "02 · Ask These Questions to Confirm (Do They Do This or Not?)",
      quizHeading:
        "Answer These 6 Questions to Confirm If Your Agency Is Violating the Law",
      quizIntro:
        "Select YES or NO for each question. You will instantly see WHY it is unlawful, WHAT proof you need to sue or report them, and 1-click buttons to reclaim your money.",
      yesBtn: "YES, they do this",
      noBtn: "NO",
      unsureBtn: "Not sure",
      resetQuizBtn: "Reset answers",
      whyIllegalLabel: "Why this is unlawful & basis to sue/report:",
      proofNeededLabel: "Proof to keep for inspectors & court:",
      verdictTitle: "Your Confirmation Result & Next Action",
      verdictClear:
        "No red flags marked yet. Always keep copies of your weekly payslips, signed contract, and fuel/transport receipts.",
      verdictWarn:
        "Warning: 1–2 violations confirmed. Demand written explanation and send a formal objection letter before more pay is deducted.",
      verdictCritical:
        "CRITICAL: Multiple serious violations confirmed! You have clear legal grounds to reclaim your money and sue/report them via SNCU, Arbeidsinspectie, Politie & employment counsel.",
      confirmedCountSuffix: "of 6 violations confirmed",
      sendToTallyBtn: "Confirm & Add to Community Evidence Tally",
      sentToTallyBtn: "Added to Community Tally ✓",
      draftDemandFromQuizBtn: "Generate Money-Back Demand Letter →",
      logCaseFromQuizBtn: "Pre-Fill Case Report & Brief →",
      questions: [
        {
          id: "q-onboarding",
          disputeType: "combined",
          category: "recruitment",
          stage: "recruitment",
          question:
            "1. Did recruiters promise better pay or proper guidance abroad, while the onboarding office rushed you without clear instructions, translation, or full written terms?",
          whyIllegal:
            "Breach of BW Art. 7:655 & EU Directive 2019/1152. Agencies bringing people from abroad must guide and instruct them honestly—not lie and trap them.",
          proof:
            "Job ad screenshots, recruiter chat messages before travel, and the late/untranslated contract.",
        },
        {
          id: "q-clawback",
          disputeType: "combined",
          category: "transport-fuel",
          stage: "payroll",
          question:
            "2. Did they pay an hourly rate or commute fuel for weeks/months and then claw money back from net wages claiming an 'internal mistake'?",
          whyIllegal:
            "Unlawful wage set-off (BW Art. 7:632), breach of good employership (BW Art. 7:611), and WAS minimum-wage protection.",
          proof:
            "Consecutive payslips showing prior payments + the negative deduction line, fuel receipts, and bank transfers.",
        },
        {
          id: "q-adv-minus",
          disputeType: "adv-holiday-minus",
          category: "contract-cao",
          stage: "payroll",
          question:
            "3. Did payroll put your statutory vakantie-uren into minus instead of using ADV hours, or claim you owe money if you leave?",
          whyIllegal:
            "Violates BW Art. 7:638 (holiday hours cannot be forced negative unilaterally), BW Art. 7:628 (employer risk), and ABU/NBBU CAO parity.",
          proof:
            "Weekly payslips showing negative vakantie-uren, host-company schedules, and your written objection.",
        },
        {
          id: "q-ignored-gear",
          disputeType: "benched-guarantee-hours",
          category: "hours-overtime",
          stage: "coordination",
          question:
            "4. Are they ignoring your calls, leaving you in agency housing with zero shifts and unpaid guaranteed hours while rent runs on—or forcing you to use your own car, phone, or tools?",
          whyIllegal:
            "BW Art. 7:628 obliges full guaranteed-hours pay when you stay available. Arbowet mandates free employer-provided PPE and work gear.",
          proof:
            "Unanswered call/WhatsApp logs, written availability notice ('beschikbaar voor werk'), and receipts for personal gear.",
        },
        {
          id: "q-housing-street",
          disputeType: "combined",
          category: "accommodation-snf",
          stage: "accommodation",
          question:
            "5. Are you in unsafe/rat-infested housing (>25% rent deduction without SNF), or are workers being left/dumped on the street with €0?",
          whyIllegal:
            "Violates SNF-norm & WAS 25% cap. Dumping recruited workers on foreign streets with €0 fuels hunger, despair, and rising street criminality across Europe.",
          proof:
            "Timestamped condition photos/videos (no faces), ignored repair messages, rent lines on payslips.",
        },
        {
          id: "q-threats-finalpay",
          disputeType: "wage-clawback",
          category: "wage-deduction",
          stage: "escalation",
          question:
            "6. Are you facing discrimination/unequal treatment, threats, passport withholding, or withheld final settlement / vakantiegeld?",
          whyIllegal:
            "Criminal coercion/fraud (Politie), anti-discrimination law, plus up to 50% statutory late-pay penalty (BW Art. 7:625).",
          proof:
            "Saved messages/recordings, final payslip, and witness notes for Politie, Arbeidsinspectie & counsel.",
        },
      ],
    },
    europeSpotlight: {
      poll1Title: "Poll 1 · Which Abuse Must Official Institutes Stop First?",
      poll2Title: "Poll 2 · National & Cross-Border Action (NL / BE / DE)",
      poll3Title: "Poll 3 · European Parliament & Brussels Action (1 Europe)",
      pollTotalVotes: "votes",
      pollVotedTag: "Your vote recorded ✓",
      pollHint: "Click an option to vote (saved to the collective institute dossier).",
      redFlagPollOptions: [
        {
          id: "retroactive-wage",
          label: "Retroactive wage clawbacks / 'internal error' payslip cuts",
        },
        {
          id: "fuel-clawback",
          label: "2-month commute fuel / transport allowance clawbacks",
        },
        {
          id: "adv-holiday-minus",
          label: "Vakantie-uren put on minus instead of ADV hours to force work",
        },
        {
          id: "unpaid-guarantee-benched",
          label: "No planning, calls ignored in housing & forced personal gear",
        },
        {
          id: "street-abandonment",
          label: "Dumped on street with €0 — fueling hunger, despair & rising crime",
        },
        {
          id: "contract-bait-switch",
          label: "Onboarding office lies & lower pay scale vs. job offer",
        },
        {
          id: "snf-housing",
          label: "Substandard SNF housing (rats/mold) / >25% rent deduction",
        },
        {
          id: "withheld-final-pay",
          label: "Withheld final settlement / vakantiegeld after disputing",
        },
        {
          id: "discrimination-unequal-treatment",
          label: "Racism, discrimination, or unequal treatment by origin",
        },
      ],
      institutePollOptions: [
        {
          id: "arbeidsinspectie-audit",
          label: "Nederlandse Arbeidsinspectie · Wage theft & fraud inspection + fines",
        },
        {
          id: "sncu-cao-audit",
          label: "SNCU · CAO parity audit (inlenersbeloning, ADV) & repayment order",
        },
        {
          id: "snf-housing-audit",
          label: "SNF & Municipality · Housing inspection & license revocation",
        },
        {
          id: "politie-fraud-report",
          label: "Politie · Criminal fraud, coercion & street-abandonment crisis",
        },
        {
          id: "collective-lawsuit",
          label: "Court / Employment Counsel · Collective wage recovery lawsuit",
        },
      ],
      brusselsPollOptions: [
        {
          id: "ela-inspection",
          label: "Request ELA joint cross-border labor inspection",
        },
        {
          id: "eu-commission-complaint",
          label: "File European Commission EU law breach complaint",
        },
        {
          id: "ep-peti-petition",
          label:
            "European Parliament (PETI) · Ban their job offers & expel corrupt agencies from EU",
        },
        {
          id: "solvit-network",
          label: "Escalate cross-border EU rights via SOLVIT",
        },
      ],
      commentsEyebrow: "Community Comments & Worker Voices (Fed Into Official Dossiers)",
      commentsTitle: "Share What Happened & Confirm Each Other's Cases",
      commentsIntro:
        "Read community warnings, click '+ Confirm (Happened to me too)' on patterns you recognize, and post your own factual comment so official institutes see collective evidence.",
      commentFilterAll: "All",
      commentsEmptyTitle: "No community comments posted yet.",
      commentsEmptySub:
        "Be the first to share what happened at your staffing agency on the right so other workers can confirm it.",
      commentConfirmBtn: "Happened to me too / Confirm",
      commentConfirmedBtn: "Confirmed ✓",
      commentSampleBadge: "Sample",
      commentFormTitle: "Add Your Community Comment / Warning",
      commentAgencyLabel: "Agency / Scope",
      commentTopicLabel: "Topic",
      commentCorridorLabel: "Corridor / Country (Optional)",
      commentCorridorPlaceholder: "e.g. RO / HU / PL → NL",
      commentAliasLabel: "Role / Alias (Optional)",
      commentAliasPlaceholder: "e.g. Technical Worker or Anonymous",
      commentBodyLabel: "What happened / Why warn others? *",
      commentBodyPlaceholder:
        "Share factual details about onboarding lies, payslips, fuel deductions, ignored calls, or housing (no private phone numbers)...",
      commentGdprLabel:
        "I confirm this comment states factual events and does NOT publish private phone numbers or home addresses of individuals.",
      commentGdprError:
        "Please confirm your comment is factual and omits private phone numbers or addresses.",
      commentSubmitBtn: "Post Comment to Community Evidence",
      commentSubmittingBtn: "Saving...",
      commentSuccess: "Comment saved and included in collective institute dossiers ✓",
      commentNetworkError: "Network error while saving comment.",
    },
    stage: {
      eyebrow: "06 · Explain & Prove · End-to-End Employment Lifecycle Schematic",
      heading: "Understand Exactly How They Trick Workers — and What Proof Beats Them",
      intro:
        "Every dispute with a Dutch staffing agency happens at one or more of these 6 stages—from fake recruitment offers and rushed onboarding to planning, fuel clawbacks, payslips, and housing. Click any stage to inspect the exact law, red flags, and evidence to sue them.",
      stagePrefix: "STAGE",
      blueprintTitle: "Inspection Blueprint · Stage",
      lawHeading: "Applicable Dutch Law / Standard",
      evidenceHeading: "Evidence to Preserve",
      verifyHeading: "What Workers Should Verify",
      redFlagsHeading: "Red Flags to Prove & Escalate",
    },
    verify: {
      eyebrow: "05 · Keep All Red Flags to Sue Them",
      heading: "Department Red Flags (Proof to Sue Them)",
      intro:
        "Workers traveling from abroad shouldn't have to run heavy pre-application bureaucracy checks before even applying: it is the agency's and onboarding office's duty to guide, instruct, translate, and protect people—and NOT lie or steal. Keep every red flag below so you can sue them and report to authorities.",
      ctaTitle: "Browse Agencies, Teams & Org Maps",
      ctaSub: "Compare agency teams & expose patterns together →",
      demandLabel: "Proof to Sue / Report",
      routeLabel: "Report & File With:",
    },
    lawyer: {
      authEyebrow: "07 · Official Cross-Border & National Institutes (NL · BE · DE · EU)",
      authHeading: "Apply Across 1 Europe — Beware Passive or Fee-Charging Desks",
      authIntro:
        "Internal domestic complaints alone will never force repeat offenders out of Europe when local networks protect each other or advisors demand fees from unpaid workers. Always escalate in parallel across NL, Belgium (SIOD), Germany (Zoll), ELA, and the European Parliament (PETI) to ban their job offers across the EU.",
      cautionBannerTitle: "COMMUNITY WARNING · AVOID CORRUPT OR FEE-CHARGING INTERMEDIARIES:",
      cautionBannerBody:
        "Never pay upfront fees to desks or intermediaries while your wages are stolen, and do not stop at one slow local desk. Escalate externally to European Parliament (PETI), ELA, European Commission, Belgium SIOD, and Germany Zoll FKS so repeat-offender agencies lose their permits and job-posting rights across Europe.",
      primaryBadge: "Primary Body",
    },
    objection: {
      eyebrow: "02 · Take Your Money Back · Private Demand Letter Generator",
      heading:
        "Draft a Formal Dutch Wage, Fuel & Holiday-Hours Demand Letter (Sommatiebrief)",
      intro:
        "Sending a written demand preserves your right to statutory interest and up to 50% late-payment uplift (BW Art. 7:625). Everything stays 100% private in your browser—nothing is uploaded.",
      disputeTypeLabel: "What Are You Claiming Back?",
      combinedOption: "Combined Wage + 2-Month Fuel Clawback",
      wageOption: "Retroactive Salary Deduction Only",
      fuelOption: "Retroactive Fuel / Transport Clawback Only",
      advMinusOption: "Remove Fake Negative Vakantie-uren & Apply ADV Hours",
      benchedOption: "No Planning / Ignored Calls: Claim Guarantee Hours & Personal Gear",
      letterLangLabel: "Draft Language",
      bilingualBtn: "English + NL Law",
      nlBtn: "Nederlands (NL)",
      workerLabel: "Your Name (Local Only)",
      workerPlaceholder: "Your full name",
      agencyLabel: "Employer / Agency (Local Only)",
      agencyPlaceholder: "Agency B.V.",
      weeksLabel: "Weeks Worked",
      payslipDateLabel: "Payslip Date / Week",
      payslipDatePlaceholder: "e.g. Week 46 / 2026-11-15",
      wageEurLabel: "Wage (€)",
      fuelEurLabel: "Fuel (€)",
      deadlineLabel: "Deadline (Days)",
      previewTag: "Client-Side Preview · Private",
      previewNote:
        "Send by email + registered post (aangetekende brief) or review free with Het Juridisch Loket.",
      copyBtn: "Copy Letter",
      copiedBtn: "Copied ✓",
      downloadBtn: "Download .txt",
    },
    reports: {
      eyebrow: "03 · Documented Cases & Case Submission",
      heading: "Worker Case Feed & Legal Dossier Builder",
      intro:
        "Factual case logs showing exact withheld euro totals, timelines, and community flags—ready to copy or download for Dutch authorities, Politie, and lawyers.",
      searchPlaceholder:
        "Search by case reference, agency, region, or keyword...",
      allFilter: "All",
      emptyTitle: "No real user cases filed in the database yet.",
      emptySub:
        "Zero fake numbers are shown—submit the first documented case on the right to start the real reimbursement ledger.",
      sampleBadge: "Illustrative Sample",
      regionLabel: "Region:",
      stageLabel: "Stage:",
      durationLabel: "Duration:",
      weeksSuffix: "wks",
      disputedLabel: "Disputed:",
      timelineHeading: "Chronological Timeline",
      evidenceHeading: "Supporting Proof Ready",
      noEvidence: "No offline evidence checklist selected yet.",
      authoritiesHeading: "Competent Dutch Escalation Channels",
      hideDetails: "Hide Details",
      inspectTimeline: "Inspect Timeline & Proof",
      copyBrief: "Copy Lawyer Brief",
      copiedBrief: "Copied Brief ✓",
      downloadTxt: "Download .txt",
      formTag: "Submit Factual Case",
      phaseBadge: "For Institutes & Court",
      formTitle: "Add Your Case to the Community Proof Feed",
      formIntro:
        "Record verifiable facts, dates, and withheld euro sums. Saved cases feed the community loss total and export cleanly for regulators and counsel.",
      gdprTitle: "GDPR & Legal Strength:",
      gdprBody:
        "Do not publish private phone numbers, BSNs, or home addresses. State the agency name, department/role, exact dates, and amounts so your case remains legally airtight.",
      titleLabel: "Case Headline *",
      titlePlaceholder:
        "e.g., Retroactive salary deduction applied after Week 10",
      categoryLabel: "Issue Category *",
      stageFieldLabel: "Lifecycle Stage *",
      weeksFieldLabel: "Weeks Worked",
      amountFieldLabel: "On Minus / Stolen (€)",
      regionFieldLabel: "NL Region",
      aliasLabel: "Role / Pseudonym (Optional)",
      aliasPlaceholder:
        "e.g., Technical Worker (Phase A) or Anonymous Worker",
      summaryLabel: "Factual Summary *",
      summaryPlaceholder:
        "Describe promised terms, onboarding/pay violations, amounts deducted, and how the agency responded...",
      timelineLabel: "Chronological Timeline (Recommended for Lawyers)",
      timelinePlaceholder:
        "Week 1: Signed contract & started work.\nWeek 10: Retroactive deduction appeared on payslip.\nWeek 11: Sent written objection requesting itemized calculation.",
      evidenceCheckHeading: "Supporting Proof You Hold Offline",
      vaultTitle: "Private Evidence Vault Upload (Vercel Private Blob)",
      vaultDesc:
        "Upload redacted payslips, contracts, bank statements, or housing defect photos (PDF, JPG, PNG, WebP · max 4.5 MB). Files stay private—always blur/remove your BSN and faces.",
      uploadTypeLabel: "Evidence file type",
      uploadFileLabel: "Select file (max 4.5 MB)",
      uploadRedactedConfirm:
        "I confirm my BSN number and any third-party faces are redacted/blurred.",
      uploadErrorRedacted:
        "Please confirm BSN numbers and third-party faces are redacted before uploading.",
      uploadErrorGeneric: "Failed to upload file to private vault.",
      uploadBtn: "Upload Evidence File",
      uploadingBtn: "Uploading...",
      uploadMaxHint: "Up to 5 files per case · Stored privately",
      uploadRemoveBtn: "Remove",
      attachmentsHeading: "Uploaded Proof Files (Private Vault)",
      viewPrivateFileBtn: "Open File ↗",
      autoMatchHeading: "Matched Official Channels for This Category",
      privacyConfirm:
        "I confirm this report states factual events only and does NOT publish private phone numbers, BSNs, or home addresses of individuals.",
      privacyError:
        "Please confirm your report omits private phone numbers, BSNs, and home addresses.",
      networkError: "Network error while saving the report. Please try again.",
      saveErrorFallback: "Could not save report. Check required fields.",
      successPrefix: "Logged as",
      successSuffix:
        "You can now copy or download the lawyer-ready brief from the feed.",
      submitBtn: "Save Case & Generate Brief",
      submittingBtn: "Saving Structured Report...",
      minusBadgePrefix: "On minus:",
      agencySelectLabel: "Staffing Agency (Optional)",
      agencySelectPlaceholder: "e.g. Charlie works, DIT & Larex, or other agency",
      corridorLabel: "EU Corridor (Optional)",
      corridorPlaceholder: "e.g. RO / PL / HU / EU → NL",
      brusselsChannelsHeading: "External Brussels / EU Escalation Channels",
      flagBrusselsBtn: "Confirm / Flag Case",
      flaggedBrusselsBtn: "Confirmed ✓",
    },
    agenciesDir: {
      addCta: "+ Add Another Agency / Team",
      section1Eyebrow: "01 · Agency Team Directory",
      section1Title: "Select an Agency to View Its Team Page",
      searchPlaceholder: "Search agency name, city, sector, or team member...",
      allBtn: "All",
      withPhotosBtn: "With Photos",
      emptyTitle: "No matching agencies found.",
      emptySub: "Clear your filter to see all curated agencies.",
      profilesSingular: "Profile",
      profilesPlural: "Profiles",
      photoRosterBadge: "Photo Roster",
      scamCheckLabel: "Scam-Prevention & Contract Check",
      previewLabel: "Team Members & Roles Preview",
      noMembersYet: "No team profiles listed yet.",
      linkedInSearchBtn: "LinkedIn Search ↗",
      siteRegistryBtn: "Site / Registry ↗",
      openPageBtn: "Open Separate Agency Page →",
      formEyebrow: "Collaborate · Multi-Agency",
      formBadge: "Creates /agencies/[slug]",
      formTitle: "Add Another Agency & Team Page",
      formIntro:
        "Working across another Dutch uitzendbureau? Add its agency profile and optional initial team role to spin up a dedicated team visualization page and help workers verify legitimate entities vs. scams.",
      guardrailTitle: "Factual & Anti-Defamation Standard:",
      guardrailBody:
        "Record verifiable agency facts, official registry links, and public or role-based entries (e.g., 'Payroll Desk'). Never publish private phone numbers or unverified criminal accusations.",
      nameLabel: "Uitzendbureau / Agency Name *",
      namePlaceholder: "e.g., Randstad / Tempo-Team / Local Flex B.V.",
      hqLabel: "HQ City / NL Region *",
      hqPlaceholder: "e.g., Rotterdam, Zuid-Holland",
      websiteLabel: "Official Website (Optional)",
      sectorsLabel: "Sectors (Comma-separated)",
      sectorsPlaceholder: "Logistics, Horticulture, Tech",
      hubsLabel: "Offices / Hubs",
      hubsPlaceholder: "Den Haag, Poland, Romania",
      emailLabel: "Public Office Email (Optional)",
      phoneLabel: "Public Office Phone (Optional)",
      scamFocusLabel: "Scam-Prevention & Verification Note *",
      scamFocusPlaceholder:
        "e.g., Verify KvK Waadi registration, confirm written hourly rate & SNF housing status before paying deposits or signing.",
      optionalMemberHeading: "Optional First Team Role / Contact",
      memberNamePlaceholder: "Role or public contact name",
      memberRolePlaceholder: "Title (e.g., Recruiter / Payroll)",
      memberScopePlaceholder: "Short factual scope (optional)",
      unit1Option: "Unit 01 · Regional & Account Management",
      unit2Option: "Unit 02 · International Recruitment",
      unit3Option: "Unit 03 · Operations, Payroll & Housing",
      confirmLabel:
        "I confirm this entry uses factual verification data and does NOT include private phone numbers or defamatory allegations.",
      confirmError:
        "Please confirm your entry contains factual, non-defamatory verification info and omits private personal data.",
      networkError: "Network error while saving the agency entry.",
      saveError: "Could not add agency to the directory.",
      createdTitle: "added to the multi-agency directory!",
      createdLink: "Open Separate Page for",
      submitBtn: "Create Separate Agency Page",
      submittingBtn: "Creating Agency Page...",
      sliderEyebrow: "02 · Collaborating Warehouses & Host Companies (Inleners)",
      sliderTitle:
        "Warehouses & Companies Where Dutch Staffing Agencies Place Workers",
      sliderIntro:
        "Browse logistics centers, distribution hubs, and host companies (such as Fetim Group in Amsterdam and Paxon in the Rotterdam corridor) to verify official company sites and host-company pay parity (inlenersbeloning under Waadi Art. 8).",
      sliderFilterAll: "All",
      sliderPrevLabel: "Previous companies",
      sliderNextLabel: "Next companies",
      companySiteBtn: "Website",
      sliderNote:
        "Factual reference directory of Dutch host warehouses and logistics companies where agency placements occur so workers can verify CAO pay parity (inlenersbeloning)—inclusion does not imply wrongdoing by the host company.",
    },
    agencyVisualizer: {
      allAgencies: "All Agencies",
      addAnotherAgency: "+ Add Another Agency",
      dedicatedBadge: "Dedicated Agency Team Page",
      backRedFlags: "← Main Portal Red Flags & Verification",
      bannerTag: "DUTCH UITZENDBUREAU PROFILE · ORG VIEW",
      profilesWord: "Team Profiles",
      unitsWord: "Org Units",
      agencyTypeBadge: "Uitzendbureau",
      searchLinkedInTeam: "Search Team on LinkedIn ↗",
      officialWebsiteBtn: "Official Website / KvK ↗",
      verifyRegistriesBtn: "Verify Waadi / SNA / SNF →",
      hqLabel: "Headquarters",
      hubsLabel: "Recruitment Hubs",
      sectorsLabel: "Core Sectors",
      contactLabel: "Public Contact Line",
      scamFocusTitle: "Scam-Prevention Focus:",
      factualTitle: "Factual Directory Standard:",
      factualBody:
        "Public titles reflect open corporate records; unconfirmed roles remain marked Neutral · Title Unverified rather than guessed.",
      sec2Eyebrow: "01 · People & LinkedIn-Style Profiles",
      sec2TitleSuffix: "Team Roster",
      ofWord: "of",
      sec2Intro:
        "Visual profile cards combining photos (where provided), verified public titles where available, LinkedIn search links, and links to the matching rights guides.",
      toggleAddRoleShow: "+ Add Role / Contact to This Agency",
      toggleAddRoleHide: "Hide Add Team Role Form",
      addRoleHeading: "Contribute a Team Role to",
      addRoleSub:
        "Add publicly verifiable roles or department contacts (e.g. 'Payroll Desk', 'Housing Coordinator') to improve multi-team transparency.",
      roleNameLabel: "Name or Desk Label *",
      roleNamePlaceholder: "e.g., Recruitment Desk NL",
      roleTitleLabel: "Role / Title *",
      roleTitlePlaceholder: "e.g., Housing Coordinator",
      roleUnitLabel: "Org Unit *",
      roleLocationLabel: "Office / Location",
      roleLocationPlaceholder: "e.g., Den Haag, NL",
      roleSummaryLabel: "Factual Scope / Verification Note *",
      roleSummaryPlaceholder:
        "Describe what contracts, timesheets, or housing issues this role handles and what workers should verify in writing...",
      roleSourceLabel: "Public Source Reference (Optional)",
      roleSourcePlaceholder:
        "e.g., Listed on agency website / LinkedIn company page",
      roleConfirm:
        "I confirm this entry is factual and excludes private phone numbers or defamatory statements.",
      roleConfirmError:
        "Please confirm this team entry is factual and omits private personal phone numbers or defamatory claims.",
      roleSubmit: "Save Role to Agency Roster",
      roleSubmitting: "Saving...",
      filterPlaceholder: "Filter by name, role, location, or department...",
      filterAll: "All",
      filterVerified: "Public Role Listed",
      filterUnverified: "Neutral / Unverified",
      filterMgmt: "Regional Mgmt",
      filterRecruit: "Recruitment",
      filterOps: "Operations Roster",
      emptyFiltered: "No team profiles match your current filter.",
      resetFilters: "Reset Filters",
      zoomPhoto: "Zoom Photo",
      relatedGuideLabel: "Related Portal Verification Guide",
      closeBtn: "Close ✕",
    },
  },
} as const;
