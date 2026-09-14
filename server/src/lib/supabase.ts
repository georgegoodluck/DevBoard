import { createClient } from "@supabase/supabase-js";
import { env } from "../env.js";

// Service-role client — bypasses RLS. Only used server-side for JWT
// verification and privileged writes (workspace creation).
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  },
);
