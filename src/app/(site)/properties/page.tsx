import type { Metadata } from "next";
import { PropertiesSection } from "@/components/sections/PropertiesSection";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getProperties } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const DEFAULT_TITLE = "Properties for Sale in the Philippines";
const DEFAULT_DESCRIPTION =
  "Browse houses and lots, condominiums, townhouses, and commercial properties for sale across the Philippines, listed by Arnold B. Fadriquila, RES.";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getSharedPropertyId(searchParams: Props["searchParams"]) {
  const { property } = await searchParams;
  return typeof property === "string" ? property : null;
}

// Shared links (/properties?property=<id>) get a preview card for that listing
// when pasted into Messenger, Viber, Facebook, etc.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sharedId = await getSharedPropertyId(searchParams);
  const property = sharedId ? (await getProperties()).find((p) => p.id === sharedId) : undefined;

  if (!property) {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      alternates: { canonical: "/properties" },
    };
  }

  const description = `${formatPrice(property.price)} · ${property.city}, ${property.province}. ${property.description}`.slice(
    0,
    200,
  );
  const images = property.images[0] ? [property.images[0]] : undefined;

  return {
    title: property.title,
    description,
    alternates: { canonical: "/properties" },
    openGraph: { title: property.title, description, images },
    twitter: { card: "summary_large_image", title: property.title, description, images },
  };
}

export default async function PropertiesPage({ searchParams }: Props) {
  const [properties, sharedId] = await Promise.all([getProperties(), getSharedPropertyId(searchParams)]);

  return (
    <>
      <PageViewTracker />
      <PropertiesSection properties={properties} initialPropertyId={sharedId} />
    </>
  );
}
