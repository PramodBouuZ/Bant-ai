import { createClient } from '@supabase/supabase-js';

// Fallback values provided by the user for immediate testing/development.
// IMPORTANT: For production, these should ALWAYS be loaded exclusively from environment variables.
const hardcodedSupabaseUrl = 'https://nqdkxuuduzgijtlkbdwo.supabase.co';
const hardcodedSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZGt4dXVkdXpnaWp0bGtiZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODIwNTksImV4cCI6MjA3ODk1ODA1OX0.LZ6aC90Z20oIEpHxzo1oLF4FmKUqC5q01adDJ4iFLks';

// Helper function to safely get environment variables without crashing in browser
const getEnvVar = (key: string) => {
  try {
    // Check for Vite/Modern Browser Envs
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // Check for Node/Process Envs
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore errors
  }
  return undefined;
};

const supabaseUrl = getEnvVar('SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL') || hardcodedSupabaseUrl;
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY') || hardcodedSupabaseAnonKey;

if (!getEnvVar('SUPABASE_URL') && !getEnvVar('VITE_SUPABASE_URL')) {
  console.warn('Supabase URL is not set as an environment variable. Using hardcoded fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);