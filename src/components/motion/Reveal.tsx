import type { Variants } from "framer-motion";

/**
 * Rises into place as it scrolls into view (CSS scroll-driven animation, see
 * .scroll-reveal in globals.css). Without browser support or with reduced
 * motion it is simply static, so text is never left hidden. `variants` is
 * accepted and ignored so existing call sites keep working.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return <div className={`scroll-reveal ${className ?? ""}`}>{children}</div>;
}
