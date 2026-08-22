import { supabase } from '../lib/supabase';
import { mediaService, ContentMedia } from './mediaService';

export interface ContentEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  [key: string]: any;
}

export interface DetailedContentEntity extends ContentEntity {
  hero_media: ContentMedia | null;
  gallery_media: ContentMedia[];
  related_entities: any[];
}

export const contentService = {
  /**
   * Fetch a generic content entity (wildlife, trail, event) with its media
   */
  async getDetailedContent(table: any, slug: string): Promise<DetailedContentEntity | null> {
    try {
      // 1. Fetch Entity
      const { data: entity, error } = await supabase
        .from(table)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !entity) return null;

      // 2. Fetch Media (mapping table to entity_type)
      const entityType = table.replace(/s$/, ''); // very basic singularization
      const media = await mediaService.getMediaForEntity(entityType, (entity as any).id);
      const hero_media = media.find(m => m.media_type === 'HERO') || null;
      const gallery_media = media.filter(m => m.media_type === 'GALLERY');

      // 3. Fetch Generic Relationships (Targeting this entity)
      const { data: relationships } = await supabase
        .from('content_relationships')
        .select('target_type, target_id')
        .eq('source_type', entityType)
        .eq('source_id', (entity as any).id);
        
      // In a full implementation, you would resolve these references to their actual records.
      // For now, returning the raw relationships.
      const related_entities = relationships || [];

      return {
        ...(entity as any),
        hero_media,
        gallery_media,
        related_entities
      } as DetailedContentEntity;

    } catch (error) {
      console.error(`Error fetching detailed content from ${table} for ${slug}:`, error);
      return null;
    }
  },

  async getAllContent(table: any): Promise<ContentEntity[]> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        // .eq('status', 'PUBLISHED') // some tables might not have status
        .limit(100);

      if (error) throw error;
      return (data || []) as any as ContentEntity[];
    } catch (error) {
      console.error(`Error fetching all content from ${table}:`, error);
      return [];
    }
  }
};
