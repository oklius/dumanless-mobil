import { getSupabase } from './supabase';

export type Entitlement = {
  status: string;
  plan?: string | null;
  current_period_end?: string | null;
};

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export async function fetchEntitlementForEmail(email: string): Promise<Entitlement | null> {
  const client = getSupabase();
  if (!client) return null;

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const { data, error } = await client
    .from('entitlements')
    .select('status,plan,current_period_end')
    .eq('email', normalizedEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}
