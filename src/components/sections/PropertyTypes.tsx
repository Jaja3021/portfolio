"use client";

import {
  BuildingsIcon as Building2,
  HouseIcon as Home,
  HouseSimpleIcon as HouseSimple,
  FarmIcon as LandPlot,
  RowsIcon as PanelsTopLeft,
  WarehouseIcon as Warehouse,
} from "@phosphor-icons/react/ssr";
import Image, { type StaticImageData } from "next/image";
import { useFilters } from "@/context/FilterContext";
import type { PropertyType } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";
import { ButtonArrow } from "@/components/ui/Button";
import houseAndLotImg from "../../../img/house-and-lot-card.jpg";
import condoImg from "../../../img/condo-card.jpg";
import townhouseImg from "../../../img/townhouse.jpg";
import bungalowImg from "../../../img/bungalow.jpeg";
import singleAttachedImg from "../../../img/single attached.webp";

const TYPES: { type: PropertyType; icon: typeof Home; description: string; image: string | StaticImageData }[] = [
  {
    type: "House & Lot",
    icon: Home,
    description: "Family homes and residential properties.",
    image: houseAndLotImg,
  },
  {
    type: "Condominium",
    icon: Building2,
    description: "Modern condominium properties for city living and investment.",
    image: condoImg,
  },
  {
    type: "Townhouse",
    icon: Warehouse,
    description: "Practical and affordable residential options.",
    image: townhouseImg,
  },
  {
    type: "Lot & Land",
    icon: LandPlot,
    description: "Residential, commercial, and investment land.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Bungalow",
    icon: HouseSimple,
    description: "Single-story homes with easy, all-on-one-level living.",
    image: bungalowImg,
  },
  {
    type: "Single Attached",
    icon: PanelsTopLeft,
    description: "Single-wall attached homes offering privacy with a more affordable price point.",
    image: singleAttachedImg,
  },
];

export function PropertyTypes() {
  const { filterByType } = useFilters();

  return (
    <section className="bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Property Collection
          </p>
          <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Find a Property That Fits Your Lifestyle
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.12}>
          {TYPES.map((t) => (
            <StaggerItem key={t.type} variants={fadeUp}>
              <button
                type="button"
                onClick={() => filterByType(t.type)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.type}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent">{t.type}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.description}</p>
                  <span className="group/btn mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                    View Properties
                    <ButtonArrow />
                  </span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
