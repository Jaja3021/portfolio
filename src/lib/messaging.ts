import { MESSAGING_CHANNELS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export type MessagingChannel = "messenger" | "viber" | "whatsapp";

const digits = (value: string) => value.replace(/\D/g, "");

export function isChannelConfigured(channel: MessagingChannel): boolean {
  switch (channel) {
    case "messenger":
      return MESSAGING_CHANNELS.messengerUrl.trim() !== "";
    case "viber":
      return digits(MESSAGING_CHANNELS.viberNumber) !== "";
    case "whatsapp":
      return digits(MESSAGING_CHANNELS.whatsappNumber) !== "";
  }
}

/** True when Messenger can pre-fill the property message (only m.me links support `?text=`). */
export function messengerSupportsText(): boolean {
  return /^https?:\/\/(www\.)?m\.me\//i.test(MESSAGING_CHANNELS.messengerUrl.trim());
}

/**
 * Deep link that opens a chat. WhatsApp (and Messenger m.me links) pre-fill
 * `text`; Viber's chat links don't support pre-filled text.
 */
export function channelLink(channel: MessagingChannel, text?: string): string {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  switch (channel) {
    case "messenger":
      return `${MESSAGING_CHANNELS.messengerUrl.trim()}${messengerSupportsText() ? q : ""}`;
    case "whatsapp":
      return `https://wa.me/${digits(MESSAGING_CHANNELS.whatsappNumber)}${q}`;
    case "viber":
      return `viber://chat?number=${encodeURIComponent(`+${digits(MESSAGING_CHANNELS.viberNumber)}`)}`;
  }
}

export function propertyMessage(property: Property, url: string): string {
  return `Hi Arnold! I'm interested in "${property.title}" (${property.city}, ${property.province}) listed at ${formatPrice(
    property.price,
  )}. Is it still available?\n\n${url}`;
}
