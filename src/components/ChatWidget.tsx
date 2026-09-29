"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpIcon, XIcon } from "@phosphor-icons/react/ssr";
import { CONTACT_INFO } from "@/lib/constants";

const SUGGESTIONS = [
  "What properties are available?",
  "How does the buying process work?",
  "Can I schedule a viewing?",
];

type Message = {
  id: string;
  role: "user" | "admin";
  failed?: boolean;
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
          className="break-words font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
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
          className="break-words font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
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
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: "user", content: trimmed }]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), content: trimmed }),
      });
      if (!res.ok) throw new Error(`Send failed with status ${res.status}`);
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, failed: true } : m)));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg sm:right-6">
          <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-white">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 bg-primary-hover">
              <Image src="/arnold-ai-avatar.png" alt="" fill sizes="36px" className="object-cover object-top" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Arnold Fadriquila</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                Real estate agent &middot; Replies here
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-background-secondary px-4 py-4">
            <div className="max-w-[85%] min-w-0 break-words rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
              <p>
                Hi! I&apos;m Arnold. Send me a message about any listing or location and I&apos;ll reply
                right here as soon as I can.
              </p>
              <dl className="mt-2.5 space-y-1 border-t border-border pt-2.5 text-xs">
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold">FB:</dt>
                  <dd className="min-w-0">
                    <a
                      href={CONTACT_INFO.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                    >
                      Arnold Fadriquila
                    </a>
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold">Cellphone:</dt>
                  <dd className="min-w-0">
                    <a
                      href={`tel:${CONTACT_INFO.phoneHref}`}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold">Address:</dt>
                  <dd className="min-w-0">{CONTACT_INFO.location}</dd>
                </div>
              </dl>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
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
                      ? "min-w-0 break-words rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-relaxed text-white"
                      : "min-w-0 break-words rounded-2xl rounded-tl-sm border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-primary"
                  }
                >
                  {renderMessageContent(m.content)}
                </div>
                {m.failed && (
                  <p className="mt-1 px-1 text-right text-[11px] text-red-600">
                    Not sent. Please try again.
                  </p>
                )}
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
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 transition focus-within:border-primary">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Arnold..."
                disabled={sending}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-foreground/40"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition disabled:opacity-40"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-foreground/45">
              Arnold usually replies within the day. Keep this page open to see replies.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-4 right-4 z-50 h-16 w-16 overflow-hidden rounded-full border-2 border-surface shadow-md transition hover:scale-105 sm:right-6"
      >
        {open ? (
          <span className="flex h-full w-full items-center justify-center bg-primary text-white">
            <XIcon className="h-6 w-6" />
          </span>
        ) : (
          <span className="relative block h-full w-full bg-primary">
            <Image src="/arnold-ai-avatar.png" alt="Open chat" fill sizes="64px" className="object-cover object-top" />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-400" />
          </span>
        )}
      </button>
    </>
  );
}
