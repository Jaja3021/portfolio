import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Arnold B. Fadriquila, RES for property inquiries, viewing requests, or general questions. We respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const properties = await getProperties();

  return (
    <>
      <PageViewTracker />
      <Contact properties={properties} />
    </>
  );
}
