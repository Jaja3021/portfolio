import { MessengerLogoIcon as Messenger } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { COPY, SITE_CONFIG } from "@/config/site";

export function CTABand() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
            Ready to see a property?
          </h2>
          <p className="mt-2 text-base text-muted">Book a site viewing — free, no obligation.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={SITE_CONFIG.bookingPath}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover"
          >
            {COPY.bookButton}
          </Link>
          <a
            href={SITE_CONFIG.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary px-6 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
          >
            <Messenger className="h-5 w-5" aria-hidden />
            Message on Messenger
          </a>
        </div>
      </div>
    </section>
  );
}
