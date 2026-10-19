import { BriefcaseIcon as Briefcase } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { QuickSearch } from "@/components/sections/QuickSearch";
import { SITE_CONFIG } from "@/config/site";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

/** Cheapest listing currently for sale (rentals, sold and unpriced listings excluded). */
function lowestPrice(properties: Property[]): number | null {
  const prices = properties
    .filter((p) => p.listingType !== "For Rent/Lease" && p.price > 0)
    .map((p) => p.price);
  return prices.length ? Math.min(...prices) : null;
}

/** @param properties listings still on the market (Sold already removed). */
export function Hero({ properties }: { properties: Property[] }) {
  const fromPrice = lowestPrice(properties);

  return (
    <section id="hero" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Philippine Real Estate Professional
          </p>

          <h1 className="font-display mt-4 max-w-2xl text-4xl font-normal leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            Find your home in Cavite —{" "}
            <span className="text-primary">with someone who walks you through every step.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Pag-IBIG, bank, or in-house financing.
            {fromPrice !== null && <> RFO and pre-selling units from {formatPrice(fromPrice)}.</>}
          </p>

          <div className="mt-8 max-w-2xl">
            <QuickSearch properties={properties} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover"
            >
              View Properties
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-primary bg-background px-7 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              About Arnold
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted">{SITE_CONFIG.prcLicense}</p>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-primary-soft shadow-sm">
            <Image
              src="/arnold-fadriquila.png"
              alt="Arnold B. Fadriquila, RES"
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 24rem, 20rem"
              className="object-cover object-top"
              preload
            />
          </div>

          <div className="absolute -left-3 bottom-6 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 shadow-sm sm:-left-6">
            <Briefcase className="h-4 w-4 text-primary" aria-hidden />
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Vice President</p>
              <p className="text-sm font-semibold text-foreground">Dream House Realty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
