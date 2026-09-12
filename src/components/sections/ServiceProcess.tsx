import {
  CalendarCheckIcon as CalendarCheck,
  KeyIcon as KeyRound,
  ChatsCircleIcon as MessagesSquare,
  MagnifyingGlassIcon as Search,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const STEPS = [
  {
    icon: MessagesSquare,
    title: "1. Inquire",
    description: "Send a message about the property or location you're interested in.",
  },
  {
    icon: Search,
    title: "2. Consultation",
    description: "Discuss your budget, needs, and preferred locations to shortlist good-fit options.",
  },
  {
    icon: CalendarCheck,
    title: "3. Viewing",
    description: "Schedule a site visit or unit viewing at a time that works for you.",
  },
  {
    icon: KeyRound,
    title: "4. Closing & Turnover",
    description: "Get support with requirements, financing, and the final turnover process.",
  },
];

export function ServiceProcess() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="How It Works"
            title="From First Message to Move-In"
            description="A straightforward process, whether you're buying, selling, or investing."
          />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.12}>
          {STEPS.map((step) => (
            <StaggerItem
              key={step.title}
              variants={fadeUp}
              className="relative rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{step.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
