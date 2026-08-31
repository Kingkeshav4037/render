import { useState, useEffect, useCallback } from 'react';
import { recentlyViewedService, RecentlyViewedItem, RecentlyViewedType } from '../services/recentlyViewedService';
import { useAuthStore } from '../store/useAuthStore';

export const useRecentlyViewed = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState<RecentlyViewedItem[]>(() => recentlyViewedService.getLocalItems());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load items from service
  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recentlyViewedService.getRecentlyViewed(user?.id);
      setItems(data);
    } catch (err) {
      console.warn('Error loading recently viewed items:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Sync guest history on login
  useEffect(() => {
    if (user?.id) {
      recentlyViewedService.syncGuestHistoryToAccount(user.id).then(() => {
        loadItems();
      });
    }
  }, [user?.id, loadItems]);

  const trackItem = useCallback(
    async (item: {
      item_type: RecentlyViewedType;
      item_id: string;
      title: string;
      image_url?: string;
      route: string;
      metadata?: Record<string, any>;
    }) => {
      const updated = await recentlyViewedService.trackView(item, user?.id);
      setItems(updated);
    },
    [user?.id]
  );

  const removeItem = useCallback(
    async (itemType: RecentlyViewedType, itemId: string) => {
      setItems(prev => prev.filter(i => !(i.item_type === itemType && String(i.item_id) === String(itemId))));
      await recentlyViewedService.removeItem(itemType, itemId, user?.id);
    },
    [user?.id]
  );

  const clearAll = useCallback(async () => {
    setItems([]);
    await recentlyViewedService.clearAll(user?.id);
  }, [user?.id]);

  return {
    items,
    isLoading,
    trackItem,
    removeItem,
    clearAll,
    refresh: loadItems,
  };
};
