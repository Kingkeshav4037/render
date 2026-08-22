import React, { createContext, useContext } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// We map Zustand's store properties to the legacy AuthState expected by components
const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAuthStore();
  
  // Create a derived state that matches the old AuthContext shape
  const contextValue = {
    user: store.user,
    session: null, // Note: raw session isn't kept in store anymore, components should use 'user'
    profile: store.profile,
    isAdmin: store.isAdmin,
    mfaLevel: store.mfaLevel,
    loading: store.loading,
    signOut: store.signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
