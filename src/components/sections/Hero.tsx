import {
  BriefcaseIcon as Briefcase,
  ShieldCheckIcon as ShieldCheck,
  StarIcon as Star,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { SplitWords } from "@/components/motion/SplitWords";
import { ButtonArrow, LinkButton } from "@/components/ui/Button";

// Load animation: headline words rise in, then the rest fades up in sequence
// and the photo unveils; the photo also drifts a little on scroll (parallax).
const HERO_WORD = "split-word hero-word";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24 lg:pt-20 lg:px-8">
        <div>
          <p className="hero-fade text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Philippine Real Estate Professional
          </p>

          <h1 className="font-display mt-6 max-w-xl text-[2.6rem] font-normal leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            <SplitWords text="Are you looking for a" wordClassName={HERO_WORD} />{" "}
            <span className="italic text-primary">
              <SplitWords text="Real Estate Agent?" offset={5} wordClassName={HERO_WORD} />
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-md text-lg text-foreground sm:text-xl" style={{ "--d": "700ms" } as React.CSSProperties}>
            This is <span className="font-semibold">Arnold</span>, your real estate agent guide.
          </p>

          <p className="hero-fade mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg" style={{ "--d": "800ms" } as React.CSSProperties}>
            I&apos;m <span className="font-medium text-foreground">Arnold B. Fadriquila, RES</span> — a
            licensed real estate professional helping clients find and secure the right property
            across the Philippines, from first-time buyers to overseas investors.
          </p>

          <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--d": "900ms" } as React.CSSProperties}>
            <LinkButton href="/properties" size="lg">
              View Properties
              <ButtonArrow />
            </LinkButton>
            <LinkButton href="/about" size="lg" variant="outline">
              About Arnold
            </LinkButton>
          </div>

          <p className="hero-fade mt-10 flex items-center gap-1.5 border-t border-border pt-6 text-xs font-medium text-muted" style={{ "--d": "1000ms" } as React.CSSProperties}>
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
            PRC-Licensed Real Estate Salesperson (RES: 0032198)
          </p>
        </div>

        <div
          data-parallax
          style={{ "--parallax": "-36px" } as React.CSSProperties}
          className="relative mx-auto w-full max-w-sm lg:mr-8"
        >
          <div className="hero-unveil relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-primary-soft shadow-sm">
            <Image
              src="/arnold-fadriquila.png"
              alt="Arnold B. Fadriquila, RES"
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
              preload
            />
          </div>

          <div style={{ "--d": "1100ms" } as React.CSSProperties} className="hero-fade absolute -left-4 -top-6 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm sm:-left-8">
            <Briefcase className="h-4 w-4 text-primary" aria-hidden />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Vice President</p>
              <p className="text-sm font-semibold text-foreground">Dream House Realty</p>
            </div>
          </div>

          <div style={{ "--d": "1250ms" } as React.CSSProperties} className="hero-fade absolute -right-4 bottom-8 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm sm:-right-8">
            <Star className="h-4 w-4 text-primary" weight="fill" aria-hidden />
            <p className="text-sm font-semibold text-foreground">
              4.9 <span className="font-medium text-muted">/ 5</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
