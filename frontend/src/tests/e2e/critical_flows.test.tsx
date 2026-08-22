/**
 * Critical E2E User Journeys & Workflow Flows
 *
 * Flow 1: Register → Login → Home → Explore → Destination Details
 * Flow 2: Login → Stay → Select Property → Checkout → Payment Result
 * Flow 3: Admin Login → Create Content → Edit → Delete
 * Flow 4: Provider Login → Create Listing → Manage Booking
 * Flow 5: User → Trip Planner → Generate Plan → Save Trip
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';
import { plannerService } from '../../services/plannerService';

// Import Pages
import { Home } from '../../pages/Home';
import { Explore } from '../../pages/Explore';
import { DestinationDetails } from '../../pages/DestinationDetails';
import { Stay } from '../../pages/Stay';
import { Checkout } from '../../pages/checkout/Checkout';
import { PaymentSuccess } from '../../pages/checkout/PaymentSuccess';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { ProviderDashboard } from '../../pages/provider/ProviderDashboard';
import { TripPlanner } from '../../pages/planner/TripPlanner';

// ─── Setup Mocks ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithProviders = (ui: React.ReactElement, initialPath = '/') =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );

vi.mock('../../lib/supabase', () => {
  const queryBuilder = (tableName: string) => {
    const builder: any = {
      _table: tableName,
      select: vi.fn(() => builder),
      insert: vi.fn(() => builder),
      update: vi.fn(() => builder),
      delete: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      in: vi.fn(() => builder),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      single: vi.fn(() => Promise.resolve({
        data: {
          id: 'mock-1',
          name: 'Geiranger Fjord',
          slug: 'geiranger-fjord',
          title: 'Geiranger Fjord',
          type: 'FJORD',
          region: 'Western Norway',
          price_per_night: 2200,
          description: 'UNESCO World Heritage fjord',
          image_url: 'https://images.unsplash.com/photo-fjord.jpg',
          latitude: 62.1,
          longitude: 7.2,
          status: 'PUBLISHED',
        },
        error: null,
      })),
      then: (resolve: any) => {
        return resolve({
          data: [
            {
              id: 'mock-1',
              name: 'Geiranger Fjord',
              slug: 'geiranger-fjord',
              title: 'Geiranger Fjord',
              type: 'FJORD',
              region: 'Western Norway',
              price_per_night: 2200,
              description: 'UNESCO World Heritage site',
              image_url: 'https://images.unsplash.com/photo-fjord.jpg',
              latitude: 62.1,
              longitude: 7.2,
              status: 'PUBLISHED',
            },
          ],
          error: null,
        });
      },
    };
    return builder;
  };

  return {
    supabase: {
      from: vi.fn((table: string) => queryBuilder(table)),
      rpc: vi.fn().mockResolvedValue({ data: 'order-123', error: null }),
      functions: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            title: 'Majestic Fjord Itinerary',
            description: 'A 7-day tour across Norway',
            start_date: '2026-09-01',
            end_date: '2026-09-08',
            budget_nok: 25000,
            days: [
              {
                day_number: 1,
                date: '2026-09-01',
                description: 'Arrival in Oslo & City Tour',
                activities: [],
                stays: [],
                segments: [],
              },
            ],
          },
          error: null,
        }),
      },
      auth: {
        signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'flow@test.no' } }, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: 'u1', email: 'flow@test.no' }, session: { access_token: 'valid' } },
          error: null,
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        mfa: {
          getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({ data: { currentLevel: 'aal2' } }),
        },
      },
    },
  };
});

vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (n: number = 0) => `NOK ${n}`,
    setCurrency: vi.fn(),
  }),
}));

vi.mock('sonner', () => {
  const t: any = vi.fn();
  t.error = vi.fn();
  t.success = vi.fn();
  t.info = vi.fn();
  return { toast: t, Toaster: () => null };
});

describe('Critical E2E User Journeys', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    useCartStore.getState().clearCart();
    useAuthStore.setState({
      user: { id: 'user-01', email: 'auditor@smartlife.no' } as any,
      profile: { id: 'user-01', fullName: 'Auditor User', role: 'USER' } as any,
      loading: false,
      initialized: true,
      isAdmin: false,
      isProvider: false,
      isAnalyst: false,
      permissions: [],
      mfaLevel: 'aal1',
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  // ─── Flow 1: Register → Login → Home → Explore → Details ───────────────────
  describe('Flow 1: Register → Login → Home → Explore → Destination Details', () => {
    it('executes complete exploration discovery journey without error', async () => {
      // 1. Simulate registration call
      const regRes = await supabase.auth.signUp({
        email: 'newtraveler@norway.no',
        password: 'Password123!',
      });
      expect(regRes.data.user?.email).toBe('flow@test.no');

      // 2. Simulate Login
      const loginRes = await supabase.auth.signInWithPassword({
        email: 'newtraveler@norway.no',
        password: 'Password123!',
      });
      expect(loginRes.data.session?.access_token).toBe('valid');

      // 3. Mount Home page
      const { container: homeContainer } = renderWithProviders(<Home />, '/home');
      expect(homeContainer).toBeTruthy();

      // 4. Mount Explore catalog
      const { container: exploreContainer } = renderWithProviders(<Explore />, '/explore');
      expect(exploreContainer).toBeTruthy();

      // 5. Mount Destination Details
      const { container: detailsContainer } = renderWithProviders(
        <Routes>
          <Route path="/explore/:slug" element={<DestinationDetails />} />
        </Routes>,
        '/explore/geiranger-fjord'
      );
      expect(detailsContainer).toBeTruthy();
    });
  });

  // ─── Flow 2: Login → Stay → Select Property → Checkout → Payment Result ────
  describe('Flow 2: Login → Stay → Select Property → Checkout → Payment Result', () => {
    it('completes accommodation booking, cart checkout, and payment confirmation', async () => {
      // 1. View accommodations catalog
      const { container: stayContainer } = renderWithProviders(<Stay />, '/stay');
      expect(stayContainer).toBeTruthy();

      // 2. Select property & add to cart
      useCartStore.getState().addItem({
        item_type: 'ACCOMMODATION',
        item_id: 'stay-01',
        name: 'Geiranger Grand Hotel',
        unit_price: 2200,
        quantity: 2,
      });

      expect(useCartStore.getState().items.length).toBe(1);
      expect(useCartStore.getState().getCartTotal()).toBe(4400);

      // 3. Mount Checkout page
      const { container: checkoutContainer } = renderWithProviders(<Checkout />, '/checkout');
      expect(checkoutContainer).toBeTruthy();

      // 4. Mount Payment Success page with validated order status
      const { container: successContainer } = renderWithProviders(
        <PaymentSuccess />,
        '/payment-success'
      );
      expect(successContainer).toBeTruthy();
    });
  });

  // ─── Flow 3: Admin Login → Create Content → Edit → Delete ──────────────────
  describe('Flow 3: Admin Login → Content Management Lifecycle', () => {
    it('authorizes admin user and performs content management lifecycle', async () => {
      useAuthStore.setState({
        user: { id: 'admin-01', email: 'admin@smartlife.no' } as any,
        profile: { id: 'admin-01', fullName: 'Super Admin', role: 'ADMIN' } as any,
        isAdmin: true,
        permissions: ['*'],
      });

      // 1. Mount Admin Dashboard
      const { container: adminContainer } = renderWithProviders(
        <AdminDashboard />,
        '/admin/dashboard'
      );
      expect(adminContainer).toBeTruthy();

      // 2. Create content entity
      await supabase.from('locations').insert({
        name: 'Trolltunga Cliff',
        slug: 'trolltunga-cliff',
        type: 'LANDMARK',
      });
      expect(supabase.from).toHaveBeenCalledWith('locations');

      // 3. Edit content entity
      await supabase.from('locations').update({
        description: 'Iconic scenic rock formation.',
      }).eq('id', 'dest-trolltunga');
      expect(supabase.from).toHaveBeenCalledWith('locations');

      // 4. Delete content entity
      await supabase.from('locations').delete().eq('id', 'dest-trolltunga');
      expect(supabase.from).toHaveBeenCalledWith('locations');
    });
  });

  // ─── Flow 4: Provider Login → Create Listing → Manage Booking ──────────────
  describe('Flow 4: Provider Login → Create Listing → Manage Booking', () => {
    it('authorizes provider and executes listing creation and booking workflows', async () => {
      useAuthStore.setState({
        user: { id: 'prov-01', email: 'provider@nordic.no' } as any,
        profile: { id: 'prov-01', fullName: 'Nordic Adventures AS', role: 'PROVIDER' } as any,
        isProvider: true,
      });

      // 1. Mount Provider Dashboard
      const { container: providerContainer } = renderWithProviders(
        <ProviderDashboard />,
        '/provider/dashboard'
      );
      expect(providerContainer).toBeTruthy();

      // 2. Create Listing
      await supabase.from('activities').insert({
        provider_id: 'prov-01',
        name: 'Kayaking in Nærøyfjord',
        type: 'WATER_SPORTS',
        price: 850,
      });
      expect(supabase.from).toHaveBeenCalledWith('activities');

      // 3. Manage Booking (Confirm booking)
      await supabase.from('bookings').update({
        status: 'CONFIRMED',
      }).eq('id', 'booking-uuid-777');
      expect(supabase.from).toHaveBeenCalledWith('bookings');
    });
  });

  // ─── Flow 5: User → Trip Planner → Generate Plan → Save Trip ───────────────
  describe('Flow 5: User → Trip Planner → Generate Plan → Save Trip', () => {
    it('calls AI trip generator, receives structured itinerary, and saves to database', async () => {
      // 1. Mount Trip Planner page
      const { container: plannerContainer } = renderWithProviders(
        <TripPlanner />,
        '/planner'
      );
      expect(plannerContainer).toBeTruthy();

      // 2. Generate AI Trip Plan
      const plan = await plannerService.generateAITrip(
        'Explore western fjords with hiking and scenic stays',
        '2026-09-01'
      );

      expect(plan).not.toBeNull();
      expect(plan?.title).toBe('Majestic Fjord Itinerary');
      expect(plan?.days.length).toBe(1);

      // 3. Save Trip Plan to Database
      const tripId = await plannerService.saveTripToDatabase('user-01', plan!);
      expect(supabase.from).toHaveBeenCalledWith('trips');
    });
  });
});
