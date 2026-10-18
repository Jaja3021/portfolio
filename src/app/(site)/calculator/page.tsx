import type { Metadata } from "next";
import { AmortizationCalculator } from "@/components/calculator/AmortizationCalculator";
import { PageViewTracker } from "@/components/PageViewTracker";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Monthly Amortization Calculator",
  description:
    "Estimate your reservation fee, monthly equity, loan amount, and monthly amortization for Pag-IBIG, bank, and in-house financing in the Philippines.",
  alternates: { canonical: "/calculator" },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CalculatorPage({ searchParams }: Props) {
  // /calculator?price=2500000 pre-fills the contract price.
  const { price } = await searchParams;
  const parsed = typeof price === "string" ? Number(price) : NaN;
  const initialPrice = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;

  return (
    <>
      <PageViewTracker />
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="Financing"
            title="Monthly Amortization Calculator"
            description="Compare Pag-IBIG, bank, and in-house financing. Adjust the down payment, terms, and interest rate to see an estimate of your monthly payments."
          />
          <AmortizationCalculator initialPrice={initialPrice} />
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted">Want an exact computation for a specific property?</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/properties">Browse Properties</LinkButton>
              <LinkButton href="/contact" variant="outline">
                Ask for a Sample Computation
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
