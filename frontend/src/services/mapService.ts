import { supabase } from '../lib/supabase';
import { wildlifeService } from './wildlifeService';

export interface MapEntity {
  id: string;
  entity_type: string;
  entity_id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  price?: string;
  status?: string;
  extra?: string;
}

export const mapService = {
  getUnifiedMapPoints: async (): Promise<MapEntity[]> => {
    // We arbitrarily bound the box to cover all of Norway
    const minLat = 55;
    const maxLat = 75;
    const minLng = 4;
    const maxLng = 35;
    
    // Call the RPC function
    const { data: markers, error } = await supabase
      .rpc('get_smart_map_markers', {
        min_lat: minLat,
        max_lat: maxLat,
        min_lng: minLng,
        max_lng: maxLng
      });

    if (error) {
      console.error('Error fetching smart map markers:', error);
    }

    let mapEntities: MapEntity[] = [];

    if (markers) {
      mapEntities = markers.map((m: any) => ({
        id: m.id,
        entity_type: m.type,
        entity_id: m.location_id || m.id,
        name: m.name,
        latitude: m.latitude,
        longitude: m.longitude,
        category: m.category,
        image: m.image_url || '/images/trolltunga_1786936111320.jpg',
        description: m.description || '',
        rating: m.average_rating || 0,
        price: m.base_price_nok ? `NOK ${m.base_price_nok}` : 'Free',
        status: m.featured ? 'Featured' : 'Active',
        extra: m.subcategory || undefined
      }));
    }

    // Fetch wildlife and add pseudo-random coords for them
    try {
      const wildlife = await wildlifeService.getAllSpecies();
      const dynamicWildlife: MapEntity[] = wildlife.slice(0, 15).map((s, idx) => ({
        id: `wildlife-${s.id}`,
        entity_type: 'WILDLIFE',
        entity_id: s.id,
        name: s.common_name,
        latitude: 58 + (idx * 1.5) % 12, // Pseudo-random latitude in Norway roughly 58-70
        longitude: 5 + (idx * 2) % 20,   // Pseudo-random longitude roughly 5-25
        category: 'WILDLIFE',
        image: s.primary_image || '/images/wildlife_reindeer_1787013667019.jpg',
        description: s.scientific_name,
        rating: 4.8,
        price: 'Free',
        status: 'Active',
        extra: s.scientific_name
      }));
      
      mapEntities = [...mapEntities, ...dynamicWildlife];
    } catch (err) {
      console.error('Error fetching wildlife for map:', err);
    }

    return mapEntities;
  }
};
