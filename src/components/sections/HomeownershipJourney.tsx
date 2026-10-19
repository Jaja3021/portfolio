"use client";

import { useEffect, useRef, useState } from "react";
import {
  CurrencyCircleDollarIcon as CurrencyCircleDollar,
  MagnifyingGlassIcon as Search,
  CalendarCheckIcon as CalendarCheck,
  HandshakeIcon as Handshake,
  FileTextIcon as FileText,
  KeyIcon as KeyRound,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

/**
 * Pinned scroll stepper: the stepper stays on screen while the page scrolls
 * through a tall track (.journey-track in globals.css), and each stretch of
 * scrolling advances one step (1 → 2 → … → 6). Clicking a step scrolls to it.
 * With reduced motion the track isn't pinned and steps change on click only.
 */
export function HomeownershipJourney() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll progress through the pinned track → active step.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const distance = r.height - window.innerHeight;
      if (distance <= 0) return;
      const progress = Math.max(0, Math.min(0.9999, -r.top / distance));
      setActive(Math.floor(progress * STEPS.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pick = (i: number) => {
    const el = trackRef.current;
    const distance = el ? el.getBoundingClientRect().height - window.innerHeight : 0;
    if (!el || distance <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(i);
      return;
    }
    // Scroll to the middle of that step's stretch of the track.
    const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / STEPS.length) * distance;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="journey" className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 pt-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Journey"
          title="Your Path to Homeownership"
          description="From getting financially ready to holding your new keys — here's what the process looks like."
        />
      </div>

      {/* Tall track; the inner panel sticks while you scroll through it. */}
      <div ref={trackRef} className="journey-track">
        <div className="journey-pin">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-center text-sm font-medium text-muted" aria-live="polite">
              Step {active + 1} of {STEPS.length}
            </p>

            {/* Desktop: horizontal stepper with connecting progress line */}
            <ol className="hidden sm:flex sm:items-start">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex flex-1 flex-col items-center last:flex-none">
                  <div className="flex w-full items-center">
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={i === active ? "step" : undefined}
                      aria-label={`Step ${i + 1}: ${s.title}`}
                      className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 ${
                        i <= active
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border bg-surface text-foreground/70 hover:border-primary hover:text-primary"
                      } ${i === active ? "scale-110 shadow-md" : ""}`}
                    >
                      {i + 1}
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="mx-1 h-1 flex-1 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full bg-primary transition-all duration-700 ease-out ${
                            i < active ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    className={`mt-3 max-w-[8rem] cursor-pointer text-center text-xs font-medium leading-snug transition-colors ${
                      i === active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>

            {/* The card swaps (and re-animates) for each step. */}
            <div key={active} className="journey-card mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary">
                <step.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display mt-5 text-2xl font-normal tracking-tight text-foreground">
                {active + 1}. {step.title}
              </h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">{step.description}</p>
            </div>

            {/* Mobile: numbered dots under the card */}
            <ol className="mt-6 flex justify-center gap-2 sm:hidden">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-current={i === active ? "step" : undefined}
                    aria-label={`Step ${i + 1}: ${s.title}`}
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                      i <= active ? "bg-primary text-on-primary" : "bg-primary-soft text-primary-strong"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
