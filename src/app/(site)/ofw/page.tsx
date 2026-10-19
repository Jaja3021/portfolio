import {
  AirplaneTiltIcon as Plane,
  BankIcon as Bank,
  CalculatorIcon as Calculator,
  CheckIcon as Check,
  CreditCardIcon as CreditCard,
  FileTextIcon as FileText,
  HandshakeIcon as Handshake,
  KeyIcon as Key,
  MessengerLogoIcon as Messenger,
  PhoneCallIcon as ViberGlyph,
  ShieldWarningIcon as ShieldWarning,
  VideoCameraIcon as Video,
  WhatsappLogoIcon as WhatsApp,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { fadeUp } from "@/components/motion/variants";
import { PageViewTracker } from "@/components/PageViewTracker";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_INFO } from "@/lib/constants";
import { FINANCING_PRESETS } from "@/lib/financing";
import { channelLink, isChannelConfigured, type MessagingChannel } from "@/lib/messaging";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buying a Home in the Philippines as an OFW",
  description:
    "A step-by-step guide for OFWs buying property in Cavite and across the Philippines from abroad: Special Power of Attorney, Pag-IBIG housing loans, online reservation, video tours, and required documents.",
  alternates: { canonical: "/ofw" },
};

// TODO(Arnold): review the steps and Pag-IBIG details below
// against current Pag-IBIG / developer requirements before publishing.

const STEPS = [
  {
    icon: Handshake,
    title: "1. Message me",
    description: "Tell me your budget, preferred location, and target move-in date. We can talk on Messenger, Viber, or WhatsApp in your time zone.",
  },
  {
    icon: Video,
    title: "2. Video tour",
    description: "I'll walk the model house or actual unit on a live video call, plus the neighborhood, roads, and nearby schools and malls.",
  },
  {
    icon: CreditCard,
    title: "3. Reserve online",
    description: "Pay the reservation fee directly to the developer's official account and receive an official receipt by email.",
  },
  {
    icon: FileText,
    title: "4. Submit documents",
    description: "Send scanned documents first. Originals and your Special Power of Attorney follow by courier.",
  },
  {
    icon: Bank,
    title: "5. Loan approval",
    description: "Your representative and I process your Pag-IBIG, bank, or in-house financing while you keep working abroad.",
  },
  {
    icon: Key,
    title: "6. Turnover",
    description: "Your representative signs and receives the keys on your behalf, or we schedule turnover on your next vacation.",
  },
];

const pagibig = FINANCING_PRESETS.pagibig;

const CHANNELS: { channel: MessagingChannel; label: string; icon: typeof Messenger; color: string }[] = [
  { channel: "messenger", label: "Messenger", icon: Messenger, color: "bg-[#0084FF]" },
  { channel: "whatsapp", label: "WhatsApp", icon: WhatsApp, color: "bg-[#25D366]" },
  { channel: "viber", label: "Viber", icon: ViberGlyph, color: "bg-[#7360F2]" },
];

const OFW_GREETING = "Hi Arnold! I'm an OFW and I'd like to ask about buying a property in the Philippines.";

export default function OfwPage() {
  const channels = CHANNELS.filter((c) => isChannelConfigured(c.channel));

  return (
    <>
      <PageViewTracker />

      <section className="bg-gradient-to-br from-primary-deep via-primary to-primary-deep">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">
            <Plane className="h-4 w-4" weight="fill" /> For OFWs & Filipinos Abroad
          </p>
          <h1 className="font-display mt-5 text-4xl font-normal leading-[1.15] tracking-tight text-white sm:text-5xl">
            Own a Home in the Philippines, Even While You&apos;re Abroad
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            From the first video tour to the turnover of keys, I can handle the process with you remotely. You
            don&apos;t need to fly home to reserve, apply for a loan, or sign.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="#contact-ofw" size="lg">
              Message Me
            </LinkButton>
            <LinkButton
              href="/calculator"
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              <Calculator className="h-5 w-5" /> Compute Monthly Payments
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal variants={fadeUp}>
            <SectionHeading
              eyebrow="How It Works"
              title="How to Buy While Overseas"
              description="Six steps, all of which can be done from abroad."
            />
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.1}>
            {STEPS.map((step) => (
              <StaggerItem key={step.title} variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section id="spa" className="bg-background-secondary">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal variants={fadeUp}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Legal</p>
            <h2 className="font-display text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
              Special Power of Attorney (SPA)
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              An SPA authorizes a trusted person in the Philippines, your <strong>attorney-in-fact</strong>, to sign
              documents, submit requirements, and receive the property on your behalf. It is usually a spouse,
              parent, or sibling.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              I can send you the SPA wording the developer or lender requires, so you only need to sign and have it
              authenticated once.
            </p>
          </Reveal>
          <Reveal variants={fadeUp}>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-foreground">Making your SPA valid in the Philippines</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <Bullet>
                  <strong className="text-foreground">Apostille countries</strong> (e.g. Japan, Hong Kong, USA, UK, Italy):
                  have the SPA notarized locally, then apostilled by that country&apos;s designated authority.
                </Bullet>
                <Bullet>
                  <strong className="text-foreground">Countries without apostille</strong>: sign
                  and have it acknowledged at the nearest Philippine Embassy or Consulate (consularized).
                </Bullet>
                <Bullet>Courier the original SPA home. Most developers and Pag-IBIG require the original copy.</Bullet>
                <Bullet>
                  Make it <strong className="text-foreground">specific</strong>: the property, the transactions
                  (reservation, loan, deed of sale, turnover), and your representative&apos;s full name.
                </Bullet>
              </ul>
              <p className="mt-4 text-xs text-muted">
                Apostille membership changes over time. Check with the Philippine Embassy or Consulate where you are.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="pag-ibig" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal variants={fadeUp}>
            <SectionHeading
              eyebrow="Financing"
              title="Pag-IBIG Housing Loan for OFWs"
              description="Pag-IBIG membership is mandatory for OFWs, and its housing loan usually has the lowest rates and the longest terms."
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Stat value={`Up to ${formatPrice(pagibig.maxLoanAmount ?? 0)}`} label="maximum loanable amount" />
            <Stat value={`Up to ${pagibig.maxLoanYears} years`} label="to pay" />
            <Stat value="24 months" label="of contributions needed (can be paid in lump sum)" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-foreground">Who can apply</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <Bullet>Active Pag-IBIG member with at least 24 monthly contributions</Bullet>
                <Bullet>Not more than 65 years old at the time of application</Bullet>
                <Bullet>No Pag-IBIG housing loan that was foreclosed, cancelled, or bought back</Bullet>
                <Bullet>Has the legal capacity to buy property, and passes the background and credit checks</Bullet>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-foreground">Tips for OFW applicants</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <Bullet>Register or check your contributions online through Virtual Pag-IBIG.</Bullet>
                <Bullet>Keep your remittance and payslip records. They are your proof of income.</Bullet>
                <Bullet>Your attorney-in-fact can file and follow up on the loan using your SPA.</Bullet>
                <Bullet>Pay the equity on time. Loan take-out usually happens after the equity is paid.</Bullet>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Loan limits, rates, and eligibility rules are set by Pag-IBIG Fund and may change. Please confirm the
            current rules with Pag-IBIG or your developer.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/requirements" variant="outline">
              See the OFW Requirements Checklist
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-background-secondary">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal variants={fadeUp} className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <CreditCard className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Online Reservation</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Reserve your unit with a bank transfer, online banking, or remittance. I&apos;ll send you the
              developer&apos;s official payment details and the reservation agreement to sign digitally.
            </p>
            <p className="mt-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
              <ShieldWarning className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Pay only to the developer&apos;s official company account, never a personal account, and always ask
                for an official receipt.
              </span>
            </p>
          </Reveal>
          <Reveal variants={fadeUp} className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <Video className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Video Tours</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Can&apos;t visit in person? I&apos;ll do a live video tour of the model house or actual unit, so you
              can ask questions as we walk through. Your family in the Philippines is welcome to join the actual
              site visit.
            </p>
            <a
              href={CONTACT_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary-hover"
            >
              Watch recorded tours on YouTube →
            </a>
          </Reveal>
        </div>
      </section>

      <section id="contact-ofw" className="scroll-mt-20 bg-gradient-to-br from-primary-deep via-primary to-primary-deep">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Let&apos;s Talk, Wherever You Are
          </h2>
          <p className="mt-4 text-base text-white/75">
            Message me any time. I&apos;ll reply as soon as I can, usually within the day.
          </p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            {channels.map(({ channel, label, icon: Icon, color }) => (
              <a
                key={channel}
                href={channelLink(channel, channel === "viber" ? undefined : OFW_GREETING)}
                target={channel === "viber" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 ${color}`}
              >
                <Icon className="h-5 w-5" weight="fill" /> {label}
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/60">
            Prefer email?{" "}
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-white underline-offset-2 hover:underline">
              {CONTACT_INFO.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" weight="bold" />
      <span>{children}</span>
    </li>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background-secondary p-6 text-center">
      <p className="text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
