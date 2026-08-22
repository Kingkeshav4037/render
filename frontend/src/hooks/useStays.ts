import { useQuery } from '@tanstack/react-query';
import { staysService } from '../services/stay/staysService';

export const useStays = (filters?: { type?: string; minPrice?: number; maxPrice?: number; rating?: number; eco_certified?: boolean }, page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['stays', filters, page, limit],
    queryFn: async () => {
      const data = await staysService.searchStays(filters, page, limit);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
