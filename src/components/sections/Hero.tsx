"use client";

import {
  BriefcaseIcon as Briefcase,
  ShieldCheckIcon as ShieldCheck,
  StarIcon as Star,
} from "@phosphor-icons/react/ssr";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EASE, slideFromLeft, slideFromRight } from "@/components/motion/variants";

const CREDENTIALS = [{ icon: ShieldCheck, label: "PRC-Licensed Real Estate Salesperson (RES: 0032198)" }];

const HEADLINE = ["Are you looking for a", "Real Estate Agent?"];

// Each word rises into place one after another, then the greeting line follows.
function AnimatedWords({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.08 }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-br from-[#081d13] via-primary to-[#0a2818]">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={slideFromLeft}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Philippine Real Estate Professional
          </p>

          <h1 className="font-display mt-5 max-w-xl text-4xl font-normal leading-[1.15] tracking-tight text-white sm:text-5xl">
            <AnimatedWords text={HEADLINE[0]} delay={0.2} />
            <br />
            <AnimatedWords text={HEADLINE[1]} delay={0.6} className="text-accent" />
          </h1>

          <motion.p
            className="mt-5 max-w-lg text-xl text-white sm:text-2xl"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
          >
            This is <span className="font-semibold">Arnold</span>, your real estate agent guide.
          </motion.p>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            I&apos;m <span className="font-semibold text-white">Arnold B. Fadriquila, RES</span> — a
            licensed real estate professional helping clients find and secure the right property
            across the Philippines, from first-time buyers to overseas investors.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-lg bg-accent px-8 text-base font-medium text-white transition-colors hover:bg-accent-dark"
            >
              View Properties
            </Link>
            <Link
              href="/about"
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              About Arnold
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6">
            {CREDENTIALS.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                <c.icon className="h-3.5 w-3.5 text-accent" />
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
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl bg-surface shadow-2xl">
            <Image
              src="/arnold-fadriquila.png"
              alt="Arnold B. Fadriquila, RES"
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="absolute -left-4 -top-6 z-10 flex items-center gap-2 rounded-lg bg-surface px-4 py-3 shadow-lg sm:-left-8 sm:-top-8">
            <Briefcase className="h-4 w-4 text-primary" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Vice President
              </p>
              <p className="text-sm font-bold text-primary">Dream House Realty</p>
            </div>
          </div>

          <div className="absolute -right-4 bottom-6 flex items-center gap-2 rounded-lg bg-surface px-4 py-3 shadow-lg sm:-right-8">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <p className="text-sm font-bold text-foreground">
              4.9 <span className="font-medium text-muted">/ 5</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
