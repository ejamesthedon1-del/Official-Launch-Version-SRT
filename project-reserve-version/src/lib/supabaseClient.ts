// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url) console.error("VITE_SUPABASE_URL is missing");
if (!anon) console.error("VITE_SUPABASE_ANON_KEY is missing");

export const supabase = createClient(url!, anon!);
