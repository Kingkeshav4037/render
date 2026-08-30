import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingState } from '../ui/LoadingState';

export const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Loading..." submessage="Checking your credentials with Norway SmartLife..." fullScreen />;
  }

  if (!user) {
    const returnTo = location.pathname + location.search;
    return (
      <Navigate 
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`} 
        state={{ from: location, returnTo }} 
        replace 
      />
    );
  }

  return <Outlet />;
};

