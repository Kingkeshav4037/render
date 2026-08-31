import { useState, useEffect, useCallback, useRef } from 'react';
import { availabilityService, AvailabilityCheckResult, InventoryHoldResult } from '../services/availabilityService';
import { useAuthStore } from '../store/useAuthStore';

export const useInventoryHold = () => {
  const { user } = useAuthStore();
  const [activeHold, setActiveHold] = useState<InventoryHoldResult | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isAcquiring, setIsAcquiring] = useState<boolean>(false);
  const [acquireError, setAcquireError] = useState<Error | null>(null);
  const holdIdRef = useRef<string | null>(null);

  // Timer countdown effect
  useEffect(() => {
    if (!activeHold?.expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const diffMs = new Date(activeHold.expiresAt!).getTime() - Date.now();
      const seconds = Math.max(0, Math.floor(diffMs / 1000));
      setRemainingSeconds(seconds);

      if (seconds <= 0) {
        setIsExpired(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeHold?.expiresAt]);

  const acquireHold = useCallback(async ({
    itemType,
    itemId,
    startTime,
    endTime,
    pax,
    quantity,
    holdDurationMinutes = 15,
  }: {
    itemType: string;
    itemId: string;
    startTime: string;
    endTime: string;
    pax?: number;
    quantity?: number;
    holdDurationMinutes?: number;
  }) => {
    if (!user?.id) {
      throw new Error('You must be signed in to reserve inventory.');
    }

    setIsAcquiring(true);
    setAcquireError(null);

    try {
      const res = await availabilityService.validateAndHoldInventory(
        user.id,
        itemType,
        itemId,
        startTime,
        endTime,
        pax || 1,
        quantity || 1,
        holdDurationMinutes
      );

      if (!res.success) {
        throw new Error(res.message || 'The selected dates or room are unavailable.');
      }

      setActiveHold(res);
      holdIdRef.current = res.holdId || null;
      setIsExpired(false);
      return res;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(err.message || 'Failed to acquire hold');
      setAcquireError(errorObj);
      throw errorObj;
    } finally {
      setIsAcquiring(false);
    }
  }, [user?.id]);

  const releaseHold = useCallback(async () => {
    if (holdIdRef.current) {
      await availabilityService.releaseInventoryHold(holdIdRef.current, user?.id);
      holdIdRef.current = null;
      setActiveHold(null);
      setRemainingSeconds(0);
    }
  }, [user?.id]);

  const formatRemainingTime = useCallback(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [remainingSeconds]);

  return {
    acquireHold,
    isAcquiring,
    acquireError,
    activeHold,
    remainingSeconds,
    isExpired,
    formattedRemainingTime: formatRemainingTime(),
    releaseHold,
  };
};
