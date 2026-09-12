import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { PrivacyPolicyContent, PRIVACY_POLICY_EFFECTIVE_DATE } from "@/components/legal/PrivacyPolicyContent";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Arnold B. Fadriquila, RES collects, uses, and protects the information you submit through this website's inquiry and property viewing forms.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageViewTracker />
      <LegalLayout title="Privacy Policy" effectiveDate={PRIVACY_POLICY_EFFECTIVE_DATE}>
        <PrivacyPolicyContent />
      </LegalLayout>
    </>
  );
}
