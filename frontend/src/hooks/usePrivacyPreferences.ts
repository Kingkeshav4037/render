import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privacyPreferencesService } from '../services/profile/privacyPreferencesService';
import type { PrivacyPreferences } from '../types/profile';

export const usePrivacyPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'privacy', userId],
    queryFn: async () => {
      if (!userId) return null;
      return privacyPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdatePrivacyPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<PrivacyPreferences> }) => {
      await privacyPreferencesService.upsert(userId, updates);
    },
    onMutate: async ({ userId, updates }) => {
      const queryKey = ['preferences', 'privacy', userId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<PrivacyPreferences>(queryKey);

      if (previous) {
        queryClient.setQueryData<PrivacyPreferences>(queryKey, {
          ...previous,
          ...updates,
        });
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['preferences', 'privacy', variables.userId], context.previous);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'privacy', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
