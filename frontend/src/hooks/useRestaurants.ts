import { useQuery } from '@tanstack/react-query';
import { foodService, Restaurant, PaginatedResult } from '../services/foodService';

export const useRestaurants = (filters?: { region?: string; cuisine?: string }, page = 1, limit = 24) => {
  return useQuery({
    queryKey: ['restaurants', filters, page, limit],
    queryFn: async (): Promise<PaginatedResult<Restaurant>> => {
      // Pass the cuisine filter down if defined.
      // Note: region filter may require location-based filtering which can be added to foodService later.
      return await foodService.getRestaurants({ cuisine: filters?.cuisine }, page, limit);
    },
  });
};
