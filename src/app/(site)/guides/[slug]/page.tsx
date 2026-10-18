import { ClockIcon as Clock, PencilSimpleIcon as Pencil } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageViewTracker } from "@/components/PageViewTracker";
import { LinkButton } from "@/components/ui/Button";
import { GUIDES, getGuide } from "@/content/guides";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    // Drafts stay out of search results until published.
    robots: guide.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
      authors: [SITE_NAME],
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "long", day: "numeric" });

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const { default: Article } = await import(`@/content/guides/${slug}.mdx`);

  return (
    <>
      <PageViewTracker />
      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {guide.draft && (
            <div
              role="note"
              className="mb-8 flex gap-3 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200"
            >
              <Pencil className="mt-0.5 h-5 w-5 shrink-0" weight="fill" />
              <p>
                <strong>DRAFT for review.</strong> This guide is hidden from search engines and the guides list. To
                publish it, set <code>draft: false</code> in <code>src/content/guides/index.ts</code>.
              </p>
            </div>
          )}

          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/guides" className="font-medium text-primary hover:text-primary-hover">
              ← All guides
            </Link>
          </nav>

          <header className="mt-6 border-b border-border pb-8">
            <h1 className="font-display text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{guide.description}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span>By {SITE_NAME}</span>
              <time dateTime={guide.updatedAt ?? guide.publishedAt}>
                {dateFormat.format(new Date(guide.updatedAt ?? guide.publishedAt))}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {guide.readingMinutes} min read
              </span>
            </p>
          </header>

          <div className="pt-2">
            <Article />
          </div>

          <div className="mt-12 rounded-xl bg-background-secondary p-6 text-center">
            <p className="font-semibold text-foreground">Have questions about buying a home?</p>
            <p className="mt-1 text-sm text-muted">I&apos;m happy to help, whether you&apos;re here or abroad.</p>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/contact">Message Me</LinkButton>
              <LinkButton href="/properties" variant="outline">
                Browse Properties
              </LinkButton>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
