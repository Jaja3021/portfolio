import { StarIcon as Star } from "@phosphor-icons/react/ssr";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  const parts = name.replace(/^The\s+/i, "").split(/\s+/).filter(Boolean);
  const letters = [parts[0]?.[0], parts[parts.length - 1]?.[0]].filter(Boolean);
  return letters.join("").toUpperCase();
}

// Testimonials come from the dashboard (Supabase `testimonials` table).
// TODO: Arnold to confirm every enabled testimonial is a real client quote used with permission.
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.filter((t) => t.enabled);
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          What clients say
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t) => {
            const rating = t.rating ?? 5;
            return (
              <figure key={t.id} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex gap-0.5 text-primary" role="img" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" weight={i < rating ? "fill" : "regular"} aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-foreground">&ldquo;{t.message}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-strong" aria-hidden>
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    {t.location && <p className="text-xs text-muted">{t.location}</p>}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
