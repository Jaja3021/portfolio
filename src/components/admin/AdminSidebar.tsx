"use client";

import {
  BellIcon as Bell,
  CalendarBlankIcon as CalendarDays,
  ChatsCircleIcon as ChatsCircle,
  ClipboardTextIcon as ClipboardList,
  HandshakeIcon as Handshake,
  HouseIcon as Home,
  SquaresFourIcon as LayoutDashboard,
  ChatCircleTextIcon as MessageSquareText,
  QuotesIcon as Quote,
  GearIcon as Settings,
  UsersIcon as Users,
  XIcon as X,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PUBLIC_SITE_URL } from "@/lib/site";

const SEEN_STORAGE_KEY = "admin-sidebar-seen-counts";

// Seen counts live in localStorage, exposed to React through useSyncExternalStore
// so the sidebar re-renders whenever they change (here or in another tab).
const seenListeners = new Set<() => void>();

function subscribeSeenCounts(listener: () => void) {
  seenListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    seenListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSeenCountsSnapshot(): string | null {
  try {
    return localStorage.getItem(SEEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSeenCountsServerSnapshot(): string | null {
  return null;
}

function parseSeenCounts(raw: string | null): Record<string, number> {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSeenCounts(seen: Record<string, number>) {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // ignore write failures (e.g. private browsing)
  }
  seenListeners.forEach((listener) => listener());
}

const NAV = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Home },
  { href: "/dashboard/clients", label: "Clients / Leads", icon: Users },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquareText, countKey: "inquiriesCount" },
  {
    href: "/dashboard/viewing-requests",
    label: "Viewing Requests",
    icon: ClipboardList,
    countKey: "viewingRequestsCount",
  },
  { href: "/dashboard/deals", label: "Transactions / Deals", icon: Handshake },
  {
    href: "/dashboard/conversations",
    label: "Conversations",
    icon: ChatsCircle,
    countKey: "conversationsCount",
  },
  { href: "/dashboard/calendar", label: "Calendar / Schedule", icon: CalendarDays },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, countKey: "notificationsCount" },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

interface AdminSidebarProps {
  inquiriesCount?: number;
  viewingRequestsCount?: number;
  conversationsCount?: number;
  notificationsCount?: number;
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({
  inquiriesCount = 0,
  viewingRequestsCount = 0,
  conversationsCount = 0,
  notificationsCount = 0,
  open = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const counts = { inquiriesCount, viewingRequestsCount, conversationsCount, notificationsCount };
  const seenRaw = useSyncExternalStore(subscribeSeenCounts, getSeenCountsSnapshot, getSeenCountsServerSnapshot);
  const seenCounts = useMemo(() => parseSeenCounts(seenRaw), [seenRaw]);

  useEffect(() => {
    const activeItem = NAV.find((item) => "countKey" in item && pathname.startsWith(item.href));
    if (!activeItem || !("countKey" in activeItem)) return;

    const currentCount = counts[activeItem.countKey];
    const prev = parseSeenCounts(getSeenCountsSnapshot());
    if (prev[activeItem.href] === currentCount) return;
    writeSeenCounts({ ...prev, [activeItem.href]: currentCount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, inquiriesCount, viewingRequestsCount, conversationsCount, notificationsCount]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-border bg-white transition-transform duration-200 ease-out md:w-64 md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <p className="text-sm font-bold text-foreground">ARNOLD B. FADRIQUILA</p>
            <p className="text-xs font-medium text-accent">Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-foreground/50 hover:bg-muted md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const rawCount = "countKey" in item ? counts[item.countKey] : 0;
            const seen = seenCounts[item.href] ?? 0;
            const count = Math.max(rawCount - seen, 0);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-accent-light text-accent-dark" : "text-foreground/60 hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <a
            href={PUBLIC_SITE_URL}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/60 hover:bg-muted"
          >
            ← View Site
          </a>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
