import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  require?: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  require, 
  requireAll = false,
  fallback, 
  children 
}) => {
  const { hasPermission, loading, initialized } = useAuthStore();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If no specific permission required, just render
  if (!require) return <>{children}</>;

  const requirements = Array.isArray(require) ? require : [require];
  
  const isAllowed = requireAll 
    ? requirements.every(p => hasPermission(p))
    : requirements.some(p => hasPermission(p));

  if (!isAllowed) {
    if (fallback) return <>{fallback}</>;
    
    // Default fallback UI for unauthorized sections
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 rounded-xl my-8 mx-auto max-w-lg">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          You do not have the required permissions to view this resource. 
          Please contact an administrator if you believe this is an error.
        </p>
        <div className="text-xs font-mono bg-slate-200 text-slate-600 px-3 py-1 rounded">
          Missing: {requirements.join(', ')}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
