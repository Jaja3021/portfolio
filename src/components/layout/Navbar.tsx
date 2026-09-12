"use client";

import { ListIcon as Menu, XIcon as X } from "@phosphor-icons/react/ssr";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DURATION, EASE } from "@/components/motion/variants";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION, ease: EASE }}
      className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold tracking-wide text-white"
            aria-hidden
          >
            ABF
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-foreground sm:text-lg">
              ARNOLD B. FADRIQUILA
            </span>
            <span className="block text-xs font-medium text-accent">Real Estate Salesperson</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden lg:block">
            <LinkButton href="/contact">Get in Touch</LinkButton>
          </div>

          <button
            type="button"
            className="p-2 text-foreground lg:hidden cursor-pointer"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <LinkButton href="/contact" className="mt-2 w-full justify-center" onClick={() => setOpen(false)}>
              Get in Touch
            </LinkButton>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
