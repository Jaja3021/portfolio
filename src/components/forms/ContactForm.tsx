"use client";

import { PaperPlaneTiltIcon as Send } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PrivacyPolicyLink } from "@/components/legal/PrivacyPolicyLink";
import { Field, inputClass } from "@/components/forms/InquiryForm";
import type { Errors } from "@/lib/validation";
import { required, validEmail, validPhone } from "@/lib/validation";
import type { ContactFormData, Property } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { MONTHLY_BUDGET_RANGES } from "@/lib/constants";

const EMPTY: ContactFormData = { name: "", email: "", phone: "", propertyInterest: "", budget: "", message: "" };

export function ContactForm({ properties }: { properties: Property[] }) {
  const [data, setData] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors<ContactFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setData((d) => ({ ...d, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: Errors<ContactFormData> = {};
    const name = required(data.name, "Full name");
    if (name) next.name = name;
    const email = validEmail(data.email);
    if (email) next.email = email;
    const phone = validPhone(data.phone);
    if (phone) next.phone = phone;
    const propertyInterest = required(data.propertyInterest, "This field");
    if (propertyInterest) next.propertyInterest = propertyInterest;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);

    if (isSupabaseConfigured) {
      setSubmitting(true);
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredProperty: data.propertyInterest,
          budget: data.budget,
          message: data.message,
        }),
      }).catch(() => null);
      setSubmitting(false);
      if (!res || !res.ok) {
        setSubmitError("Something went wrong sending your inquiry. Please try again.");
        return;
      }
    }

    setSubmitted(true);
    setData(EMPTY);
  };

  if (submitted) {
    return (
      <p className="rounded-xl bg-accent-light p-6 text-center text-sm font-medium text-accent-dark">
        Thank you! Your inquiry has been received. Arnold&apos;s team will get back to you within 24
        hours.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name}>
          <input
            value={data.name}
            onChange={set("name")}
            placeholder="Juan Dela Cruz"
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone}>
          <input
            value={data.phone}
            onChange={set("phone")}
            placeholder="09XX-XXX-XXXX"
            className={inputClass(!!errors.phone)}
          />
        </Field>
      </div>

      <Field label="Email Address" error={errors.email}>
        <input
          type="email"
          value={data.email}
          onChange={set("email")}
          placeholder="your@email.com"
          className={inputClass(!!errors.email)}
        />
      </Field>

      <Field label="I'm Interested In" error={errors.propertyInterest}>
        <select value={data.propertyInterest} onChange={set("propertyInterest")} className={inputClass(!!errors.propertyInterest)}>
          <option value="">Select a property...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.title}>
              {p.title} — {p.city}, {p.province}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Monthly Budget Range">
        <select value={data.budget} onChange={set("budget")} className={inputClass(false)}>
          <option value="">Select budget range...</option>
          {MONTHLY_BUDGET_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message">
        <textarea
          rows={4}
          value={data.message}
          onChange={set("message")}
          placeholder="Tell me more about what you're looking for..."
          className={inputClass(false)}
        />
      </Field>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      <p className="text-xs text-foreground/70">
        By submitting, you agree to our <PrivacyPolicyLink />.
      </p>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        <Send className="h-4 w-4" />
        {submitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
