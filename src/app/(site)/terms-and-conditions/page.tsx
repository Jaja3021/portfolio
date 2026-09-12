import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CONTACT_INFO } from "@/lib/constants";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms that govern your use of the Arnold B. Fadriquila, RES website, including property listings, viewing requests, and content ownership.",
  alternates: { canonical: "/terms-and-conditions" },
};

const EFFECTIVE_DATE = "September 8, 2026";

export default function TermsPage() {
  return (
    <>
      <PageViewTracker />
      <LegalLayout title="Terms and Conditions" effectiveDate={EFFECTIVE_DATE}>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your use of this website,
          operated by {SITE_NAME} under Dream House Realty. By browsing this site or submitting
          a form, you agree to these Terms.
        </p>

        <h2>Property Listings</h2>
        <p>
          Property details, prices, availability, and images are provided for general
          information only and may change without prior notice. Listings do not constitute a
          binding offer to sell. All transactions are subject to a separate, formal agreement
          and are carried out under the supervision of a PRC-licensed real estate broker, in
          accordance with the Real Estate Service Act (RA 9646).
        </p>

        <h2>Viewing Requests and Inquiries</h2>
        <p>
          Submitting a viewing request or inquiry does not guarantee property availability or
          reserve a unit. Schedules are confirmed individually, and Arnold&apos;s team will
          contact you using the details you provide to arrange or adjust a viewing.
        </p>

        <h2>Accuracy of Submitted Information</h2>
        <p>
          You agree to provide accurate and current contact details when submitting a form. We
          are not responsible for missed communications resulting from incorrect information you
          supplied.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The text, layout, branding, and photography on this site (excluding property images
          supplied by third-party developers) belong to {SITE_NAME} / Dream House Realty and may
          not be copied or reused without permission.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          This site may link to third-party services, such as social media pages. We are not
          responsible for the content or privacy practices of those external sites.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          This website is provided &quot;as is.&quot; While we try to keep information accurate
          and the site available, we do not guarantee uninterrupted access and are not liable
          for decisions made solely on information found here without independent verification.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Republic of the Philippines.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may revise these Terms from time to time. Continued use of the site after changes
          are posted constitutes acceptance of the updated Terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a> or{" "}
          <a href={`tel:${CONTACT_INFO.phoneHref}`}>{CONTACT_INFO.phone}</a>.
        </p>
      </LegalLayout>
    </>
  );
}
