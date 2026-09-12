"use client";

import {
  BuildingsIcon as Building2,
  HouseIcon as Home,
  FarmIcon as LandPlot,
  RowsIcon as PanelsTopLeft,
  StorefrontIcon as Store,
  WarehouseIcon as Warehouse,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { useFilters } from "@/context/FilterContext";
import type { PropertyType } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const TYPES: { type: PropertyType; icon: typeof Home; description: string; image: string }[] = [
  {
    type: "House & Lot",
    icon: Home,
    description: "Family homes and residential properties.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Condominium",
    icon: Building2,
    description: "Modern condominium properties for city living and investment.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Townhouse",
    icon: Warehouse,
    description: "Practical and affordable residential options.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Lot & Land",
    icon: LandPlot,
    description: "Residential, commercial, and investment land.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Commercial",
    icon: Store,
    description: "Commercial spaces, buildings, offices, and business properties.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
  },
  {
    type: "Single Attached",
    icon: PanelsTopLeft,
    description: "Single-wall attached homes offering privacy with a more affordable price point.",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80&auto=format&fit=crop",
  },
];

export function PropertyTypes() {
  const { filterByType } = useFilters();

  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find a Property That Fits Your Lifestyle
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.12}>
          {TYPES.map((t) => (
            <StaggerItem key={t.type} variants={fadeUp}>
              <button
                type="button"
                onClick={() => filterByType(t.type)}
                className="group h-full w-full overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.type}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <t.icon className="h-5 w-5 text-accent" />
                    <h3 className="text-base font-semibold text-foreground">{t.type}</h3>
                  </div>
                  <p className="text-sm text-foreground/60">{t.description}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-accent">
                    View Properties →
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
