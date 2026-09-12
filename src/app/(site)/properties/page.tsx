import type { Metadata } from "next";
import { PropertiesSection } from "@/components/sections/PropertiesSection";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Properties for Sale in the Philippines",
  description:
    "Browse houses and lots, condominiums, townhouses, and commercial properties for sale across the Philippines, listed by Arnold B. Fadriquila, RES.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <PageViewTracker />
      <PropertiesSection properties={properties} />
    </>
  );
}
