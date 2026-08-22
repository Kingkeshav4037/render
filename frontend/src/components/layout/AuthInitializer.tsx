import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const cleanup = initialize();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initialize]);

  return <>{children}</>;
};
