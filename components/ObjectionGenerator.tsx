"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_TEXT } from "@/lib/i18n-ui";

type DisputeType =
  | "wage-clawback"
  | "fuel-clawback"
  | "adv-holiday-minus"
  | "benched-guarantee-hours"
  | "combined";
type LetterLang = "bilingual" | "nl";

let cachedClientDate: string | null = null;
function subscribeNoop() {
  return () => {};
}
function getClientDateSnapshot(): string {
  if (!cachedClientDate) {
    cachedClientDate = new Date().toISOString().slice(0, 10);
  }
  return cachedClientDate;
}
function getServerDateSnapshot(): string {
  return "";
}

export function ObjectionGenerator() {
  const { locale } = useLanguage();
  const copy = UI_TEXT[locale].objection;

  const [disputeType, setDisputeType] = useState<DisputeType>("combined");
  const [letterLangOverride, setLetterLangOverride] =
    useState<LetterLang | null>(null);
  const [workerName, setWorkerName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [weeksWorked, setWeeksWorked] = useState("");
  const [deductionDate, setDeductionDate] = useState("");
  const [wageAmount, setWageAmount] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [copied, setCopied] = useState(false);

  const todayDate = useSyncExternalStore(
    subscribeNoop,
    getClientDateSnapshot,
    getServerDateSnapshot
  );

  useEffect(() => {
    function onPrefillObjection(e: Event) {
      const custom = e as CustomEvent<{
        disputeType?: DisputeType;
        agencyName?: string;
      }>;
      if (!custom.detail) return;
      if (custom.detail.disputeType) {
        setDisputeType(custom.detail.disputeType);
      }
      if (custom.detail.agencyName) {
        setAgencyName(custom.detail.agencyName);
      }
    }
    window.addEventListener("werkrecht-prefill-objection", onPrefillObjection);
    return () => {
      window.removeEventListener(
        "werkrecht-prefill-objection",
        onPrefillObjection
      );
    };
  }, []);

  const lang: LetterLang =
    letterLangOverride ?? (locale === "nl" ? "nl" : "bilingual");

  const generatedLetter = useMemo(() => {
    const today = todayDate || (lang === "nl" ? "[DATUM]" : "[DATE]");
    const worker =
      workerName.trim() ||
      (lang === "nl" ? "[JOUW VOLLEDIGE NAAM]" : "[YOUR FULL NAME]");
    const agency =
      agencyName.trim() ||
      (lang === "nl"
        ? "[NAAM UITZENDBUREAU B.V.]"
        : "[STAFFING AGENCY LEGAL NAME]");
    const weeks = weeksWorked.trim() || "[AANTAL]";
    const dedDate =
      deductionDate.trim() ||
      (lang === "nl"
        ? "[LOONSTROOK DATUM / WEEKNUMMER]"
        : "[PAYSLIP DATE / WEEK NUMBER]");
    const wageEur = Number(wageAmount) > 0 ? Number(wageAmount) : 0;
    const fuelEur = Number(fuelAmount) > 0 ? Number(fuelAmount) : 0;
    const days = deadlineDays.trim() || "7";

    const totalClaim =
      disputeType === "fuel-clawback"
        ? fuelEur
        : disputeType === "combined"
          ? wageEur + fuelEur
          : wageEur;

    if (lang === "nl") {
      const disputeParagraph =
        disputeType === "wage-clawback"
          ? `Na ${weeks} weken werkzaamheden tegen het overeengekomen uurloon heeft u op loonstrook ${dedDate} eenzijdig en met terugwerkende kracht €${wageEur.toLocaleString("nl-NL")} op mijn salaris ingehouden.`
          : disputeType === "fuel-clawback"
            ? `Gedurende circa twee maanden heeft u mijn brandstof-/reiskosten vergoed. Op loonstrook ${dedDate} heeft u deze reeds betaalde vergoeding eenzijdig als 'fout' bestempeld en €${fuelEur.toLocaleString("nl-NL")} rechtstreeks op mijn nettoloon ingehouden.`
            : disputeType === "adv-holiday-minus"
              ? `Na ${weeks} weken werkzaamheden heeft u op loonstrook ${dedDate} mijn wettelijke vakantie-uren eenzijdig in de min gezet (ter waarde van circa €${wageEur.toLocaleString("nl-NL")}) in plaats van geldende ADV-/ATV-uren conform de inlenersbeloning toe te passen. Ik heb nooit schriftelijk verzocht om extra verlof op te nemen of mijn vakantiesaldo negatief te maken.`
              : disputeType === "benched-guarantee-hours"
                ? `Ondanks mijn overeengekomen urengarantie en herhaalde pogingen om contact op te nemen met de planning, blijven telefoontjes onbeantwoord, ben ik niet ingepland en ontvang ik geen loon over mijn garantie-uren (openstaand circa €${wageEur.toLocaleString("nl-NL")}) terwijl de huisvestingskosten doorlopen. Daarnaast ben ik verplicht om eigen middelen (telefoon, vervoer en/of werkkleding/gereedschap) te gebruiken zonder volledige vergoeding. Ik verklaar hierbij uitdrukkelijk beschikbaar te zijn en te blijven voor arbeid.`
                : `Na ${weeks} weken werkzaamheden heeft u op loonstrook ${dedDate} eenzijdig en met terugwerkende kracht bedragen op mijn salaris ingehouden: €${wageEur.toLocaleString("nl-NL")} aan looncorrectie en €${fuelEur.toLocaleString("nl-NL")} aan eerder gedurende twee maanden vergoede brandstof-/reiskosten (totaal: €${totalClaim.toLocaleString("nl-NL")}).`;

      const lawBasis =
        disputeType === "adv-holiday-minus"
          ? "Onder Nederlands arbeidsrecht worden vakantie-uren vastgesteld overeenkomstig de wens van de werknemer (artikel 7:638 BW), blijft onvoldoende werk of roosteruitval voor risico van de werkgever (artikel 7:628 BW), is eenzijdige loonverrekening verboden (artikel 7:632 BW) en heeft een uitzendkracht recht op ADV-uren/vergoeding gelijk aan de inlener (ABU/NBBU CAO inlenersbeloning)."
          : disputeType === "benched-guarantee-hours"
            ? "Op grond van artikel 7:628 BW (loondoorbetaling bij geen of onvoldoende werk) en de toepasselijke ABU/NBBU CAO blijft u verplicht de overeengekomen garantie-uren door te betalen zolang ik mij beschikbaar houd voor werk. Bovendien moeten vereiste werkmiddelen en persoonlijke beschermingsmiddelen (PBM's) op grond van de Arbowet en goed werkgeverschap (art. 7:611 BW) kosteloos worden verstrekt of volledig vergoed."
            : "Ik heb hiervoor geen voorafgaande schriftelijke toestemming gegeven. Onder Nederlands arbeidsrecht gelden strikte wettelijke grenzen voor verrekening en inhouding op het loon (waaronder artikel 7:632 BW, de Wet aanpak schijnconstructies (WAS), goed werkgeverschap ex artikel 7:611 BW en de toepasselijke ABU/NBBU CAO).";

      const actionItem1 =
        disputeType === "adv-holiday-minus"
          ? `1. Binnen ${days} kalenderdagen het onterechte negatieve saldo vakantie-uren volledig te schrappen, de juiste ADV-/ATV-uren conform de inlenersbeloning bij te boeken en eventueel ingehouden bedragen (€${totalClaim.toLocaleString("nl-NL")}) volledig uit te betalen;`
          : disputeType === "benched-guarantee-hours"
            ? `1. Binnen ${days} kalenderdagen de achterstallige garantie-uren (€${totalClaim.toLocaleString("nl-NL")}) volledig uit te betalen, mij direct weer in te plannen zonder oplopende huurschuld en verplichte werkmiddelen/PBM's kosteloos te verstrekken;`
            : `1. Binnen ${days} kalenderdagen na dagtekening het ingehouden bedrag van €${totalClaim.toLocaleString("nl-NL")} volledig op mijn bankrekening over te maken;`;

      return [
        `Datum: ${today}`,
        `Aan: ${agency} (t.a.v. Salarisadministratie / Directie)`,
        `Van: ${worker}`,
        `Onderwerp: ${
          disputeType === "adv-holiday-minus"
            ? "Formeel bezwaar tegen negatieve vakantie-uren i.p.v. ADV-uren (inlenersbeloning)"
            : disputeType === "benched-guarantee-hours"
              ? "Beschikbaarheidsmelding (art. 7:628 BW) & sommatie betaling garantie-uren / werkmiddelen"
              : "Formeel bezwaar en sommatie tot uitbetaling onterechte looninhouding"
        }`,
        "",
        "Geachte heer/mevrouw,",
        "",
        disputeType === "adv-holiday-minus"
          ? "Hierbij maak ik formeel bezwaar tegen het eenzijdig in de min zetten van mijn vakantie-uren in plaats van het toepassen van geldende ADV-uren."
          : disputeType === "benched-guarantee-hours"
            ? "Hierbij stel ik mij uitdrukkelijk beschikbaar voor arbeid en maak ik bezwaar tegen het onbetaald laten van mijn garantie-uren terwijl planning en telefonisch contact uitblijven."
            : "Hierbij maak ik formeel bezwaar tegen de eenzijdige inhouding/verrekening op mijn salaris.",
        "",
        disputeParagraph,
        "",
        lawBasis,
        "",
        "Ik verzoek en — voor zover nodig — sommeer u hierbij om:",
        actionItem1,
        "2. Mij binnen dezelfde termijn een volledige, gespecificeerde berekening te verstrekken inclusief de toegepaste inlenersbeloning en schriftelijke grondslag.",
        "",
        `Indien correctie en/of betaling binnen ${days} kalenderdagen uitblijft, behoud ik mij alle rechten voor, waaronder aanspraak op de wettelijke verhoging (artikel 7:625 BW) en wettelijke rente, alsmede melding bij de SNCU, de Nederlandse Arbeidsinspectie en verdere juridische stappen via een arbeidsrechtadvocaat.`,
        "",
        "Met vriendelijke groet,",
        "",
        worker,
        "[E-mailadres / Telefoonnummer]",
        "",
        "(Conceptbrief ter voorbereiding — laat deze bij twijfel kosteloos controleren door Het Juridisch Loket of een arbeidsrechtadvocaat.)",
      ].join("\n");
    }

    const issueBlock =
      disputeType === "wage-clawback"
        ? `After ${weeks} weeks of work paid at the agreed rate, payslip ${dedDate} contains a unilateral retroactive salary deduction of EUR ${wageEur.toLocaleString("en-IE")}.`
        : disputeType === "fuel-clawback"
          ? `After paying commute fuel/petrol reimbursements consistently over roughly two months, payslip ${dedDate} retroactively deducted EUR ${fuelEur.toLocaleString("en-IE")} directly from my earned net wages as an alleged internal mistake.`
          : disputeType === "adv-holiday-minus"
            ? `After ${weeks} weeks of work, payslip ${dedDate} placed my statutory holiday hours (vakantie-uren) into a negative balance (approx. EUR ${wageEur.toLocaleString("en-IE")} value) instead of applying applicable ADV/ATV hours under host-company pay parity (inlenersbeloning). I never requested unpaid or negative holiday leave in writing.`
            : disputeType === "benched-guarantee-hours"
              ? `Despite my contractual weekly hours guarantee and repeated calls to the planning desk, phone calls go unanswered, no shifts are scheduled, and guaranteed wages (approx. EUR ${wageEur.toLocaleString("en-IE")}) remain unpaid while agency housing charges continue. I was also required to use my personal phone, vehicle, or tools without reimbursement. I hereby confirm in writing that I remain available for work.`
              : `After ${weeks} weeks of work, payslip ${dedDate} contains unilateral retroactive deductions from my earned salary: EUR ${wageEur.toLocaleString("en-IE")} in retroactive wage reduction and EUR ${fuelEur.toLocaleString("en-IE")} in previously reimbursed fuel/transport costs (total disputed: EUR ${totalClaim.toLocaleString("en-IE")}).`;

    const enLawBlock =
      disputeType === "adv-holiday-minus"
        ? "Under Dutch employment law, holiday hours are scheduled in accordance with the employee's wishes (BW Art. 7:638), lack of work or host scheduling closures remain the employer's risk (BW Art. 7:628), unilateral wage set-off is prohibited (BW Art. 7:632), and temp workers are entitled to the host company's ADV/ATV scheme under ABU/NBBU CAO parity (inlenersbeloning)."
        : disputeType === "benched-guarantee-hours"
          ? "Under Dutch Civil Code Art. 7:628 (employer pay duty during lack of planning) and the applicable ABU/NBBU CAO, you remain legally obliged to pay agreed/guaranteed hours while I keep myself available for work. Under the Working Conditions Act (Arbowet) and BW Art. 7:611, mandatory safety gear (PPE) and work tools must be provided free of charge or fully reimbursed."
          : "I did not give prior written consent to this retroactive deduction or wage set-off. Under Dutch employment law, unilateral wage deductions and clawbacks are strictly restricted by Dutch Civil Code Art. 7:632 (verrekening), Art. 7:611 (goed werkgeverschap / good employership), the Wet aanpak schijnconstructies (WAS), and the applicable ABU/NBBU Collective Labor Agreement (CAO).";

    const enActionItem1 =
      disputeType === "adv-holiday-minus"
        ? `1. Remove the unilateral negative vakantie-uren balance, apply the correct ADV/ATV hours under host-company parity, and repay any deducted amount (EUR ${totalClaim.toLocaleString("en-IE")}) to my bank account;`
        : disputeType === "benched-guarantee-hours"
          ? `1. Pay all overdue guaranteed-hours wages (EUR ${totalClaim.toLocaleString("en-IE")}) to my bank account, resume lawful shift scheduling without accumulating housing debt, and provide/reimburse required work equipment & PPE;`
          : `1. Repay the full withheld amount of EUR ${totalClaim.toLocaleString("en-IE")} to my bank account; and`;

    return [
      `Date: ${today}`,
      `To: ${agency} (Attn: Payroll Administration / Management)`,
      `From: ${worker}`,
      `Subject: ${
        disputeType === "adv-holiday-minus"
          ? "Formal Written Objection — Unlawful Negative Holiday Balance Instead of ADV Hours"
          : disputeType === "benched-guarantee-hours"
            ? "Written Availability Notice (BW Art. 7:628) & Demand for Unpaid Guarantee Hours"
            : "Formal Written Objection & Wage Demand (Formeel Bezwaar Looninhouding / Sommatie)"
      }`,
      "",
      "Dear Sir / Madam,",
      "",
      disputeType === "adv-holiday-minus"
        ? "I hereby formally object to my vakantie-uren being placed into a negative balance instead of applying ADV hours."
        : disputeType === "benched-guarantee-hours"
          ? "I hereby confirm in writing that I am available for work and formally demand payment of my unpaid guaranteed hours while calls and shift scheduling are withheld."
          : "I hereby formally object to the unilateral retroactive deduction applied to my salary.",
      "",
      issueBlock,
      "",
      enLawBlock,
      "",
      `I formally request that within ${days} calendar days of this notice you:`,
      enActionItem1,
      "2. Provide an itemized written explanation showing the applicable CAO pay scale (inlenersbeloning), ADV/travel policy, and claimed legal basis.",
      "",
      `If correction/payment is not received within ${days} calendar days, I reserve all rights under Dutch law—including claiming statutory late-payment uplift up to 50% (BW Art. 7:625) and statutory interest—and will escalate the documented file to SNCU, Nederlandse Arbeidsinspectie, and Dutch employment counsel.`,
      "",
      "Kind regards,",
      "",
      worker,
      "[Email / Phone Number]",
      "",
      "(Draft template for legal preparation — review with Het Juridisch Loket or a Dutch employment lawyer before sending.)",
    ].join("\n");
  }, [
    agencyName,
    deadlineDays,
    deductionDate,
    disputeType,
    fuelAmount,
    lang,
    todayDate,
    wageAmount,
    weeksWorked,
    workerName,
  ]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      handleDownload();
    }
  }

  function handleDownload() {
    const blob = new Blob([generatedLetter], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wage-objection-${lang}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="objection-letter"
      className="scroll-mt-20 border-b border-slate-200 bg-[#f8f9fa] py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D95D24]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {copy.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {copy.intro}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5">
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-slate-800">
                  {copy.disputeTypeLabel}
                </span>
                <div className="mt-1.5 grid grid-cols-1 gap-2">
                  {(
                    [
                      ["combined", copy.combinedOption],
                      ["wage-clawback", copy.wageOption],
                      ["fuel-clawback", copy.fuelOption],
                      ["adv-holiday-minus", copy.advMinusOption],
                      ["benched-guarantee-hours", copy.benchedOption],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDisputeType(value)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                        disputeType === value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800">
                  {copy.letterLangLabel}
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLetterLangOverride("nl")}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                      lang === "nl"
                        ? "border-[#D95D24] bg-[#D95D24] text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {copy.nlBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLetterLangOverride("bilingual")}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                      lang === "bilingual"
                        ? "border-[#D95D24] bg-[#D95D24] text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {copy.bilingualBtn}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="obj-worker"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.workerLabel}
                  </label>
                  <input
                    id="obj-worker"
                    type="text"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder={copy.workerPlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="obj-agency"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.agencyLabel}
                  </label>
                  <input
                    id="obj-agency"
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder={copy.agencyPlaceholder}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="obj-weeks"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.weeksLabel}
                  </label>
                    <input
                      id="obj-weeks"
                      type="number"
                      min={1}
                      value={weeksWorked}
                      onChange={(e) => setWeeksWorked(e.target.value)}
                      placeholder="10"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="obj-date"
                      className="block text-xs font-semibold text-slate-800"
                    >
                      {copy.payslipDateLabel}
                    </label>
                    <input
                      id="obj-date"
                      type="text"
                      value={deductionDate}
                      onChange={(e) => setDeductionDate(e.target.value)}
                      placeholder={copy.payslipDatePlaceholder}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {disputeType !== "fuel-clawback" && (
                    <div>
                      <label
                        htmlFor="obj-wage"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        {copy.wageEurLabel}
                      </label>
                      <input
                        id="obj-wage"
                        type="number"
                        min={0}
                        value={wageAmount}
                        onChange={(e) => setWageAmount(e.target.value)}
                        placeholder="0"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  )}
                  {(disputeType === "combined" ||
                    disputeType === "fuel-clawback") && (
                    <div>
                      <label
                        htmlFor="obj-fuel"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        {copy.fuelEurLabel}
                      </label>
                      <input
                        id="obj-fuel"
                        type="number"
                        min={0}
                        value={fuelAmount}
                        onChange={(e) => setFuelAmount(e.target.value)}
                        placeholder="0"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  )}
                <div>
                  <label
                    htmlFor="obj-days"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {copy.deadlineLabel}
                  </label>
                  <input
                    id="obj-days"
                    type="number"
                    min={3}
                    max={30}
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Letter Preview */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-xs lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  {copy.previewTag}
                </span>
                <p className="text-xs text-slate-400">{copy.previewNote}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg bg-[#D95D24] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  {copied ? copy.copiedBtn : copy.copyBtn}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500"
                >
                  {copy.downloadBtn}
                </button>
              </div>
            </div>

            <pre className="mt-4 flex-1 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
              {generatedLetter}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
