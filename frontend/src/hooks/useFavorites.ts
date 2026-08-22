import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { useAuthStore } from '../store/useAuthStore';

export const useFavorites = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoriteService.getFavorites(user!.id),
    enabled: !!user?.id,
  });
};

export const useIsFavorite = (itemType: string, itemId: string) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['favorites', user?.id, itemType, itemId],
    queryFn: () => favoriteService.checkIsFavorite(user!.id, itemType, itemId),
    enabled: !!user?.id && !!itemId,
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string, itemId: string }) => {
      if (!user) throw new Error("Must be logged in");
      return favoriteService.toggleFavorite(user.id, itemType, itemId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id, variables.itemType, variables.itemId] });
    }
  });
};
