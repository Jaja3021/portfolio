"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, staggerContainer } from "./variants";

export function StaggerGroup({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  as?: "div" | "ol" | "ul";
}) {
  const props = {
    className,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.2 },
    variants: staggerContainer(staggerChildren, delayChildren),
  };

  if (as === "ol") return <motion.ol {...props}>{children}</motion.ol>;
  if (as === "ul") return <motion.ul {...props}>{children}</motion.ul>;
  return <motion.div {...props}>{children}</motion.div>;
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li";
}) {
  if (as === "li") {
    return (
      <motion.li className={className} variants={variants}>
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
