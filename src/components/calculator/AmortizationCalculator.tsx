"use client";

import { ArrowCounterClockwiseIcon as Reset, InfoIcon as Info, WarningIcon as Warning } from "@phosphor-icons/react/ssr";
import { useId, useMemo, useState } from "react";
import {
  DEFAULT_RESERVATION_FEE,
  FINANCING_OPTIONS,
  FINANCING_PRESETS,
  clamp,
  computeFinancing,
  type FinancingOption,
  type FinancingTerms,
} from "@/lib/financing";
import { formatPrice } from "@/lib/utils";

function presetTerms(option: FinancingOption): FinancingTerms {
  const { downPaymentPercent, equityMonths, loanYears, interestRate } = FINANCING_PRESETS[option];
  return { downPaymentPercent, equityMonths, loanYears, interestRate };
}

const initialTerms = () =>
  Object.fromEntries(FINANCING_OPTIONS.map((o) => [o, presetTerms(o)])) as Record<FinancingOption, FinancingTerms>;

function peso(value: number) {
  return formatPrice(Math.round(value));
}

export function AmortizationCalculator({
  initialPrice,
  compact = false,
}: {
  /** Property pages pass the listing price; buyers can still edit it. */
  initialPrice?: number;
  /** Tighter spacing for use inside the property modal. */
  compact?: boolean;
}) {
  const [option, setOption] = useState<FinancingOption>("pagibig");
  const [price, setPrice] = useState(initialPrice ?? 3_000_000);
  const [reservationFee, setReservationFee] = useState(DEFAULT_RESERVATION_FEE);
  // Each financing option keeps its own edits, so switching tabs doesn't lose them.
  const [termsByOption, setTermsByOption] = useState(initialTerms);

  const preset = FINANCING_PRESETS[option];
  const terms = termsByOption[option];
  const result = useMemo(() => computeFinancing(price, reservationFee, terms), [price, reservationFee, terms]);

  const updateTerms = (patch: Partial<FinancingTerms>) =>
    setTermsByOption((prev) => ({ ...prev, [option]: { ...prev[option], ...patch } }));

  const resetOption = () => setTermsByOption((prev) => ({ ...prev, [option]: presetTerms(option) }));

  const overLoanCap = preset.maxLoanAmount !== null && result.loanAmount > preset.maxLoanAmount;
  const reservationExceedsEquity = reservationFee > result.downPayment && result.downPayment > 0;

  return (
    <div className={`rounded-xl border border-border bg-surface ${compact ? "p-4 sm:p-5" : "p-5 sm:p-8"}`}>
      <div role="tablist" aria-label="Financing option" className="grid grid-cols-3 gap-1 rounded-lg bg-background-secondary p-1">
        {FINANCING_OPTIONS.map((o) => (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={option === o}
            onClick={() => setOption(o)}
            className={`rounded-md px-2 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              option === o ? "bg-primary text-on-primary shadow-sm" : "text-foreground/70 hover:text-primary"
            }`}
          >
            {FINANCING_PRESETS[o].shortLabel}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{preset.description}</p>

      <div className={`grid gap-6 ${compact ? "mt-5" : "mt-6 lg:grid-cols-2 lg:gap-10"}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            label="Total contract price (₱)"
            value={price}
            onChange={(v) => setPrice(clamp(v, 0, 1_000_000_000))}
            className="sm:col-span-2"
          />
          <NumberField
            label="Down payment / equity (%)"
            value={terms.downPaymentPercent}
            onChange={(v) => updateTerms({ downPaymentPercent: clamp(v, 0, 100) })}
            step={1}
            hint={peso(result.downPayment)}
          />
          <NumberField
            label="Equity term (months)"
            value={terms.equityMonths}
            onChange={(v) => updateTerms({ equityMonths: clamp(Math.round(v), 0, 120) })}
            step={1}
          />
          <NumberField
            label="Loan term (years)"
            value={terms.loanYears}
            onChange={(v) => updateTerms({ loanYears: clamp(Math.round(v), 1, preset.maxLoanYears) })}
            step={1}
            hint={`Max ${preset.maxLoanYears} years`}
          />
          <NumberField
            label="Interest rate (% per year)"
            value={terms.interestRate}
            onChange={(v) => updateTerms({ interestRate: clamp(v, 0, 40) })}
            step={0.125}
          />
          <NumberField
            label="Reservation fee (₱)"
            value={reservationFee}
            onChange={(v) => setReservationFee(clamp(v, 0, 10_000_000))}
            step={1000}
            className="sm:col-span-2"
          />
          <button
            type="button"
            onClick={resetOption}
            className="flex items-center gap-1.5 justify-self-start text-sm font-medium text-primary hover:text-primary-hover cursor-pointer sm:col-span-2"
          >
            <Reset className="h-4 w-4" /> Reset {preset.shortLabel} defaults
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-primary p-5 text-on-primary">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-primary/80">
              Est. monthly amortization
            </p>
            <p className="mt-1 text-3xl font-semibold sm:text-4xl">
              {peso(result.monthlyAmortization)}
              <span className="text-base font-normal text-on-primary/80"> /month</span>
            </p>
            <p className="mt-1 text-sm text-on-primary/80">
              for {terms.loanYears} {terms.loanYears === 1 ? "year" : "years"} at {terms.interestRate}%
            </p>
          </div>

          <dl className="divide-y divide-border rounded-xl border border-border text-sm">
            <Row label="Reservation fee" value={peso(reservationFee)} />
            <Row
              label={`Monthly equity${terms.equityMonths > 0 ? ` × ${terms.equityMonths} mos` : ""}`}
              value={peso(result.monthlyEquity)}
            />
            <Row label="Total down payment" value={peso(result.downPayment)} />
            <Row label="Loan amount" value={peso(result.loanAmount)} strong />
          </dl>

          {overLoanCap && (
            <Notice icon={Warning} tone="warn">
              Pag-IBIG&apos;s maximum loanable amount is {peso(preset.maxLoanAmount!)}. Increase the down payment or
              consider bank financing.
            </Notice>
          )}
          {reservationExceedsEquity && (
            <Notice icon={Warning} tone="warn">
              The reservation fee is higher than the down payment.
            </Notice>
          )}
          <Notice icon={Info}>
            Rates and results are estimates only and exclude fees, insurance, and taxes. Please confirm the actual
            rates, terms, and computation with the developer or lender.
          </Notice>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  hint,
  className = "",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  hint?: string;
  className?: string;
}) {
  const id = useId();
  // Keep the raw text so users can clear the field or type "6." mid-edit.
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (Number(text.replace(/,/g, "")) !== value) setText(String(value));
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const parsed = Number(e.target.value);
          if (e.target.value !== "" && !Number.isNaN(parsed)) onChange(parsed);
        }}
        onBlur={() => setText(String(value))}
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-primary"
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-foreground" : "font-medium text-foreground"}>{value}</dd>
    </div>
  );
}

function Notice({
  icon: Icon,
  tone = "info",
  children,
}: {
  icon: typeof Info;
  tone?: "info" | "warn";
  children: React.ReactNode;
}) {
  return (
    <p
      className={`flex gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed ${
        tone === "warn"
          ? "bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200"
          : "bg-background-secondary text-muted"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
