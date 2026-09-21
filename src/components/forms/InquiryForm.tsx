"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PrivacyPolicyLink } from "@/components/legal/PrivacyPolicyLink";
import type { Errors } from "@/lib/validation";
import { required, validEmail, validPhone } from "@/lib/validation";
import type { InquiryFormData } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const EMPTY: InquiryFormData = {
  fullName: "",
  email: "",
  phone: "",
  preferredProperty: "",
  preferredLocation: "",
  budget: "",
  message: "",
};

export function InquiryForm({ presetProperty = "" }: { presetProperty?: string }) {
  const [data, setData] = useState<InquiryFormData>({ ...EMPTY, preferredProperty: presetProperty });
  const [errors, setErrors] = useState<Errors<InquiryFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof InquiryFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setData((d) => ({ ...d, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: Errors<InquiryFormData> = {};
    const fullName = required(data.fullName, "Full name");
    if (fullName) next.fullName = fullName;
    const email = validEmail(data.email);
    if (email) next.email = email;
    const phone = validPhone(data.phone);
    if (phone) next.phone = phone;
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
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          preferredProperty: data.preferredProperty,
          preferredLocation: data.preferredLocation,
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
      <p className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center text-sm font-medium text-primary">
        Thank you! Your inquiry has been received. Arnold&apos;s team will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Full Name" error={errors.fullName}>
        <input
          value={data.fullName}
          onChange={set("fullName")}
          className={inputClass(!!errors.fullName)}
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={data.email}
          onChange={set("email")}
          className={inputClass(!!errors.email)}
        />
      </Field>
      <Field label="Phone Number" error={errors.phone}>
        <input value={data.phone} onChange={set("phone")} className={inputClass(!!errors.phone)} />
      </Field>
      <Field label="Preferred Property">
        <input value={data.preferredProperty} onChange={set("preferredProperty")} className={inputClass(false)} />
      </Field>
      <Field label="Preferred Location">
        <input value={data.preferredLocation} onChange={set("preferredLocation")} className={inputClass(false)} />
      </Field>
      <Field label="Budget">
        <input value={data.budget} onChange={set("budget")} className={inputClass(false)} />
      </Field>
      <Field label="Message">
        <textarea rows={3} value={data.message} onChange={set("message")} className={inputClass(false)} />
      </Field>
      {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      <p className="text-xs text-foreground/70">
        By submitting, you agree to our <PrivacyPolicyLink />.
      </p>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}

export function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-surface px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary ${
    hasError ? "border-red-400" : "border-border"
  }`;
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
