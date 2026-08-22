import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportPreferencesService } from '../services/profile/transportPreferencesService';
import type { TransportPreferences } from '../types/profile';

export const useTransportPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'transport', userId],
    queryFn: async () => {
      if (!userId) return null;
      return transportPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateTransportPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<TransportPreferences> }) => {
      await transportPreferencesService.upsert(userId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'transport', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
