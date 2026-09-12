import { ViewingForm } from "@/components/forms/ViewingForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/components/motion/variants";

export function ViewingCTA() {
  return (
    <section id="schedule-viewing" className="bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="Book a Viewing"
            title="Request a Property Viewing"
            description="Let Arnold's team know when you're available and they'll confirm a schedule with you."
          />
        </Reveal>
        <Reveal variants={fadeUp} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <ViewingForm />
        </Reveal>
      </div>
    </section>
  );
}
