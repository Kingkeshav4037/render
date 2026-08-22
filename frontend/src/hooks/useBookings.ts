import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

export const useBookings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      // The bookingService uses RLS to get the authenticated user's bookings,
      // but we pass userId to the query key so the cache is keyed to the current user.
      if (!userId) return [];
      return bookingService.getUserBookings();
    },
    enabled: !!userId,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      return bookingService.cancelBooking(bookingId);
    },
    onSuccess: (data, variables) => {
      // The user ID is ideally available from auth store to invalidate the correct key,
      // but since we only ever view the logged-in user's bookings, we can invalidate
      // all 'bookings' query keys or just let it refetch everything.
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
  });
};
