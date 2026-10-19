import { ArrowRightIcon as ArrowRight, ClockIcon as Clock } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { PageViewTracker } from "@/components/PageViewTracker";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listedGuides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Home Buying Guides",
  description:
    "Practical guides for Filipino home buyers and OFWs: RFO vs pre-selling, Pag-IBIG housing loan requirements, and affordable house and lot options in Cavite.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = listedGuides();

  return (
    <>
      <PageViewTracker />
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="Guides"
            title="Home Buying Guides"
            description="Straightforward answers to the questions buyers ask me most, from financing to choosing the right location."
          />

          {guides.length === 0 ? (
            <div className="mx-auto max-w-md rounded-xl border border-border bg-background-secondary p-8 text-center">
              <p className="text-sm text-muted">New guides are on the way. In the meantime, feel free to ask me anything.</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <LinkButton href="/contact">Message Me</LinkButton>
                <LinkButton href="/ofw" variant="outline">
                  Guide for OFWs
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group/btn flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/25"
                >
                  <div className="flex items-center gap-3 text-xs text-muted">
                    {g.draft && (
                      <span className="rounded-full bg-status-presell-bg px-2.5 py-0.5 font-semibold uppercase tracking-wide text-status-presell-text">
                        Draft
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {g.readingMinutes} min read
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-foreground">{g.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-sm text-muted">
            Buying from abroad? Read the <Link href="/ofw" className="font-medium text-primary hover:underline">guide for OFWs</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
