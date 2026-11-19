import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('placeholder')) {
    // Return standard client or handle gracefully
    return createBrowserClient(
      url || 'https://placeholder.supabase.co',
      anonKey || 'placeholder-anon-key'
    );
  }

  return createBrowserClient(url, anonKey);
}
