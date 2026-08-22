import { useQuery } from '@tanstack/react-query';
import { wildlifeService } from '../services/wildlifeService';

export const useWildlife = (filters?: { category?: string; region?: string; season?: string }, page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['wildlife', filters, page, limit],
    queryFn: async () => {
      const data = await wildlifeService.getPaginatedSpecies(filters, page, limit);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
