"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: ReturnType<typeof createClient> | null = null;

export function createBrowserSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  browserClient ??= createClient(config.url, config.key);
  return browserClient;
}
