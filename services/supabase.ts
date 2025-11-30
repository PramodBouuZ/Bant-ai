import { createClient } from '@supabase/supabase-js';

// Fallback values provided by the user for immediate testing/development.
// These allow the app to run without manual env var configuration.
const hardcodedSupabaseUrl = 'https://nqdkxuuduzgijtlkbdwo.supabase.co';
const hardcodedSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZGt4dXVkdXpnaWp0bGtiZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODIwNTksImV4cCI6MjA3ODk1ODA1OX0.LZ6aC90Z20oIEpHxzo1oLF4FmKUqC5q01adDJ4iFLks';

// Helper function to safely get environment variables
const getEnvVar = (key: string) => {
  // Check for Vite/Modern Browser Envs (import.meta.env)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // Check for Node/Process Envs (injected by Vite define)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const envUrl = getEnvVar('SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

// Use env var if available, otherwise use hardcoded fallback
const supabaseUrl = envUrl || hardcodedSupabaseUrl;
const supabaseAnonKey = envKey || hardcodedSupabaseAnonKey;

// Only log if we are missing BOTH env vars and fallbacks (which shouldn't happen here due to hardcoded values)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Database connection will fail.');
} else if (!envUrl) {
  // Optional: Log to debug info that we are using fallback, but keep it clean for user
  console.info('Using default Supabase instance.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);