import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

// ─── Mock Auth Store ──────────────────────────────────────────────────
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'usr-audit-001', email: 'traveler@norwaysmartlife.no', last_sign_in_at: '2026-08-20T10:00:00Z' },
    profile: { id: 'usr-audit-001', fullName: 'Astrid Lind', role: 'USER', permissions: ['user:read'] },
    loading: false,
    initialized: true,
    isAdmin: false,
    isProvider: false,
    isAnalyst: false,
    permissions: ['user:read'],
    mfaLevel: 'aal1' as const,
    hasPermission: () => true,
    signOut: vi.fn(),
  };
  const mockHook: any = (selector?: any) => {
    if (typeof selector === 'function') return selector(store);
    return store;
  };
  mockHook.getState = () => store;
  mockHook.setState = vi.fn();
  return { useAuthStore: mockHook };
});

// Mock Currency Store
vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (amount: number = 0) => `NOK ${(amount || 0).toLocaleString()}`,
    setCurrency: vi.fn(),
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'usr-audit-001', email: 'traveler@norwaysmartlife.no' } },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'usr-audit-001', email: 'traveler@norwaysmartlife.no', last_sign_in_at: '2026-08-20T10:00:00Z' },
          },
        },
        error: null,
      }),
      mfa: {
        enroll: vi.fn().mockResolvedValue({
          data: { id: 'factor-01', totp: { qr_code: 'data:image/svg+xml;utf8,<svg></svg>' } },
          error: null,
        }),
        challenge: vi.fn().mockResolvedValue({
          data: { id: 'challenge-01' },
          error: null,
        }),
        verify: vi.fn().mockResolvedValue({
          data: { access_token: 'new-token' },
          error: null,
        }),
        listFactors: vi.fn().mockResolvedValue({
          data: { totp: [{ id: 'factor-01' }] },
          error: null,
        }),
        unenroll: vi.fn().mockResolvedValue({
          data: { id: 'factor-01' },
          error: null,
        }),
      },
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// Mock Profile Service
vi.mock('../../services/profile/profileService', () => ({
  profileService: {
    getProfile: vi.fn().mockResolvedValue({
      id: 'usr-audit-001',
      fullName: 'Astrid Lind',
      email: 'traveler@norwaysmartlife.no',
      phone: '+47 40000000',
      nationality: 'Norwegian',
      bio: 'Fjord explorer',
    }),
    getProfileCompletion: vi.fn().mockResolvedValue({ score: 85 }),
    updateProfile: vi.fn().mockResolvedValue({ success: true }),
  },
}));

// ─── Component Imports ────────────────────────────────────────────────
import { Dashboard } from '../../pages/user/Dashboard';
import { UpcomingTripWidget } from '../../pages/user/components/UpcomingTripWidget';
import { MyTripsWidget } from '../../pages/user/components/MyTripsWidget';
import { FavoritesWidget } from '../../pages/user/components/FavoritesWidget';
import { MyBookings } from '../../pages/user/MyBookings';
import { BookingDetails } from '../../pages/user/BookingDetails';
import { Assistant } from '../../pages/user/Assistant';
import { Security } from '../../pages/user/security/Security';
import { Notifications } from '../../pages/user/Notifications';
import { Profile } from '../../pages/user/Profile';

describe('User Dashboard Complete Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  // ─── 1. Complete User Dashboard ────────────────────────────────────
  describe('User Dashboard Root', () => {
    it('renders greeting, countdown, hero cards, and quick actions', async () => {
      const testClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      render(
        <QueryClientProvider client={testClient}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Wait past simulated loading
      await waitFor(() => {
        expect(screen.getByText(/Astrid/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText(/Your next adventure starts in/i)).toBeInTheDocument();
      expect(screen.getByText('Lofoten')).toBeInTheDocument();
      expect(screen.getByText('Travel Wallet')).toBeInTheDocument();
      expect(screen.getByText('Saved Places')).toBeInTheDocument();
      expect(screen.getByText('Your Norway Impact')).toBeInTheDocument();
    });
  });

  // ─── 2. Upcoming Trip Widget ───────────────────────────────────────
  describe('Upcoming Trip Widget (All States)', () => {
    const mockTrip: any = {
      id: 'trip-101',
      title: 'Arctic Expedition',
      destinationName: 'Tromsø & Senja',
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      coverImage: 'https://example.com/tromso.jpg',
      status: 'CONFIRMED',
    };

    it('renders active/upcoming trip with countdown and destination details (Success)', () => {
      render(
        <MemoryRouter>
          <UpcomingTripWidget trip={mockTrip} isActive={false} />
        </MemoryRouter>
      );

      expect(screen.getByText('Tromsø & Senja')).toBeInTheDocument();
      expect(screen.getByText('Arctic Expedition')).toBeInTheDocument();
      expect(screen.getByText(/days to go/i)).toBeInTheDocument();
    });

    it('renders empty placeholder when no trip is planned without crashing (Empty Data)', () => {
      render(
        <MemoryRouter>
          <UpcomingTripWidget trip={null} isActive={false} />
        </MemoryRouter>
      );

      expect(screen.getByText('No trips planned yet')).toBeInTheDocument();
      expect(screen.getByText('Plan a Trip')).toBeInTheDocument();
    });
  });

  // ─── 3. My Trips Widget ───────────────────────────────────────────
  describe('My Trips Widget (All States)', () => {
    const mockTrips: any[] = [
      {
        id: 'trip-01',
        title: 'Geirangerfjord Tour',
        destinationName: 'Geiranger',
        startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        status: 'CONFIRMED',
      },
      {
        id: 'trip-02',
        title: 'Bergen Coastal Walk',
        destinationName: 'Bergen',
        startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 25).toISOString(),
        status: 'COMPLETED',
      },
    ];

    it('renders trips with tab navigation and destination cards (Success)', () => {
      render(
        <MemoryRouter>
          <MyTripsWidget trips={mockTrips} />
        </MemoryRouter>
      );

      expect(screen.getByText('My Trips')).toBeInTheDocument();
      expect(screen.getByText('Geirangerfjord Tour')).toBeInTheDocument();

      // Switch to completed tab
      const completedBtn = screen.getByRole('button', { name: /completed/i });
      fireEvent.click(completedBtn);
      expect(screen.getByText('Bergen')).toBeInTheDocument();
    });

    it('displays empty feedback on filter with no items without crashing (Empty Data)', () => {
      render(
        <MemoryRouter>
          <MyTripsWidget trips={[]} />
        </MemoryRouter>
      );

      expect(screen.getByText(/No upcoming trips found/i)).toBeInTheDocument();
    });
  });

  // ─── 4. Favorites Widget ──────────────────────────────────────────
  describe('Favorites Widget (All States)', () => {
    const mockFavorites: any[] = [
      { id: 'fav-01', name: 'Flåm Railway', itemType: 'TRANSPORT', image: '/images/flam.jpg', url: '/travel/flam' },
      { id: 'fav-02', name: 'Reinebringen Hike', itemType: 'ACTIVITY', image: '/images/reine.jpg', url: '/activities/reine' },
    ];

    it('renders favorite places with links and category badges (Success)', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget favorites={mockFavorites} />
        </MemoryRouter>
      );

      expect(screen.getByText('Saved Places')).toBeInTheDocument();
      expect(screen.getByText('Flåm Railway')).toBeInTheDocument();
      expect(screen.getByText('Reinebringen Hike')).toBeInTheDocument();
    });

    it('renders empty bookmark state when no favorites exist (Empty Data)', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget favorites={[]} />
        </MemoryRouter>
      );

      expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
      expect(screen.getByText('Explore Destinations')).toBeInTheDocument();
    });
  });

  // ─── 5. My Bookings ───────────────────────────────────────────────
  describe('My Bookings Page (All States)', () => {
    it('renders user bookings with status tags and ticket links (Success)', async () => {
      const mockEq = vi.fn();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'BK-101',
            start_time: new Date(Date.now() + 86400000 * 5).toISOString(),
            end_time: new Date(Date.now() + 86400000 * 8).toISOString(),
            status: 'CONFIRMED',
            total_amount: 6800,
            item_type: 'HOTEL',
            pax: 2,
          },
        ],
        error: null,
      });
      mockEq.mockReturnValue({ order: mockOrder });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      render(
        <MemoryRouter>
          <MyBookings />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('My Bookings')).toBeInTheDocument();
        expect(screen.getByText('Booking #BK')).toBeInTheDocument();
      });

      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });

    it('handles empty bookings list cleanly (Empty Data)', async () => {
      const mockEq = vi.fn();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      mockEq.mockReturnValue({ order: mockOrder });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      render(
        <MemoryRouter>
          <MyBookings />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('My Bookings')).toBeInTheDocument();
        expect(screen.getByText(/No upcoming bookings/i)).toBeInTheDocument();
      });
    });

    it('handles database error gracefully without crashing (Database Failure)', async () => {
      const mockEq = vi.fn();
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database connection failed' } });
      mockEq.mockReturnValue({ order: mockOrder });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      render(
        <MemoryRouter>
          <MyBookings />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('My Bookings')).toBeInTheDocument();
      });
    });
  });

  // ─── 6. Booking Details ───────────────────────────────────────────
  describe('Booking Details Page', () => {
    it('renders single booking detail view and cancellation handler', async () => {
      const mockEq = vi.fn();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'BK-101',
          start_time: new Date(Date.now() + 86400000 * 5).toISOString(),
          end_time: new Date(Date.now() + 86400000 * 8).toISOString(),
          status: 'CONFIRMED',
          total_amount: 6800,
          location: 'Svolvær',
          item_type: 'HOTEL',
          pax: 2,
          created_at: '2026-08-15T12:00:00Z',
        },
        error: null,
      });
      mockEq.mockReturnValue({ single: mockSingle });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      render(
        <MemoryRouter initialEntries={['/user/bookings/BK-101']}>
          <Routes>
            <Route path="/user/bookings/:id" element={<BookingDetails />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Booking #BK')).toBeInTheDocument();
        expect(screen.getByText('Invoice')).toBeInTheDocument();
        expect(screen.getByText('Cancel Booking')).toBeInTheDocument();
      });
    });
  });

  // ─── 7. AI Assistant ──────────────────────────────────────────────
  describe('AI Travel Assistant', () => {
    it('renders initial assistant greeting and handles user messaging', async () => {
      render(
        <MemoryRouter>
          <Assistant />
        </MemoryRouter>
      );

      expect(screen.getByText(/Hei! I am your personal Norway assistant/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Ask about your trip/i);
      fireEvent.change(input, { target: { value: 'What is the best time to see the northern lights?' } });

      const sendBtn = screen.getByRole('button');
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(screen.getByText('What is the best time to see the northern lights?')).toBeInTheDocument();
      });
    });
  });

  // ─── 8. User Security ─────────────────────────────────────────────
  describe('User Security & Sessions', () => {
    it('renders active sessions, MFA security options, and sign-out controls', async () => {
      render(
        <MemoryRouter>
          <Security />
        </MemoryRouter>
      );

      expect(screen.getByText('Security & Sessions')).toBeInTheDocument();
      expect(screen.getByText(/Two-Factor Authentication/i)).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Sign out all other devices')).toBeInTheDocument();
    });

    it('triggers MFA setup flow with QR code generation', async () => {
      render(
        <MemoryRouter>
          <Security />
        </MemoryRouter>
      );

      const enableBtn = screen.getByRole('button', { name: /Setup Authenticator App/i });
      fireEvent.click(enableBtn);

      await waitFor(() => {
        expect(supabase.auth.mfa.enroll).toHaveBeenCalled();
      });
    });
  });

  // ─── 9. Notifications ─────────────────────────────────────
  describe('User Notifications', () => {
    it('renders notification center, filter tabs, and alert items', () => {
      render(
        <MemoryRouter>
          <Notifications />
        </MemoryRouter>
      );

      expect(screen.getByText('Notification Center')).toBeInTheDocument();
      expect(screen.getByText('Severe Mountain Weather Advisory')).toBeInTheDocument();
      expect(screen.getByText('All Notifications')).toBeInTheDocument();
      expect(screen.getByText('Safety & Advisories')).toBeInTheDocument();

      // Switch to Safety & Advisories filter
      fireEvent.click(screen.getByText('Safety & Advisories'));
      expect(screen.getByText('Severe Mountain Weather Advisory')).toBeInTheDocument();
    });
  });

  // ─── 10. Profile Updates ──────────────────────────────────
  describe('Profile & Settings Management', () => {
    it('loads profile overview with completion meter and tab navigation', async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText('Travel Preferences')).toBeInTheDocument();
        expect(screen.getAllByText('Food & Dietary')[0]).toBeInTheDocument();
      });

      // Switch tabs
      fireEvent.click(screen.getAllByText('Food & Dietary')[0]);
      expect(screen.getAllByText('Food & Dietary')[0]).toBeInTheDocument();
    });
  });
});
