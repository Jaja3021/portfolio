import type { Variants } from "framer-motion";

/**
 * List/grid wrappers. Each item tilts up into place as it scrolls into view
 * (.scroll-reveal-3d in globals.css), so items lower on the page arrive
 * slightly later. Static without browser support or with reduced motion.
 * The old framer-motion props are accepted and ignored.
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
  if (as === "ol") return <ol className={className}>{children}</ol>;
  if (as === "ul") return <ul className={className}>{children}</ul>;
  return <div className={className}>{children}</div>;
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
  const cls = `scroll-reveal-3d ${className ?? ""}`;
  if (as === "li") return <li className={cls}>{children}</li>;
  return <div className={cls}>{children}</div>;
}
