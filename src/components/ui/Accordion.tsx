"use client";

import { CaretDownIcon as ChevronDown } from "@phosphor-icons/react/ssr";
import { useState } from "react";

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-lg border bg-surface transition-colors ${open ? "border-primary" : "border-border"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className={`font-medium ${open ? "text-primary" : "text-foreground"}`}>{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-150 ${
            open ? "rotate-180 text-primary" : "text-muted"
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-150 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}
