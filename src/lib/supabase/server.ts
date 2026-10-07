import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { isSupabaseConfigured } from "./client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseServerClient(useServiceRole = false): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const key = useServiceRole && supabaseServiceRoleKey ? supabaseServiceRoleKey : supabaseAnonKey;
  if (!key) return null;

  return createClient<Database>(supabaseUrl!, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
