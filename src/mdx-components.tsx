import { InfoIcon as Info, LightbulbIcon as Lightbulb } from "@phosphor-icons/react/ssr";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ListingsInCity } from "@/components/guides/ListingsInCity";
import { childrenText, headingId } from "@/lib/heading-id";

// Styles for /guides articles (written in MDX under src/content/guides).
// Required by @next/mdx in the App Router.

function Callout({ type = "tip", children }: { type?: "tip" | "note"; children: React.ReactNode }) {
  const Icon = type === "tip" ? Lightbulb : Info;
  return (
    <aside className="my-8 flex gap-4 rounded-r-xl border-l-4 border-primary bg-primary-soft px-5 py-4 text-[0.95rem] leading-relaxed text-foreground">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-strong" weight="fill" aria-hidden />
      <div className="[&>p]:my-0">{children}</div>
    </aside>
  );
}

const components: MDXComponents = {
  // h2s get ids so the "On this page" list can link to them.
  h2: ({ children, ...props }) => (
    <h2
      id={headingId(childrenText(children))}
      className="font-display mb-4 mt-14 scroll-mt-28 border-t border-border pt-10 text-2xl font-normal tracking-tight text-foreground first:mt-0 first:border-0 first:pt-0 sm:text-[2rem]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: (props) => <h3 className="mb-3 mt-8 text-lg font-semibold text-foreground" {...props} />,
  p: (props) => <p className="my-5 text-[1.0625rem] leading-8 text-foreground/85" {...props} />,
  ul: (props) => (
    <ul
      className="my-5 space-y-3 text-[1.0625rem] leading-8 text-foreground/85 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.8rem] [&>li]:before:h-2 [&>li]:before:w-2 [&>li]:before:rounded-full [&>li]:before:bg-primary [&>li]:before:content-['']"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-5 list-decimal space-y-3 pl-6 text-[1.0625rem] leading-8 text-foreground/85 marker:font-semibold marker:text-primary"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        {...props}
      />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        {...props}
      />
    ),
  hr: () => <hr className="my-12 border-border" />,
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[520px] text-left text-[0.95rem]" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-primary-soft text-primary-strong" {...props} />,
  th: (props) => <th className="px-5 py-3.5 text-sm font-semibold" {...props} />,
  tr: (props) => <tr className="even:bg-background-secondary/60" {...props} />,
  td: (props) => (
    <td className="border-t border-border px-5 py-3.5 align-top leading-relaxed text-foreground/85 first:font-medium first:text-foreground" {...props} />
  ),
  Callout,
  ListingsInCity,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
