import { supabase } from '../lib/supabase';

export interface FavoriteItem {
  id: string;
  user_id?: string | null;
  item_type: 'LOCATION' | 'STAY' | 'RESTAURANT' | 'ACTIVITY' | 'TRIP' | 'PRODUCT' | string;
  item_id: string;
  created_at?: string | null;
}

export const favoriteService = {
  async getFavorites(userId: string): Promise<FavoriteItem[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async toggleFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    // Check if it exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing) {
      // Remove it
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return false; // Not favorited anymore
    } else {
      // Add it
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          item_type: itemType,
          item_id: itemId
        });
      if (error) throw error;
      return true; // Favorited
    }
  },

  async checkIsFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId);

    if (error) throw error;
    return (count || 0) > 0;
  }
};
