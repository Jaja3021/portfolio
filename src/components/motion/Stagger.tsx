import type { Variants } from "framer-motion";

/**
 * List/grid whose items tilt up into place one after another as they scroll
 * into view (ScrollEffects + "Scroll triggers" in globals.css). The old
 * framer-motion props are accepted and ignored.
 */
export function StaggerGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  as?: "div" | "ol" | "ul";
}) {
  if (as === "ol") return <ol data-stagger className={className}>{children}</ol>;
  if (as === "ul") return <ul data-stagger className={className}>{children}</ul>;
  return <div data-stagger className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li";
}) {
  if (as === "li") return <li data-reveal="tilt" className={className}>{children}</li>;
  return <div data-reveal="tilt" className={className}>{children}</div>;
}
