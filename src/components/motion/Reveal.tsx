import type { Variants } from "framer-motion";

/**
 * Plain wrapper. Scroll-triggered fade-ins were removed so text is always
 * visible (minimal design); `variants` is accepted and ignored so existing
 * call sites keep working.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
