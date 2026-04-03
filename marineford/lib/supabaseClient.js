// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function fetchFromSupabase(table, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      // ✅ Header อันที่ 1
      "apikey": SUPABASE_ANON_KEY,
      // ✅ Header อันที่ 2
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Prefer": "return=representation",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  return response.json();
}