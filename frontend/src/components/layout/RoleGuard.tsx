import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { AppRole } from '../../types/profile';
import { normalizeRole } from '../../types/profile';
import { LoadingState } from '../ui/LoadingState';

interface RoleGuardProps {
  allowedRoles: AppRole[];
  redirectPath?: string;
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  redirectPath = '/home',
  children
}) => {
  const { profile, loading, user, isAdmin } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingState 
        message="Verifying security credentials..." 
        submessage="Validating access permissions for this administrative portal..."
        fullScreen 
      />
    );
  }

  if (!user) {
    const loginTarget = redirectPath.includes('admin') ? '/admin/login' : '/login';
    return <Navigate to={loginTarget} state={{ from: location, returnTo: location.pathname }} replace />;
  }

  const userRole = normalizeRole(profile?.role);
  const isAllowedAdmin = (allowedRoles.includes('ADMIN') || allowedRoles.includes('SUPER_ADMIN')) && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || isAdmin);
  const isAllowedRole = allowedRoles.includes(userRole) || isAllowedAdmin;

  if (!profile || !isAllowedRole) {
    return <Navigate to={redirectPath} state={{ from: location, unauthorized: true }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
