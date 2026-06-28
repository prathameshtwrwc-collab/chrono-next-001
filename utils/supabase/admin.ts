import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createSupabaseAdmin() {
  if (!supabaseUrl || (!serviceRoleKey && !publishableKey)) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey || publishableKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
