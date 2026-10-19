// Amortization math shared by the calculator, the property modal, and the
// "from ₱X/month" estimate on listing cards. All figures are estimates —
// actual rates and terms come from the developer or lender.

export type FinancingOption = "pagibig" | "bank" | "inhouse";

export interface FinancingTerms {
  /** Down payment / equity as a percent of the total contract price. */
  downPaymentPercent: number;
  /** Months to pay the equity (after the reservation fee). */
  equityMonths: number;
  loanYears: number;
  /** Annual interest rate, in percent. */
  interestRate: number;
}

export interface FinancingPreset extends FinancingTerms {
  label: string;
  shortLabel: string;
  description: string;
  maxLoanYears: number;
  /** Maximum loanable amount, if the program has one. */
  maxLoanAmount: number | null;
}

// Defaults reflect typical published figures in the Philippines; buyers
// should always confirm current rates with the developer or lender.
export const FINANCING_PRESETS: Record<FinancingOption, FinancingPreset> = {
  pagibig: {
    label: "Pag-IBIG Housing Loan",
    shortLabel: "Pag-IBIG",
    description: "Lowest rates and longest terms for Pag-IBIG members, up to ₱10M loanable.",
    downPaymentPercent: 10,
    equityMonths: 12,
    loanYears: 30,
    interestRate: 6.25,
    maxLoanYears: 30,
    maxLoanAmount: 10_000_000,
  },
  bank: {
    label: "Bank Financing",
    shortLabel: "Bank",
    description: "Faster approval for higher loan amounts. Rates vary by bank and fixing period.",
    downPaymentPercent: 20,
    equityMonths: 12,
    loanYears: 20,
    interestRate: 7.5,
    maxLoanYears: 25,
    maxLoanAmount: null,
  },
  inhouse: {
    label: "In-House Financing",
    shortLabel: "In-House",
    description: "Paid directly to the developer. Easier approval, but higher rates and shorter terms.",
    downPaymentPercent: 20,
    equityMonths: 12,
    loanYears: 5,
    interestRate: 16,
    maxLoanYears: 10,
    maxLoanAmount: null,
  },
};

export const FINANCING_OPTIONS = Object.keys(FINANCING_PRESETS) as FinancingOption[];

export const DEFAULT_RESERVATION_FEE = 20_000;

/** Standard annuity formula: monthly payment for a fully amortizing loan. */
export function monthlyAmortization(principal: number, annualRatePercent: number, years: number): number {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export interface FinancingBreakdown {
  downPayment: number;
  /** Equity left after the reservation fee is credited. */
  netEquity: number;
  monthlyEquity: number;
  loanAmount: number;
  monthlyAmortization: number;
}

export function computeFinancing(price: number, reservationFee: number, terms: FinancingTerms): FinancingBreakdown {
  const safePrice = Math.max(0, price);
  const downPayment = (safePrice * clamp(terms.downPaymentPercent, 0, 100)) / 100;
  const netEquity = Math.max(0, downPayment - Math.max(0, reservationFee));
  const monthlyEquity = terms.equityMonths > 0 ? netEquity / terms.equityMonths : netEquity;
  const loanAmount = Math.max(0, safePrice - downPayment);

  return {
    downPayment,
    netEquity,
    monthlyEquity,
    loanAmount,
    monthlyAmortization: monthlyAmortization(loanAmount, terms.interestRate, terms.loanYears),
  };
}

export interface MonthlyEstimate {
  monthly: number;
  /** Short assumption note for the card footnote, e.g. "Est. Pag-IBIG, 30 yrs, 10% down". */
  assumptions: string;
}

/**
 * The "From ₱X/mo" figure on listing cards: Pag-IBIG defaults when the loan
 * fits under Pag-IBIG's cap, otherwise bank-loan defaults. Null when it
 * can't be computed (no price).
 */
export function estimateMonthly(price: number): MonthlyEstimate | null {
  if (!(price > 0)) return null;
  const pagibig = FINANCING_PRESETS.pagibig;
  const pagibigLoan = price * (1 - pagibig.downPaymentPercent / 100);
  const preset = pagibig.maxLoanAmount === null || pagibigLoan <= pagibig.maxLoanAmount ? pagibig : FINANCING_PRESETS.bank;
  const monthly = computeFinancing(price, 0, preset).monthlyAmortization;
  if (!(monthly > 0)) return null;
  return {
    monthly,
    assumptions: `Est. ${preset.shortLabel}, ${preset.loanYears} yrs at ${preset.interestRate}%, ${preset.downPaymentPercent}% down`,
  };
}

export function estimateMonthlyFrom(price: number): number {
  return estimateMonthly(price)?.monthly ?? 0;
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
