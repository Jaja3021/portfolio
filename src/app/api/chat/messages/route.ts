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

const MAX_MESSAGE_LENGTH = 2000;

// Visitor → admin: stores the widget's message in the visitor's conversation
// (created on first message) so it shows up in the dashboard's Conversations page.
export async function POST(request: Request) {
  if (!isAdminClientConfigured) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!sessionId || sessionId.length > 100) {
    return NextResponse.json({ error: "A valid sessionId is required." }, { status: 400 });
  }
  if (!content || content.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .upsert({ session_id: sessionId, last_message_at: now }, { onConflict: "session_id" })
    .select("id")
    .single();

  if (conversationError || !conversation) {
    console.error("Failed to upsert conversation:", conversationError?.message);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversation.id, role: "user", content })
    .select("id, created_at")
    .single();

  if (messageError || !message) {
    console.error("Failed to insert message:", messageError?.message);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  return NextResponse.json({ message });
}
