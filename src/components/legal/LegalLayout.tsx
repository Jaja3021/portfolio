import { LegalProse } from "@/components/legal/LegalProse";

export function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Legal</p>
        <h1 className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-foreground/60">Effective date: {effectiveDate}</p>

        <div className="mt-10">
          <LegalProse>{children}</LegalProse>
        </div>
      </div>
    </section>
  );
}
