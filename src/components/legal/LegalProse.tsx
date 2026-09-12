export function LegalProse({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        prose-legal flex flex-col gap-6 text-sm leading-relaxed text-foreground/80
        [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground
        [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5
        [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
        [&_strong]:font-semibold [&_strong]:text-foreground
      "
    >
      {children}
    </div>
  );
}
