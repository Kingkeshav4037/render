import { supabase } from '../lib/supabase';
import { availabilityService } from './availabilityService';

/**
 * Booking Service
 * 
 * V2 Architecture: This service abstracts the database calls for bookings.
 * React components should call these methods instead of using Supabase directly.
 */
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
   * Check availability for a specific product/stay
   */
  async checkAvailability(productType: string, productId: string, startDate: string, endDate?: string) {
    const end = endDate || startDate;
    const res = await availabilityService.checkAvailability(productType, productId, startDate, end);
    return res.available;
  },

  /**
   * Fetch all bookings (Admin/Provider)
   */
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
