"use client";

import {
  ChatsTeardropIcon as Chats,
  MessengerLogoIcon as Messenger,
  PhoneCallIcon as ViberGlyph,
  WhatsappLogoIcon as WhatsApp,
  XIcon,
} from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { channelLink, isChannelConfigured, type MessagingChannel } from "@/lib/messaging";

export const CHANNEL_META: Record<
  MessagingChannel,
  { label: string; icon: typeof Messenger; color: string }
> = {
  messenger: { label: "Messenger", icon: Messenger, color: "bg-[#0084FF]" },
  viber: { label: "Viber", icon: ViberGlyph, color: "bg-[#7360F2]" },
  whatsapp: { label: "WhatsApp", icon: WhatsApp, color: "bg-[#25D366]" },
};

const CHANNELS: MessagingChannel[] = ["messenger", "viber", "whatsapp"];
const IS_DEV = process.env.NODE_ENV === "development";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Unconfigured channels are hidden on the live site; in dev they show as
  // placeholders so the layout can be checked before numbers are filled in.
  const channels = CHANNELS.filter((c) => IS_DEV || isChannelConfigured(c));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
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

  if (channels.length === 0) return null;

  return (
    // Hidden on phones: the sticky bottom bar (MobileActionBar) has Messenger there.
    <div ref={rootRef} className="fixed bottom-4 right-4 z-40 hidden flex-col items-end gap-2 sm:right-6 md:flex">
      {open && (
        <ul id="floating-contact-menu" className="mb-1 flex flex-col gap-2">
          {channels.map((c) => {
            const { label, icon: Icon, color } = CHANNEL_META[c];
            const configured = isChannelConfigured(c);
            return (
              <li key={c}>
                {configured ? (
                  <a
                    href={channelLink(c)}
                    target={c === "viber" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-5 text-sm font-medium text-foreground shadow-md transition hover:border-primary"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${color}`}>
                      <Icon className="h-5 w-5" weight="fill" />
                    </span>
                    {label}
                  </a>
                ) : (
                  <span className="flex items-center gap-3 rounded-full border border-dashed border-border bg-surface py-1.5 pl-1.5 pr-5 text-sm text-muted shadow-md">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white opacity-50 ${color}`}>
                      <Icon className="h-5 w-5" weight="fill" />
                    </span>
                    {label} (not set up)
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="floating-contact-menu"
        aria-label={open ? "Close contact options" : "Message Arnold on Messenger, Viber, or WhatsApp"}
        className="flex h-14 items-center gap-2 rounded-full bg-primary px-4 font-medium text-white shadow-md transition hover:scale-105 hover:bg-primary-hover"
      >
        {open ? <XIcon className="h-6 w-6" /> : <Chats className="h-6 w-6" weight="fill" />}
        <span className="hidden text-sm sm:inline">{open ? "Close" : "Message me"}</span>
      </button>
    </div>
  );
}
