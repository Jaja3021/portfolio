"use client";

import { useEffect, useRef } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function PageViewTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !isSupabaseConfigured) return;
    tracked.current = true;
    fetch("/api/page-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch((err) => console.error("Failed to record page view:", err));
  }, []);

  return null;
}
