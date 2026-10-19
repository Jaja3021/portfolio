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
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Checklist</p>
          <h1 className="font-display mt-4 text-4xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">
            Required Documents
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            Everything to prepare for your housing loan application. Pick the list that matches your employment.
          </p>
        </div>
      </section>
      <RequiredDocuments defaultChecklist={audience === "local" ? "local" : "ofw"} showHeading={false} />
    </>
  );
}
