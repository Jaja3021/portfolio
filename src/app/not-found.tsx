import type { Metadata } from "next";
import { HouseIcon as Home, MagnifyingGlassIcon as Search } from "@phosphor-icons/react/ssr";
import { LinkButton } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterProvider } from "@/context/FilterContext";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or may have been moved.",
  robots: { index: false, follow: true },
};

// A top-level not-found.tsx renders inside the root layout only, so it
// doesn't inherit the (site) route group's layout — the Navbar/Footer (and
// the FilterProvider the Footer's quick-filter buttons rely on) are included
// directly here to keep the page visually and functionally consistent with
// the rest of the site instead of showing a bare, chrome-less error page.
export default function NotFound() {
  return (
    <FilterProvider>
      <Navbar />
      <main>
        <section className="flex min-h-[60vh] items-center bg-background">
          <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Error 404</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Page Not Found
            </h1>
            <p className="mt-4 text-base text-foreground/70">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s
              get you back on track.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/" size="lg">
                <Home className="h-4 w-4" />
                Back to Home
              </LinkButton>
              <LinkButton href="/properties" size="lg" variant="outline">
                <Search className="h-4 w-4" />
                Browse Properties
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </FilterProvider>
  );
}
