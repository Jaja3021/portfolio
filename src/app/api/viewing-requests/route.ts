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

  const { name, email, phone, property, preferredDate, preferredTime, message } = body;
  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof preferredDate !== "string" || !preferredDate.trim() ||
    typeof preferredTime !== "string" || !preferredTime.trim()
  ) {
    return NextResponse.json({ error: "Name, email, phone, date, and time are required." }, { status: 400 });
  }

  const { error } = await createAdminClient().from("viewing_requests").insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    property_text: typeof property === "string" && property.trim() ? property.trim() : null,
    preferred_date: preferredDate.trim(),
    preferred_time: preferredTime.trim(),
    message: typeof message === "string" && message.trim() ? message.trim() : null,
  });

  if (error) {
    console.error("Failed to insert viewing request:", error.message);
    return NextResponse.json({ error: "Failed to save viewing request." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
