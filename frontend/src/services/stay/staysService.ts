import { supabase } from '../../lib/supabase';

export interface Accommodation {
  id: string;
  location_id: string;
  name: string;
  type: string;
  description: string;
  price_per_night: number;
  currency: string;
  rating: number;
  amenities: string[];
  eco_certified: boolean;
  featured: boolean;
  image_url: string;
  lat: number;
  lng: number;
  locations?: {
    name: string;
    region: string;
  };
}

export interface AccommodationRoom {
  id: string;
  accommodation_id: string;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  image_url: string;
  available: boolean;
}

export const staysService = {
  searchStays: async (filters: { 
    type?: string, 
    minPrice?: number, 
    maxPrice?: number, 
    rating?: number, 
    eco_certified?: boolean 
  } = {}, page: number = 1, limit: number = 12): Promise<{ data: Accommodation[], count: number }> => {
    let q = supabase.from('accommodations').select('id, name, type, description, price_per_night, currency, rating, amenities, eco_certified, featured, image_url, lat, lng, locations(name, region)', { count: 'exact' }).eq('status', 'PUBLISHED');

    if (filters.type) {
      q = q.eq('type', filters.type as any);
    }
    if (filters.minPrice) {
      q = q.gte('price_per_night', filters.minPrice);
    }
    if (filters.maxPrice) {
      q = q.lte('price_per_night', filters.maxPrice);
    }
    if (filters.rating) {
      q = q.gte('rating', filters.rating);
    }
    if (filters.eco_certified) {
      q = q.eq('eco_certified', true);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    q = q.range(from, to).order('featured', { ascending: false }).order('rating', { ascending: false });

    const { data, error, count } = await q;
    if (error) {
      console.error('Error fetching stays:', error);
      return { data: [], count: 0 };
    }
    return { data: data as any, count: count || 0 };
  },

  getStayDetails: async (id: string): Promise<Accommodation | null> => {
    const { data, error } = await supabase.from('accommodations').select('id, name, type, description, price_per_night, currency, rating, amenities, eco_certified, featured, image_url, lat, lng, locations(name, region)').eq('id', id).single();
    if (error) return null;
    return data as any;
  },

  getStayRooms: async (accommodationId: string): Promise<AccommodationRoom[]> => {
    const { data, error } = await supabase.from('accommodation_rooms' as any).select('id, accommodation_id, name, description, capacity, price_per_night, amenities, image_url, available').eq('accommodation_id', accommodationId);
    if (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
    return data as any;
  },
  
  getRoomDetails: async (roomId: string): Promise<AccommodationRoom | null> => {
    const { data, error } = await supabase.from('accommodation_rooms' as any).select('id, accommodation_id, name, description, capacity, price_per_night, amenities, image_url, available').eq('id', roomId).single();
    if (error) return null;
    return data as any;
  }
};
