"use client";

import {
  CalendarBlankIcon as Calendar,
  MessengerLogoIcon as Messenger,
  PhoneIcon as Phone,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, bookingHref } from "@/config/site";
import { channelLink, propertyMessage } from "@/lib/messaging";
import { propertyPath } from "@/lib/property-url";
import type { Property } from "@/lib/types";

const itemClass =
  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors";

/**
 * Sticky Call / Messenger / Book bar for phones (below 768px). The site layout
 * renders the general one; a property detail page renders its own with the
 * listing pre-selected, so the general one hides there.
 */
export function MobileActionBar({ property }: { property?: Property }) {
  const pathname = usePathname();
  if (!property && /^\/properties\/[^/]+/.test(pathname)) return null;

  const onMessenger = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!property) return;
    // Pre-fill which listing they mean (built on click so it uses the real origin).
    e.preventDefault();
    const text = propertyMessage(property, `${window.location.origin}${propertyPath(property)}`);
    window.open(channelLink("messenger", text), "_blank", "noopener,noreferrer");
  };

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden"
    >
      <div className="flex items-stretch">
        <a href={SITE_CONFIG.phoneHref} className={`${itemClass} text-foreground hover:text-primary`}>
          <Phone className="h-5 w-5" aria-hidden />
          <span>Call</span>
        </a>
        <a
          href={channelLink("messenger")}
          onClick={onMessenger}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} border-x border-border text-foreground hover:text-primary`}
        >
          <Messenger className="h-5 w-5" aria-hidden />
          <span>Messenger</span>
        </a>
        <Link href={bookingHref(property?.id)} className={`${itemClass} bg-primary text-white hover:bg-primary-hover`}>
          <Calendar className="h-5 w-5" aria-hidden />
          <span>Book</span>
        </Link>
      </div>
    </nav>
  );
}
