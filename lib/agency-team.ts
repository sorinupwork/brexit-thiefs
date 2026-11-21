import agenciesJson from "@/data/agencies.json";

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

/**
 * Single source of truth: edit `data/agencies.json` directly and place team
 * photos in `public/team/` (e.g. `"photoPath": "/team/photo.jpg"`).
 */
export const AGENCIES: AgencyRecord[] =
  agenciesJson as unknown as AgencyRecord[];

export function getAgencyBySlug(slug: string): AgencyRecord | null {
  return AGENCIES.find((agency) => agency.slug === slug) ?? null;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
