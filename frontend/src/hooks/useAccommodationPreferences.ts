import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accommodationPreferencesService } from '../services/profile/accommodationPreferencesService';
import type { AccommodationPreferences } from '../types/profile';

export const useAccommodationPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'accommodation', userId],
    queryFn: async () => {
      if (!userId) return null;
      return accommodationPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateAccommodationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<AccommodationPreferences> }) => {
      await accommodationPreferencesService.upsert(userId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accommodation', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
