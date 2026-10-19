import {
  BriefcaseIcon as Briefcase,
  ShieldCheckIcon as ShieldCheck,
  StarIcon as Star,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

const CREDENTIALS = [{ icon: ShieldCheck, label: "PRC-Licensed Real Estate Salesperson (RES: 0032198)" }];

export function Hero() {
  return (
    <section id="hero" className="border-b border-border bg-background">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Philippine Real Estate Professional
          </p>

          <h1 className="font-display mt-5 max-w-xl text-4xl font-normal leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            Are you looking for a
            <br />
            <span className="text-primary">Real Estate Agent?</span>
          </h1>

          <p className="mt-5 max-w-lg text-xl text-foreground sm:text-2xl">
            This is <span className="font-semibold">Arnold</span>, your real estate agent guide.
          </p>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            I&apos;m <span className="font-semibold text-foreground">Arnold B. Fadriquila, RES</span> — a
            licensed real estate professional helping clients find and secure the right property
            across the Philippines, from first-time buyers to overseas investors.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-on-primary transition-colors hover:bg-primary-hover"
            >
              View Properties
            </Link>
            <Link
              href="/about"
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-lg border border-primary bg-background px-8 text-base font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              About Arnold
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6">
            {CREDENTIALS.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <c.icon className="h-3.5 w-3.5 text-primary" />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl bg-primary-soft shadow-sm">
            <Image
              src="/arnold-fadriquila.png"
              alt="Arnold B. Fadriquila, RES"
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-top"
              preload
            />
          </div>

          <div className="absolute -left-4 -top-6 z-10 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 shadow-sm sm:-left-8 sm:-top-8">
            <Briefcase className="h-4 w-4 text-primary" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Vice President</p>
              <p className="text-sm font-bold text-primary">Dream House Realty</p>
            </div>
          </div>

          <div className="absolute -right-4 bottom-6 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 shadow-sm sm:-right-8">
            <Star className="h-4 w-4 text-primary" weight="fill" />
            <p className="text-sm font-bold text-foreground">
              4.9 <span className="font-medium text-muted">/ 5</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
