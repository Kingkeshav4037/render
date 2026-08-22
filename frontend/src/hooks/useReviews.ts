import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { useAuthStore } from '../store/useAuthStore';

export const useReviews = (productType: string, productId: string) => {
  return useQuery({
    queryKey: ['reviews', productType, productId],
    queryFn: () => reviewService.getReviews(productType, productId),
    enabled: !!productId,
  });
};

export const useAverageRating = (productType: string, productId: string) => {
  return useQuery({
    queryKey: ['reviews-average', productType, productId],
    queryFn: () => reviewService.getAverageRating(productType, productId),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: { product_type: string, product_id: string, rating: number, title?: string, description?: string, photos?: string[] }) => {
      if (!user) throw new Error("Must be logged in");
      return reviewService.createReview({ ...review, user_id: user.id });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_type, variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews-average', variables.product_type, variables.product_id] });
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      // Invalidate all reviews (or we could pass the productType/productId to be precise)
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews-average'] });
    }
  });
};
