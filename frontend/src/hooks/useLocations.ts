// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { mapService, Location } from '../services/map/mapService';
import { supabase } from '../lib/supabase';

export interface LocationFilters {
  category?: string | string[];
  search?: string;
  bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  nearby?: { lng: number; lat: number; radiusMeters?: number };
}

export const useLocations = (filters?: LocationFilters) => {
  return useQuery({
    queryKey: ['locations', filters],
    queryFn: async () => {
      // 1. If bbox is provided, fetch by bbox
      if (filters?.bbox) {
        return mapService.getLocationsInBbox(
          filters.bbox.minLng,
          filters.bbox.minLat,
          filters.bbox.maxLng,
          filters.bbox.maxLat,
          filters.category
        );
      }
      
      // 2. If nearby is provided, fetch by radius
      if (filters?.nearby) {
        return mapService.getLocationsNearby(
          filters.nearby.lng,
          filters.nearby.lat,
          filters.nearby.radiusMeters || 50000,
          filters.category
        );
      }
      
      // 3. If search is provided, search
      if (filters?.search) {
        return mapService.searchLocations(filters.search, filters.category);
      }
      
      // 4. Default: fallback fetch general locations with optional category filter
      let query = supabase.from('locations').select('*');
      if (filters?.category) {
        if (Array.isArray(filters.category)) {
          query = query.in('type', filters.category);
        } else {
          query = query.eq('type', filters.category);
        }
      }
      query = query.limit(100); // safety limit
      
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Location[];
    },
  });
};

export const useLocation = (slugOrId: string | undefined) => {
  return useQuery({
    queryKey: ['location', slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      
      // Try to fetch by ID first, then by slug
      let { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', slugOrId)
        .single();
        
      if (error && error.code === '22P02') { // invalid uuid, try slug
        const res = await supabase
          .from('locations')
          .select('*')
          .eq('slug', slugOrId)
          .single();
        data = res.data;
        error = res.error;
      }
      
      if (error) throw error;
      return data as unknown as Location;
    },
    enabled: !!slugOrId,
  });
};

