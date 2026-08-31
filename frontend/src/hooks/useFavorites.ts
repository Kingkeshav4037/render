import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService, HydratedFavorite, FavoriteItem } from '../services/favoriteService';
import { useAuthStore } from '../store/useAuthStore';

export const useFavorites = () => {
  const { user } = useAuthStore();
  
  return useQuery<FavoriteItem[]>({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoriteService.getFavorites(user!.id),
    enabled: !!user?.id,
  });
};

export const useHydratedFavorites = () => {
  const { user } = useAuthStore();

  return useQuery<HydratedFavorite[]>({
    queryKey: ['hydratedFavorites', user?.id],
    queryFn: () => favoriteService.getHydratedFavorites(user!.id),
    enabled: !!user?.id,
  });
};

export const useIsFavorite = (itemType: string, itemId: string) => {
  const { user } = useAuthStore();
  
  return useQuery<boolean>({
    queryKey: ['favorites', user?.id, itemType, itemId],
    queryFn: () => favoriteService.checkIsFavorite(user!.id, itemType, itemId),
    enabled: !!user?.id && !!itemId,
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: string }) => {
      if (!user) throw new Error("Authentication required to save favorites.");
      return favoriteService.toggleFavorite(user.id, itemType, itemId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id, variables.itemType, variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['hydratedFavorites', user?.id] });
    }
  });
};

export const useRemoveFavorite = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: string }) => {
      if (!user) throw new Error("Authentication required.");
      return favoriteService.removeFavorite(user.id, itemType, itemId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id, variables.itemType, variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['hydratedFavorites', user?.id] });
    }
  });
};
