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
   * Enriches a booking with resolved amounts, stay names, and nights
   * when database records have total_amount missing or 0.
   */
  async enrichBooking(booking: any) {
    if (!booking) return booking;

    let amount = Number(booking.total_amount || 0);

    // Calculate nights if dates exist
    const start = new Date(booking.start_time || booking.created_at || Date.now());
    const end = booking.end_time ? new Date(booking.end_time) : new Date(start.getTime() + 24 * 3600 * 1000);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const pax = Math.max(1, Number(booking.pax || 1));

    booking.nights = nights;

    // Resolve missing or zero total_amount
    if (amount <= 0) {
      if (booking.item_type === 'ACCOMMODATION') {
        let pricePerNight = 2400; // Standard Norwegian lodge rate
        let stayName = '';

        if (booking.item_id) {
          try {
            const { data: acc } = await (supabase as any)
              .from('accommodations')
              .select('name, price_per_night')
              .eq('id', booking.item_id)
              .maybeSingle();

            if (acc) {
              if (acc.price_per_night) pricePerNight = Number(acc.price_per_night);
              if (acc.name) stayName = acc.name;
            } else {
              const { data: rm } = await (supabase as any)
                .from('rooms')
                .select('name, price_per_night')
                .eq('id', booking.item_id)
                .maybeSingle();

              if (rm) {
                if (rm.price_per_night) pricePerNight = Number(rm.price_per_night);
                if (rm.name) stayName = rm.name;
              }
            }
          } catch (err) {
            console.warn('Could not query accommodation details:', err);
          }
        }

        amount = nights * pricePerNight;
        if (stayName && !booking.stay_name) {
          booking.stay_name = stayName;
        }
      } else if (booking.item_type === 'ACTIVITY') {
        let actPrice = 1250;
        let actTitle = '';
        if (booking.item_id) {
          try {
            const { data: act } = await (supabase as any)
              .from('activities')
              .select('title, price')
              .eq('id', booking.item_id)
              .maybeSingle();
            if (act) {
              if (act.price) actPrice = Number(act.price);
              if (act.title) actTitle = act.title;
            }
          } catch (e) {}
        }
        amount = actPrice * pax;
        if (actTitle && !booking.activity_name) booking.activity_name = actTitle;
      } else if (booking.item_type === 'TRANSPORT') {
        amount = 450 * pax;
      } else if (booking.item_type === 'PRODUCT') {
        amount = 890 * pax;
      } else if (booking.item_type === 'RESTAURANT') {
        amount = 0; // Free table reservation, 0 kr deposit
      }

      if (amount > 0) {
        booking.total_amount = amount;
        // Persist resolved amount back to Supabase database so future reads are instant
        try {
          (supabase as any)
            .from('bookings')
            .update({ total_amount: amount })
            .eq('id', booking.id)
            .then();
        } catch (e) {
          // ignore background update error
        }
      }
    } else if (booking.item_type === 'ACCOMMODATION' && !booking.stay_name && booking.item_id) {
      // Try to resolve stay name for display even if amount already exists
      try {
        const { data: acc } = await (supabase as any)
          .from('accommodations')
          .select('name')
          .eq('id', booking.item_id)
          .maybeSingle();
        if (acc?.name) booking.stay_name = acc.name;
      } catch {}
    }

    return booking;
  },

  /**
   * Enriches an array of bookings concurrently
   */
  async enrichBookings(bookings: any[]) {
    if (!Array.isArray(bookings)) return [];
    return Promise.all(bookings.map(b => this.enrichBooking({ ...b })));
  },

  /**
   * Fetch bookings for the authenticated user
   */
  async getUserBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return this.enrichBookings(data || []);
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
