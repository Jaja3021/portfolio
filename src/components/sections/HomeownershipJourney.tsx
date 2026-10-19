const STEPS = [
  {
    title: "Get financially ready",
    description: "Set your budget and choose Pag-IBIG, bank, or in-house financing.",
  },
  {
    title: "Search & shortlist",
    description: "Narrow listings and locations down to what fits your needs.",
  },
  {
    title: "Site viewing",
    description: "Tour your shortlisted properties in person before deciding.",
  },
  {
    title: "Reservation & financing",
    description: "Reserve your unit and finalize the loan or payment terms.",
  },
  {
    title: "Documentation & approval",
    description: "Complete the requirements while your loan goes through approval.",
  },
  {
    title: "Closing & turnover",
    description: "Settle the final payment and get the keys to your new home.",
  },
];

/** How Buying Works: all six steps visible at once (horizontal on desktop, vertical on mobile). */
export function HomeownershipJourney() {
  return (
    <section id="journey" className="bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          How buying works
        </h2>
        <p className="mt-3 max-w-2xl text-base text-muted">Six steps, and Arnold is with you for every one.</p>

        <ol className="mt-10 grid grid-cols-1 gap-0 lg:grid-cols-6 lg:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:gap-3 lg:pb-0">
              {/* Connector line: vertical on mobile, horizontal on desktop. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px bg-border lg:left-9 lg:top-4 lg:h-px lg:w-[calc(100%-2.25rem+1.5rem)]"
                />
              )}
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary bg-background text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
