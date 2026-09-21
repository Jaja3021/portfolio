import {
  ClipboardTextIcon as ClipboardList,
  CompassIcon as Compass,
  HandshakeIcon as Handshake,
  MapPinLineIcon as MapPinned,
  TrendUpIcon as TrendingUp,
  HouseIcon as Home,
  FileTextIcon as FileText,
  CalculatorIcon as Calculator,
  BankIcon as Landmark,
  BuildingsIcon as Building2,
  MagnifyingGlassIcon as Search,
  KeyIcon as KeyRound,
} from "@phosphor-icons/react/ssr";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";

const SERVICE_GROUPS = [
  {
    category: "Buying & Selling",
    items: [
      { icon: Home, title: "Property Buying", description: "Assistance in finding suitable residential and investment properties." },
      { icon: Handshake, title: "Property Selling", description: "Professional support for property owners looking to sell." },
      { icon: TrendingUp, title: "Property Investment", description: "Guidance in identifying potential real estate opportunities." },
    ],
  },
  {
    category: "Client Support",
    items: [
      { icon: ClipboardList, title: "Property Consultation", description: "Personalized property discussions based on the client's needs." },
      { icon: Compass, title: "Property Viewing", description: "Help arrange property viewing appointments." },
      { icon: MapPinned, title: "Location Assistance", description: "Help clients explore properties across different Philippine locations." },
    ],
  },
  {
    category: "Financing & Paperwork",
    items: [
      { icon: Search, title: "Property Listing Search", description: "Curated property options matched to your budget and preferences." },
      { icon: FileText, title: "Documentation Assistance", description: "Guidance through contracts, titles, and other transaction paperwork." },
      { icon: Calculator, title: "Financing & Loan Guidance", description: "Help understanding bank financing, Pag-IBIG loans, and payment terms." },
    ],
  },
  {
    category: "Property Services",
    items: [
      { icon: Landmark, title: "Property Valuation", description: "Insight into fair market value for buying, selling, or investment decisions." },
      { icon: Building2, title: "Rental Assistance", description: "Support finding rental units or tenants for residential properties." },
      { icon: KeyRound, title: "Turnover Assistance", description: "Coordination and support through the final turnover of your property." },
    ],
  },
];

export function Services() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal variants={fadeUp}>
          <SectionHeading
            eyebrow="What Arnold Offers"
            title="Real Estate Services"
            description="Full support across every stage of buying, selling, or investing in property."
          />
        </Reveal>

        <div className="flex flex-col gap-14">
          {SERVICE_GROUPS.map((group) => (
            <Reveal key={group.category} variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <div className="lg:sticky lg:top-24">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {group.category}
                  </span>
                </div>
              </div>

              <StaggerGroup
                as="div"
                className="flex flex-col divide-y divide-border border-t border-border lg:col-span-9"
                staggerChildren={0.09}
              >
                {group.items.map((s) => (
                  <StaggerItem key={s.title} variants={fadeUp} className="flex gap-4 py-6">
                    <div className="group/chip flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary bg-surface transition-colors duration-150 hover:bg-primary">
                      <s.icon className="h-4.5 w-4.5 text-primary transition-colors duration-150 group-hover/chip:text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{s.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
