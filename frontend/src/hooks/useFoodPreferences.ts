import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodPreferencesService } from '../services/profile/foodPreferencesService';
import type { FoodPreferences } from '../types/profile';

export const useFoodPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'food', userId],
    queryFn: async () => {
      if (!userId) return null;
      return foodPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateFoodPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<FoodPreferences> }) => {
      await foodPreferencesService.upsert(userId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'food', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
