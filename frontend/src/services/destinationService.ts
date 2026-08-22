import { supabase } from '../lib/supabase';
import { mediaService, ContentMedia } from './mediaService';

export interface LocationDestination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string | null;
  type: string;
  status: string;
  lat: number | null;
  lng: number | null;
  source_type: string;
  seo_title: string | null;
  hero_image_url: string | null; // legacy
}

export interface DestinationDetailed extends LocationDestination {
  hero_media: ContentMedia | null;
  gallery_media: ContentMedia[];
  related_activities: any[];
  related_accommodations: any[];
}

export const destinationService = {
  async getDestinationBySlug(slug: string): Promise<DestinationDetailed | null> {
    try {
      // 1. Fetch Location
      const { data: location, error: locError } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .single();

      if (locError || !location) return null;

      // 2. Fetch Media
      const media = await mediaService.getMediaForEntity('location', location.id);
      const hero_media = media.find(m => m.media_type === 'HERO') || null;
      const gallery_media = media.filter(m => m.media_type === 'GALLERY');

      // 3. Fetch Related Accommodations via content_relationships (Assuming target_type = 'accommodation')
      const { data: relAccomm } = await supabase
        .from('content_relationships')
        .select('target_id')
        .eq('source_type', 'location')
        .eq('source_id', location.id)
        .eq('target_type', 'accommodation');
        
      const accommodationIds = relAccomm?.map(r => r.target_id) || [];
      let related_accommodations: any[] = [];
      if (accommodationIds.length > 0) {
        const { data: accomms } = await supabase
          .from('accommodations')
          .select('*')
          .in('id', accommodationIds)
          .limit(3);
        related_accommodations = accomms || [];
      }

      // 4. Fetch Related Activities via content_relationships
      const { data: relActivities } = await supabase
        .from('content_relationships')
        .select('target_id')
        .eq('source_type', 'location')
        .eq('source_id', location.id)
        .eq('target_type', 'activity');

      const activityIds = relActivities?.map(r => r.target_id) || [];
      let related_activities: any[] = [];
      if (activityIds.length > 0) {
        const { data: acts } = await supabase
          .from('activities')
          .select('*')
          .in('id', activityIds)
          .limit(3);
        related_activities = acts || [];
      }

      return {
        ...location,
        hero_media,
        gallery_media,
        related_accommodations,
        related_activities
      } as DestinationDetailed;

    } catch (error) {
      console.error(`Error fetching destination ${slug}:`, error);
      return null;
    }
  },
  
  async getAllDestinations(): Promise<LocationDestination[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .in('type', ['CITY', 'REGION', 'FJORD', 'ISLAND', 'MOUNTAIN'])
        .eq('status', 'PUBLISHED')
        .order('name');
        
      if (error) throw error;
      return (data || []) as LocationDestination[];
    } catch (error) {
      console.error('Error fetching all destinations:', error);
      return [];
    }
  }
};
