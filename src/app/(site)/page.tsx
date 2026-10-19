import { Hero } from "@/components/sections/Hero";
import { HomeownershipJourney } from "@/components/sections/HomeownershipJourney";
import { TrustFeatures } from "@/components/sections/TrustFeatures";
import { DeveloperLogos } from "@/components/sections/DeveloperLogos";
import { ViewingCTA } from "@/components/sections/ViewingCTA";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { RecentlySold } from "@/components/sections/RecentlySold";
import { PageViewTracker } from "@/components/PageViewTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProperties, getTestimonials } from "@/lib/data";
import { realEstateAgentJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const [testimonials, properties] = await Promise.all([getTestimonials(), getProperties()]);

  return (
    <>
      <PageViewTracker />
      <JsonLd data={realEstateAgentJsonLd()} />
      <Hero />
      <DeveloperLogos />
      <HomeownershipJourney />
      <TrustFeatures />
      <ViewingCTA />
      <RecentlySold properties={properties} />
      <Testimonials testimonials={testimonials} />
      <FAQ />
    </>
  );
}
