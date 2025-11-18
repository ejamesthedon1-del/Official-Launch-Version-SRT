// kv_store.ts for Edge Function
// Uses service role key to bypass RLS policies

import { createClient } from "npm:@supabase/supabase-js@2";

// Get Supabase URL and service role key from environment
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create Supabase client with service role key (bypasses RLS)
// Using auth option to explicitly use service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Set a key-value pair
export const set = async (key: string, value: any): Promise<void> => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is missing");
    throw new Error("Service role key not configured");
  }
  
  const { error } = await supabase
    .from("kv_store_52cdd920")
    .upsert({ key, value });
  
  if (error) {
    console.error("KV store set error:", error);
    throw new Error(error.message);
  }
};

// Get a key-value pair
export const get = async (key: string): Promise<any> => {
  const { data, error } = await supabase
    .from("kv_store_52cdd920")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};

// Delete a key-value pair
export const del = async (key: string): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_52cdd920")
    .delete()
    .eq("key", key);
  if (error) throw new Error(error.message);
};

