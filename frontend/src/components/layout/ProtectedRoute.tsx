import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingState } from '../ui/LoadingState';
import { isProfileComplete } from '../../types/profile';

export const ProtectedRoute = () => {
  const { user, profile, loading } = useAuthStore();
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

  // If user is authenticated but profile is missing required information (Gender, DOB, Address, Country)
  // and they are attempting to access a protected route other than /complete-profile
  if (profile && !isProfileComplete(profile) && location.pathname !== '/complete-profile') {
    const returnTo = location.pathname + location.search;
    return (
      <Navigate 
        to={`/complete-profile?returnTo=${encodeURIComponent(returnTo)}`} 
        state={{ from: location, returnTo }} 
        replace 
      />
    );
  }

  return <Outlet />;
};

