import { SplitWords } from "@/components/motion/SplitWords";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-12 max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <p data-reveal="up" className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          {eyebrow}
        </p>
      )}
      {/* Words rise out of a mask when the heading scrolls into view. */}
      <h2
        data-reveal="words"
        className="font-display text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl"
      >
        <SplitWords text={title} />
      </h2>
      {description && (
        <p data-reveal="up" style={{ "--d": "250ms" } as React.CSSProperties} className="mt-4 text-base leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
