"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpIcon, XIcon } from "@phosphor-icons/react/ssr";

const N8N_WEBHOOK_URL =
  "https://jafadriquila.app.n8n.cloud/webhook/caf86b33-48db-4451-9ce3-c96e3fb74415/chat";

const SUGGESTIONS = [
  "What properties are available?",
  "How does the buying process work?",
  "How do I get in touch with Arnold?",
];

type Message = {
  id: string;
  role: "user" | "bot" | "admin";
  content: string;
};

const ADMIN_POLL_INTERVAL_MS = 3000;

const INLINE_TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/\S+)/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;
const BARE_URL_RE = /^https?:\/\/\S+$/;

function renderInline(text: string, keyPrefix: string) {
  return text.split(INLINE_TOKEN_RE).filter(Boolean).map((part, i) => {
    const linkMatch = part.match(LINK_RE);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {label}
        </a>
      );
    }
    if (BARE_URL_RE.test(part)) {
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {part}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function renderMessageContent(content: string) {
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(keyBase: string) {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${keyBase}`} className="mt-1.5 list-disc space-y-1 pl-4 first:mt-0">
        {listBuffer.map((item, i) => (
          <li key={`li-${keyBase}-${i}`}>{renderInline(item, `li-${keyBase}-${i}`)}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  }

  content.split("\n").forEach((rawLine, idx) => {
    const line = rawLine.trim();
    const bulletMatch = line.match(/^[*-]\s+(.*)/);
    if (bulletMatch) {
      listBuffer.push(bulletMatch[1]);
      return;
    }
    flushList(String(idx));
    if (line) {
      blocks.push(
        <p key={`p-${idx}`} className="mt-1.5 first:mt-0">
          {renderInline(line, `p-${idx}`)}
        </p>,
      );
    }
  });
  flushList("end");

  return blocks;
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "chat_session_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  // Starts at page-load time, not null — an admin reply from a previous visit
  // (before this reload) should stay in the dashboard's history only, not
  // resurface in the widget, which shows no history on a fresh page load.
  const sinceRef = useRef<string>(new Date().toISOString());
  const seenAdminIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  // While the chat is open, poll for admin replies sent from the dashboard —
  // the widget has no live push channel, so this is how a human agent's
  // message reaches an already-open session without a page reload.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function poll() {
      try {
        const params = new URLSearchParams({ sessionId: getSessionId() });
        if (sinceRef.current) params.set("since", sinceRef.current);

        const res = await fetch(`/api/chat/messages?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        const incoming: { id: string; content: string; created_at: string }[] = data.messages ?? [];
        if (cancelled || incoming.length === 0) return;

        const fresh = incoming.filter((m) => !seenAdminIdsRef.current.has(m.id));
        if (fresh.length === 0) return;

        for (const m of fresh) seenAdminIdsRef.current.add(m.id);
        sinceRef.current = incoming[incoming.length - 1].created_at;

        setMessages((prev) => [
          ...prev,
          ...fresh.map((m) => ({ id: m.id, role: "admin" as const, content: m.content })),
        ]);
      } catch {
        // silently retry on the next interval tick
      }
    }

    poll();
    const interval = setInterval(poll, ADMIN_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);

    const botId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: botId, role: "bot", content: "" }]);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          chatInput: trimmed,
          sessionId: getSessionId(),
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botText = "";
      let hadError = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.type === "item" && typeof evt.content === "string") {
              botText += evt.content;
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, content: botText } : m)),
              );
            } else if (evt.type === "error") {
              hadError = true;
            }
          } catch {
            // ignore malformed partial line
          }
        }
      }

      if (hadError || !botText.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  content:
                    "Sorry, I couldn't process that just now. Please try again, or reach Arnold directly through the contact page.",
                }
              : m,
          ),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
                ...m,
                content:
                  "Sorry, I couldn't process that just now. Please try again, or reach Arnold directly through the contact page.",
              }
            : m,
        ),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:right-6">
          <div className="flex items-center gap-3 bg-foreground px-4 py-3.5 text-background">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20">
              <Image src="/arnold-fadriquila.jpg" alt="" fill sizes="36px" className="object-cover object-top" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Arnold&apos;s Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-background/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                Online &middot; Real estate assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 rounded-full p-1.5 text-background/70 transition hover:bg-white/10 hover:text-background"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-muted px-4 py-4">
            <div className="max-w-[85%] min-w-0 break-words rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
              Hi! I&apos;m Arnold&apos;s assistant. Ask me anything about listings, locations, or how
              to get in touch — what are you looking for?
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "ml-auto max-w-[85%] min-w-0" : "max-w-[85%] min-w-0"}>
                {m.role === "admin" && (
                  <p className="mb-1 px-1 text-[11px] font-medium text-foreground/50">Arnold</p>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "min-w-0 break-words rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-sm leading-relaxed text-white"
                      : m.role === "admin"
                        ? "min-w-0 break-words rounded-2xl rounded-tl-sm border border-accent/30 bg-accent-light px-4 py-3 text-sm leading-relaxed text-accent-dark"
                        : "min-w-0 break-words rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground"
                  }
                >
                  {m.content ? renderMessageContent(m.content) : m.role === "bot" && sending ? "…" : ""}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-border bg-surface px-3 py-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 transition focus-within:border-accent">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={sending}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-foreground/40"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition disabled:opacity-40"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-foreground/45">
              Answers come from Arnold&apos;s listings and may be inaccurate.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-4 right-4 z-50 h-16 w-16 overflow-hidden rounded-full border-2 border-surface shadow-xl transition hover:scale-105 sm:right-6"
      >
        {open ? (
          <span className="flex h-full w-full items-center justify-center bg-foreground text-background">
            <XIcon className="h-6 w-6" />
          </span>
        ) : (
          <span className="relative block h-full w-full">
            <Image src="/arnold-fadriquila.jpg" alt="Open chat" fill sizes="64px" className="object-cover object-top" />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-400" />
          </span>
        )}
      </button>
    </>
  );
}
