import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const GlobalOfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkState = () => {
      const state = localStorage.getItem('mock_offline_mode') === 'true';
      setIsOffline(state);
    };
    
    checkState();

    // Listen for custom event to update in real-time across components without context
    window.addEventListener('offlineModeToggled', checkState);
    return () => window.removeEventListener('offlineModeToggled', checkState);
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-400 text-amber-900 px-4 py-2 flex items-center justify-center gap-3 fixed top-0 w-full z-50 shadow-md">
      <WifiOff size={16} />
      <span className="text-xs font-bold uppercase tracking-widest">Offline Travel Mode Active</span>
      <span className="text-sm font-medium ml-2 border-l border-amber-900/20 pl-4 hidden md:inline">
        Your Wallet and Itinerary are cached and accessible without connection.
      </span>
    </div>
  );
};
