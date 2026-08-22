import { supabase } from '../lib/supabase';

export interface ContentMedia {
  id: string;
  entity_type: string;
  entity_id: string;
  media_type: 'HERO' | 'GALLERY' | 'THUMBNAIL' | 'DOCUMENT';
  media_url: string;
  alt_text: string | null;
  credits: string | null;
  license: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
}

export const mediaService = {
  /**
   * Fetch all media for a specific entity, ordered by sort_order
   */
  async getMediaForEntity(entityType: string, entityId: string): Promise<ContentMedia[]> {
    try {
      const { data, error } = await supabase
        .from('content_media')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data || []) as ContentMedia[];
    } catch (error) {
      console.error(`Error fetching media for ${entityType} ${entityId}:`, error);
      return [];
    }
  },

  /**
   * Fetch only the HERO image for a specific entity
   */
  async getHeroImage(entityType: string, entityId: string): Promise<ContentMedia | null> {
    try {
      const { data, error } = await supabase
        .from('content_media')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('media_type', 'HERO')
        .order('sort_order', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
      return (data || null) as ContentMedia | null;
    } catch (error) {
      console.error(`Error fetching hero image for ${entityType} ${entityId}:`, error);
      return null;
    }
  }
};
