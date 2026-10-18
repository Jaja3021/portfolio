import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PageViewTracker } from "@/components/PageViewTracker";
import { PropertyDetails } from "@/components/properties/PropertyDetailModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProperties } from "@/lib/data";
import { findPropertyBySlug, propertyPath } from "@/lib/property-url";
import { realEstateListingJsonLd } from "@/lib/structured-data";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

async function getPropertyForSlug(params: Props["params"]) {
  const { slug } = await params;
  return findPropertyBySlug(await getProperties(), slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyForSlug(params);
  if (!property) return { title: "Property Not Found" };

  const description = `${formatPrice(property.price)} · ${property.propertyType} in ${property.city}, ${property.province}. ${property.description}`.slice(
    0,
    200,
  );
  const images = property.images[0] ? [property.images[0]] : undefined;

  return {
    title: property.title,
    description,
    alternates: { canonical: propertyPath(property) },
    openGraph: { title: property.title, description, images, type: "website" },
    twitter: { card: "summary_large_image", title: property.title, description, images },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = findPropertyBySlug(await getProperties(), slug);
  if (!property) notFound();

  // Old or retitled slugs redirect to the current one, so each listing has one URL.
  const canonical = propertyPath(property);
  if (`/properties/${decodeURIComponent(slug)}` !== canonical) permanentRedirect(canonical);

  return (
    <>
      <PageViewTracker />
      <JsonLd data={realEstateListingJsonLd(property)} />
      <section className="bg-background-secondary">
        <div className="mx-auto max-w-4xl px-0 py-6 sm:px-6 sm:py-10 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 px-4 text-sm text-muted sm:px-0">
            <Link href="/properties" className="font-medium text-primary hover:text-primary-hover">
              ← All properties
            </Link>
          </nav>
          <article className="overflow-hidden border-y border-border bg-surface sm:rounded-xl sm:border">
            <PropertyDetails property={property} headingId="property-title" headingAs="h1" />
          </article>
        </div>
      </section>
    </>
  );
}
