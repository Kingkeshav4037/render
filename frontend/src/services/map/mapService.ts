import { supabase } from '../../lib/supabase';

export interface Location {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  subcategory?: string;
  description?: string;
  base_price_nok?: number;
  latitude: number;
  longitude: number;
  image_url: string | null;
  featured: boolean;
  average_rating: number | null;
}

export type MapMarker = Location;

export interface DestinationScore {
  location_id: string;
  score: number;
  reasons: string[];
  composite_ai_score?: number;
  sustainability_score?: number;
  aurora_score?: number;
  accessibility_score?: number;
}

export const getSmartMapMarkers = async (
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  filterLayers: string[] | null = null
): Promise<MapMarker[]> => {
  try {
    const { data, error } = await supabase.rpc('get_smart_map_markers' as any, {
      min_lng: minLng,
      min_lat: minLat,
      max_lng: maxLng,
      max_lat: maxLat,
      filter_layers: filterLayers,
    });

    if (error) {
      console.error('Error fetching smart map markers:', error);
      return [];
    }

    return data as MapMarker[];
  } catch (error) {
    console.error('MapService.getSmartMapMarkers Error:', error);
    return [];
  }
};

export const getLocationsNearby = async (
  lng: number,
  lat: number,
  radiusMeters: number = 50000,
  category: string | string[] | null = null
): Promise<Location[]> => {
  try {
    const { data, error } = await supabase.rpc('get_nearby_locations' as any, {
      target_lng: lng,
      target_lat: lat,
      radius_meters: radiusMeters,
      max_results: 50
    });

    if (error) {
      console.error('Error fetching nearby locations:', error);
      return [];
    }

    return data as Location[];
  } catch (error) {
    console.error('MapService.getLocationsNearby Error:', error);
    return [];
  }
};

export const mapService = {
  getSmartMapMarkers,
  getLocationsNearby,
  fetchLocationsInBounds: getSmartMapMarkers,
  searchLocations: async (query: string, category?: string | string[]): Promise<Location[]> => {
    let q = supabase.from('locations').select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured').ilike('name', `%${query}%`).limit(20);
    if (category) {
      if (Array.isArray(category)) {
        q = q.in('type', category as any);
      } else {
        q = q.eq('type', category as any);
      }
    }
    const { data } = await q;
    return (data || []) as unknown as Location[];
  },
  getDestinationDetails: async (slug: string): Promise<{ location: Location; scores: DestinationScore } | null> => {
    const { data: location, error } = await supabase.from('locations').select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured').eq('slug', slug).single();
    if (error || !location) return null;
    return {
      location: location as unknown as Location,
      scores: {
        location_id: location.id,
        score: 8.5,
        reasons: [],
        composite_ai_score: 9.2,
        sustainability_score: 9,
        aurora_score: 8,
        accessibility_score: 8
      }
    };
  },
  getNearbyStays: async (lat: number, lng: number, radiusMeters: number = 50000): Promise<any[]> => {
    const { data } = await supabase.rpc('get_nearby_stays' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
    return (data as any[]) || [];
  },
  getNearbyRestaurants: async (lat: number, lng: number, radiusMeters: number = 50000): Promise<any[]> => {
    const { data } = await supabase.rpc('get_nearby_restaurants' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
    return (data as any[]) || [];
  },
  getNearbyActivities: async (locationId: string): Promise<any[]> => {
    const { data } = await supabase.rpc('get_nearby_activities' as any, { target_location_id: locationId, max_results: 3 });
    return (data as any[]) || [];
  },
  getNearbyRelatedLocations: async (lat: number, lng: number, radiusMeters: number = 100000): Promise<any[]> => {
    const { data } = await supabase.rpc('get_nearby_locations' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
    return (data as any[]) || [];
  },
  getAllLocations: async (): Promise<Location[]> => {
    const { data } = await supabase.from('locations').select('id, name, slug, type, region, lat, lng, hero_image_url, featured').eq('status', 'PUBLISHED').order('name');
    return (data || []) as unknown as Location[];
  }
};
