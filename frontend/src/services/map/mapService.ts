import { supabase } from '../../lib/supabase';

export interface Location {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  region?: string;
  subcategory?: string;
  description?: string;
  base_price_nok?: number;
  latitude: number;
  longitude: number;
  image_url: string | null;
  hero_image_url?: string | null;
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
  _category: string | string[] | null = null
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
    if (!slug || slug === 'undefined' || slug === 'null') return null;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      let locData: any = null;

      if (isUUID) {
        const { data } = await supabase.from('locations').select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured').eq('id', slug).maybeSingle();
        locData = data;
      } else {
        const { data } = await supabase.from('locations').select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured').eq('slug', slug).maybeSingle();
        locData = data;
        if (!locData) {
          const { data: byName } = await supabase.from('locations').select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured').ilike('name', slug.replace(/-/g, ' ')).maybeSingle();
          locData = byName;
        }
      }

      if (locData) {
        const loc: Location = {
          id: locData.id,
          location_id: locData.id,
          name: locData.name,
          slug: locData.slug || slug,
          type: locData.type || 'DESTINATION',
          category: locData.type || 'DESTINATION',
          region: locData.region,
          description: locData.description || '',
          latitude: locData.latitude ?? locData.lat ?? 60.3913,
          longitude: locData.longitude ?? locData.lng ?? 5.3221,
          image_url: locData.hero_image_url || locData.image_url || null,
          hero_image_url: locData.hero_image_url || locData.image_url || null,
          featured: locData.featured ?? true,
          average_rating: locData.average_rating ?? 4.9
        };

        return {
          location: loc,
          scores: {
            location_id: locData.id,
            score: 8.5,
            reasons: ['Iconic Destination', 'Top Rated', 'Spectacular Views'],
            composite_ai_score: 9.2,
            sustainability_score: 9,
            aurora_score: 8,
            accessibility_score: 8
          }
        };
      }
    } catch {
      // Fall through to fallback
    }

    const { FALLBACK_DESTINATIONS } = await import('../destinationService');
    const cleanSlug = slug.toLowerCase().trim();
    const fallback = FALLBACK_DESTINATIONS.find(d => 
      d.slug?.toLowerCase() === cleanSlug || 
      d.id?.toLowerCase() === cleanSlug ||
      d.name.toLowerCase() === cleanSlug ||
      d.name.toLowerCase().replace(/\s+/g, '-') === cleanSlug ||
      (cleanSlug === 'lofoten' && d.slug === 'lofoten-islands') ||
      cleanSlug.includes(d.slug?.toLowerCase() || '') ||
      (d.slug && cleanSlug.startsWith(d.slug.toLowerCase())) ||
      cleanSlug.includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(cleanSlug)
    );
    if (fallback) {
      return {
        location: {
          id: fallback.id,
          location_id: fallback.id,
          name: fallback.name,
          slug: fallback.slug,
          type: fallback.type,
          category: fallback.type,
          region: fallback.region || undefined,
          description: fallback.description || '',
          latitude: fallback.lat || 69.6492,
          longitude: fallback.lng || 18.9553,
          image_url: fallback.hero_image_url,
          hero_image_url: fallback.hero_image_url,
          featured: true,
          average_rating: 4.9
        },
        scores: {
          location_id: fallback.id,
          score: 8.8,
          reasons: ['Iconic Destination', 'UNESCO Heritage', 'Scenic Views'],
          composite_ai_score: 9.4,
          sustainability_score: 9.2,
          aurora_score: 8.9,
          accessibility_score: 8.5
        }
      };
    }
    return null;
  },
  getNearbyStays: async (lat: number, lng: number, radiusMeters: number = 50000): Promise<any[]> => {
    try {
      if (typeof supabase?.rpc === 'function') {
        const { data, error } = await supabase.rpc('get_nearby_stays' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
        if (!error && data && data.length > 0) return data as any[];
      }
      const { FALLBACK_STAYS } = await import('../stay/staysService');
      return FALLBACK_STAYS.slice(0, 3);
    } catch {
      return [];
    }
  },
  getNearbyRestaurants: async (lat: number, lng: number, radiusMeters: number = 50000): Promise<any[]> => {
    try {
      if (typeof supabase?.rpc === 'function') {
        const { data, error } = await supabase.rpc('get_nearby_restaurants' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
        if (!error && data && data.length > 0) return data as any[];
      }
      return [];
    } catch {
      return [];
    }
  },
  getNearbyActivities: async (locationId: string): Promise<any[]> => {
    try {
      if (typeof supabase?.rpc === 'function') {
        const { data, error } = await supabase.rpc('get_nearby_activities' as any, { target_location_id: locationId, max_results: 3 });
        if (!error && data && data.length > 0) return data as any[];
      }
      const { activityService } = await import('../activityService');
      const acts = await activityService.getActivities();
      return (acts?.data || []).slice(0, 3);
    } catch {
      return [];
    }
  },
  getNearbyRelatedLocations: async (lat: number, lng: number, radiusMeters: number = 100000): Promise<any[]> => {
    try {
      if (typeof supabase?.rpc === 'function') {
        const { data, error } = await supabase.rpc('get_nearby_locations' as any, { target_lat: lat, target_lng: lng, radius_meters: radiusMeters, max_results: 3 });
        if (!error && data && data.length > 0) return data as any[];
      }
      return [];
    } catch {
      return [];
    }
  },
  getAllLocations: async (): Promise<Location[]> => {
    const { data } = await supabase.from('locations').select('id, name, slug, type, region, lat, lng, hero_image_url, featured').eq('status', 'PUBLISHED').order('name');
    return (data || []) as unknown as Location[];
  }
};
