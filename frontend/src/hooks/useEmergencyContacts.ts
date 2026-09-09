import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyContactsService } from '../services/profile/emergencyContactsService';
import type { EmergencyContact } from '../types/profile';

export const useEmergencyContacts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['emergency-contacts', userId],
    queryFn: async () => {
      if (!userId) return [];
      return emergencyContactsService.getAll(userId);
    },
    enabled: !!userId,
  });
};

export const useAddEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, contact }: { userId: string; contact: Omit<EmergencyContact, 'id' | 'isPrimary'> }) => {
      return emergencyContactsService.add(userId, contact);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId: _userId, contactId, updates }: { userId: string; contactId: string; updates: Partial<Omit<EmergencyContact, 'id' | 'isPrimary'>> }) => {
      await emergencyContactsService.update(contactId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', variables.userId] });
    },
  });
};

export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId: _userId, contactId }: { userId: string; contactId: string }) => {
      await emergencyContactsService.delete(contactId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', variables.userId] });
    },
  });
};

export const useSetPrimaryEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, contactId }: { userId: string; contactId: string }) => {
      await emergencyContactsService.setPrimary(contactId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', variables.userId] });
    },
  });
};
