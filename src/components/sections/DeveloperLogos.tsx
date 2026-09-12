"use client";

import Image, { type StaticImageData } from "next/image";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeIn } from "@/components/motion/variants";
import ayala from "../../../img/trimmed/ayala.webp";
import cbdi from "../../../img/trimmed/CBDI.webp";
import dmci from "../../../img/trimmed/dmci.webp";
import masaito from "../../../img/trimmed/Masaito.webp";
import megaworld from "../../../img/trimmed/megaworld.webp";
import raemulan from "../../../img/trimmed/raemulan.png";

const DEVELOPERS: { name: string; logo: StaticImageData }[] = [
  { name: "CBDI", logo: cbdi },
  { name: "Raemulan Lands", logo: raemulan },
  { name: "Masaito Homes", logo: masaito },
  { name: "Ayala Land", logo: ayala },
  { name: "Megaworld", logo: megaworld },
  { name: "DMCI Homes", logo: dmci },
];

export function DeveloperLogos() {
  const items = [...DEVELOPERS, ...DEVELOPERS];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/70">
          Accredited Developer Partners
        </p>

        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <StaggerGroup
            className="flex w-max animate-marquee items-center gap-6 hover:[animation-play-state:paused]"
            staggerChildren={0.15}
          >
            {items.map((d, i) =>
              i < DEVELOPERS.length ? (
                <StaggerItem
                  key={`${d.name}-${i}`}
                  variants={fadeIn}
                  className="flex h-20 shrink-0 items-center rounded-xl bg-white px-7 shadow-sm"
                >
                  <Image
                    src={d.logo}
                    alt={d.name}
                    className="object-contain"
                    style={{ height: "3rem", width: "auto" }}
                  />
                </StaggerItem>
              ) : (
                <span
                  key={`${d.name}-${i}`}
                  className="flex h-20 shrink-0 items-center rounded-xl bg-white px-7 shadow-sm"
                >
                  <Image
                    src={d.logo}
                    alt={d.name}
                    className="object-contain"
                    style={{ height: "3rem", width: "auto" }}
                  />
                </span>
              )
            )}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
