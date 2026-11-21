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
  departments: AgencyDepartmentNode[];
  members: AgencyTeamMember[];
}

/**
 * Single source of truth: edit `data/agencies.json` directly and place team
 * photos in `public/team/` (e.g. `"photoPath": "/team/photo.jpg"`).
 */
export const AGENCIES: AgencyRecord[] =
  agenciesJson as unknown as AgencyRecord[];

export interface AgencySummaryLink {
  id: string;
  slug: string;
  name: string;
  hqLocation: string;
  memberCount: number;
}

export function getAgencyBySlug(slug: string): AgencyRecord | null {
  return AGENCIES.find((agency) => agency.slug === slug) ?? null;
}

export function getAgencySummaries(): AgencySummaryLink[] {
  return AGENCIES.map((agency) => ({
    id: agency.id,
    slug: agency.slug,
    name: agency.name,
    hqLocation: agency.hqLocation,
    memberCount: agency.members.length,
  }));
}

/**
 * Converts a URL slug (e.g. `charlie-works`) into a human-readable title fallback.
 */
export function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
