import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [logo, photo] = await Promise.all([
    readFile(join(process.cwd(), "img", "logo.png")),
    readFile(join(process.cwd(), "public", "arnold-fadriquila.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#173d32",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={72}
            height={72}
            alt=""
            style={{ borderRadius: 999, marginBottom: 28 }}
          />
          <div
            style={{
              display: "flex",
              color: "#b5965a",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Philippine Real Estate Professional
          </div>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
            Arnold B. Fadriquila, RES
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.8)", fontSize: 28, marginTop: 20 }}>
            Vice President, Dream House Realty
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={340}
          height={430}
          alt=""
          style={{
            objectFit: "cover",
            borderRadius: 12,
            border: "4px solid rgba(255,255,255,0.25)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
