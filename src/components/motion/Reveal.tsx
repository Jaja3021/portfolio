"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp } from "./variants";

export function Reveal({
  children,
  variants = fadeUp,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
