
import { createClient } from '@supabase/supabase-js';

// Declare the global constants defined in vite.config.ts
// @ts-ignore
const supabaseUrl = typeof __SUPABASE_URL__ !== 'undefined' ? __SUPABASE_URL__ : '';
// @ts-ignore
const supabaseAnonKey = typeof __SUPABASE_ANON_KEY__ !== 'undefined' ? __SUPABASE_ANON_KEY__ : '';

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.warn('BANTConfirm Alert: Supabase URL or Anon Key is missing. The app is running in degraded mode (Auth/DB will fail gracefully). Check Vercel Environment Variables.');
}

// robust mock chain helper
const mockChain = {
  select: () => mockChain,
  insert: async () => ({ error: new Error('Database not connected (Mock Mode).') }),
  update: () => mockChain,
  delete: () => mockChain,
  eq: () => mockChain,
  order: () => ({ data: [], error: null }),
  limit: () => mockChain, // Fix for "limit is not a function"
  single: async () => ({ data: null, error: null }),
  maybeSingle: async () => ({ data: null, error: null }),
};

// Fallback mock client to prevent "White Screen" crash on startup
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ error: new Error('Database not connected. Please configure VITE_SUPABASE_URL in Vercel.') }),
    signUp: async () => ({ error: new Error('Database not connected. Please configure VITE_SUPABASE_URL in Vercel.') }),
    signOut: async () => ({ error: null }),
  },
  from: () => mockChain,
} as any;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : mockClient;
