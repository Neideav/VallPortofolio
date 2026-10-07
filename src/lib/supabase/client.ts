import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const DEFAULT_SUPABASE_URL = "https://hrxitzvkkiipnwwkmtta.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_C0l2vtCRY6EuHNnFsfYBeQ_PQw057kn";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use configured env if valid and not the obsolete project, otherwise fallback to active Porto project
export const supabaseUrl =
  rawUrl && !rawUrl.includes("uahishbtcbmcruwqjbug") && !rawUrl.includes("your-project")
    ? rawUrl
    : DEFAULT_SUPABASE_URL;

export const supabaseAnonKey =
  rawAnonKey && !rawAnonKey.includes("slYDquQ1") && !rawAnonKey.includes("AzlONrh")
    ? rawAnonKey
    : DEFAULT_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.startsWith("http") &&
      !supabaseUrl.includes("your-project-ref")
  );
}

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (browserClient) return browserClient;

  if (!isSupabaseConfigured()) {
    return null;
  }

  browserClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}
