import { NextResponse } from "next/server";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!isAdminClientConfigured) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === "string" && body.path ? body.path : "/";

  const { error } = await createAdminClient().from("page_views").insert({ path });

  if (error) {
    console.error("Failed to record page view:", error.message);
    return NextResponse.json({ error: "Failed to record page view." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
