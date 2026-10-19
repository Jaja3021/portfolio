"use client";

import { useState } from "react";
import { CHANNEL_META } from "@/components/contact/FloatingContact";
import {
  channelLink,
  isChannelConfigured,
  messengerSupportsText,
  propertyMessage,
  type MessagingChannel,
} from "@/lib/messaging";
import { propertyPath } from "@/lib/property-url";
import type { Property } from "@/lib/types";

// Viber is left out here: its chat links can't pre-fill the property name.
const CHANNELS: MessagingChannel[] = ["messenger", "whatsapp"];
const IS_DEV = process.env.NODE_ENV === "development";

export function MessagePropertyButtons({ property }: { property: Property }) {
  const [copied, setCopied] = useState(false);
  const channels = CHANNELS.filter((c) => IS_DEV || isChannelConfigured(c));
  if (channels.length === 0) return null;

  // Built on click so it uses the real origin (works on preview deploys too).
  const open = (channel: MessagingChannel) => {
    const url = `${window.location.origin}${propertyPath(property)}`;
    const text = propertyMessage(property, url);
    // Non-m.me Messenger links can't pre-fill text, so copy it for the visitor to paste.
    if (channel === "messenger" && !messengerSupportsText()) {
      navigator.clipboard?.writeText(text).then(
        () => setCopied(true),
        () => {},
      );
    }
    window.open(channelLink(channel, text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-4 rounded-lg bg-background-secondary p-4">
      <p className="text-sm font-semibold text-foreground">Message me about this property</p>
      <p className="mt-0.5 text-xs text-muted">
        {copied
          ? "Message copied! Paste it in Messenger so I know which property you mean."
          : "Opens a chat with the property details ready to send."}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {channels.map((c) => {
          const { label, icon: Icon, color } = CHANNEL_META[c];
          const configured = isChannelConfigured(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => open(c)}
              disabled={!configured}
              title={configured ? undefined : "TODO: set this up in MESSAGING_CHANNELS (src/lib/constants.ts)"}
              className={`flex h-12 items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed ${color}`}
            >
              <Icon className="h-5 w-5" weight="fill" />
              {configured ? label : `${label} (not set up)`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
