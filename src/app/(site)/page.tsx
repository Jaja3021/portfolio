import { AboutStrip } from "@/components/sections/AboutStrip";
import { CTABand } from "@/components/sections/CTABand";
import { FAQ } from "@/components/sections/FAQ";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { Hero } from "@/components/sections/Hero";
import { HomeownershipJourney } from "@/components/sections/HomeownershipJourney";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageViewTracker } from "@/components/PageViewTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProperties, getTestimonials } from "@/lib/data";
import { realEstateAgentJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const [testimonials, properties] = await Promise.all([getTestimonials(), getProperties()]);
  const available = properties.filter((p) => p.status !== "Sold");

  return (
    <>
      <PageViewTracker />
      <JsonLd data={realEstateAgentJsonLd()} />
      <Hero properties={available} />
      <FeaturedListings properties={available} />
      <AboutStrip />
      <HomeownershipJourney />
      <Testimonials testimonials={testimonials} />
      <FAQ />
      <CTABand />
    </>
  );
}
