"use client";

import {
  SealCheckIcon as BadgeCheck,
  MapPinLineIcon as MapPinned,
  ShieldCheckIcon as ShieldCheck,
  UsersIcon as Users,
} from "@phosphor-icons/react/ssr";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Trusted & Professional",
    description: "Professional real estate service focused on client needs.",
  },
  {
    icon: MapPinned,
    title: "Nationwide Coverage",
    description: "Property opportunities available across Luzon, Visayas, and Mindanao.",
  },
  {
    icon: Users,
    title: "Client-Focused",
    description: "Personalized assistance from property selection to transaction.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Properties",
    description: "Properties shown with available verification and status information.",
  },
];

export function TrustFeatures() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.15}>
          {FEATURES.map((f) => (
            <StaggerItem key={f.title} variants={fadeUp} className="flex flex-col items-start gap-3">
              <div className="group/chip rounded-lg border border-primary bg-surface p-3 transition-colors duration-150 hover:bg-primary">
                <f.icon className="h-5 w-5 text-primary transition-colors duration-150 group-hover/chip:text-white" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted">{f.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
