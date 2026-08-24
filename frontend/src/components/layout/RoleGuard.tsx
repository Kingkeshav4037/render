import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { AppRole } from '../../store/useAuthStore';
import { LoadingState } from '../ui/LoadingState';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

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
  const { profile, loading, user } = useAuthStore();
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role as AppRole)) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
