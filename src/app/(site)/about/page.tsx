import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Approach } from "@/components/sections/Approach";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "About Arnold B. Fadriquila, RES",
  description:
    "Meet Arnold B. Fadriquila, a PRC-accredited real estate salesperson and Vice President of Dream House Realty, serving clients across Luzon, Visayas, and Mindanao.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageViewTracker />
      <About />
      <Journey />
      <Approach />
    </>
  );
}
