"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PrivacyPolicyLink } from "@/components/legal/PrivacyPolicyLink";
import { Field, inputClass } from "@/components/forms/InquiryForm";
import type { Errors } from "@/lib/validation";
import { required, validEmail, validPhone } from "@/lib/validation";
import type { ViewingFormData } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const EMPTY: ViewingFormData = {
  name: "",
  email: "",
  phone: "",
  property: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

export function ViewingForm({ presetProperty = "" }: { presetProperty?: string }) {
  const [data, setData] = useState<ViewingFormData>({ ...EMPTY, property: presetProperty });
  const [errors, setErrors] = useState<Errors<ViewingFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof ViewingFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setData((d) => ({ ...d, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: Errors<ViewingFormData> = {};
    const name = required(data.name, "Name");
    if (name) next.name = name;
    const email = validEmail(data.email);
    if (email) next.email = email;
    const phone = validPhone(data.phone);
    if (phone) next.phone = phone;
    const date = required(data.preferredDate, "Preferred date");
    if (date) next.preferredDate = date;
    const time = required(data.preferredTime, "Preferred time");
    if (time) next.preferredTime = time;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);

    if (isSupabaseConfigured) {
      setSubmitting(true);
      const res = await fetch("/api/viewing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          property: data.property,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          message: data.message,
        }),
      }).catch(() => null);
      setSubmitting(false);
      if (!res || !res.ok) {
        setSubmitError("Something went wrong sending your request. Please try again.");
        return;
      }
    }

    setSubmitted(true);
    setData(EMPTY);
  };

  if (submitted) {
    return (
      <p className="rounded-xl bg-accent-light p-6 text-center text-sm font-medium text-accent-dark">
        Thank you! Your viewing request has been received. Arnold&apos;s team will confirm your schedule
        soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Name" error={errors.name}>
        <input value={data.name} onChange={set("name")} className={inputClass(!!errors.name)} />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={data.email} onChange={set("email")} className={inputClass(!!errors.email)} />
      </Field>
      <Field label="Phone" error={errors.phone}>
        <input value={data.phone} onChange={set("phone")} className={inputClass(!!errors.phone)} />
      </Field>
      <Field label="Property">
        <input value={data.property} onChange={set("property")} className={inputClass(false)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Preferred Date" error={errors.preferredDate}>
          <input
            type="date"
            value={data.preferredDate}
            onChange={set("preferredDate")}
            className={inputClass(!!errors.preferredDate)}
          />
        </Field>
        <Field label="Preferred Time" error={errors.preferredTime}>
          <input
            type="time"
            value={data.preferredTime}
            onChange={set("preferredTime")}
            className={inputClass(!!errors.preferredTime)}
          />
        </Field>
      </div>
      <Field label="Message">
        <textarea rows={3} value={data.message} onChange={set("message")} className={inputClass(false)} />
      </Field>
      {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      <p className="text-xs text-foreground/70">
        By submitting, you agree to our <PrivacyPolicyLink />.
      </p>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Sending..." : "Request Property Viewing"}
      </Button>
    </form>
  );
}
