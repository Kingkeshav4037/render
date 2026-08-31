import { supabase } from '../lib/supabase';

export type RecentlyViewedType =
  | 'DESTINATION'
  | 'STAY'
  | 'RESTAURANT'
  | 'FOOD'
  | 'PRODUCT'
  | 'ACTIVITY'
  | 'ATTRACTION'
  | 'WILDLIFE'
  | 'FLORA'
  | 'PLACE'
  | 'TRAIL'
  | 'FJORD'
  | 'MOUNTAIN'
  | 'EVENT';

export interface RecentlyViewedItem {
  id?: string;
  user_id?: string;
  item_type: RecentlyViewedType;
  item_id: string;
  title: string;
  image_url?: string;
  route: string;
  metadata?: Record<string, any>;
  viewed_at: string;
}

const LOCAL_STORAGE_KEY = 'norway_recently_viewed_v1';
const MAX_RECENT_ITEMS = 20;

export const recentlyViewedService = {
  /**
   * Get items stored in LocalStorage for guests
   */
  getLocalItems(): RecentlyViewedItem[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Save items to LocalStorage
   */
  setLocalItems(items: RecentlyViewedItem[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT_ITEMS)));
    } catch (err) {
      console.warn('Failed to save recently viewed to LocalStorage:', err);
    }
  },

  /**
   * Track a viewed item (works for both guests and authenticated users)
   */
  async trackView(
    item: {
      item_type: RecentlyViewedType;
      item_id: string;
      title: string;
      image_url?: string;
      route: string;
      metadata?: Record<string, any>;
    },
    userId?: string | null
  ): Promise<RecentlyViewedItem[]> {
    const newItem: RecentlyViewedItem = {
      ...item,
      user_id: userId || undefined,
      viewed_at: new Date().toISOString(),
    };

    // 1. Update LocalStorage copy
    const local = this.getLocalItems();
    const filteredLocal = local.filter(
      i => !(i.item_type === item.item_type && String(i.item_id) === String(item.item_id))
    );
    const updatedLocal = [newItem, ...filteredLocal].slice(0, MAX_RECENT_ITEMS);
    this.setLocalItems(updatedLocal);

    // 2. If authenticated, persist to Supabase
    if (userId) {
      try {
        await (supabase.from('recently_viewed' as any) as any).upsert(
          {
            user_id: userId,
            item_type: item.item_type,
            item_id: String(item.item_id),
            title: item.title,
            image_url: item.image_url || null,
            route: item.route,
            metadata: item.metadata || {},
            viewed_at: newItem.viewed_at,
          },
          { onConflict: 'user_id,item_type,item_id' }
        );
      } catch (err) {
        console.warn('Error saving recently viewed to Supabase:', err);
      }
    }

    return updatedLocal;
  },

  /**
   * Retrieve recently viewed items for the user or guest
   */
  async getRecentlyViewed(userId?: string | null): Promise<RecentlyViewedItem[]> {
    if (!userId) {
      return this.getLocalItems();
    }

    try {
      const { data, error } = await (supabase.from('recently_viewed' as any) as any)
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(MAX_RECENT_ITEMS);

      if (error) throw error;
      if (data && data.length > 0) {
        return data as RecentlyViewedItem[];
      }
      // Fallback to local storage if user has no server history yet
      return this.getLocalItems();
    } catch (err) {
      console.warn('Error fetching recently viewed from Supabase, fallback to local:', err);
      return this.getLocalItems();
    }
  },

  /**
   * Remove a single item from history
   */
  async removeItem(itemType: RecentlyViewedType, itemId: string, userId?: string | null): Promise<void> {
    // 1. Remove from LocalStorage
    const local = this.getLocalItems();
    const updated = local.filter(i => !(i.item_type === itemType && String(i.item_id) === String(itemId)));
    this.setLocalItems(updated);

    // 2. Remove from Supabase if logged in
    if (userId) {
      try {
        await (supabase.from('recently_viewed' as any) as any)
          .delete()
          .eq('user_id', userId)
          .eq('item_type', itemType)
          .eq('item_id', String(itemId));
      } catch (err) {
        console.warn('Error deleting recently viewed item from Supabase:', err);
      }
    }
  },

  /**
   * Clear all recently viewed items
   */
  async clearAll(userId?: string | null): Promise<void> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}

    if (userId) {
      try {
        await (supabase.from('recently_viewed' as any) as any)
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Error clearing recently viewed in Supabase:', err);
      }
    }
  },

  /**
   * Sync guest localStorage history into Supabase after user logs in
   */
  async syncGuestHistoryToAccount(userId: string): Promise<void> {
    if (!userId) return;
    const localItems = this.getLocalItems();
    if (localItems.length === 0) return;

    try {
      // Use RPC if available
      if (typeof (supabase as any).rpc === 'function') {
        const { error } = await (supabase.rpc as any)('sync_recently_viewed', {
          p_user_id: userId,
          p_items: localItems,
        });
        if (!error) return;
      }

      // Direct batch upsert fallback
      const payload = localItems.map(i => ({
        user_id: userId,
        item_type: i.item_type,
        item_id: String(i.item_id),
        title: i.title,
        image_url: i.image_url || null,
        route: i.route,
        metadata: i.metadata || {},
        viewed_at: i.viewed_at,
      }));

      await (supabase.from('recently_viewed' as any) as any).upsert(payload, {
        onConflict: 'user_id,item_type,item_id',
      });
    } catch (err) {
      console.warn('Error syncing guest recently viewed to account:', err);
    }
  },
};
