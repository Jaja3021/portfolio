"use client";

import { EnvelopeIcon as Mail, MapPinIcon as MapPin, PhoneIcon as Phone } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { CONTACT_INFO, PROPERTY_TYPES, REGIONS } from "@/lib/constants";
import { useFilters } from "@/context/FilterContext";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { href: CONTACT_INFO.facebook, icon: FacebookIcon, label: "Facebook" },
  { href: CONTACT_INFO.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: CONTACT_INFO.tiktok, icon: TiktokIcon, label: "TikTok" },
  { href: CONTACT_INFO.youtube, icon: YoutubeIcon, label: "YouTube" },
];

const CONTACT_ROWS = [
  { icon: Phone, label: "Call", value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phoneHref}` },
  { icon: Mail, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
  { icon: MapPin, label: "Based in", value: CONTACT_INFO.location, href: null },
];

export function Footer() {
  const { filterByType, filterByRegion } = useFilters();

  return (
    <footer id="footer" className="bg-primary text-white">
      <div className="h-1 w-full bg-gradient-to-r from-accent via-primary-hover to-accent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:border-r lg:border-white/10 lg:pr-10">
            <div className="flex items-center gap-3">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-base font-bold tracking-wide text-white"
                aria-hidden
              >
                ABF
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-semibold tracking-tight text-white">
                  ARNOLD B. FADRIQUILA
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                  Real Estate Professional
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#d5ded9]">
              Helping clients find the right property across the Philippines — from first-time
              buyers to overseas investors.
            </p>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-[#d5ded9]">
              PRC RES No. 0032198
            </span>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:gap-6">
            <FooterColumn title="Quick Links">
              {QUICK_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-left text-sm text-[#d5ded9] hover:text-accent">
                  {l.label}
                </Link>
              ))}
            </FooterColumn>

            <FooterColumn title="Property Types">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => filterByType(t)}
                  className="text-left text-sm text-[#d5ded9] hover:text-accent cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </FooterColumn>

            <FooterColumn title="Locations">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => filterByRegion(r)}
                  className="text-left text-sm text-[#d5ded9] hover:text-accent cursor-pointer"
                >
                  {r}
                </button>
              ))}
            </FooterColumn>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white/5 p-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                Get in Touch
              </h3>
              <div className="mt-4 flex flex-col gap-4">
                {CONTACT_ROWS.map((c) => {
                  const content = (
                    <>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[10px] uppercase tracking-wide text-white/50">
                          {c.label}
                        </span>
                        <span className="block truncate text-sm text-[#d5ded9]">{c.value}</span>
                      </span>
                    </>
                  );
                  return c.href ? (
                    <a key={c.label} href={c.href} className="flex items-center gap-3 hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    <span key={c.label} className="flex items-center gap-3">
                      {content}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-8 text-center text-xs text-[#d5ded9] sm:flex-row sm:text-left">
          <p>© 2026 Arnold B. Fadriquila, RES (PRC RES No. 0032198). All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/terms-and-conditions" className="hover:text-accent">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
