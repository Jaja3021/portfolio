import type { Variants } from "framer-motion";

/**
 * Plain list/grid wrappers. Staggered entrance animations were removed so
 * text is always visible; the animation props are accepted and ignored.
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
  if (as === "li") return <li className={className}>{children}</li>;
  return <div className={className}>{children}</div>;
}
