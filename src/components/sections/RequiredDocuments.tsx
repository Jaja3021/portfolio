"use client";

import { AirplaneTiltIcon as Plane, BriefcaseIcon as Briefcase } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/components/motion/variants";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Checklist = "ofw" | "local";

// Items ending in "*" apply only if relevant (married, taxable, government employee, ...).
const CHECKLISTS: Record<Checklist, { label: string; icon: typeof Plane; items: string[] }> = {
  ofw: {
    label: "OFW",
    icon: Plane,
    items: [
      "HELP Seminar",
      "Latest job contract",
      "TIN ID / BIR 1904 (TIN verified)",
      "Back-to-back copy of government valid ID with 3 specimen signatures",
      "Pag-IBIG Loyalty Card Plus ID with 3 specimen signatures",
      "Proof of SSS / GSIS number",
      "Copy of birth certificate, if single",
      "Copy of marriage contract, if married*",
      "Copy of 2 valid IDs of spouse, if applicable*",
      "4 pcs 1x1 picture with name tag",
      "Proof of billing / barangay clearance",
      "Passport / visa",
      "Special Power of Attorney",
      "2 valid IDs of Attorney-in-Fact with 3 specimen signatures",
      "2 pcs 1x1 picture of Attorney-in-Fact",
      "E-ticket",
      "Entry / exit arrival stamp",
      "Resident ID",
      "Overseas Employment Certificate",
      "ESAV (under POP)",
      "MDF (under OFW)",
    ],
  },
  local: {
    label: "Locally Employed",
    icon: Briefcase,
    items: [
      "HELP Seminar",
      "Latest original Certificate of Employment with Compensation",
      "Latest 1-month payslip",
      "TIN ID / BIR 1904 (TIN verified)",
      "Back-to-back copy of company ID with 3 specimen signatures",
      "Back-to-back copy of government valid ID with 3 specimen signatures",
      "Pag-IBIG Loyalty Card Plus ID with 3 specimen signatures",
      "Proof of SSS / GSIS number",
      "Copy of birth certificate, if single",
      "Copy of marriage contract, if married*",
      "Copy of 2 valid IDs of spouse, if applicable*",
      "4 pcs 1x1 picture with name tag",
      "Proof of billing / barangay clearance",
      "ESAV",
      "MDF",
      "BIR ITR 2316, if taxable*",
      "Service record, if a government employee*",
    ],
  },
};

export function RequiredDocuments({
  defaultChecklist = "ofw",
  showHeading = true,
}: {
  defaultChecklist?: Checklist;
  /** Off on /requirements, which has its own page title. */
  showHeading?: boolean;
}) {
  const [active, setActive] = useState<Checklist>(defaultChecklist);
  const checklist = CHECKLISTS[active];

  return (
    <section id="required-documents" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {showHeading && (
          <Reveal variants={fadeUp}>
            <SectionHeading
              eyebrow="Checklist"
              title="Required Documents"
              description="What to prepare for your housing loan application. Choose the list that matches your employment."
            />
          </Reveal>
        )}

        <div role="tablist" aria-label="Checklist" className="mx-auto mb-8 grid max-w-md grid-cols-2 gap-1 rounded-lg bg-background-secondary p-1">
          {(Object.keys(CHECKLISTS) as Checklist[]).map((key) => {
            const { label, icon: Icon } = CHECKLISTS[key];
            const selected = active === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`checklist-tab-${key}`}
                aria-selected={selected}
                aria-controls="checklist-panel"
                onClick={() => setActive(key)}
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  selected ? "bg-primary text-white shadow-sm" : "text-foreground/70 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" weight={selected ? "fill" : "regular"} />
                {label}
              </button>
            );
          })}
        </div>

        <ol
          id="checklist-panel"
          role="tabpanel"
          aria-labelledby={`checklist-tab-${active}`}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {checklist.items.map((item, i) => {
            const optional = item.endsWith("*");
            return (
              <li
                key={`${active}-${item}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5"
              >
                <span className="w-7 shrink-0 text-lg font-bold tabular-nums text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-snug text-foreground/80">
                  {optional ? item.slice(0, -1) : item}
                  {optional && <span className="text-accent">*</span>}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-center text-xs text-muted">
          * Only if applicable. Requirements may vary by developer and lender. I&apos;ll confirm the exact list for your
          chosen property.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/contact">Ask About Requirements</LinkButton>
          {active === "ofw" && (
            <LinkButton href="/ofw" variant="outline">
              Full Guide for OFWs
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}
