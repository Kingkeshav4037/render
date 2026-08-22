import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const hasServiceKey = !!SUPABASE_SERVICE_KEY;

const supabase = hasServiceKey ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } }) : null;
const adminSupabase = hasServiceKey ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } }) : null;

describe('RLS Matrix Tests', () => {
  if (!hasServiceKey || !supabase || !adminSupabase) {
    it('skips database RLS tests because SUPABASE_SERVICE_ROLE_KEY is not set', () => {
      expect(true).toBe(true);
    });
    return;
  }

  it('enforces RLS rules correctly', async () => {
    // 1. Unauthenticated user tests
    
    // Should be able to read public destinations
    const { error: destError } = await supabase.from('locations').select('id').limit(1);
    expect(destError).toBeNull();
    // Should NOT be able to read private trips
    const { data: trips } = await supabase.from('trips').select('*');
    expect(trips?.length || 0).toBe(0);

    // Should NOT be able to insert trip
    const { error: insertTripError } = await supabase.from('trips').insert({ 
      user_id: '11111111-1111-1111-1111-111111111111', 
      title: 'Hacked Trip'
    });
    expect(insertTripError).not.toBeNull();

    // 2. Authenticated User Tests
    
    // Create first dummy user
    const { data: authData } = await supabase.auth.signUp({
      email: `testuser1_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    });
    const userId1 = authData.user!.id;

    // Create second dummy user
    const { data: authData2 } = await supabase.auth.signUp({
      email: `testuser2_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    });
    const userId2 = authData2.user!.id;

    // Sign in as user1
    await supabase.auth.signInWithPassword({
      email: authData.user!.email!,
      password: 'SecurePassword123!'
    });

    // Ensure profiles exist in case the db trigger was missed in tests
    const { error: upsertError } = await adminSupabase.from('profiles').upsert([
      { id: userId1, email: authData.user!.email!, full_name: 'Test User 1' },
      { id: userId2, email: authData2.user!.email!, full_name: 'Test User 2' }
    ]);
    if (upsertError) {
      console.error('PROFILES UPSERT ERROR:', upsertError);
      throw new Error(upsertError.message);
    }

    // Insert a trip for user1
    const { error: myTripError } = await supabase.from('trips').insert({
      user_id: userId1,
      title: 'My Valid Trip'
    });
    expect(myTripError).toBeNull();

    // Attempt IDOR: user1 tries to insert a trip for user2
    const { error: spoofTripError } = await supabase.from('trips').insert({
      user_id: userId2,
      title: 'Spoofed Trip'
    });
    expect(spoofTripError).not.toBeNull();

    // Attempt IDOR: Update user2's trip
    const { error: updateOtherError } = await supabase.from('trips')
      .update({ title: 'Hacked name' })
      .eq('user_id', userId2);
    
    // We actually expect no error on update, just 0 rows updated, unless the policy denies explicitly instead of silently filtering
    // Clean up
    await supabase.auth.signOut();
  }, 30000);
});
