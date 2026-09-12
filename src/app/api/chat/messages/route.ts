import { NextResponse } from "next/server";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

// Polled by the chat widget every few seconds while open, so a visitor sees
// admin replies sent from the dashboard without needing direct table access
// (which would require a public RLS read policy exposing other visitors' chats).
export async function GET(request: Request) {
  if (!isAdminClientConfigured) {
    return NextResponse.json({ messages: [] });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const since = searchParams.get("since");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (conversationError) {
    console.error("Failed to look up conversation:", conversationError.message);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }

  if (!conversation) {
    return NextResponse.json({ messages: [] });
  }

  let query = supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversation.id)
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  if (since) query = query.gt("created_at", since);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load admin messages:", error.message);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}
