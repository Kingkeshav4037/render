import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelPreferencesService } from '../services/profile/travelPreferencesService';
import type { TravelPreferences } from '../types/profile';

export const useTravelPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'travel', userId],
    queryFn: async () => {
      if (!userId) return null;
      return travelPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateTravelPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<TravelPreferences> }) => {
      await travelPreferencesService.upsert(userId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'travel', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
