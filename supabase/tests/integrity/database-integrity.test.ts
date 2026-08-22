import { describe, it, expect } from 'vitest';
import { getAuthenticatedClient } from '../helpers/test-client';

describe('Database Integrity Constraints', () => {
  it('Should reject rating > 5', async () => {
    const client = await getAuthenticatedClient('superadmin@test.com');
    
    // Create a dummy location
    const { data: locationData, error: locErr } = await client
      .from('locations')
      .insert({
        name: 'Test Location',
        latitude: 69.6492,
        longitude: 18.9553,
        type: 'ATTRACTION',
        status: 'ACTIVE'
      })
      .select('id')
      .single();
      
    if (locErr) {
      console.error('Error creating location:', locErr);
      return;
    }

    const { error } = await client
      .from('reviews')
      .insert({
        location_id: locationData.id,
        rating: 6, // Should fail CHECK constraint
        review_text: 'Too good!'
      });
      
    expect(error).not.toBeNull();
    expect(error?.message).toMatch(/check constraint/i);
  });
});
