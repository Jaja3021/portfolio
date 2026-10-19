import { HOME_FAQ } from "@/content/faq";

// All answers are shown (no accordion) so nothing is hidden behind a click.
export function FAQ() {
  return (
    <section id="faq" className="bg-background-secondary">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {HOME_FAQ.map((item) => (
            <div key={item.id} className="py-6">
              <dt className="text-base font-semibold text-foreground">{item.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
