import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useProfile } from './useProfile';
import { adminService } from '../services/admin/adminService';
import { normalizeRole } from '../types/profile';

// Determine if the base application role is considered staff/admin
const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'DATA_MANAGER'];

export const useAdmin = () => {
  const { user } = useAuthStore();
  const { data: profile } = useProfile(user?.id);

  const appRole = normalizeRole(profile?.role);
  const isStaff = STAFF_ROLES.includes(appRole);

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['admin-permissions', user?.id, appRole],
    queryFn: async () => {
      if (!user?.id || !isStaff) return {};
      return adminService.getUserPermissions(user.id, appRole);
    },
    enabled: !!user?.id && isStaff,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasPermission = (resource: string, action: string): boolean => {
    if (appRole === 'SUPER_ADMIN') return true;
    if (!permissions) return false;
    return !!permissions[resource]?.[action];
  };

  const hasAnyPermission = (requirements: { resource: string; action: string }[]): boolean => {
    if (appRole === 'SUPER_ADMIN') return true;
    if (!permissions) return false;
    return requirements.some((req) => !!permissions[req.resource]?.[req.action]);
  };

  const hasAllPermissions = (requirements: { resource: string; action: string }[]): boolean => {
    if (appRole === 'SUPER_ADMIN') return true;
    if (!permissions) return false;
    return requirements.every((req) => !!permissions[req.resource]?.[req.action]);
  };

  return {
    isStaff,
    appRole,
    permissions: permissions || {},
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
