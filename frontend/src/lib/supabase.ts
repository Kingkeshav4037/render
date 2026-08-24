import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const isProd = import.meta.env.PROD;
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isProd && (!envUrl || !envKey)) {
  throw new Error('Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in production!');
}

const supabaseUrl = envUrl || 'http://127.0.0.1:54321';
const supabaseAnonKey = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

