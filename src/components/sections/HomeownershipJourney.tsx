"use client";

import { useState } from "react";
import {
  CurrencyCircleDollarIcon as CurrencyCircleDollar,
  MagnifyingGlassIcon as Search,
  CalendarCheckIcon as CalendarCheck,
  HandshakeIcon as Handshake,
  FileTextIcon as FileText,
  KeyIcon as KeyRound,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { DURATION, EASE, fadeUp } from "@/components/motion/variants";

const descriptionCardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE, delay: 0.85 } },
};

const STEPS = [
  {
    icon: CurrencyCircleDollar,
    title: "Get Financially Ready",
    description:
      "Set your budget and explore financing options — bank loan, Pag-IBIG, or in-house financing — so you know what you can afford.",
  },
  {
    icon: Search,
    title: "Search & Shortlist Properties",
    description: "Browse listings and locations together, narrowed down to what fits your needs and budget.",
  },
  {
    icon: CalendarCheck,
    title: "Site Viewing",
    description: "Schedule and tour your shortlisted properties in person before making a decision.",
  },
  {
    icon: Handshake,
    title: "Reservation & Financing",
    description: "Reserve your chosen unit or lot and finalize the loan or payment terms that work for you.",
  },
  {
    icon: FileText,
    title: "Documentation & Approval",
    description: "Complete the requirements and contracts while financing and paperwork move through approval.",
  },
  {
    icon: KeyRound,
    title: "Closing & Turnover",
    description: "Settle the final payment, complete turnover, and get the keys to move into your new home.",
  },
];

export function HomeownershipJourney() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="The Journey"
            title="Your Path to Homeownership"
            description="From getting financially ready to holding your new keys — here's what the process looks like."
          />
        </Reveal>

        {/* Desktop: horizontal stepper with connecting progress line */}
        <StaggerGroup as="ol" className="hidden sm:flex sm:items-start" staggerChildren={0.12}>
          {STEPS.map((s, i) => (
            <StaggerItem key={s.title} as="li" className="flex flex-1 flex-col items-center last:flex-none">
              <div className="flex w-full items-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    i <= active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-foreground/70 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
                {i < STEPS.length - 1 && (
                  <div className="mx-1 h-1 flex-1 rounded-full bg-border">
                    <div
                      className={`h-full rounded-full bg-primary transition-all ${i < active ? "w-full" : "w-0"}`}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`mt-3 max-w-[8rem] text-center text-xs font-medium leading-snug transition-colors ${
                  i === active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {s.title}
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal variants={descriptionCardVariants} className="mt-10 hidden rounded-xl border border-border bg-surface p-6 sm:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
            <step.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            {active + 1}. {step.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
        </Reveal>

        {/* Mobile: stacked accordion-style list */}
        <StaggerGroup as="ol" className="flex flex-col gap-3 sm:hidden" staggerChildren={0.12}>
          {STEPS.map((s, i) => {
            const isActive = i === active;
            return (
              <StaggerItem key={s.title} as="li" className="rounded-lg border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setActive(isActive ? active : i)}
                  aria-current={isActive ? "step" : undefined}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}
                  >
                    {s.title}
                  </span>
                </button>
                {isActive && (
                  <p className="px-4 pb-4 pl-11 text-sm leading-relaxed text-muted">
                    {s.description}
                  </p>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
