import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminClientConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

// Bypasses RLS — only ever import this from server-side code (API routes),
// never from a client component. Used for public write endpoints (inquiries,
// viewing requests, page views) so the browser never needs direct table access.
export function createAdminClient() {
  if (!isAdminClientConfigured) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }
  return createSupabaseClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
