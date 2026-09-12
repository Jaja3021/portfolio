"use client";

import { BriefcaseIcon as Briefcase, ShieldCheckIcon as ShieldCheck, StarIcon as Star } from "@phosphor-icons/react/ssr";
import { motion } from "framer-motion";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { slideFromLeft, slideFromRight } from "@/components/motion/variants";

const CREDENTIALS = [{ icon: ShieldCheck, label: "PRC-Licensed Real Estate Salesperson" }];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#2e2019] to-accent-dark">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:18px_18px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={slideFromLeft}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-accent-light">
            <ShieldCheck className="h-3.5 w-3.5" />
            Philippine Real Estate Professional
          </span>

          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Find the <span className="text-accent-light">Right Property</span>.
            <br />
            In the Right Place.
            <br />
            At the Right Value.
          </h1>

          <p className="mt-6 max-w-lg text-base text-white/80 sm:text-lg">
            I&apos;m <span className="font-semibold text-white">Arnold B. Fadriquila, RES</span> — a
            licensed real estate professional helping clients find and secure the right property
            across the Philippines, from first-time buyers to overseas investors.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <LinkButton href="/properties" size="lg">
              View Properties
            </LinkButton>
            <LinkButton
              href="/about"
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:border-accent-light hover:text-white"
            >
              About Arnold
            </LinkButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {CREDENTIALS.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                <c.icon className="h-3.5 w-3.5 text-accent-light" />
                {c.label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={slideFromRight}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/5 text-center">
            <Image
              src="/arnold-fadriquila.jpg"
              alt="Arnold B. Fadriquila, RES"
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="absolute -left-4 -top-6 z-10 flex items-center gap-2 rounded-xl bg-surface px-4 py-3 shadow-lg sm:-left-8 sm:-top-8">
            <Briefcase className="h-4 w-4 text-accent" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/70">
                Vice President
              </p>
              <p className="text-sm font-bold text-accent">Dream House Realty</p>
            </div>
          </div>

          <div className="absolute -right-4 bottom-6 flex items-center gap-2 rounded-xl bg-surface px-4 py-3 shadow-lg sm:-right-8">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <p className="text-sm font-bold text-foreground">
              4.9 <span className="font-medium text-foreground/70">/ 5</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
