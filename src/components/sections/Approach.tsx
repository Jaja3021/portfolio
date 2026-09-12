import {
  CertificateIcon as FileCheck2,
  HandshakeIcon as Handshake,
  MapPinLineIcon as MapPinned,
  ShieldCheckIcon as ShieldCheck,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const INFO_CARDS = [
  {
    icon: ShieldCheck,
    title: "PRC-Accredited Under RA 9646",
    detail:
      "Operates under the Real Estate Service Act (RESA), which requires every salesperson to work under the direct supervision of a PRC-licensed real estate broker.",
  },
  {
    icon: Handshake,
    title: "Broker-Supervised Transactions",
    detail:
      "Assists buyers and sellers with property selection, viewings, and negotiation, while all contracts and official documents are co-signed by the supervising broker as required by law.",
  },
  {
    icon: MapPinned,
    title: "Nationwide Property Coverage",
    detail:
      "Sources and presents listings across Luzon, Visayas, and Mindanao — house & lot, condominiums, townhouses, lots, and commercial spaces.",
  },
  {
    icon: FileCheck2,
    title: "End-to-End Client Support",
    detail:
      "Guides clients from initial inquiry through site viewing, reservation, and requirements gathering, coordinating closely with the broker of record to closing.",
  },
];

export function Approach() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="How Arnold Can Help"
            title="What Working Together Looks Like"
            description="A quick look at how property inquiries are handled, from first message to closing."
          />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2" staggerChildren={0.12}>
          {INFO_CARDS.map((card) => (
            <StaggerItem key={card.title} variants={fadeUp} className="rounded-2xl border border-border bg-muted p-6">
              <div className="inline-flex rounded-xl bg-accent-light p-2.5">
                <card.icon className="h-4 w-4 text-accent" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{card.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">{card.detail}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
