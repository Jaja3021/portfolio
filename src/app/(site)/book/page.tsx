import type { Metadata } from "next";
import Link from "next/link";
import { ViewingForm } from "@/components/forms/ViewingForm";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SITE_CONFIG } from "@/config/site";
import { getProperties } from "@/lib/data";
import { propertyPath } from "@/lib/property-url";

export const metadata: Metadata = {
  title: "Book a Viewing",
  description:
    "Book a free, no-obligation site viewing with Arnold B. Fadriquila, RES. Pick a date and time and Arnold will confirm your schedule.",
  alternates: { canonical: "/book" },
};

// The one shared booking form. Links from cards, the detail page and the
// mobile bar pass ?property=<id> so the listing is pre-filled.
export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { property: propertyId } = await searchParams;
  const property =
    typeof propertyId === "string"
      ? (await getProperties()).find((p) => p.id === propertyId && p.status !== "Sold")
      : undefined;

  return (
    <>
      <PageViewTracker />
      <section className="bg-background-secondary">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Book a Viewing</p>
          <h1 className="font-display mt-3 text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
            See the property in person
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Free, no obligation. Pick a date and time that works for you and Arnold will confirm your
            schedule.
          </p>

          {property && (
            <p className="mt-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
              Viewing request for{" "}
              <Link href={propertyPath(property)} className="font-semibold text-primary underline-offset-2 hover:underline">
                {property.title}
              </Link>
              <span className="text-muted">
                {" "}
                · {property.city}, {property.province}
              </span>
            </p>
          )}

          <div className="mt-6 rounded-xl border border-border bg-surface p-6 sm:p-8">
            <ViewingForm key={property?.id ?? "none"} presetProperty={property?.title ?? ""} />
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Prefer to chat first?{" "}
            <a
              href={SITE_CONFIG.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Message Arnold on Messenger
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
