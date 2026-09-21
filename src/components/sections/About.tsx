"use client";

import { BriefcaseIcon as Briefcase, ShieldCheckIcon as ShieldCheck } from "@phosphor-icons/react/ssr";
import { motion } from "framer-motion";
import Image from "next/image";
import { slideFromLeft, slideFromRight } from "@/components/motion/variants";

const FACTS = [
  {
    icon: ShieldCheck,
    label: "Accreditation",
    value: "PRC-Accredited Real Estate Salesperson (RES: 0032198)",
  },
  {
    icon: Briefcase,
    label: "Role",
    value: "Vice President, Dream House Realty",
  },
];

export function About() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <motion.div initial="hidden" animate="show" variants={slideFromLeft} className="relative lg:col-span-6">
            <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background-secondary">
              <Image
                src="/arnold-fadriquila.png"
                alt="Arnold B. Fadriquila, RES"
                fill
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={slideFromRight} className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">About Me</p>
            <h1 className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              Arnold B. Fadriquila
            </h1>
            <p className="mt-2 text-base font-medium text-muted">
              Real Estate Professional · Dream House Realty
            </p>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70">
              Arnold works as a PRC-accredited real estate salesperson under the{" "}
              <span className="font-semibold text-foreground">Real Estate Service Act (RA 9646)</span>,
              which means every listing he presents and every transaction he assists with is carried
              out under the direct supervision of a licensed real estate broker — giving clients an
              added layer of accountability at every step. As Vice President of{" "}
              <span className="font-semibold text-foreground">Dream House Realty</span>, he helps
              buyers, sellers, and overseas investors navigate property options across Luzon,
              Visayas, and Mindanao — from first inquiry to move-in day.
            </p>

            <dl className="mt-10 grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {FACTS.map((f) => (
                <div key={f.label} className="flex items-start gap-3 py-5 sm:pr-6 sm:first:pl-0 sm:last:pl-6">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
