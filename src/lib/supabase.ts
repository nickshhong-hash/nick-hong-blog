import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase credentials are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create client only if credentials are available
// If not configured, the like button will show an appropriate message
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is available
export function checkSupabaseAvailable(): boolean {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Like button feature will be disabled.');
    return false;
  }
  return true;
}
