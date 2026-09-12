"use client";

import Link from "next/link";
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

export function Footer() {
  const { filterByType, filterByRegion } = useFilters();

  return (
    <footer id="footer" className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold tracking-wide text-white"
                aria-hidden
              >
                ABF
              </span>
              <span className="leading-tight">
                <span className="block text-base font-bold tracking-tight text-foreground">
                  ARNOLD B. FADRIQUILA
                </span>
                <span className="block text-xs font-medium text-accent">Real Estate Salesperson</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-foreground/60">
              Helping clients find the right property across the Philippines.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-left text-sm text-foreground/60 hover:text-accent"
              >
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
                className="text-left text-sm text-foreground/60 hover:text-accent cursor-pointer"
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
                className="text-left text-sm text-foreground/60 hover:text-accent cursor-pointer"
              >
                {r}
              </button>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <a href={`tel:${CONTACT_INFO.phoneHref}`} className="text-sm text-foreground/60 hover:text-accent">
              {CONTACT_INFO.phone}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-foreground/60 hover:text-accent">
              {CONTACT_INFO.email}
            </a>
            <span className="text-sm text-foreground/60">{CONTACT_INFO.location}</span>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8 text-center text-xs text-foreground/70">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-accent">
              Terms and Conditions
            </Link>
          </div>
          <p>© 2026 Arnold B. Fadriquila, RES. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
