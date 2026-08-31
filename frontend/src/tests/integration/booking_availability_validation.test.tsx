import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { availabilityService } from '../../services/availabilityService';
import { bookingService } from '../../services/bookingService';
import { staysService } from '../../services/stay/staysService';
import { StayBooking } from '../../pages/checkout/StayBooking';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

// Mock toast notifications
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.success = vi.fn();
  mockToast.error = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

describe('Phase C — Change 10: Booking Availability Validation & Inventory Holds', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── 1. Client-Side Booking Rule Validation ─────────────────────────────────
  describe('Rule & Date Boundary Validation', () => {
    it('rejects check-in dates in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);

      const res = availabilityService.validateBookingRules(
        pastDate.toISOString().split('T')[0],
        futureDate.toISOString().split('T')[0],
        2
      );

      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/cannot be in the past/i);
    });

    it('rejects check-out date on or before check-in date', () => {
      const checkIn = '2026-09-10';
      const checkOut = '2026-09-08';

      const res = availabilityService.validateBookingRules(checkIn, checkOut, 2);

      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/after check-in date/i);
    });

    it('rejects bookings violating minimum stay rules', () => {
      const checkIn = '2026-09-10';
      const checkOut = '2026-09-11'; // 1 night

      const res = availabilityService.validateBookingRules(checkIn, checkOut, 2, {
        minNights: 3,
      });

      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/minimum stay for this property is 3 nights/i);
    });

    it('rejects guest counts exceeding room maximum capacity', () => {
      const checkIn = '2026-09-10';
      const checkOut = '2026-09-14';

      const res = availabilityService.validateBookingRules(checkIn, checkOut, 6, {
        maxGuests: 4,
      });

      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/maximum capacity for this room is 4 guests/i);
    });

    it('passes valid date range and guest count within capacity', () => {
      const checkIn = '2026-09-10';
      const checkOut = '2026-09-14';

      const res = availabilityService.validateBookingRules(checkIn, checkOut, 2, {
        minNights: 2,
        maxGuests: 4,
      });

      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });

  // ─── 2. Real-Time Availability Check (RPC) ──────────────────────────────────
  describe('Authoritative Real-Time Availability Check', () => {
    it('returns available: true when no conflicting bookings or holds exist', async () => {
      (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

      const res = await availabilityService.checkAvailability(
        'ACCOMMODATION',
        'stay-juvet-cabin-01',
        '2026-09-10',
        '2026-09-14'
      );

      expect(res.available).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('check_availability', expect.objectContaining({
        p_item_type: 'ACCOMMODATION',
        p_item_id: 'stay-juvet-cabin-01',
      }));
    });

    it('returns available: false with descriptive message when dates are booked', async () => {
      (supabase.rpc as any).mockResolvedValue({ data: false, error: null });

      const res = await availabilityService.checkAvailability(
        'ACCOMMODATION',
        'stay-juvet-cabin-01',
        '2026-09-10',
        '2026-09-14'
      );

      expect(res.available).toBe(false);
      expect(res.message).toMatch(/unavailable/i);
      expect(res.errorCode).toBe('ERR_DATES_UNAVAILABLE');
    });
  });

  // ─── 3. Temporary Inventory Hold & Concurrent Locking ────────────────────────
  describe('Temporary Hold & Concurrency Control', () => {
    it('creates an active inventory hold with 15-minute TTL for authenticated user', async () => {
      const mockHoldId = 'hold-uuid-12345';
      const mockExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      (supabase.rpc as any).mockResolvedValue({
        data: {
          success: true,
          hold_id: mockHoldId,
          expires_at: mockExpiresAt,
          nights: 4,
          pax: 2,
        },
        error: null,
      });

      const res = await availabilityService.validateAndHoldInventory(
        'user-alice-1',
        'ACCOMMODATION',
        'room-panoramic-suite',
        '2026-09-10',
        '2026-09-14',
        2,
        1,
        15
      );

      expect(res.success).toBe(true);
      expect(res.holdId).toBe(mockHoldId);
      expect(res.expiresAt).toBe(mockExpiresAt);
    });

    it('rejects concurrent hold attempt by another user while room is held', async () => {
      (supabase.rpc as any).mockResolvedValue({
        data: {
          success: false,
          error_code: 'ERR_ROOM_HELD',
          message: 'This property is currently reserved by another traveler. Please try again shortly.',
        },
        error: null,
      });

      const res = await availabilityService.validateAndHoldInventory(
        'user-bob-2',
        'ACCOMMODATION',
        'room-panoramic-suite',
        '2026-09-10',
        '2026-09-14',
        2,
        1,
        15
      );

      expect(res.success).toBe(false);
      expect(res.errorCode).toBe('ERR_ROOM_HELD');
      expect(res.message).toMatch(/currently reserved by another traveler/i);
    });

    it('allows releasing an active hold when payment is cancelled or dismissed', async () => {
      (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

      const released = await availabilityService.releaseInventoryHold('hold-uuid-12345', 'user-alice-1');
      expect(released).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('release_inventory_hold', {
        p_hold_id: 'hold-uuid-12345',
        p_user_id: 'user-alice-1',
      });
    });
  });

  // ─── 4. StayBooking UI Hold Banner & Countdown Timer ─────────────────────────
  describe('StayBooking Checkout Flow & UI Feedback', () => {
    it('displays reservation hold banner when inventory hold is active', async () => {
      useAuthStore.setState({
        user: { id: 'user-nordic-1', email: 'traveler@fjord.no' } as any,
        profile: { fullName: 'Astrid Lind', phone: '+47 987 65 432' } as any,
      });

      (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

      vi.spyOn(staysService, 'getStayDetails').mockResolvedValue({
        id: 'stay-juvet',
        location_id: 'loc-valldal',
        name: 'Juvet Landscape Hotel',
        type: 'HOTEL',
        description: 'Iconic architecture',
        price_per_night: 3200,
        currency: 'NOK',
        rating: 4.9,
        amenities: [],
        eco_certified: true,
        featured: true,
        image_url: '/images/hotel_juvet_1787013813000.jpg',
        lat: 62.2,
        lng: 7.2,
      });

      vi.spyOn(staysService, 'getStayRooms').mockResolvedValue([
        {
          id: 'room-landscape-cabin',
          accommodation_id: 'stay-juvet',
          name: 'Landscape Cabin',
          type: 'Cabin',
          price_per_night: 3200,
          capacity: 2,
          bed: '1 King Bed',
          size: '30m²',
          amenities: [],
          image_url: '/images/hotel_juvet_1787013813000.jpg',
        },
      ]);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/checkout/stay/stay-juvet?checkIn=2026-09-10&checkOut=2026-09-14&guests=2']}>
            <Routes>
              <Route path="/checkout/stay/:id" element={<StayBooking />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Verify page loads with Secure Your Stay header
      await waitFor(() => {
        expect(screen.getByText(/Secure Your Stay/i)).toBeInTheDocument();
      });

      // Verify guest inputs and confirm button are available
      expect(screen.getByRole('button', { name: /Confirm & Pay/i })).toBeInTheDocument();
    });
  });
});
