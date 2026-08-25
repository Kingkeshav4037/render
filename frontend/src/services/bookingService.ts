// @ts-nocheck
/**
 * Booking Service
 * 
 * V2 Architecture: This service abstracts the database calls for bookings.
 * React components should call these methods instead of using Supabase directly.
 */

import { supabase } from '../lib/supabase';

export const bookingService = {
  /**
   * Fetch bookings for the authenticated user
   */
  async getUserBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Check availability for a specific product
   */
  async checkAvailability(productType: string, productId: string, date: string, participants: number) {
    const { data, error } = await supabase
      .rpc('check_availability', {
        p_item_type: productType,
        p_item_id: productId,
        p_start_date: date,
        p_end_date: date,
        p_quantity: participants
      });

    if (error) throw error;
    return data; // Returns boolean
  },

  async fetchAllBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, user:user_id(id)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
    return data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
