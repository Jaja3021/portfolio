import { CONTACT_INFO } from "@/lib/constants";
import { SITE_NAME } from "@/lib/site";

export const PRIVACY_POLICY_EFFECTIVE_DATE = "September 8, 2026";

export function PrivacyPolicyContent() {
  return (
    <>
      <p>
        This Privacy Policy explains what information {SITE_NAME} (&quot;Arnold,&quot;
        &quot;we,&quot; &quot;us&quot;) collects through this website, how it is used, and the
        choices you have. By submitting a form on this site, you agree to the practices
        described below.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We only collect information you choose to give us. This site has two forms that submit
        data:
      </p>
      <ul>
        <li>
          <strong>Request Property Viewing form</strong> — collects your name, email address,
          phone number, the property you&apos;re interested in, your preferred viewing date and
          time, and any message you add.
        </li>
        <li>
          <strong>General Inquiry / Contact form</strong> — collects your name, email address,
          phone number, preferred property or location, budget range, and any message you add.
        </li>
      </ul>
      <p>
        We also record which pages of the site are visited (the page path only) for basic usage
        analytics. This does not include your name, email, or any other personal identifier,
        and no advertising or third-party tracking cookies are used.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to your viewing request or inquiry and schedule property viewings.</li>
        <li>To contact you by phone, email, or messaging apps about properties, pricing, and availability.</li>
        <li>To keep an internal record of leads and client communication.</li>
        <li>To understand which pages of the site are most useful to visitors.</li>
      </ul>
      <p>
        We do not sell, rent, or trade your personal information to third parties for marketing
        purposes.
      </p>

      <h2>Where Your Information Is Stored</h2>
      <p>
        Form submissions are stored in a secure, access-controlled database and are only visible
        to Arnold and authorized staff of Dream House Realty who need them to follow up on your
        request.
      </p>

      <h2>Data Retention</h2>
      <p>
        We keep viewing requests and inquiries for as long as reasonably necessary to respond to
        you and maintain business records, or until you ask us to delete them.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may ask us to access, correct, or delete the personal information you&apos;ve
        submitted at any time by contacting us using the details below. This is consistent with
        your rights under the Philippine Data Privacy Act of 2012 (RA 10173).
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this Privacy Policy or your data can be sent to{" "}
        <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a> or{" "}
        <a href={`tel:${CONTACT_INFO.phoneHref}`}>{CONTACT_INFO.phone}</a>.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page
        with a revised effective date.
      </p>
    </>
  );
}
