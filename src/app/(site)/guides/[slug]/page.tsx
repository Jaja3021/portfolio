import {
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
  ClockIcon as Clock,
  PencilSimpleIcon as Pencil,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ButtonArrow, LinkButton } from "@/components/ui/Button";
import { GUIDES, getGuide, listedGuides } from "@/content/guides";
import { guideToc } from "@/lib/guide-toc";
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

  const [{ default: Article }, toc] = await Promise.all([import(`@/content/guides/${slug}.mdx`), guideToc(slug)]);
  const more = listedGuides().filter((g) => g.slug !== slug).slice(0, 2);
  const date = guide.updatedAt ?? guide.publishedAt;

  return (
    <>
      <PageViewTracker />

      <header className="border-b border-border bg-background-secondary">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
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

          <Link
            href="/guides"
            className="group/btn inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-0.5" aria-hidden />
            All guides
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Buying Guide</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-normal leading-[1.08] tracking-tight text-foreground sm:text-[3.4rem]">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{guide.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden rounded-full bg-primary-soft ring-1 ring-border">
                <Image src="/arnold-fadriquila.png" alt="" fill sizes="40px" className="object-cover object-top" />
              </span>
              <span className="leading-tight">
                <span className="block font-medium text-foreground">{SITE_NAME}</span>
                <span className="block text-xs">PRC-Licensed Real Estate Salesperson</span>
              </span>
            </span>
            <span aria-hidden className="hidden h-8 w-px bg-border sm:block" />
            <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden /> {guide.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      <div className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:px-8">
          <article className="min-w-0 max-w-[44rem]">
            <Article />
          </article>

          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-28 flex flex-col gap-6">
              {toc.length > 0 && (
                <nav>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
                  <ol className="mt-4 flex flex-col gap-1 border-l border-border">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm leading-snug text-muted transition-colors hover:border-primary hover:text-primary"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="rounded-2xl border border-border bg-background-secondary p-5">
                <p className="text-sm font-semibold text-foreground">Questions about your situation?</p>
                <p className="mt-1 text-sm text-muted">Ask Arnold directly, whether you&apos;re here or abroad.</p>
                <LinkButton href="/contact" size="sm" className="mt-4 w-full">
                  Message Arnold
                </LinkButton>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-border bg-background-secondary" aria-labelledby="more-guides">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 id="more-guides" className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
              Keep reading
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {more.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group/btn flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {g.readingMinutes} min read
                  </span>
                  <span className="mt-3 text-lg font-semibold text-foreground">{g.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</span>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-6 py-10 sm:px-10 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-normal tracking-tight text-on-primary sm:text-3xl">
                Have questions about buying a home?
              </h2>
              <p className="mt-2 text-on-primary/80">I&apos;m happy to help, whether you&apos;re here or abroad.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/contact"
                className="group/btn inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-on-primary px-7 text-base font-medium text-primary transition-opacity hover:opacity-90"
              >
                Message Me
                <ButtonArrow />
              </Link>
              <Link
                href="/properties"
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-on-primary/60 px-7 text-base font-medium text-on-primary transition-colors hover:bg-on-primary/10"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
