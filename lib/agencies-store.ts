import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import {
  SEEDED_AGENCIES,
  buildDefaultDepartments,
  makeAgencyMonogram,
  slugifyAgencyName,
  type AgencyDepartmentId,
  type AgencyRecord,
  type AgencySubmissionInput,
  type AgencyTeamMember,
  type TeamMemberSubmissionInput,
} from "./agency-team";

const DATA_DIR = path.join(process.cwd(), "data");
const AGENCIES_FILE = path.join(DATA_DIR, "agencies.json");

const VALID_DEPARTMENTS = new Set<AgencyDepartmentId>([
  "regional-management",
  "recruitment",
  "operations-staff",
]);

const DEPARTMENT_LABELS: Record<AgencyDepartmentId, string> = {
  "regional-management": "Regional & Account Management",
  recruitment: "International Recruitment",
  "operations-staff": "Operations & Featured Staff",
};

const DEPARTMENT_PORTAL_LINKS: Record<
  AgencyDepartmentId,
  { area: string; href: string; label: string }
> = {
  "regional-management": {
    area: "Coordination & Host-Company Pay Parity (Inlenersbeloning)",
    href: "/#verify-agency",
    label: "Check Coordination & CAO Red Flags",
  },
  recruitment: {
    area: "Recruitment Offers & Pre-Arrival Terms (BW Art. 7:655)",
    href: "/#verify-agency",
    label: "Check Recruitment Red Flags",
  },
  "operations-staff": {
    area: "Payroll, Transport & SNF Housing Verification",
    href: "/#verify-agency",
    label: "Open Pre-Signing Checklist",
  },
};

async function ensureAgenciesFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(AGENCIES_FILE);
  } catch {
    await fs.writeFile(
      AGENCIES_FILE,
      JSON.stringify(SEEDED_AGENCIES, null, 2),
      "utf-8"
    );
  }
}

export async function readAgencies(): Promise<AgencyRecord[]> {
  try {
    await ensureAgenciesFile();
    const raw = await fs.readFile(AGENCIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return SEEDED_AGENCIES;
    }
    return parsed as AgencyRecord[];
  } catch {
    return SEEDED_AGENCIES;
  }
}

export async function readAgencyBySlug(
  slug: string
): Promise<AgencyRecord | null> {
  const agencies = await readAgencies();
  return agencies.find((agency) => agency.slug === slug) ?? null;
}

function sanitizeOptionalUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return "";
  } catch {
    return "";
  }
}

function parseListField(raw: unknown, maxItems = 6): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string")
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[,;\n]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }
  return [];
}

export function validateAgencyInput(
  body: unknown
): { ok: true; data: AgencySubmissionInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const hqLocation =
    typeof record.hqLocation === "string" ? record.hqLocation.trim() : "";
  const scamPreventionFocus =
    typeof record.scamPreventionFocus === "string"
      ? record.scamPreventionFocus.trim()
      : "";
  const registryChecklistNote =
    typeof record.registryChecklistNote === "string"
      ? record.registryChecklistNote.trim()
      : "";

  if (name.length < 2 || name.length > 90) {
    return {
      ok: false,
      error: "Agency name must be between 2 and 90 characters.",
    };
  }

  if (hqLocation.length < 2 || hqLocation.length > 120) {
    return {
      ok: false,
      error: "Headquarters city or Dutch region must be 2–120 characters.",
    };
  }

  if (scamPreventionFocus.length < 15 || scamPreventionFocus.length > 600) {
    return {
      ok: false,
      error:
        "Scam-prevention / verification note must be between 15 and 600 characters.",
    };
  }

  const websiteUrl = sanitizeOptionalUrl(record.websiteUrl);
  const regionalHubs = parseListField(record.regionalHubs);
  const sectors = parseListField(record.sectors);
  const contactEmail =
    typeof record.contactEmail === "string"
      ? record.contactEmail.trim().slice(0, 120)
      : "";
  const contactPhone =
    typeof record.contactPhone === "string"
      ? record.contactPhone.trim().slice(0, 40)
      : "";

  const initialMemberName =
    typeof record.initialMemberName === "string"
      ? record.initialMemberName.trim().slice(0, 80)
      : "";
  const initialMemberRole =
    typeof record.initialMemberRole === "string"
      ? record.initialMemberRole.trim().slice(0, 80)
      : "";
  const initialMemberDepartment = VALID_DEPARTMENTS.has(
    record.initialMemberDepartment as AgencyDepartmentId
  )
    ? (record.initialMemberDepartment as AgencyDepartmentId)
    : "operations-staff";
  const initialMemberSummary =
    typeof record.initialMemberSummary === "string"
      ? record.initialMemberSummary.trim().slice(0, 400)
      : "";

  return {
    ok: true,
    data: {
      name,
      hqLocation,
      regionalHubs: regionalHubs.length > 0 ? regionalHubs : [hqLocation],
      sectors:
        sectors.length > 0 ? sectors : ["Temporary Staffing (Uitzendbureau)"],
      websiteUrl,
      contactEmail,
      contactPhone,
      scamPreventionFocus,
      registryChecklistNote:
        registryChecklistNote ||
        "Verify KvK Waadi registration, SNA payroll certification, ABU/NBBU CAO parity, and SNF housing status before signing.",
      initialMemberName,
      initialMemberRole,
      initialMemberDepartment,
      initialMemberSummary,
    },
  };
}

export async function appendAgency(
  input: AgencySubmissionInput
): Promise<AgencyRecord> {
  const existing = await readAgencies();
  const baseSlug = slugifyAgencyName(input.name);
  let uniqueSlug = baseSlug;
  let counter = 2;
  while (existing.some((a) => a.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const encodedAgency = encodeURIComponent(input.name);
  const members: AgencyTeamMember[] = [];

  if (input.initialMemberName) {
    const deptId = input.initialMemberDepartment ?? "operations-staff";
    const roleText = input.initialMemberRole || "Agency Team Role";
    const portalMeta = DEPARTMENT_PORTAL_LINKS[deptId];
    members.push({
      id: `member-${crypto.randomUUID().slice(0, 8)}`,
      name: input.initialMemberName,
      role: roleText,
      roleStatus: "unverified",
      roleBadgeLabel: "Community Contributed",
      departmentId: deptId,
      departmentLabel: DEPARTMENT_LABELS[deptId],
      location: input.hqLocation,
      photoPath: null,
      photoAlt: `Monogram badge for ${input.initialMemberName}`,
      objectPosition: "object-top",
      headline: `${roleText} · ${input.name}`,
      summary:
        input.initialMemberSummary ||
        `Community-contributed organizational role entry for ${input.name} to help temp workers verify department contacts and written responsibilities.`,
      sourceNote: "Source: Community directory submission (verify directly)",
      linkedInSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
        `${input.initialMemberName} ${input.name}`
      )}`,
      linkedInButtonLabel: "Search LinkedIn",
      relatedDisputeArea: portalMeta.area,
      portalHref: portalMeta.href,
      portalLinkLabel: portalMeta.label,
    });
  }

  const agency: AgencyRecord = {
    id: `agency-${crypto.randomUUID().slice(0, 8)}`,
    slug: uniqueSlug,
    name: input.name,
    monogram: makeAgencyMonogram(input.name),
    tagline: `Dutch Uitzendbureau · ${input.sectors.slice(0, 3).join(" · ")}`,
    hqLocation: input.hqLocation,
    regionalHubs: input.regionalHubs,
    sectors: input.sectors,
    contactEmail: input.contactEmail || "Verify via official agency site",
    contactPhone: input.contactPhone || "Verify via KvK / official site",
    websiteUrl:
      input.websiteUrl ||
      `https://www.kvk.nl/zoeken/?q=${encodedAgency}`,
    linkedInCompanySearchUrl: `https://www.linkedin.com/search/results/companies/?keywords=${encodedAgency}`,
    linkedInPeopleSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedAgency}`,
    scamPreventionFocus: input.scamPreventionFocus,
    registryChecklistNote: input.registryChecklistNote,
    isSeeded: false,
    createdAt: new Date().toISOString(),
    departments: buildDefaultDepartments(input.hqLocation),
    members,
  };

  const updated = [agency, ...existing];
  await ensureAgenciesFile();
  await fs.writeFile(AGENCIES_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return agency;
}

export function validateMemberInput(
  body: unknown
):
  | { ok: true; data: TeamMemberSubmissionInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const record = body as Record<string, unknown>;
  const agencySlug =
    typeof record.agencySlug === "string" ? record.agencySlug.trim() : "";
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const role = typeof record.role === "string" ? record.role.trim() : "";
  const location =
    typeof record.location === "string" ? record.location.trim() : "";
  const summary =
    typeof record.summary === "string" ? record.summary.trim() : "";
  const sourceNote =
    typeof record.sourceNote === "string" ? record.sourceNote.trim() : "";

  if (!agencySlug) {
    return { ok: false, error: "Missing agency identifier." };
  }
  if (name.length < 2 || name.length > 80) {
    return {
      ok: false,
      error: "Role title or name label must be between 2 and 80 characters.",
    };
  }
  if (role.length < 2 || role.length > 80) {
    return {
      ok: false,
      error: "Position / desk role must be between 2 and 80 characters.",
    };
  }
  if (summary.length < 15 || summary.length > 500) {
    return {
      ok: false,
      error: "Factual role description must be between 15 and 500 characters.",
    };
  }

  const departmentId = VALID_DEPARTMENTS.has(
    record.departmentId as AgencyDepartmentId
  )
    ? (record.departmentId as AgencyDepartmentId)
    : "operations-staff";

  return {
    ok: true,
    data: {
      agencySlug,
      name,
      role,
      departmentId,
      location: location || "Netherlands",
      summary,
      sourceNote:
        sourceNote || "Source: Community team role note (verify directly)",
    },
  };
}

export async function appendMemberToAgency(
  input: TeamMemberSubmissionInput
): Promise<{ agency: AgencyRecord; member: AgencyTeamMember } | null> {
  const existing = await readAgencies();
  const targetIndex = existing.findIndex((a) => a.slug === input.agencySlug);
  if (targetIndex === -1) {
    return null;
  }

  const targetAgency = existing[targetIndex];
  const portalMeta = DEPARTMENT_PORTAL_LINKS[input.departmentId];

  const member: AgencyTeamMember = {
    id: `member-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    role: input.role,
    roleStatus: "unverified",
    roleBadgeLabel: "Community Contributed",
    departmentId: input.departmentId,
    departmentLabel: DEPARTMENT_LABELS[input.departmentId],
    location: input.location,
    photoPath: null,
    photoAlt: `Monogram badge for ${input.name}`,
    objectPosition: "object-top",
    headline: `${input.role} · ${targetAgency.name}`,
    summary: input.summary,
    sourceNote: input.sourceNote,
    linkedInSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      `${input.name} ${targetAgency.name}`
    )}`,
    linkedInButtonLabel: "Search LinkedIn",
    relatedDisputeArea: portalMeta.area,
    portalHref: portalMeta.href,
    portalLinkLabel: portalMeta.label,
  };

  const updatedAgency: AgencyRecord = {
    ...targetAgency,
    members: [...targetAgency.members, member],
  };

  const updatedList = [...existing];
  updatedList[targetIndex] = updatedAgency;

  await ensureAgenciesFile();
  await fs.writeFile(
    AGENCIES_FILE,
    JSON.stringify(updatedList, null, 2),
    "utf-8"
  );

  return { agency: updatedAgency, member };
}
