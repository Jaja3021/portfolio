import { MapPinIcon as MapPin, SealCheckIcon as SealCheck } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/components/motion/variants";
import { NoPhoto } from "@/components/properties/NoPhoto";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Property } from "@/lib/types";

const MAX_SHOWN = 6;

/** Most recently sold first; listings sold before sold_at existed fall back to created_at. */
export function recentlySold(properties: Property[]): Property[] {
  return properties
    .filter((p) => p.status === "Sold")
    .sort((a, b) => (b.soldAt ?? b.createdAt).localeCompare(a.soldAt ?? a.createdAt))
    .slice(0, MAX_SHOWN);
}

// Renders nothing until at least one listing is marked "Sold" in the dashboard.
export function RecentlySold({ properties }: { properties: Property[] }) {
  const sold = recentlySold(properties);
  if (sold.length === 0) return null;

  return (
    <section className="bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="Track Record"
            title="Recently Sold"
            description="Families and OFWs who found their home with my help. Looking for something similar? Let's talk."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sold.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative h-48 w-full overflow-hidden">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%]"
                  />
                ) : (
                  <NoPhoto />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                  <SealCheck className="h-3.5 w-3.5" weight="fill" /> Sold
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent">{p.propertyType}</p>
                <h3 className="mt-1 font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-4 w-4 text-primary" />
                  {p.city}, {p.province}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <LinkButton href="/properties">See Available Properties</LinkButton>
        </div>
      </div>
    </section>
  );
}
