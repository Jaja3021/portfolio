"use client";

import {
  ArrowLeftIcon as ArrowLeft,
  ArrowUpIcon as ArrowUp,
  ChatsCircleIcon as ChatsCircle,
  UserCircleIcon as UserCircle,
} from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ConversationRow } from "@/lib/supabase/types";
import type { Conversation } from "@/lib/types";

const POLL_INTERVAL_MS = 5000;

function mapConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    sessionId: row.session_id,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    humanTakeover: row.human_takeover,
    messages: (row.messages ?? [])
      .map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.created_at }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

function preview(conversation: Conversation): string {
  const last = conversation.messages[conversation.messages.length - 1];
  return last?.content ?? "No messages yet.";
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
}

export function ConversationsManager({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id ?? null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // Visitors message from the site's chat widget with no push channel to the
  // dashboard, so poll for new conversations and messages while this page is open.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function refresh() {
      const { data, error: loadError } = await createClient()
        .from("conversations")
        .select("*, messages(*)")
        .order("last_message_at", { ascending: false });
      if (cancelled || loadError || !data) return;
      setConversations((data as ConversationRow[]).map(mapConversation));
    }

    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleSendReply = async () => {
    const content = reply.trim();
    if (!content || !selected || sending) return;

    if (!isSupabaseConfigured) {
      setError("Connect Supabase to send replies.");
      return;
    }

    setSending(true);
    setError(null);

    const { data, error: insertError } = await createClient()
      .from("messages")
      .insert({ conversation_id: selected.id, role: "admin", content })
      .select("id, role, content, created_at")
      .single();

    setSending(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to send reply.");
      return;
    }

    await createClient().from("conversations").update({ last_message_at: data.created_at }).eq("id", selected.id);

    setReply("");
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              lastMessageAt: data.created_at,
              messages: [
                ...c.messages,
                { id: data.id, role: data.role, content: data.content, createdAt: data.created_at },
              ],
            }
          : c
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Conversations</h1>
        <p className="mt-1 text-sm text-foreground/60">
          {conversations.length} conversation{conversations.length === 1 ? "" : "s"} from the website chat
        </p>
      </div>

      {conversations.length === 0 ? (
        <p className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-foreground/50">
          No conversations yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row">
          <div
            className={`w-full shrink-0 flex-col gap-2 md:flex md:max-w-sm ${
              selected ? "hidden md:flex" : "flex"
            }`}
          >
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-colors ${
                  selectedId === c.id ? "border-accent bg-accent-light" : "border-border bg-white hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 shrink-0 text-foreground/40" />
                  <p className="truncate text-sm font-semibold text-foreground">
                    {c.contactName || `Visitor · ${c.sessionId.slice(0, 8)}`}
                  </p>
                </div>
                <p className="mt-1.5 truncate text-xs text-foreground/60">{preview(c)}</p>
                <p className="mt-2 text-[11px] text-foreground/40">{formatTime(c.lastMessageAt)}</p>
              </button>
            ))}
          </div>

          <div
            className={`min-w-0 flex-1 flex-col rounded-2xl border border-border bg-white shadow-sm ${
              selected ? "flex" : "hidden md:flex"
            }`}
          >
            {!selected ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-foreground/40">
                <ChatsCircle className="h-8 w-8" />
                <p className="text-sm">Select a conversation to view the thread.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-border p-4 pb-3 sm:p-5 sm:pb-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      aria-label="Back to conversations"
                      className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/60 hover:bg-muted md:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {selected.contactName || `Visitor session ${selected.sessionId}`}
                      </p>
                      {selected.contactEmail && (
                        <p className="truncate text-xs text-foreground/60">{selected.contactEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
                  {selected.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                      <div className="max-w-[75%]">
                        {m.role !== "user" && (
                          <p className="mb-1 px-1 text-right text-[11px] font-medium text-foreground/40">
                            {m.role === "admin" ? "Arnold" : "Assistant (legacy)"}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm ${
                            m.role === "user" ? "bg-muted text-foreground/80" : "bg-accent text-white"
                          }`}
                        >
                          <p>{m.content}</p>
                          <p className={`mt-1 text-[10px] ${m.role === "user" ? "text-foreground/40" : "text-white/70"}`}>
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-4">
                  {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendReply();
                    }}
                    className="flex items-center gap-2 rounded-full border border-border bg-muted px-2 py-1.5"
                  >
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Reply as Arnold..."
                      disabled={sending}
                      className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-foreground/40"
                    />
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      aria-label="Send reply"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
