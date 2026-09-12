import type { Metadata } from "next";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PartnerDevelopersMap } from "@/components/sections/PartnerDevelopersMap";
import { LocationExplorer } from "@/components/sections/LocationExplorer";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Locations We Cover",
  description:
    "Browse real estate opportunities across Luzon, Visayas, and Mindanao with Arnold B. Fadriquila, RES, in partnership with accredited Philippine developers.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageViewTracker />
      <LocationsSection />
      <PartnerDevelopersMap />
      <LocationExplorer />
    </>
  );
}
