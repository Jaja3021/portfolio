"use client";

import {
  BuildingsIcon as Building2,
  CalculatorIcon as Calculator,
  ClockIcon as Clock,
  EnvelopeIcon as Mail,
  PhoneIcon as Phone,
  ShieldCheckIcon as ShieldCheck,
} from "@phosphor-icons/react/ssr";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/ContactForm";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { CONTACT_INFO } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp, slideFromLeft, slideFromRight } from "@/components/motion/variants";

const TRUST_BADGES = [
  { icon: Clock, title: "Fast Response", detail: "Within 24 hours" },
  { icon: Calculator, title: "Free Computation", detail: "No obligation" },
  { icon: ShieldCheck, title: "PRC Licensed", detail: "Trusted professional" },
];

const SOCIAL_LINKS = [
  { href: CONTACT_INFO.facebook, icon: FacebookIcon, label: "Facebook" },
  { href: CONTACT_INFO.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: CONTACT_INFO.tiktok, icon: TiktokIcon, label: "TikTok" },
  { href: CONTACT_INFO.youtube, icon: YoutubeIcon, label: "YouTube" },
];

export function Contact({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#2e2019] to-accent-dark pb-28 pt-20 sm:pb-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:18px_18px]"
          aria-hidden
        />
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">Get In Touch</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s Find Your Next Property
          </h2>
          <p className="mt-4 text-base text-white/75">
            Reach out directly, or send an inquiry below and Arnold will get back to you within 24
            hours.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${CONTACT_INFO.phoneHref}`}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:border-accent-light"
            >
              <Phone className="h-4 w-4" />
              {CONTACT_INFO.phone}
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:border-accent-light"
            >
              <Mail className="h-4 w-4" />
              {CONTACT_INFO.email}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto -mt-16 max-w-4xl px-4 pb-20 sm:-mt-20 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal variants={fadeUp} className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-10">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Send an Inquiry</h3>
          <p className="mt-1 mb-6 text-sm text-foreground/60">
            Fill out the form below and Arnold will get back to you within 24 hours.
          </p>

          <ContactForm properties={properties} />

          <StaggerGroup className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" staggerChildren={0.12}>
            {TRUST_BADGES.map((b) => (
              <StaggerItem
                key={b.title}
                variants={fadeUp}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-4 text-center"
              >
                <b.icon className="h-4 w-4 text-accent" />
                <p className="text-xs font-semibold text-foreground">{b.title}</p>
                <p className="text-[11px] text-foreground/70">{b.detail}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal variants={slideFromLeft} className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Follow on Social Media</h3>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal variants={slideFromRight} className="rounded-2xl border border-border bg-accent-light/60 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Building2 className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">Dream House Realty</p>
                <p className="text-xs font-medium text-accent">Vice President</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-foreground/60">
              Looking to build a career in real estate? Dream House Realty is always welcoming
              driven individuals who want to join our team.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
