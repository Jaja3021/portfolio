import { Hero } from "@/components/sections/Hero";
import { HomeownershipJourney } from "@/components/sections/HomeownershipJourney";
import { TrustFeatures } from "@/components/sections/TrustFeatures";
import { PropertyTypes } from "@/components/sections/PropertyTypes";
import { DeveloperLogos } from "@/components/sections/DeveloperLogos";
import { ViewingCTA } from "@/components/sections/ViewingCTA";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getTestimonials } from "@/lib/data";

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageViewTracker />
      <Hero />
      <DeveloperLogos />
      <HomeownershipJourney />
      <PropertyTypes />
      <TrustFeatures />
      <ViewingCTA />
      <Testimonials testimonials={testimonials} />
      <FAQ />
    </>
  );
}
