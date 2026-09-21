import { StarIcon as Star } from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  const parts = name.replace(/^The\s+/i, "").split(/\s+/).filter(Boolean);
  const letters = [parts[0]?.[0], parts[parts.length - 1]?.[0]].filter(Boolean);
  return letters.join("").toUpperCase();
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.filter((t) => t.enabled);
  if (items.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="Client feedback"
            title="What Clients Say"
            description="Real feedback from clients Arnold has helped find and secure their homes."
          />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3" staggerChildren={0.12}>
          {items.map((t) => {
            const rating = t.rating ?? 5;
            return (
              <StaggerItem key={t.id} variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">&ldquo;{t.message}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    {t.location && <p className="text-xs text-muted">{t.location}</p>}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
