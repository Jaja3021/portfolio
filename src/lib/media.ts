// Parsing helpers for the optional video tour and map pin on a listing.

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts the video ID from any common YouTube link: watch?v=, youtu.be/,
 * shorts/, live/, or embed/. Returns null if it isn't a YouTube video link.
 */
export function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = parsed.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v");
    else {
      const match = parsed.pathname.match(/^\/(shorts|live|embed)\/([^/?#]+)/);
      id = match?.[2] ?? null;
    }
  }
  return id && YOUTUBE_ID.test(id) ? id : null;
}

/** Privacy-friendly embed URL (no tracking cookies until the visitor presses play). */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Parses "14.2847, 120.7634" (as copied from Google Maps by right-clicking a
 * spot) or a Google Maps link containing "@lat,lng" or "q=lat,lng".
 */
export function parseCoordinates(input: string): Coordinates | null {
  const text = input.trim();
  if (!text) return null;
  const match =
    text.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/) ??
    text.match(/[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/) ??
    text.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

export function formatCoordinates(latitude: number | null | undefined, longitude: number | null | undefined): string {
  return latitude != null && longitude != null ? `${latitude}, ${longitude}` : "";
}

export function mapEmbedUrl({ latitude, longitude }: Coordinates): string {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

export function mapLinkUrl({ latitude, longitude }: Coordinates): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
