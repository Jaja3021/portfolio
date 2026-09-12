import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { ServiceProcess } from "@/components/sections/ServiceProcess";
import { ServiceAudience } from "@/components/sections/ServiceAudience";
import { ViewingCTA } from "@/components/sections/ViewingCTA";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Real Estate Services",
  description:
    "From property search to closing, see how Arnold B. Fadriquila and Dream House Realty support buyers, sellers, and overseas investors across the Philippines.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageViewTracker />
      <Services />
      <ServiceProcess />
      <ServiceAudience />
      <ViewingCTA />
    </>
  );
}
