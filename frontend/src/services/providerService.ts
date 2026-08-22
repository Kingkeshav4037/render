import { supabase } from '../lib/supabase';

export const providerService = {
  async getDashboardStats(providerId: string) {
    const { data, error } = await supabase.rpc('get_provider_dashboard_stats', {
      p_provider_id: providerId
    });

    if (error) {
      console.error('Failed to get dashboard stats:', error);
      throw error;
    }
    return data;
  },

  async getProviderListings(providerId: string) {
    const { data, error } = await supabase
      .from('provider_listings_view')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get provider listings:', error);
      throw error;
    }
    return data;
  },

  async getRecentBookings(providerId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        item_type,
        item_id,
        start_time,
        end_time,
        pax,
        total_amount,
        status,
        created_at,
        profiles (
          id,
          full_name,
          email
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Failed to get provider bookings:', error);
      throw error;
    }
    return data;
  }
};
