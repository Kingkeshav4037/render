import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingState } from '../ui/LoadingState';

export const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingState message="Loading..." submessage="Checking your credentials with Norway SmartLife..." fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

