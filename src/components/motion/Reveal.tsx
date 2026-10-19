import type { Variants } from "framer-motion";

/**
 * Animates in when scrolled into view (ScrollEffects + "Scroll triggers" in
 * globals.css). `variants` is accepted and ignored so older call sites keep
 * working.
 */
export function Reveal({
  children,
  className,
  effect = "up",
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  effect?: "up" | "tilt" | "image";
}) {
  return (
    <div data-reveal={effect} className={className}>
      {children}
    </div>
  );
}
