"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import ayala from "../../../img/trimmed/ayala.webp";
import cbdi from "../../../img/trimmed/CBDI.webp";
import dmci from "../../../img/trimmed/dmci.webp";
import masaito from "../../../img/trimmed/Masaito.webp";
import megaworld from "../../../img/trimmed/megaworld.webp";
import raemulan from "../../../img/trimmed/raemulan.png";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface DeveloperPin {
  name: string;
  logo: StaticImageData;
  location: string;
  x: number;
  y: number;
}

const PINS: DeveloperPin[] = [
  { name: "Ayala Land", logo: ayala, location: "Makati City", x: 156, y: 214 },
  { name: "Megaworld", logo: megaworld, location: "Taguig City", x: 172, y: 222 },
  { name: "DMCI Homes", logo: dmci, location: "Quezon City", x: 158, y: 196 },
  { name: "CBDI", logo: cbdi, location: "Manila City", x: 140, y: 206 },
  { name: "Masaito Homes", logo: masaito, location: "Bacoor, Cavite", x: 128, y: 236 },
  { name: "Raemulan Lands", logo: raemulan, location: "Nueva Ecija", x: 150, y: 140 },
];

export function PartnerDevelopersMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Accredited Partners"
          title="Where Our Developer Partners Build"
          description="Pin locations reflect each partner's primary hub — hover or tap a pin to see who's there."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="relative mx-auto w-full max-w-md rounded-xl border border-border bg-background-secondary p-6">
            <svg
              viewBox="0 0 300 500"
              className="w-full"
              role="img"
              aria-label="Map of the Philippines with pins showing developer partner locations"
            >
              {/* Luzon */}
              <path
                d="M120 20 C150 15 175 30 180 55 C190 70 175 90 185 110 C195 130 210 150 195 175 C190 195 200 215 185 235 C175 255 150 260 135 245 C120 260 95 255 90 235 C80 215 95 195 85 175 C75 155 85 130 95 110 C90 90 100 65 110 45 C105 30 110 25 120 20 Z"
                className="fill-primary/10 stroke-primary/30"
                strokeWidth="1.5"
              />
              <text x="137" y="150" textAnchor="middle" className="fill-foreground/40 text-[10px] font-semibold uppercase tracking-wider">
                Luzon
              </text>

              {/* Visayas */}
              <path
                d="M110 280 C130 275 145 285 150 300 C160 310 155 325 140 330 C130 340 110 338 100 328 C90 335 75 330 75 318 C70 305 85 300 95 295 C95 285 100 282 110 280 Z"
                className="fill-primary/10 stroke-primary/30"
                strokeWidth="1.5"
              />
              <path
                d="M175 290 C190 286 205 295 205 310 C210 322 198 332 185 328 C172 335 158 325 162 310 C160 298 165 292 175 290 Z"
                className="fill-primary/10 stroke-primary/30"
                strokeWidth="1.5"
              />
              <text x="137" y="360" textAnchor="middle" className="fill-foreground/40 text-[10px] font-semibold uppercase tracking-wider">
                Visayas
              </text>

              {/* Mindanao */}
              <path
                d="M110 390 C140 380 175 385 200 400 C225 410 235 430 220 450 C215 465 195 478 175 472 C160 480 140 478 128 465 C110 470 90 460 92 442 C80 430 85 412 100 402 C100 395 104 392 110 390 Z"
                className="fill-primary/10 stroke-primary/30"
                strokeWidth="1.5"
              />
              <text x="157" y="500" textAnchor="middle" className="fill-foreground/40 text-[10px] font-semibold uppercase tracking-wider">
                Mindanao
              </text>

              {/* Developer pins */}
              {PINS.map((pin) => (
                <g
                  key={pin.name}
                  className="cursor-pointer"
                  onMouseEnter={() => setActive(pin.name)}
                  onMouseLeave={() => setActive((cur) => (cur === pin.name ? null : cur))}
                  onClick={() => setActive((cur) => (cur === pin.name ? null : pin.name))}
                >
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={active === pin.name ? 7 : 5}
                    className="fill-primary stroke-white transition-all"
                    strokeWidth="2"
                  />
                  {active === pin.name && (
                    <circle cx={pin.x} cy={pin.y} r="12" className="fill-primary/20 animate-ping" />
                  )}
                </g>
              ))}
            </svg>

            {active && (
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white">
                  <Image
                    src={PINS.find((p) => p.name === active)!.logo}
                    alt={active}
                    className="object-contain"
                    style={{ height: "1.75rem", width: "auto" }}
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{active}</p>
                  <p className="text-xs text-muted">{PINS.find((p) => p.name === active)!.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {PINS.map((pin) => (
              <button
                key={pin.name}
                type="button"
                onMouseEnter={() => setActive(pin.name)}
                onMouseLeave={() => setActive((cur) => (cur === pin.name ? null : cur))}
                onClick={() => setActive((cur) => (cur === pin.name ? null : pin.name))}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                  active === pin.name ? "border-primary bg-primary/5" : "border-border bg-background-secondary hover:border-primary/40"
                }`}
              >
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white">
                  <Image src={pin.logo} alt={pin.name} className="object-contain" style={{ height: "1.75rem", width: "auto" }} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{pin.name}</p>
                  <p className="text-xs text-muted">{pin.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
