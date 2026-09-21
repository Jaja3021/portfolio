import { AccordionItem } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";
import { FAQ_ITEMS } from "@/lib/mock-data";

export function FAQ() {
  return (
    <section className="bg-background-secondary">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading title="Frequently Asked Questions" />
        </Reveal>
        <StaggerGroup className="flex flex-col gap-3" staggerChildren={0.12}>
          {FAQ_ITEMS.map((item) => (
            <StaggerItem key={item.id} variants={fadeUp}>
              <AccordionItem question={item.question} answer={item.answer} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
