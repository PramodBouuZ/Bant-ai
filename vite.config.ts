import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We handle the potential missing process.cwd() for robust Vercel builds.
  let env: Record<string, string> = {};
  try {
    env = loadEnv(mode, (process as any).cwd(), '');
  } catch (e) {
    console.warn("Could not load .env file, using defaults.");
  }

  return {
    plugins: [react()],
    define: {
      // We use the URL from your screenshot as the default fallback
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL || 'https://nqdkxuuduzgijtlkbdwo.supabase.co'),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    }
  };
});