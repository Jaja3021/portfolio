import { InfoIcon as Info, LightbulbIcon as Lightbulb } from "@phosphor-icons/react/ssr";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ListingsInCity } from "@/components/guides/ListingsInCity";

// Styles for /guides articles (written in MDX under src/content/guides).
// Required by @next/mdx in the App Router.

function Callout({ type = "tip", children }: { type?: "tip" | "note"; children: React.ReactNode }) {
  const Icon = type === "tip" ? Lightbulb : Info;
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-border bg-accent-light px-4 py-3.5 text-sm leading-relaxed text-foreground/80">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" weight="fill" />
      <div className="[&>p]:my-0">{children}</div>
    </aside>
  );
}

const components: MDXComponents = {
  h2: (props) => <h2 className="font-display mt-12 mb-4 text-2xl font-normal tracking-tight text-foreground sm:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-lg font-semibold text-foreground" {...props} />,
  p: (props) => <p className="my-4 text-base leading-relaxed text-foreground/80" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground/80 marker:text-primary" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 text-base leading-relaxed text-foreground/80 marker:font-semibold marker:text-primary" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-medium text-primary underline-offset-2 hover:underline" {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-2 hover:underline" {...props} />
    ),
  hr: () => <hr className="my-10 border-border" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-background-secondary text-foreground" {...props} />,
  th: (props) => <th className="px-4 py-3 font-semibold" {...props} />,
  td: (props) => <td className="border-t border-border px-4 py-3 align-top text-foreground/80" {...props} />,
  Callout,
  ListingsInCity,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
