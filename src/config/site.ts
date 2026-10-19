import { CONTACT_INFO, MESSAGING_CHANNELS } from "@/lib/constants";

/**
 * Site-wide copy and contact settings for the public pages. Phone, email and
 * social links still live in CONTACT_INFO / MESSAGING_CHANNELS (lib/constants)
 * so the dashboard and older components keep working; this re-exports them in
 * one place for the header, sticky bar and CTA band.
 */
export const SITE_CONFIG = {
  /** Switches a few lines (booking button, contact intro) to Taglish. Everything else stays English. */
  useTaglishCopy: false,

  // TODO: real city Arnold is based in (shown as "Based in <city>, Cavite").
  baseCity: "[TODO: city]",

  phoneDisplay: CONTACT_INFO.phone,
  phoneHref: `tel:${CONTACT_INFO.phoneHref}`,
  messengerUrl: MESSAGING_CHANNELS.messengerUrl,

  /** Shared booking form (src/app/(site)/book). Add ?property=<id> to pre-select a listing. */
  bookingPath: "/book",

  prcLicense: "PRC RES No. 0032198",
};

export const COPY = {
  bookButton: SITE_CONFIG.useTaglishCopy ? "Tara, let's visit the site!" : "Book a Viewing",
  contactIntro: SITE_CONFIG.useTaglishCopy
    ? "Ask me anything — kahit basic questions lang."
    : "Ask me anything — even the basic questions.",
};

export function bookingHref(propertyId?: string): string {
  return propertyId ? `${SITE_CONFIG.bookingPath}?property=${encodeURIComponent(propertyId)}` : SITE_CONFIG.bookingPath;
}
