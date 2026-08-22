import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, UserProfile } from '../services/profile/profileService';

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      return profileService.getProfile(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserProfile & { full_name?: string; preferences?: any }> }) => {
      await profileService.updateProfile(userId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      return profileService.uploadAvatar(userId, file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateTravelPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updateTravelPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateFoodPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updateFoodPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateAccommodationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updateAccommodationPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateTransportPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updateTransportPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updateNotificationPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdatePrivacyPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => profileService.updatePrivacyPreferences(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useProfileCompletion = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile-completion', userId],
    queryFn: async () => {
      if (!userId) return { score: 0, sections: {} };
      return profileService.getProfileCompletion(userId);
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute — completion doesn't change often
  });
};
