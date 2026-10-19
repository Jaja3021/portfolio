"use client";

import { CaretDownIcon as CaretDown, ListIcon as Menu, XIcon as X } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SITE_CONFIG } from "@/config/site";

type NavLink = { label: string; href: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Properties", href: "/properties" },
  { label: "For OFWs", href: "/ofw" },
  {
    label: "Buying Guide",
    children: [
      { label: "Requirements", href: "/requirements" },
      { label: "Guides", href: "/guides" },
      { label: "Loan Calculator", href: "/calculator" },
      { label: "Services", href: "/services" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-wide text-on-primary"
            aria-hidden
          >
            ABF
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground sm:text-lg">
              ARNOLD B. FADRIQUILA
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Real Estate Professional
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) =>
            "children" in item ? (
              <DesktopDropdown key={item.label} label={item.label} items={item.children} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                  isActive(pathname, item.href)
                    ? "bg-accent-light text-primary-strong"
                    : "text-foreground/80 hover:bg-background-secondary hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden md:block">
            <LinkButton href={SITE_CONFIG.bookingPath} size="sm">
              Book a Viewing
            </LinkButton>
          </div>

          <button
            type="button"
            className="cursor-pointer rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-surface px-4 py-4 lg:hidden">
          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              "children" in item ? (
                <div key={item.label} className="py-1">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {item.label}
                  </p>
                  <ul className="ml-3 flex flex-col gap-1 border-l border-border pl-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <MobileLink link={child} pathname={pathname} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <MobileLink key={item.href} link={item} pathname={pathname} />
              ),
            )}
            <LinkButton href={SITE_CONFIG.bookingPath} className="mt-3 w-full justify-center">
              Book a Viewing
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const active = isActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={`block rounded-md px-3 py-3 text-sm font-medium transition-colors ${
        active ? "bg-accent-light text-primary-strong" : "text-foreground hover:bg-background-secondary"
      }`}
    >
      {link.label}
    </Link>
  );
}

function DesktopDropdown({ label, items, pathname }: { label: string; items: NavLink[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = items.some((i) => isActive(pathname, i.href));

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        // Close when keyboard focus leaves the dropdown entirely.
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="buying-guide-menu"
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
          active || open
            ? "bg-accent-light text-primary-strong"
            : "text-foreground/80 hover:bg-background-secondary hover:text-primary"
        }`}
      >
        {label}
        <CaretDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul
          id="buying-guide-menu"
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-surface p-1.5 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-accent-light font-medium text-primary-strong"
                    : "text-foreground hover:bg-background-secondary hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
