import { createClient } from '@supabase/supabase-js';

// Default local Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key'; 

export const getSupabaseClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// In testing, we can authenticate as specific test users:
export const getAuthenticatedClient = async (email: string) => {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: 'password123'
  });
  if (error) {
    throw new Error(`Failed to authenticate ${email}: ${error.message}`);
  }
  return client;
};
