import { NextResponse } from "next/server";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!isAdminClientConfigured) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, preferredProperty, preferredLocation, budget, message } = body;
  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }

  const { error } = await createAdminClient().from("inquiries").insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    preferred_property: typeof preferredProperty === "string" && preferredProperty.trim() ? preferredProperty.trim() : null,
    preferred_location: typeof preferredLocation === "string" && preferredLocation.trim() ? preferredLocation.trim() : null,
    budget: typeof budget === "string" && budget.trim() ? budget.trim() : null,
    message: typeof message === "string" && message.trim() ? message.trim() : null,
  });

  if (error) {
    console.error("Failed to insert inquiry:", error.message);
    return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
