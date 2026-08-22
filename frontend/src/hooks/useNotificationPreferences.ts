import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationPreferencesService } from '../services/profile/notificationPreferencesService';
import type { NotificationPreferences } from '../types/profile';

export const useNotificationPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['preferences', 'notifications', userId],
    queryFn: async () => {
      if (!userId) return null;
      return notificationPreferencesService.get(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<NotificationPreferences> }) => {
      await notificationPreferencesService.upsert(userId, updates);
    },
    onMutate: async ({ userId, updates }) => {
      const queryKey = ['preferences', 'notifications', userId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<NotificationPreferences>(queryKey);

      if (previous) {
        queryClient.setQueryData<NotificationPreferences>(queryKey, {
          ...previous,
          ...updates,
        });
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['preferences', 'notifications', variables.userId], context.previous);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'notifications', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};
