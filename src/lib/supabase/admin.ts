import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PLACEHOLDER_SERVICE_KEY = "replace_with_your_service_role_key";

// The bucket payment receipts are stored in (see the reservation upload flow).
export const PAYMENT_PROOF_BUCKET = "payment-proofs";

// True only when a real service-role key has been provided. The repo ships
// with a placeholder, so admin routes use this to degrade gracefully.
export function isServiceRoleConfigured(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    key && key !== PLACEHOLDER_SERVICE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

// Service-role client — bypasses RLS. Server-only; never import into client code.
export function createAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
