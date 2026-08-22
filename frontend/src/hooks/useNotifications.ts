import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { useAuthStore } from '../store/useAuthStore';

export const useNotifications = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationService.getNotifications(user!.id),
    enabled: !!user?.id,
    refetchInterval: 30000, // Poll every 30s
  });
};

export const useUnreadCount = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: () => notificationService.getUnreadCount(user!.id),
    enabled: !!user?.id,
    refetchInterval: 30000,
  });
};

export const useMarkAsRead = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread', user?.id] });
    }
  });
};

export const useMarkAllAsRead = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Must be logged in");
      return notificationService.markAllAsRead(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread', user?.id] });
    }
  });
};
