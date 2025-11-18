/* src/lib/supabase.ts */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Vite environment variables
const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Create a properly typed Supabase client
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ----------------------
// Key-Value helper functions
// ----------------------

// Set a key-value pair
export const set = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_52cdd920")
    .upsert({ key, value });
  if (error) throw new Error(error.message);
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

// Set multiple key-value pairs
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_52cdd920")
    .upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
  if (error) throw new Error(error.message);
};
