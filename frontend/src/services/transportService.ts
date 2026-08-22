import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type TransportRoute = Database['public']['Tables']['transport_routes']['Row'];
export type Location = Database['public']['Tables']['locations']['Row'];

export interface RouteWithLocations extends TransportRoute {
  origin: Location;
  destination: Location;
}

export const transportService = {
  async getRoutes(filters?: { mode?: string, originId?: string, destinationId?: string }): Promise<RouteWithLocations[]> {
    let query = supabase
      .from('transport_routes')
      .select('*, origin:origin_id(*), destination:destination_id(*)')
      .eq('status', 'PUBLISHED');

    if (filters?.mode && filters.mode !== 'all') {
      query = query.eq('type', filters.mode.toUpperCase() as any);
    }
    if (filters?.originId) {
      query = query.eq('origin_id', filters.originId);
    }
    if (filters?.destinationId) {
      query = query.eq('destination_id', filters.destinationId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
    return data as unknown as RouteWithLocations[];
  },

  async getRouteDetails(id: string): Promise<RouteWithLocations | null> {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('*, origin:origin_id(*), destination:destination_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching route details:', error);
      return null;
    }
    return data as unknown as RouteWithLocations;
  }
};
