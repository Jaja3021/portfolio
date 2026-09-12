import {
  BriefcaseIcon as Briefcase,
  GraduationCapIcon as GraduationCap,
  ShieldCheckIcon as ShieldCheck,
  TrendUpIcon as TrendingUp,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const MILESTONES = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "Bachelor of Science in Information Technology (BSIT), IETI-Alabang.",
  },
  {
    icon: ShieldCheck,
    title: "PRC-Licensed Real Estate Salesperson (RES)",
    description:
      "Certified and licensed by the Professional Regulation Commission to legally assist clients in buying and selling property.",
  },
  {
    icon: Briefcase,
    title: "Vice President, Dream House Realty",
    description: "[Add role details and years of involvement]",
  },
  {
    icon: TrendingUp,
    title: "Today",
    description:
      "Continues to help Filipino families and overseas investors find the right property across the Philippines.",
  },
];

export function Journey() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="The Journey"
            title="A Story of Growth"
            description="[Add starting point] to a trusted name in Philippine real estate."
          />
        </Reveal>

        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-border sm:left-1/2 sm:-translate-x-1/2" />

          <StaggerGroup as="ol" className="flex flex-col gap-10" staggerChildren={0.15}>
            {MILESTONES.map((m, i) => {
              const alignRight = i % 2 === 1;
              return (
                <StaggerItem
                  key={m.title}
                  as="li"
                  variants={fadeUp}
                  className="relative flex flex-col gap-4 pl-14 sm:grid sm:grid-cols-2 sm:gap-8 sm:pl-0"
                >
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-muted bg-accent-light text-accent sm:left-1/2 sm:-translate-x-1/2">
                    <m.icon className="h-4 w-4" />
                  </span>

                  <div className={alignRight ? "sm:col-start-2 sm:pl-10" : "sm:col-start-1 sm:pr-10 sm:text-right"}>
                    <div className="rounded-xl border border-border bg-surface p-5">
                      <h3 className="text-sm font-semibold text-accent">{m.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{m.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
