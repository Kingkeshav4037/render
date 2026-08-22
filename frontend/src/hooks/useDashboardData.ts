import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard/dashboardService';

export const useDashboardData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      if (!userId) return null;
      return dashboardService.getDashboardData(userId);
    },
    enabled: !!userId,
  });
};
