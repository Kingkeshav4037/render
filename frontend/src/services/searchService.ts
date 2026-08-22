import { supabase } from '../lib/supabase';

export interface SearchResult {
  entity_id: string;
  entity_type: string;
  title: string;
  description: string | null;
  slug: string;
  hero_image_url: string | null;
  rank: number;
  source_type: string;
}

export const searchService = {
  /**
   * Performs a global search across all content engines using FTS (Full Text Search).
   * It relies on the `global_search` RPC function in Supabase.
   */
  async globalSearch(
    query: string,
    filterCategory: string | null = null,
    limit: number = 20,
    offset: number = 0
  ): Promise<SearchResult[]> {
    if (!query || query.trim() === '') return [];

    try {
      const { data, error } = await supabase.rpc('global_search' as any, {
        search_query: query,
        filter_category: filterCategory || undefined,
        limit_count: limit,
        offset_count: offset
      });

      if (error) throw error;
      return (data || []) as SearchResult[];
    } catch (error) {
      console.error('Global search error:', error);
      return [];
    }
  }
};
