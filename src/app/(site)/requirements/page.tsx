import type { Metadata } from "next";
import { PageViewTracker } from "@/components/PageViewTracker";
import { RequiredDocuments } from "@/components/sections/RequiredDocuments";

export const metadata: Metadata = {
  title: "Housing Loan Requirements Checklist",
  description:
    "Complete checklist of documents for a housing loan application, for OFWs and locally employed buyers: IDs, proof of income, Pag-IBIG forms, and Special Power of Attorney.",
  alternates: { canonical: "/requirements" },
};

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function RequirementsPage({ searchParams }: Props) {
  // /requirements?for=local opens the Locally Employed list (handy for sharing).
  const { for: audience } = await searchParams;

  return (
    <>
      <PageViewTracker />
      <section className="bg-gradient-to-br from-[#081d13] via-primary to-[#0a2818]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Checklist</p>
          <h1 className="font-display mt-4 text-4xl font-normal leading-tight tracking-tight text-white sm:text-5xl">
            Required Documents
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Everything to prepare for your housing loan application. Pick the list that matches your employment.
          </p>
        </div>
      </section>
      <RequiredDocuments defaultChecklist={audience === "local" ? "local" : "ofw"} showHeading={false} />
    </>
  );
}
