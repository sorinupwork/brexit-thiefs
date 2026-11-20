export type AgencyDepartmentId =
  | "regional-management"
  | "recruitment"
  | "operations-staff";

export type AgencyRoleStatus = "verified" | "unverified";

export interface AgencyTeamMember {
  id: string;
  name: string;
  role: string;
  roleStatus: AgencyRoleStatus;
  roleBadgeLabel: string;
  departmentId: AgencyDepartmentId;
  departmentLabel: string;
  location: string;
  photoPath: string | null;
  photoAlt: string;
  objectPosition: string;
  headline: string;
  summary: string;
  sourceNote: string;
  linkedInSearchUrl: string;
  linkedInButtonLabel: string;
  relatedDisputeArea: string;
  portalHref: string;
  portalLinkLabel: string;
}

export interface AgencyDepartmentNode {
  id: AgencyDepartmentId;
  code: string;
  title: string;
  dutchLabel: string;
  location: string;
  accentClass: string;
  scope: string;
  redFlagFocus: string;
  whatToDocument: string[];
  portalStageHref: string;
  portalStageLabel: string;
  portalRedFlagHref: string;
  portalRedFlagLabel: string;
}

export interface AgencyRecord {
  id: string;
  slug: string;
  name: string;
  monogram: string;
  tagline: string;
  hqLocation: string;
  regionalHubs: string[];
  sectors: string[];
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  linkedInCompanySearchUrl: string;
  linkedInPeopleSearchUrl: string;
  scamPreventionFocus: string;
  registryChecklistNote: string;
  isSeeded?: boolean;
  createdAt: string;
  departments: AgencyDepartmentNode[];
  members: AgencyTeamMember[];
}

export interface AgencySubmissionInput {
  name: string;
  hqLocation: string;
  regionalHubs: string[];
  sectors: string[];
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  scamPreventionFocus: string;
  registryChecklistNote: string;
  initialMemberName?: string;
  initialMemberRole?: string;
  initialMemberDepartment?: AgencyDepartmentId;
  initialMemberSummary?: string;
}

export interface TeamMemberSubmissionInput {
  agencySlug: string;
  name: string;
  role: string;
  departmentId: AgencyDepartmentId;
  location: string;
  summary: string;
  sourceNote: string;
}

export interface DepartmentPortalBridge {
  department: string;
  stageCode: string;
  focus: string;
  lawRef: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function slugifyAgencyName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "agency";
}

export function makeAgencyMonogram(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "AG";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0].toLowerCase()}`;
}

export function buildDefaultDepartments(hqLocation: string): AgencyDepartmentNode[] {
  return [
    {
      id: "regional-management",
      code: "UNIT 01",
      title: "Regional & Account Management",
      dutchLabel: "Regio Management & Opdrachtgevers",
      location: hqLocation,
      accentClass: "border-sky-300 bg-sky-50/70 text-sky-900",
      scope:
        "Coordinates host-company (inlener) client accounts, regional staffing contracts, and placement continuity.",
      redFlagFocus:
        "Verify host-company pay parity (inlenersbeloning), exact CAO job classification, and written placement terms.",
      whatToDocument: [
        "Written host-company (inlener) job scale & hourly rate confirmation",
        "Signed placement confirmation (uitzendbevestiging) matching actual duties",
        "Any rate change or shift-schedule amendment in writing",
      ],
      portalStageHref: "/#schematic",
      portalStageLabel: "Inspect Stage 02 · Coordination",
      portalRedFlagHref: "/#verify-agency",
      portalRedFlagLabel: "Check Coordination Red Flags",
    },
    {
      id: "recruitment",
      code: "UNIT 02",
      title: "International Recruitment",
      dutchLabel: "Werving & Selectie (NL & EU)",
      location: "Netherlands & EU Recruitment Desks",
      accentClass: "border-[#D95D24]/40 bg-orange-50/70 text-orange-950",
      scope:
        "Sources and screens candidates, presents job offers, and guides workers through pre-arrival onboarding.",
      redFlagFocus:
        "Ensure advertised gross hourly wages, weekly hours, housing fees, and travel rules appear verbatim in the signed contract.",
      whatToDocument: [
        "Job ad screenshots and recruiter messages quoting gross/net pay",
        "Full Dutch + translated contract provided prior to traveling",
        "Written confirmation of weekly housing deductions & SNF status",
      ],
      portalStageHref: "/#schematic",
      portalStageLabel: "Inspect Stage 01 · Recruitment",
      portalRedFlagHref: "/#verify-agency",
      portalRedFlagLabel: "Check Recruitment Red Flags",
    },
    {
      id: "operations-staff",
      code: "UNIT 03",
      title: "Agency Operations & Featured Staff",
      dutchLabel: "Operationeel Team & Interne Staf",
      location: hqLocation,
      accentClass: "border-slate-300 bg-slate-100/80 text-slate-900",
      scope:
        "Internal agency staff supporting payroll, transport, planning, and housing operations. Unconfirmed titles remain neutral.",
      redFlagFocus:
        "Across payroll, transport, and housing desks, insist on itemized payslips, written consent before deductions, and SNF housing checks.",
      whatToDocument: [
        "Consecutive weekly payslips (loonstroken) and bank deposit statements",
        "Written transport/fuel policy before using agency cars or fuel cards",
        "Timestamped housing maintenance tickets (no staff photos in public reports)",
      ],
      portalStageHref: "/#lawyer-matrix",
      portalStageLabel: "View Legal Routing Matrix",
      portalRedFlagHref: "/#objection-letter",
      portalRedFlagLabel: "Draft Written Objection",
    },
  ];
}

export const DEPARTMENT_DISPUTE_BRIDGES: DepartmentPortalBridge[] = [
  {
    department: "Recruitment Desk",
    stageCode: "Stage 01",
    focus: "Written job offers, promised hourly rates, and zero unlawful recruitment fees.",
    lawRef: "BW Art. 7:655 · Waadi",
    primaryHref: "/#verify-agency",
    primaryLabel: "Recruitment Red Flags",
    secondaryHref: "/#schematic",
    secondaryLabel: "Stage 01 Guide",
  },
  {
    department: "Coordination & Planning",
    stageCode: "Stage 02",
    focus: "ABU/NBBU CAO phase, host-company pay parity (inlenersbeloning), and shift logs.",
    lawRef: "ABU/NBBU CAO · Waadi Art. 8",
    primaryHref: "/#verify-agency",
    primaryLabel: "Coordination Red Flags",
    secondaryHref: "/#lawyer-matrix",
    secondaryLabel: "SNCU / Legal Routing",
  },
  {
    department: "Transport & Fleet",
    stageCode: "Stage 03",
    focus: "Fuel-card policies, €0.23/km travel parity, and blocking retroactive fuel clawbacks.",
    lawRef: "BW Art. 7:611 · BW Art. 7:632",
    primaryHref: "/#objection-letter",
    primaryLabel: "Fuel Objection Letter",
    secondaryHref: "/#verify-agency",
    secondaryLabel: "Transport Red Flags",
  },
  {
    department: "Payroll Administration",
    stageCode: "Stage 04",
    focus: "Weekly loonstroken, statutory minimum wage protection, and unlawful wage set-offs.",
    lawRef: "BW Art. 7:632 · Art. 7:625 · WAS",
    primaryHref: "/#objection-letter",
    primaryLabel: "Wage Demand Letter",
    secondaryHref: "/#verify-agency",
    secondaryLabel: "Payroll Red Flags",
  },
  {
    department: "Housing / SNF Desk",
    stageCode: "Stage 05",
    focus: "SNF certification check, pest/hygiene standards, and the 25% WAS rent deduction cap.",
    lawRef: "SNF-norm · WAS 25% Cap",
    primaryHref: "/#verify-agency",
    primaryLabel: "Verify SNF Register",
    secondaryHref: "/#submit-report",
    secondaryLabel: "Log Housing Case",
  },
];

export const SEEDED_AGENCIES: AgencyRecord[] = [
  {
    id: "agency-charlie-works",
    slug: "charlie-works",
    name: "Charlie works",
    monogram: "Cw",
    tagline:
      "European Uitzendbureau · Logistics, Production & Horticulture Staffing",
    hqLocation: "Rijn 20, 2491 BG Den Haag (The Hague), Netherlands",
    regionalHubs: [
      "Den Haag (NL HQ)",
      "Gyula (Hungary)",
      "Poland & Slovakia Offices",
    ],
    sectors: [
      "Logistics & Warehousing",
      "Food & Production",
      "Horticulture (Tuinbouw)",
      "Technical / Regional Projects",
    ],
    contactEmail: "supports@charlieworks.eu",
    contactPhone: "071 - 528 0859",
    websiteUrl: "https://charlieworks.eu",
    linkedInCompanySearchUrl:
      "https://www.linkedin.com/search/results/companies/?keywords=Charlie%20works",
    linkedInPeopleSearchUrl:
      "https://www.linkedin.com/search/results/people/?keywords=Charlie%20works",
    scamPreventionFocus:
      "Before signing or authorizing deductions, verify written inlenersbeloning pay parity, signed fuel/transport terms (no retroactive clawbacks), and active SNF certification on housing.",
    registryChecklistNote:
      "Cross-check KvK Waadi registration, SNA payroll certification, ABU/NBBU membership, and SNF housing certificates prior to onboarding.",
    isSeeded: true,
    createdAt: "2026-11-20T00:00:00.000Z",
    departments: [
      {
        id: "regional-management",
        code: "UNIT 01",
        title: "Regional & Account Management",
        dutchLabel: "Regio Management & Opdrachtgevers",
        location: "Netherlands (Regional Hubs & HQ)",
        accentClass: "border-sky-300 bg-sky-50/70 text-sky-900",
        scope:
          "Coordinates host-company (inlener) client accounts, regional staffing allocations, and placement continuity across Dutch regions.",
        redFlagFocus:
          "Verify host-company pay parity (inlenersbeloning), exact CAO job group classification, and written placement terms.",
        whatToDocument: [
          "Written host-company (inlener) job scale & hourly rate confirmation",
          "Signed placement confirmation (uitzendbevestiging) matching actual duties",
          "Any regional rate change or shift-schedule amendment in writing",
        ],
        portalStageHref: "/#schematic",
        portalStageLabel: "Inspect Stage 02 · Coordination",
        portalRedFlagHref: "/#verify-agency",
        portalRedFlagLabel: "Check Coordination Red Flags",
      },
      {
        id: "recruitment",
        code: "UNIT 02",
        title: "International Recruitment",
        dutchLabel: "Werving & Selectie (NL & EU)",
        location: "Den Haag · Gyula (HU) · Central Europe",
        accentClass: "border-[#D95D24]/40 bg-orange-50/70 text-orange-950",
        scope:
          "Sources and screens international candidates, explains job offers, and guides workers through pre-arrival onboarding.",
        redFlagFocus:
          "Ensure advertised gross hourly wages, weekly hours, housing fees, and travel rules appear verbatim in the signed contract.",
        whatToDocument: [
          "Job ad screenshots and recruiter messages quoting gross/net pay",
          "Full Dutch + translated contract provided prior to traveling",
          "Written confirmation of weekly housing deductions & SNF status",
        ],
        portalStageHref: "/#schematic",
        portalStageLabel: "Inspect Stage 01 · Recruitment",
        portalRedFlagHref: "/#verify-agency",
        portalRedFlagLabel: "Check Recruitment Red Flags",
      },
      {
        id: "operations-staff",
        code: "UNIT 03",
        title: "Agency Operations & Featured Staff",
        dutchLabel: "Operationeel Team & Interne Staf",
        location: "Netherlands",
        accentClass: "border-slate-300 bg-slate-100/80 text-slate-900",
        scope:
          "Internal agency staff and featured team lineup members supporting daily staffing operations. Individual department titles for this group are kept neutral until publicly verified.",
        redFlagFocus:
          "Across payroll, transport, and housing desks, insist on itemized payslips, written consent before deductions, and SNF housing checks.",
        whatToDocument: [
          "Consecutive weekly payslips (loonstroken) and bank deposit statements",
          "Written transport/fuel policy before using agency cars or fuel cards",
          "Timestamped housing maintenance tickets (no staff photos in public posts)",
        ],
        portalStageHref: "/#lawyer-matrix",
        portalStageLabel: "View Legal Routing Matrix",
        portalRedFlagHref: "/#objection-letter",
        portalRedFlagLabel: "Draft Written Objection",
      },
    ],
    members: [
      {
        id: "anil-krishan",
        name: "Anil Krishan",
        role: "Regio Manager Noord",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "regional-management",
        departmentLabel: "Regional & Account Management",
        location: "Netherlands · Regio Noord",
        photoPath: "/team/anil_krishan.jpeg",
        photoAlt: "Portrait photo of Anil Krishan",
        objectPosition: "object-top",
        headline: "Regio Manager Noord · Charlie works",
        summary:
          "Publicly listed via The Org as Regio Manager Noord at Charlie works, matching professionals with regional client projects, and featured in Charlie works team lineup communications.",
        sourceNote: "Source: Publicly indexed on The Org & charlieworks.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Anil%20Krishan%20Charlie%20works",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea: "Coordination & Host-Company Pay Parity (Inlenersbeloning)",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Check Coordination & CAO Red Flags",
      },
      {
        id: "anita-fabian",
        name: "Anita Fabian",
        role: "Recruiter",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "recruitment",
        departmentLabel: "International Recruitment",
        location: "Gyula, Hungary · International Desk",
        photoPath: "/team/anita_fabian.jpeg",
        photoAlt: "Portrait photo of Anita Fabian at Charlie works recruitment desk",
        objectPosition: "object-[60%_14%]",
        headline: "Recruiter · Charlie works (Gyula / International Recruitment)",
        summary:
          "Publicly listed on charlieworks.eu as a dedicated recruiter guiding applicants from Hungary and Central Europe into logistics, production, and horticulture roles in the Netherlands.",
        sourceNote: "Source: Publicly listed on charlieworks.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Anita%20Fabian%20Charlie%20works",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea: "Recruitment Offers & Pre-Arrival Terms (BW Art. 7:655)",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Check Recruitment Red Flags",
      },
      {
        id: "auke-van-de-beek",
        name: "Auke van de Beek",
        role: "Agency Team Member",
        roleStatus: "unverified",
        roleBadgeLabel: "Neutral · Title Unverified",
        departmentId: "operations-staff",
        departmentLabel: "Operations & Featured Staff",
        location: "Netherlands",
        photoPath: "/team/auke_van_de_beek.png",
        photoAlt: "Portrait photo of Auke van de Beek in front of Charlie works sign",
        objectPosition: "object-[42%_15%]",
        headline: "Team Member · Charlie works (Specific job title unverified)",
        summary:
          "Featured in Charlie works promotional team lineup campaigns on charlieworks.eu. Exact corporate title and public LinkedIn URL are not confirmed in open search indexes.",
        sourceNote: "Source: Workspace photo · First name on charlieworks.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Auke%20van%20de%20Beek%20Charlie%20works",
        linkedInButtonLabel: "Search LinkedIn",
        relatedDisputeArea: "Agency Payroll, Transport & Verification Checklist",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Open Pre-Signing Checklist",
      },
      {
        id: "mirjam-hooft",
        name: "Mirjam Hooft",
        role: "Agency Team Member",
        roleStatus: "unverified",
        roleBadgeLabel: "Neutral · Title Unverified",
        departmentId: "operations-staff",
        departmentLabel: "Operations & Featured Staff",
        location: "Netherlands",
        photoPath: "/team/mirjam_hooft.jpeg",
        photoAlt: "Portrait photo of Mirjam Hooft",
        objectPosition: "object-top",
        headline: "Team Member · Agency Roster (Specific job title unverified)",
        summary:
          "Provided in the workspace agency photo roster. Public corporate title, office branch, and LinkedIn profile URL were not found in open search indexes and remain neutral.",
        sourceNote: "Source: Workspace photo · Public title unverified",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Mirjam%20Hooft%20Charlie%20works",
        linkedInButtonLabel: "Search LinkedIn",
        relatedDisputeArea: "Department Red Flags & Official NL Registers",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Inspect Department Red Flags",
      },
      {
        id: "nina",
        name: "Nina",
        role: "Agency Team Member",
        roleStatus: "unverified",
        roleBadgeLabel: "Neutral · Full Name & Title Unverified",
        departmentId: "operations-staff",
        departmentLabel: "Operations & Featured Staff",
        location: "Netherlands",
        photoPath: "/team/nina.png",
        photoAlt: "Portrait photo of Nina",
        objectPosition: "object-top",
        headline: "Team Member · Charlie works (Surname & job title unverified)",
        summary:
          "Featured as 'Nina' in Charlie works team lineup communications on charlieworks.eu. Full surname, specific internal department, and LinkedIn URL are not publicly verified.",
        sourceNote: "Source: Workspace photo · First name on charlieworks.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Nina%20Charlie%20works",
        linkedInButtonLabel: "Search LinkedIn",
        relatedDisputeArea: "Lifecycle Checkpoints & Lawyer Escalation Routing",
        portalHref: "/#lawyer-matrix",
        portalLinkLabel: "Open Lawyer Escalation Matrix",
      },
    ],
  },
  {
    id: "agency-dit-larex",
    slug: "dit-larex",
    name: "DIT & Larex",
    monogram: "DL",
    tagline:
      "DIT Holding (DIT Personeel & Larex) · Technical, Construction & Metal Staffing",
    hqLocation:
      "Maagdenburgstraat 10, 7421 ZB Deventer (Larex) · Filipsweistraat 9A, 4181 CH Waardenburg (DIT Holding)",
    regionalHubs: [
      "Deventer (Larex NL)",
      "Waardenburg (DIT Holding HQ)",
      "Opole (Poland)",
      "Galați & Ploiești (Romania)",
    ],
    sectors: [
      "Engineering & Metal (Techniek & Metaal)",
      "Construction (Bouw)",
      "Electrical & Installation",
      "Industrial & Skilled Trades",
    ],
    contactEmail: "Verify per regional desk (larex.eu / ditholding.nl)",
    contactPhone: "088 - 4949600 (Larex) · 088 - 4949500 (DIT)",
    websiteUrl: "https://www.larex.eu",
    linkedInCompanySearchUrl:
      "https://www.linkedin.com/search/results/companies/?keywords=Larex%20DIT%20Holding",
    linkedInPeopleSearchUrl:
      "https://www.linkedin.com/search/results/people/?keywords=Larex%20DIT%20Personeel",
    scamPreventionFocus:
      "For skilled technical, metal, and construction placements, verify written host-company CAO parity (inlenersbeloning including ADV/ATV hours vs. vakantie-uren—never accept holiday hours put into minus to force work), written travel/fuel terms, and SNF housing certification.",
    registryChecklistNote:
      "Cross-check KvK Waadi registration for the exact contracting entity (DIT Personeel / Larex), SNA NEN 4400-1 certification, NBBU CAO rules, and active SNF housing certificates.",
    isSeeded: true,
    createdAt: "2026-11-20T02:10:00.000Z",
    departments: [
      {
        id: "regional-management",
        code: "UNIT 01",
        title: "Executive & Regional Management",
        dutchLabel: "Directie & Regiomanagement (Techniek, Metaal & Bouw)",
        location: "Waardenburg HQ · Deventer · NL Regions",
        accentClass: "border-sky-300 bg-sky-50/70 text-sky-900",
        scope:
          "Commercial leadership and regional management across DIT Holding, Larex Techniek/Metaal, and Larex Bouw divisions.",
        redFlagFocus:
          "Verify host-company CAO pay scale (Bouw / Metaal / Techniek inlenersbeloning), written assignment terms, and shift rates before starting.",
        whatToDocument: [
          "Signed placement confirmation showing exact host-company (inlener) pay group",
          "Written confirmation of skilled trade allowances, tools, or travel reimbursements",
          "Any mid-project pay or rate adjustment strictly documented in writing",
        ],
        portalStageHref: "/#schematic",
        portalStageLabel: "Inspect Stage 02 · Coordination",
        portalRedFlagHref: "/#verify-agency",
        portalRedFlagLabel: "Check Coordination Red Flags",
      },
      {
        id: "recruitment",
        code: "UNIT 02",
        title: "Account Management & EU Placement",
        dutchLabel: "Accountmanagement Techniek & Internationale Bemiddeling",
        location: "Deventer (NL) · Poland & Romania Offices",
        accentClass: "border-[#D95D24]/40 bg-orange-50/70 text-orange-950",
        scope:
          "Matches EU and Dutch technical professionals with construction, metal, and engineering client projects and manages onboarding.",
        redFlagFocus:
          "Ensure promised hourly/weekly rates, commute fuel or travel allowances, and SNF housing fees match your signed Dutch contract verbatim.",
        whatToDocument: [
          "Pre-arrival job offer, rate quote, and recruiter messages from NL/PL/RO desks",
          "Full Dutch + translated uitzendovereenkomst before traveling",
          "Written transport/fuel-card policy excluding retroactive deductions",
        ],
        portalStageHref: "/#schematic",
        portalStageLabel: "Inspect Stage 01 · Recruitment",
        portalRedFlagHref: "/#verify-agency",
        portalRedFlagLabel: "Check Recruitment Red Flags",
      },
      {
        id: "operations-staff",
        code: "UNIT 03",
        title: "Payroll, Transport & SNF Housing Desks",
        dutchLabel: "Salarisadministratie, Vervoer & Huisvesting",
        location: "Deventer / Waardenburg",
        accentClass: "border-slate-300 bg-slate-100/80 text-slate-900",
        scope:
          "Handles weekly loonstroken, travel/fuel reimbursements, and flex-housing compliance. Use the collaborative button below to log desk roles.",
        redFlagFocus:
          "Watch for retroactive salary or fuel clawbacks AND agencies booking vakantie-uren into minus instead of applying ADV/ATV hours (BW Art. 7:638 / 7:628) to pressure workers into staying.",
        whatToDocument: [
          "All weekly payslips (loonstroken) showing ADV reservations vs. negative vakantie-uren",
          "Fuel receipts, mileage logs, and written car/fuel-card agreements",
          "Written objection (bezwaar) under BW Art. 7:638, 7:628 & 7:632 against forced minus holiday hours",
        ],
        portalStageHref: "/#objection-letter",
        portalRedFlagHref: "/#lawyer-matrix",
        portalStageLabel: "Draft Written Objection",
        portalRedFlagLabel: "View Legal Routing Matrix",
      },
    ],
    members: [
      {
        id: "daniel-keurntjes",
        name: "Daniël Keurntjes",
        role: "Commercieel Directeur",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "regional-management",
        departmentLabel: "Executive & Regional Management",
        location: "Waardenburg / Deventer · DIT Holding & Larex",
        photoPath: null,
        photoAlt: "Monogram badge for Daniël Keurntjes",
        objectPosition: "object-top",
        headline: "Commercieel Directeur · DIT Holding (DIT Personeel & Larex)",
        summary:
          "Publicly listed on larex.eu and ditholding.nl as Commercieel Directeur at DIT Holding (parent group of DIT Personeel and Larex), overseeing commercial leadership after joining Larex in 2021.",
        sourceNote: "Source: Publicly listed on larex.eu & ditholding.nl",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Daniel%20Keurntjes%20Larex%20DIT",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea:
          "Corporate Governance, CAO Parity & Wage Compliance (BW Art. 7:632)",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Check Agency Registries & Red Flags",
      },
      {
        id: "bastian-de-weerd",
        name: "Bastian de Weerd",
        role: "Regiomanager Techniek en Metaal",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "regional-management",
        departmentLabel: "Executive & Regional Management",
        location: "Netherlands · Team Techniek & Metaal",
        photoPath: null,
        photoAlt: "Monogram badge for Bastian de Weerd",
        objectPosition: "object-top",
        headline: "Regiomanager Techniek en Metaal · Larex (DIT Holding)",
        summary:
          "Publicly listed on larex.eu as Regiomanager Techniek en Metaal, leading the Engineering and Metal regional teams placing technical professionals across the Netherlands.",
        sourceNote: "Source: Publicly listed on larex.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Bastian%20de%20Weerd%20Larex",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea:
          "Technical & Metal Pay Scales (Inlenersbeloning) & Timesheets",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Check Coordination & CAO Red Flags",
      },
      {
        id: "jan-jaap-muller",
        name: "Jan Jaap Muller",
        role: "Regiomanager Bouw",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "regional-management",
        departmentLabel: "Executive & Regional Management",
        location: "Netherlands · Team Bouw",
        photoPath: null,
        photoAlt: "Monogram badge for Jan Jaap Muller",
        objectPosition: "object-top",
        headline: "Regiomanager Bouw · Larex (DIT Holding)",
        summary:
          "Publicly listed on larex.eu as Regiomanager Bouw, coordinating regional operations and construction staffing teams across Dutch building projects.",
        sourceNote: "Source: Publicly listed on larex.eu",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Jan%20Jaap%20Muller%20Larex",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea:
          "Construction CAO Parity, Commute Travel & Overtime Verification",
        portalHref: "/#schematic",
        portalLinkLabel: "Inspect Lifecycle Stages 02–04",
      },
      {
        id: "georgiana-constantinescu",
        name: "Georgiana Constantinescu",
        role: "Accountmanager Techniek",
        roleStatus: "verified",
        roleBadgeLabel: "Public Role Listed",
        departmentId: "recruitment",
        departmentLabel: "Account Management & EU Placement",
        location: "Deventer / EU Technical Placement · Larex",
        photoPath: "/team/georgiana_constantinescu.jpeg",
        photoAlt: "Portrait photo of Georgiana Constantinescu",
        objectPosition: "object-[50%_18%]",
        headline: "Accountmanager Techniek · Larex (DIT Holding)",
        summary:
          "Publicly listed on larex.eu as Accountmanager Techniek, supporting technical client matching and international candidate placements in the Netherlands.",
        sourceNote: "Source: Publicly listed on larex.eu · Workspace photo",
        linkedInSearchUrl:
          "https://www.linkedin.com/search/results/people/?keywords=Georgiana%20Constantinescu%20Larex",
        linkedInButtonLabel: "Find on LinkedIn",
        relatedDisputeArea:
          "Pre-Signing Legal Check: ADV vs. Vakantie-uren, Inlenersbeloning & Fuel Terms (BW Art. 7:655 / 7:638)",
        portalHref: "/#verify-agency",
        portalLinkLabel: "Verify Legal Facts Before Signing",
      },
    ],
  },
];
