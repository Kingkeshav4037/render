import { describe, it, expect, beforeAll } from 'vitest';
import { getAuthenticatedClient, getSupabaseClient } from '../helpers/test-client';

describe('RLS: profiles', () => {
  it('USER should be able to read their own profile', async () => {
    const client = await getAuthenticatedClient('user@test.com');
    const { data: { user } } = await client.auth.getUser();
    
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user?.id);
      
    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data?.[0].role).toBe('USER');
  });

  it('USER should be able to read other profiles (public profiles)', async () => {
    const client = await getAuthenticatedClient('user@test.com');
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('email', 'admin@test.com');
      
    // RLS allows reading all profiles
    expect(data?.length).toBe(1);
  });

  it('ADMIN should be able to read all profiles', async () => {
    const adminClient = await getAuthenticatedClient('admin@test.com');
    const { data, error } = await adminClient
      .from('profiles')
      .select('*');
      
    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThan(1);
  });
});
