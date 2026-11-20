import type {
  AuthorityId,
  DutchAuthority,
  EvidenceItemType,
  IssueCategory,
  LifecycleStageInfo,
  WorkerReport,
} from "./types";

export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; shortLabel: string; badgeClass: string; authorities: AuthorityId[] }
> = {
  "wage-deduction": {
    label: "Wage Deduction / Retroactive Clawback",
    shortLabel: "Wage Deduction",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
    authorities: ["arbeidsinspectie", "sncu", "juridisch-loket"],
  },
  "transport-fuel": {
    label: "Transport, Commute & Fuel Clawback",
    shortLabel: "Transport / Fuel",
    badgeClass: "bg-orange-50 text-orange-900 border-orange-200",
    authorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
  },
  "contract-cao": {
    label: "Contract & CAO Discrepancy",
    shortLabel: "Contract / CAO",
    badgeClass: "bg-sky-50 text-sky-900 border-sky-200",
    authorities: ["sncu", "juridisch-loket", "fairwork"],
  },
  "accommodation-snf": {
    label: "Accommodation & SNF Standards",
    shortLabel: "Accommodation / SNF",
    badgeClass: "bg-rose-50 text-rose-900 border-rose-200",
    authorities: ["snf", "arbeidsinspectie", "fairwork"],
  },
  recruitment: {
    label: "Recruitment Misrepresentation",
    shortLabel: "Recruitment",
    badgeClass: "bg-indigo-50 text-indigo-900 border-indigo-200",
    authorities: ["arbeidsinspectie", "fairwork", "juridisch-loket"],
  },
  "hours-overtime": {
    label: "Unpaid Hours & Overtime",
    shortLabel: "Hours & Overtime",
    badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-200",
    authorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
  },
};

export const EVIDENCE_LABELS: Record<EvidenceItemType, string> = {
  payslips: "Payslips (Loonstroken)",
  contract: "Employment Contract & CAO Terms",
  "written-messages": "Emails / WhatsApp / Portal Messages",
  "bank-statements": "Bank Transfer Statements",
  "fuel-transport-logs": "Fuel Receipts, Car Agreement & Mileage Logs",
  "housing-photos": "Accommodation Condition Photos (No Faces)",
  "hours-log": "Independent Hours / Timesheet Log",
};

export const NL_REGIONS = [
  "Noord-Holland",
  "Zuid-Holland",
  "Noord-Brabant",
  "Gelderland",
  "Utrecht",
  "Limburg",
  "Overijssel",
  "Flevoland",
  "Zeeland",
  "Groningen / Friesland / Drenthe",
  "Netherlands (Unspecified)",
];

export const DUTCH_AUTHORITIES: Record<AuthorityId, DutchAuthority> = {
  arbeidsinspectie: {
    id: "arbeidsinspectie",
    name: "Nederlandse Arbeidsinspectie",
    englishLabel: "Netherlands Labour Authority",
    scope:
      "Statutory enforcement of minimum wage, unlawful wage deductions, illegal work conditions, and labor exploitation.",
    bestFor: [
      "Retroactive salary clawbacks pushing pay below statutory rules",
      "Illegal deductions violating Wet aanpak schijnconstructies (WAS)",
      "Unsafe work or severe exploitation indicators",
    ],
    url: "https://www.nlarbeidsinspectie.nl/melden",
    actionLabel: "Report to Arbeidsinspectie",
    urgent: true,
  },
  sncu: {
    id: "sncu",
    name: "SNCU",
    englishLabel: "Temp-Agency CAO Enforcement Foundation",
    scope:
      "Audits Dutch temp agencies (uitzendbureaus) for compliance with the ABU and NBBU Collective Labor Agreements (CAO).",
    bestFor: [
      "Incorrect hourly rate vs. host-company pay parity (inlenersbeloning)",
      "Retroactive pay recalculations, missing holiday pay, or unpaid allowances",
      "Unlawful fines or unagreed deductions on payslips",
    ],
    url: "https://www.sncu.nl/melding-doen/",
    actionLabel: "File CAO Tip at SNCU",
    urgent: true,
  },
  snf: {
    id: "snf",
    name: "SNF (Stichting Normering Flexwonen)",
    englishLabel: "Certified Flex-Housing Standards Board",
    scope:
      "Oversees certified accommodation for temporary/migrant workers and investigates hygiene, pest, safety, and space violations.",
    bestFor: [
      "Pests (rats, mice, bedbugs), mold, or poor sanitation",
      "Overcrowding, fire safety defects, or broken heating/utilities",
      "Missing SNF maintenance response after written notice",
    ],
    url: "https://www.normeringflexwonen.nl/klachten",
    actionLabel: "Submit Housing Complaint to SNF",
    urgent: true,
  },
  "juridisch-loket": {
    id: "juridisch-loket",
    name: "Het Juridisch Loket",
    englishLabel: "Public Legal Aid & Employment Advice",
    scope:
      "Free initial Dutch legal guidance on wage claims, formal demand letters (sommatiebrief), and subsidized employment lawyers.",
    bestFor: [
      "Drafting a formal written objection to a retroactive wage deduction",
      "Claiming statutory interest and late-payment uplift (Art. 7:625 BW)",
      "Referral to a specialized Dutch employment lawyer (arbeidsrechtadvocaat)",
    ],
    url: "https://www.juridischloket.nl/",
    actionLabel: "Consult Het Juridisch Loket",
  },
  fairwork: {
    id: "fairwork",
    name: "FairWork",
    englishLabel: "Independent Migrant Worker Support NGO",
    scope:
      "Confidential, multilingual guidance for international workers in the Netherlands facing unfair treatment or labor abuse.",
    bestFor: [
      "Multilingual help understanding Dutch payslips and contracts",
      "Independent guidance before signing settlement or deduction agreements",
      "Escalation support when housing and employment are tied together",
    ],
    url: "https://www.fairwork.nu/",
    actionLabel: "Contact FairWork NL",
  },
  politie: {
    id: "politie",
    name: "Politie",
    englishLabel: "Dutch National Police",
    scope:
      "Criminal reporting for threats, coercion, document confiscation, fraud, or unlawful eviction/harassment.",
    bestFor: [
      "Threats, intimidation, or withholding of passport/ID documents",
      "Documented criminal fraud or identity misuse",
      "Immediate physical safety or illegal lockouts",
    ],
    url: "https://www.politie.nl/aangifte-of-melding-doen",
    actionLabel: "Report to Dutch Police",
  },
};

export const LIFECYCLE_STAGES: LifecycleStageInfo[] = [
  {
    id: "recruitment",
    stepNumber: "01",
    title: "Recruitment & Pre-Arrival Promises",
    shortTitle: "Recruitment",
    subtitle: "Written job offers, promised hourly wage, housing fees, and transport terms.",
    legalFramework: [
      "Dutch Civil Code (BW Art. 7:655) — mandatory written statement of employment terms",
      "EU Transparent and Predictable Working Conditions Directive",
    ],
    whatToVerify: [
      "Gross hourly rate, CAO pay scale, and guaranteed weekly hours in writing",
      "Exact weekly housing cost and whether the property holds an active SNF certificate",
      "No unlawful recruitment fees charged to the worker (prohibited under Waadi)",
    ],
    redFlags: [
      "Verbal promises of higher pay that never appear in the signed contract",
      "Deductions or deposits introduced only after arriving in the Netherlands",
      "Refusal to share the written contract prior to travel or onboarding",
    ],
    evidenceToCollect: [
      "Job advertisements, offer emails, and recruiter chat screenshots",
      "Written salary breakdowns provided prior to start date",
    ],
    primaryAuthorities: ["arbeidsinspectie", "fairwork", "juridisch-loket"],
  },
  {
    id: "coordination",
    stepNumber: "02",
    title: "Onboarding, Coordination & Contract",
    shortTitle: "Coordination",
    subtitle: "ABU/NBBU CAO phase, host-company parity (inlenersbeloning), and timesheets.",
    legalFramework: [
      "ABU / NBBU CAO voor Uitzendkrachten — equal pay rules (inlenersbeloning) & guaranteed-hours pay",
      "BW Art. 7:628 — employer scheduling risk (must pay agreed/guaranteed hours even if planning stops)",
      "Arbowet & Waadi — employer must supply mandatory PPE/tools free of charge (no forced personal gear)",
    ],
    whatToVerify: [
      "Correct CAO phase, guaranteed weekly hours, and host-company pay scale (inlenersbeloning)",
      "Written availability confirmation if planning goes silent or phone calls go unanswered",
      "Free provision of required work tools, safety gear (PPE), and transport without personal costs",
    ],
    redFlags: [
      "Agency ignores planning calls, leaves you in agency housing with zero shifts, and withholds guaranteed hours while charging rent",
      "Forcing use of personal car, personal phone, or personal tools/PPE without written reimbursement",
      "Performing skilled work on an entry-level pay scale or trimmed portal hours",
    ],
    evidenceToCollect: [
      "Signed uitzendovereenkomst, guaranteed-hours clause, and call/message logs showing unanswered outreach",
      "Written availability emails ('beschikbaar voor werk') + receipts for personal tools/phone/transport costs",
    ],
    primaryAuthorities: ["sncu", "juridisch-loket"],
  },
  {
    id: "transport",
    stepNumber: "03",
    title: "Transport Department, Commute & Fuel Allowances",
    shortTitle: "Transport & Fuel",
    subtitle:
      "Agency vehicles, fuel cards, travel reimbursement (reiskostenvergoeding), and retroactive petrol clawbacks.",
    legalFramework: [
      "ABU / NBBU CAO (inlenersbeloning) — mandatory commute/travel reimbursement parity with host-company staff",
      "BW Art. 7:611 (goed werkgeverschap) — good employership & legitimate expectation when fuel is consistently paid over months",
      "BW Art. 7:632 & WAS — strict prohibition on unilateral salary deductions for alleged internal billing or fuel-allowance errors",
    ],
    whatToVerify: [
      "Written transport policy: who pays fuel/petrol, car-pool fees, or €0.23/km commute reimbursement",
      "Whether a fuel allowance or fuel card was paid consistently across weekly payslips without written conditions",
      "Any transport deduction taken from net wages must have explicit prior written consent and cannot violate WML/WAS rules",
    ],
    redFlags: [
      "Agency pays fuel or travel reimbursement for 1–2+ months, then calls it an 'internal mistake' and claws the entire sum back out of earned salary",
      "Forcing a worker to retroactively absorb work-commute petrol costs after shifts were completed without prior written agreement",
      "Undisclosed vehicle fees, fuel-card penalties, or damage deductions taken directly from net pay",
    ],
    evidenceToCollect: [
      "Consecutive payslips showing 2+ months of paid fuel/commute lines followed by the negative clawback entry",
      "Fuel receipts, fuel-card logs, daily commute km records, and written transport coordinator approvals",
      "Written objection disputing the retroactive fuel deduction and requesting the underlying CAO travel rule",
    ],
    primaryAuthorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
  },
  {
    id: "payroll",
    stepNumber: "04",
    title: "Payroll, Payslips & Retroactive Deductions",
    shortTitle: "Payroll",
    subtitle: "Weekly/monthly loonstroken, holiday reservations, and legal limits on wage clawbacks.",
    legalFramework: [
      "BW Art. 7:632 — strict limits on employer wage set-off (verrekening) during employment",
      "Wet aanpak schijnconstructies (WAS) — ban on illegal deductions below minimum wage",
      "BW Art. 7:625 — statutory late-payment uplift (up to 50%) on unpaid earned wages",
    ],
    whatToVerify: [
      "Every deduction line item must have a clear statutory or signed written basis",
      "Retroactive 'overpayment' corrections after weeks of payment cannot simply wipe out net salary without legal justification and transparent calculation",
      "Minimum wage floor (WML) cannot be breached by arbitrary agency fines or deductions",
    ],
    redFlags: [
      "Sudden retroactive pay reduction weeks into an assignment ('we paid you too much')",
      "Unitemized negative correction lines on a weekly payslip",
      "Withholding final salary or accrued holiday pay (vakantiegeld) after raising a dispute",
    ],
    evidenceToCollect: [
      "All consecutive payslips (loonstroken) from Week 1 onward",
      "Bank statements showing actual net deposits vs. payslip totals",
      "Written objection stating you do not agree to the retroactive deduction",
    ],
    primaryAuthorities: ["arbeidsinspectie", "sncu", "juridisch-loket"],
  },
  {
    id: "accommodation",
    stepNumber: "05",
    title: "Agency Accommodation & SNF Housing",
    shortTitle: "Accommodation",
    subtitle: "Hygiene, pest control, space standards, and rent deduction caps.",
    legalFramework: [
      "SNF-norm (Stichting Normering Flexwonen) — space, hygiene, safety, and maintenance",
      "WAS Housing Rule — wage deduction for rent capped at 25% of statutory minimum wage (only with SNF certification + written authorization)",
    ],
    whatToVerify: [
      "Whether the housing provider is listed in the public SNF register",
      "Written rent authorization and whether housing is legally separated from termination pressure",
      "Prompt pest-control and maintenance response when defects are reported in writing",
    ],
    redFlags: [
      "Rodents/rats, insects, mold, broken heating, or unsafe electrical wiring",
      "Rent deducted from wages without valid SNF certification or above the 25% cap",
      "Threat of immediate eviction when questioning pay or reporting housing defects",
    ],
    evidenceToCollect: [
      "Timestamped photos/videos of property conditions (pests, damp, defects — no faces)",
      "Written maintenance reports sent to the housing desk and their replies (or lack thereof)",
      "Payslips showing weekly housing deduction amounts",
    ],
    primaryAuthorities: ["snf", "arbeidsinspectie", "fairwork"],
  },
  {
    id: "escalation",
    stepNumber: "06",
    title: "Structured Escalation & Legal Appeal",
    shortTitle: "Legal Appeal",
    subtitle: "Packaging factual timelines and evidence for Dutch regulators and employment lawyers.",
    legalFramework: [
      "Formal written demand (ingebrekestelling / sommatiebrief) preserving wage claims",
      "Parallel regulatory filings: Arbeidsinspectie + SNCU + SNF + Legal Counsel",
    ],
    whatToVerify: [
      "All facts are chronological, verifiable, and stripped of unverified personal attacks",
      "Each claim is backed by a document reference (payslip date, euro figure, written message)",
      "Separate complaints are sent to the exact body with legal jurisdiction over each issue",
    ],
    redFlags: [
      "Signing a 'final settlement' (vaststellingsovereenkomst) without legal review",
      "Publishing personal photos or defamatory labels of staff, which creates legal counter-risk",
      "Waiting months without sending a written objection to an unlawful wage deduction",
    ],
    evidenceToCollect: [
      "One-page chronological case brief (exportable from this portal)",
      "Indexed folder of payslips, contract, bank statements, and condition photos",
    ],
    primaryAuthorities: ["juridisch-loket", "arbeidsinspectie", "sncu", "snf", "politie"],
  },
];

export const SAMPLE_REPORTS: WorkerReport[] = [
  {
    id: "sample-wr-001",
    caseNumber: "WR-2026-001",
    title: "Retroactive salary clawback applied after 10 weeks of technical placement",
    category: "wage-deduction",
    stage: "payroll",
    region: "Zuid-Holland",
    weeksWorked: 10,
    disputedAmountEur: 1480,
    authorAlias: "Sample Case · Software / Technical Specialist",
    summary:
      "Illustrative anonymized case: After 10 consecutive weekly payslips paid at the rate agreed during onboarding, the payroll department applied a unilateral negative correction citing an internal rate reclassification, reducing net take-home pay below agreed terms without prior written consent.",
    timelineNotes:
      "Week 1: Signed placement confirmation and started technical assignment.\nWeeks 1–10: Weekly payslips issued consistently at agreed hourly rate.\nWeek 11: Retroactive negative adjustment appeared on loonstrook without signed addendum.\nAction taken: Sent written objection requesting itemized CAO calculation and prepared SNCU + Arbeidsinspectie dossier.",
    evidenceHeld: ["payslips", "contract", "written-messages", "bank-statements"],
    recommendedAuthorities: ["arbeidsinspectie", "sncu", "juridisch-loket"],
    attachments: [],
    createdAt: "2026-11-12T09:30:00.000Z",
    isSample: true,
  },
  {
    id: "sample-wr-002",
    caseNumber: "WR-2026-002",
    title: "Two months of paid commute fuel retroactively clawed back from earned salary",
    category: "transport-fuel",
    stage: "transport",
    region: "Zuid-Holland",
    weeksWorked: 9,
    disputedAmountEur: 540,
    authorAlias: "Sample Case · Commuting Technical Worker",
    summary:
      "Illustrative anonymized case: For two consecutive months the transport and payroll desks paid commute fuel/petrol costs without issue. After completing those shifts, the agency declared the reimbursements an 'internal mistake' and deducted the entire 2-month fuel total directly out of earned net wages.",
    timelineNotes:
      "Months 1–2: Fuel/commute costs reimbursed consistently while driving to assigned workplace.\nMonth 3: Transport/payroll desk claimed prior fuel payouts were made in error and applied a lump-sum negative deduction to net salary.\nAction taken: Preserved all payslips, fuel receipts, and transport messages; cited BW Art. 7:611 (good employership) and BW Art. 7:632 (wage set-off limits) for SNCU & legal counsel review.",
    evidenceHeld: ["payslips", "fuel-transport-logs", "written-messages", "bank-statements"],
    recommendedAuthorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
    attachments: [],
    createdAt: "2026-11-14T16:40:00.000Z",
    isSample: true,
  },
  {
    id: "sample-wr-003",
    caseNumber: "WR-2026-003",
    title: "Rodent infestation and unresolved sanitation defects in agency-deducted housing",
    category: "accommodation-snf",
    stage: "accommodation",
    region: "Noord-Brabant",
    weeksWorked: 14,
    disputedAmountEur: 620,
    authorAlias: "Sample Case · Logistics & Warehouse Worker",
    summary:
      "Illustrative anonymized case: Weekly housing charges were deducted directly from salary while shared kitchen and ground-floor bedrooms showed active rodent presence and dampness. Written maintenance tickets went unresolved for over three weeks.",
    timelineNotes:
      "Week 4: First written notice with timestamped kitchen/utility photos sent to housing portal.\nWeek 6: Second notice sent after no pest-control visit occurred.\nWeek 8: Verified SNF registration status and compiled SNF complaint + WAS 25% deduction check.",
    evidenceHeld: ["housing-photos", "payslips", "written-messages"],
    recommendedAuthorities: ["snf", "arbeidsinspectie", "fairwork"],
    attachments: [],
    createdAt: "2026-11-15T14:15:00.000Z",
    isSample: true,
  },
  {
    id: "sample-wr-004",
    caseNumber: "WR-2026-004",
    title: "Mismatch between advertised gross rate and Phase A contract pay scale",
    category: "contract-cao",
    stage: "coordination",
    region: "Noord-Holland",
    weeksWorked: 6,
    disputedAmountEur: 740,
    authorAlias: "Sample Case · Industrial Technician",
    summary:
      "Illustrative anonymized case: Recruitment offer referenced host-company skilled scale, but onboarding contract placed the worker two tiers lower without documenting the host company's inlenersbeloning statement.",
    timelineNotes:
      "Pre-arrival: Received written job summary with target hourly gross rate.\nDay 1: Signed digital contract under time pressure; scale differed from host-company peers.\nWeek 6: Requested formal inlenersbeloning overview under ABU/NBBU CAO and consulted Juridisch Loket.",
    evidenceHeld: ["contract", "payslips", "hours-log", "written-messages"],
    recommendedAuthorities: ["sncu", "juridisch-loket", "fairwork"],
    attachments: [],
    createdAt: "2026-11-18T11:00:00.000Z",
    isSample: true,
  },
  {
    id: "sample-wr-005",
    caseNumber: "WR-2026-005",
    title:
      "ADV hours omitted while vakantie-uren booked into minus (-€890) to pressure continued work",
    category: "contract-cao",
    stage: "payroll",
    region: "Overijssel",
    agencyName: "DIT & Larex",
    originCorridor: "EU → NL (Bouw / Techniek)",
    weeksWorked: 16,
    disputedAmountEur: 890,
    authorAlias: "Sample Case · Technical / Construction Worker",
    summary:
      "Illustrative anonymized case: On host-company ADV/closure days or lower-hour weeks, instead of applying host-company ADV hours (inlenersbeloning), the agency booked statutory holiday hours (vakantie-uren) into a negative balance, creating artificial debt to deter leaving or reduce final pay.",
    timelineNotes:
      "Weeks 1–12: Worked full technical schedule where permanent host-company staff accrued/used ADV hours.\nWeeks 13–16: Payslip showed vakantie-uren pushed deep into minus without written employee leave requests.\nLegal check: Cited BW Art. 7:638 (holiday hours set per worker's wish), BW Art. 7:628 (employer risk), BW Art. 7:632 (set-off ban), and ABU/NBBU CAO ADV parity for SNCU & counsel review.",
    evidenceHeld: ["payslips", "contract", "hours-log", "written-messages"],
    recommendedAuthorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
    attachments: [],
    createdAt: "2026-11-19T15:20:00.000Z",
    isSample: true,
  },
  {
    id: "sample-wr-006",
    caseNumber: "WR-2026-006",
    title:
      "Unanswered planning calls, unpaid guaranteed hours in housing & forced use of personal gear (-€1,150)",
    category: "hours-overtime",
    stage: "coordination",
    region: "Noord-Brabant",
    originCorridor: "EU → NL",
    weeksWorked: 5,
    disputedAmountEur: 1150,
    authorAlias: "Sample Case · International Temp Worker",
    summary:
      "Illustrative anonymized case: Despite a written weekly hours guarantee, the agency stopped scheduling shifts, ignored phone calls, left the worker in agency housing accumulating rent debt without pay, and previously required personal phone, car, and tools for work.",
    timelineNotes:
      "Weeks 1–3: Completed shifts while using personal phone/car and own work gear without reimbursement.\nWeeks 4–5: Planning desk stopped assigning shifts and did not answer phone calls while housing charges continued.\nLegal check: Sent written availability notice under BW Art. 7:628 (loondoorbetaling) + Arbowet PPE/equipment claim to SNCU, Arbeidsinspectie & Juridisch Loket.",
    evidenceHeld: ["contract", "written-messages", "payslips", "hours-log"],
    recommendedAuthorities: ["sncu", "arbeidsinspectie", "juridisch-loket"],
    attachments: [],
    createdAt: "2026-11-20T01:10:00.000Z",
    isSample: true,
  },
];

export interface BrusselsChannel {
  id: string;
  name: string;
  shortTag: string;
  scope: string;
  url: string;
  actionLabel: string;
}

export const BRUSSELS_CHANNELS: BrusselsChannel[] = [
  {
    id: "ela",
    name: "European Labour Authority (ELA)",
    shortTag: "EU Mobility & Joint Inspections",
    scope:
      "Supports cross-border labor inspections, social dumping investigations, and fair mobility enforcement across EU member states.",
    url: "https://www.ela.europa.eu/",
    actionLabel: "Visit ELA (EU) ↗",
  },
  {
    id: "eu-commission",
    name: "European Commission · EU Law Breach Complaint",
    shortTag: "Brussels Infringement Channel",
    scope:
      "Formal Brussels portal to report systemic national failures or breaches of EU labor directives by a member state.",
    url: "https://commission.europa.eu/about-european-commission/contact/problems-and-complaints/complaints-about-breaches-eu-law-member-countries_en",
    actionLabel: "Report EU Law Breach ↗",
  },
  {
    id: "solvit",
    name: "SOLVIT (EU Internal Market Network)",
    shortTag: "Cross-Border Expat Rights",
    scope:
      "Free EU network resolving cross-border problems where public authorities fail to uphold EU free-movement and worker rights.",
    url: "https://solvit.ec.europa.eu/",
    actionLabel: "Open SOLVIT EU ↗",
  },
  {
    id: "ep-petitions",
    name: "European Parliament Petitions (PETI)",
    shortTag: "Brussels Political Oversight",
    scope:
      "Submit formal collective petitions to Brussels highlighting widespread cross-border agency abuse or national enforcement gaps.",
    url: "https://www.europarl.europa.eu/petitions/en/home",
    actionLabel: "Petition Brussels (PETI) ↗",
  },
];

export function formatLegalBrief(report: WorkerReport): string {
  const cat = CATEGORY_META[report.category];
  const authorityNames = report.recommendedAuthorities
    .map((id) => `${DUTCH_AUTHORITIES[id].name} (${DUTCH_AUTHORITIES[id].url})`)
    .join("\n  - ");
  const brusselsNames = BRUSSELS_CHANNELS.map(
    (ch) => `${ch.name} (${ch.url})`
  ).join("\n  - ");
  const evidenceList =
    report.evidenceHeld.length > 0
      ? report.evidenceHeld.map((e) => `  - [x] ${EVIDENCE_LABELS[e]}`).join("\n")
      : "  - (No offline evidence items selected yet)";

  return [
    "================================================================",
    "EXTERNAL EU & DUTCH WORKER CASE BRIEF (NL + BRUSSELS ESCALATION)",
    "================================================================",
    `Case Reference:   ${report.caseNumber}`,
    `Date Logged:      ${report.createdAt.slice(0, 10)}`,
    `Issue Category:   ${cat.label}`,
    `Lifecycle Stage:  ${report.stage.toUpperCase()}`,
    `Region (NL):      ${report.region}`,
    ...(report.agencyName ? [`Agency / Desk:    ${report.agencyName}`] : []),
    ...(report.originCorridor
      ? [`EU Corridor:      ${report.originCorridor}`]
      : []),
    `Weeks Worked:     ${report.weeksWorked ?? "Not specified"}`,
    `Amount on Minus:  ${report.disputedAmountEur !== null ? `-EUR ${report.disputedAmountEur.toLocaleString("en-IE")}` : "Not specified"}`,
    `Submitted By:     ${report.authorAlias}`,
    "",
    "1. FACTUAL SUMMARY",
    "----------------------------------------------------------------",
    report.summary,
    "",
    "2. CHRONOLOGICAL TIMELINE",
    "----------------------------------------------------------------",
    report.timelineNotes || "(No chronological timeline provided)",
    "",
    "3. SUPPORTING EVIDENCE HELD BY WORKER (FOR DIRECT SUBMISSION)",
    "----------------------------------------------------------------",
    evidenceList,
    "",
    "4. COMPETENT DUTCH ENFORCEMENT BODIES",
    "----------------------------------------------------------------",
    `  - ${authorityNames}`,
    "",
    "5. EXTERNAL BRUSSELS / EU ESCALATION CHANNELS",
    "----------------------------------------------------------------",
    `  - ${brusselsNames}`,
    "",
    "NOTE: Formatted for external regulatory, legal, and EU oversight.",
    "Personal identifiers of third-party staff should remain omitted from",
    "public posts and provided only when formally requested by counsel or",
    "a statutory authority.",
    "================================================================",
  ].join("\n");
}
