import {
  BuildingsIcon as Building2,
  GlobeHemisphereWestIcon as Globe2,
  HouseIcon as Home,
  UsersIcon as Users,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const AUDIENCES = [
  {
    icon: Home,
    title: "First-Time Homebuyers",
    description:
      "Step-by-step guidance through financing options, requirements, and choosing the right first home.",
  },
  {
    icon: Globe2,
    title: "Overseas Filipino Investors",
    description:
      "Remote-friendly coordination for OFWs and balikbayans investing in property back home.",
  },
  {
    icon: Users,
    title: "Growing Families",
    description:
      "Property options suited to space, school proximity, and long-term family needs.",
  },
  {
    icon: Building2,
    title: "Sellers & Landlords",
    description:
      "Support in pricing, listing, and finding qualified buyers or tenants for your property.",
  },
];

export function ServiceAudience() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading eyebrow="Who Arnold Helps" title="Built Around Different Client Needs" />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.12}>
          {AUDIENCES.map((a) => (
            <StaggerItem
              key={a.title}
              variants={fadeUp}
              className="flex flex-col items-center rounded-2xl border border-border bg-muted p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light">
                <a.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{a.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
