import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kjsxtfweybttvqoafptc.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_GJtMtdBcb98y9crLNv21EA_uqpAIu7p";

let supabaseInstance: any = null;

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = supabaseCreateClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}
