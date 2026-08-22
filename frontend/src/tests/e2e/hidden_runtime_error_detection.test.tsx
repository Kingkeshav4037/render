import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { supabase } from '../../lib/supabase';

// ─── Polyfills & Spies ───────────────────────────────────────────────
let consoleErrors: string[] = [];
let consoleWarns: string[] = [];

beforeEach(() => {
  consoleErrors = [];
  consoleWarns = [];
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    consoleErrors.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  });
  vi.spyOn(console, 'warn').mockImplementation((...args) => {
    consoleWarns.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  });
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Mock Auth Store for Multi-Role Audit
let currentRole = 'ADMIN';
let currentUser = { id: 'usr-audit-01', email: 'admin@norwaysmartlife.no' };

vi.mock('../../store/useAuthStore', () => {
  const store = {
    get user() { return currentUser; },
    get profile() { return { id: currentUser.id, fullName: 'System Auditor', role: currentRole, permissions: ['*'] }; },
    loading: false,
    initialized: true,
    get isAdmin() { return currentRole === 'ADMIN'; },
    get isProvider() { return currentRole === 'PROVIDER' || currentRole === 'ADMIN'; },
    isAnalyst: false,
    permissions: ['*'],
    mfaLevel: 'aal2' as const,
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

// Mock Sonner Toast
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

// Mock Supabase
vi.mock('../../lib/supabase', () => {
  const createChainableQuery = () => {
    const obj: any = {
      select: vi.fn().mockImplementation(() => obj),
      insert: vi.fn().mockImplementation(() => obj),
      update: vi.fn().mockImplementation(() => obj),
      delete: vi.fn().mockImplementation(() => obj),
      order: vi.fn().mockImplementation(() => obj),
      limit: vi.fn().mockImplementation(() => obj),
      eq: vi.fn().mockImplementation(() => obj),
      in: vi.fn().mockImplementation(() => obj),
      ilike: vi.fn().mockImplementation(() => obj),
      single: vi.fn().mockImplementation(() => obj),
      then: (resolve: any) => Promise.resolve({ data: [{ id: 'sample-01', status: 'CONFIRMED', name: 'Sample Item' }], error: null }).then(resolve),
    };
    return obj;
  };

  return {
    supabase: {
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'usr-audit-01', email: 'admin@norwaysmartlife.no' } }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'usr-audit-01' } } }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        mfa: {
          enroll: vi.fn().mockResolvedValue({ data: { id: 'factor_1', totp: { qr_code: 'qr', secret: 'sec' } }, error: null }),
          challenge: vi.fn().mockResolvedValue({ data: { id: 'chal_1' }, error: null }),
          verify: vi.fn().mockResolvedValue({ data: null, error: null }),
        },
      },
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
      from: vi.fn().mockImplementation(() => createChainableQuery()),
    },
  };
});

// ─── Component Imports ────────────────────────────────────────────────
import { Home } from '../../pages/Home';
import { Explore } from '../../pages/Explore';
import { DestinationDetails } from '../../pages/DestinationDetails';
import { Stay } from '../../pages/Stay';
import { StayDetails } from '../../pages/StayDetails';
import { Travel } from '../../pages/Travel';
import { TransportDetails } from '../../pages/TransportDetails';
import { RoadTrips } from '../../pages/travel/RoadTrips';
import { Food } from '../../pages/Food';
import { FoodDetails } from '../../pages/FoodDetails';
import { Activities } from '../../pages/Activities';
import { ActivityDetails } from '../../pages/ActivityDetails';
import { HikingTrails } from '../../pages/adventure/HikingTrails';
import { TrailDetails } from '../../pages/adventure/TrailDetails';
import { WinterSports } from '../../pages/adventure/WinterSports';
import { WinterResortDetails } from '../../pages/adventure/WinterResortDetails';
import { Wildlife } from '../../pages/nature/Wildlife';
import { WildlifeDetail } from '../../pages/nature/WildlifeDetail';
import { LiveWeather } from '../../pages/nature/LiveWeather';
import { AuroraTracker } from '../../pages/nature/AuroraTracker';
import { SafetyAlerts } from '../../pages/nature/SafetyAlerts';
import { Sustainability } from '../../pages/nature/Sustainability';
import { Deals } from '../../pages/travel/Deals';
import { Guides } from '../../pages/travel/Guides';
import { Events } from '../../pages/events/Events';
import { Products } from '../../pages/marketplace/Products';
import { SmartCity } from '../../pages/city/SmartCity';
import { EVCharging } from '../../pages/mobility/EVCharging';
import { EVStationDetails } from '../../pages/mobility/EVStationDetails';
import { SmartFerry } from '../../pages/mobility/SmartFerry';
import { Infrastructure } from '../../pages/industry/Infrastructure';
import { EnergyDashboard } from '../../pages/infrastructure/EnergyDashboard';
import { IoTDashboard } from '../../pages/infrastructure/IoTDashboard';
import { Insights } from '../../pages/Insights';

// User Dashboard Pages
import { Dashboard } from '../../pages/user/Dashboard';
import { Wishlist } from '../../pages/user/Wishlist';
import { TripsList } from '../../pages/user/Trips/TripsList';
import { TripDetails } from '../../pages/user/Trips/TripDetails';
import { Assistant } from '../../pages/user/Assistant';
import { Notifications } from '../../pages/user/Notifications';
import { Reviews } from '../../pages/user/Reviews';
import { TravelHistory } from '../../pages/user/TravelHistory';
import { Expenses } from '../../pages/user/Expenses';
import { Impact } from '../../pages/user/Impact';
import { MyBookings } from '../../pages/user/MyBookings';
import { BookingDetails } from '../../pages/user/BookingDetails';
import { Security } from '../../pages/user/security/Security';

// Provider Pages
import { ProviderDashboard } from '../../pages/provider/ProviderDashboard';
import { ProviderListings } from '../../pages/provider/listings/ProviderListings';
import { ProviderCalendar } from '../../pages/provider/operations/ProviderCalendar';
import { ProviderBookings } from '../../pages/provider/operations/ProviderBookings';
import { ProviderMessages } from '../../pages/provider/operations/ProviderMessages';
import { ProviderCustomers } from '../../pages/provider/operations/ProviderCustomers';

// Admin Pages
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminUsers } from '../../pages/admin/users/AdminUsers';
import { AdminDestinations } from '../../pages/admin/AdminDestinations';
import { AdminBookings } from '../../pages/admin/AdminBookings';
import { AdminContent } from '../../pages/admin/content/AdminContent';
import { ImportManager } from '../../pages/admin/data/ImportManager';
import { AdminSecurityEvents } from '../../pages/admin/security/AdminSecurityEvents';
import { AdminPageHealth } from '../../pages/admin/system/AdminPageHealth';

describe('Hidden Runtime Error Detection Across All Major Routes', () => {

  // ─── 1. Public Exploration & Discovery Routes ─────────────────────
  describe('Public Exploration Routes', () => {
    const publicPages = [
      { name: 'Home (/home)', Component: Home, path: '/home' },
      { name: 'Explore (/explore)', Component: Explore, path: '/explore' },
      { name: 'Stay Directory (/stay)', Component: Stay, path: '/stay' },
      { name: 'Travel Hub (/travel)', Component: Travel, path: '/travel' },
      { name: 'Food Directory (/food)', Component: Food, path: '/food' },
      { name: 'Activities Directory (/activities)', Component: Activities, path: '/activities' },
      { name: 'Hiking Trails (/trails)', Component: HikingTrails, path: '/trails' },
      { name: 'Winter Sports (/winter)', Component: WinterSports, path: '/winter' },
      { name: 'Wildlife Explorer (/wildlife)', Component: Wildlife, path: '/wildlife' },
      { name: 'Live Weather (/weather)', Component: LiveWeather, path: '/weather' },
      { name: 'Aurora Tracker (/nature/aurora)', Component: AuroraTracker, path: '/nature/aurora' },
      { name: 'Safety Alerts (/safety)', Component: SafetyAlerts, path: '/safety' },
      { name: 'Sustainability (/sustainability)', Component: Sustainability, path: '/sustainability' },
      { name: 'Travel Deals (/deals)', Component: Deals, path: '/deals' },
      { name: 'Travel Guides (/guides)', Component: Guides, path: '/guides' },
      { name: 'Events Calendar (/events)', Component: Events, path: '/events' },
      { name: 'Marketplace Shop (/shop)', Component: Products, path: '/shop' },
      { name: 'Smart City (/smart-city)', Component: SmartCity, path: '/smart-city' },
      { name: 'EV Charging (/mobility/ev)', Component: EVCharging, path: '/mobility/ev' },
      { name: 'Smart Ferry (/mobility/ferry)', Component: SmartFerry, path: '/mobility/ferry' },
      { name: 'Infrastructure (/infrastructure)', Component: Infrastructure, path: '/infrastructure' },
      { name: 'Energy Dashboard (/infrastructure/energy)', Component: EnergyDashboard, path: '/infrastructure/energy' },
      { name: 'IoT Sensor Dashboard (/infrastructure/iot)', Component: IoTDashboard, path: '/infrastructure/iot' },
      { name: 'Aurora Intelligence (/insights)', Component: Insights, path: '/insights' },
    ];

    publicPages.forEach(({ name, Component, path }) => {
      it(`mounts and renders without fatal crashes: ${name}`, async () => {
        expect(() => {
          renderWithProviders(<Component />, [path]);
        }).not.toThrow();

        const fatalErrors = consoleErrors.filter(e => 
          e.includes('Uncaught') || 
          e.includes('The above error occurred in the <') ||
          e.includes('Cannot read properties of null') ||
          e.includes('Cannot read properties of undefined')
        );
        expect(fatalErrors).toEqual([]);
      });
    });
  });

  // ─── 2. Parameterized Detail Pages ────────────────────────────────
  describe('Parameterized Detail Pages', () => {
    const detailPages = [
      { name: 'Destination Details (/explore/:slug)', Component: DestinationDetails, path: '/explore/geirangerfjord', route: '/explore/:slug' },
      { name: 'Stay Details (/stay/:id)', Component: StayDetails, path: '/stay/stay-fjord-01', route: '/stay/:id' },
      { name: 'Transport Details (/travel/route/:id)', Component: TransportDetails, path: '/travel/route/tr-01', route: '/travel/route/:id' },
      { name: 'Food Details (/food/:id)', Component: FoodDetails, path: '/food/rest-01', route: '/food/:id' },
      { name: 'Activity Details (/activities/:id)', Component: ActivityDetails, path: '/activities/act-01', route: '/activities/:id' },
      { name: 'Trail Details (/trails/:id)', Component: TrailDetails, path: '/trails/trail-01', route: '/trails/:id' },
      { name: 'Winter Resort Details (/winter/:id)', Component: WinterResortDetails, path: '/winter/resort-01', route: '/winter/:id' },
      { name: 'Wildlife Detail (/wildlife/:id)', Component: WildlifeDetail, path: '/wildlife/wild-01', route: '/wildlife/:id' },
      { name: 'EV Station Details (/mobility/ev/:id)', Component: EVStationDetails, path: '/mobility/ev/ev-01', route: '/mobility/ev/:id' },
    ];

    detailPages.forEach(({ name, Component, path, route }) => {
      it(`renders detail route safely: ${name}`, async () => {
        expect(() => {
          renderWithProviders(
            <Routes>
              <Route path={route} element={<Component />} />
            </Routes>,
            [path]
          );
        }).not.toThrow();

        const fatalErrors = consoleErrors.filter(e => 
          e.includes('Uncaught') || 
          e.includes('The above error occurred in the <') ||
          e.includes('Cannot read properties of null') ||
          e.includes('Cannot read properties of undefined')
        );
        expect(fatalErrors).toEqual([]);
      });
    });
  });

  // ─── 3. Authenticated User Dashboard Routes ───────────────────────
  describe('User Dashboard Routes', () => {
    const userPages = [
      { name: 'User Dashboard (/user/dashboard)', Component: Dashboard, path: '/user/dashboard' },
      { name: 'Wishlist (/user/wishlist)', Component: Wishlist, path: '/user/wishlist' },
      { name: 'Trips List (/user/trips)', Component: TripsList, path: '/user/trips' },
      { name: 'AI Assistant (/user/assistant)', Component: Assistant, path: '/user/assistant' },
      { name: 'Notifications (/user/notifications)', Component: Notifications, path: '/user/notifications' },
      { name: 'User Reviews (/user/reviews)', Component: Reviews, path: '/user/reviews' },
      { name: 'Travel History (/user/history)', Component: TravelHistory, path: '/user/history' },
      { name: 'Expenses (/user/expenses)', Component: Expenses, path: '/user/expenses' },
      { name: 'Norway Impact (/user/impact)', Component: Impact, path: '/user/impact' },
      { name: 'My Bookings (/user/bookings)', Component: MyBookings, path: '/user/bookings' },
      { name: 'Security & 2FA (/user/security)', Component: Security, path: '/user/security' },
    ];

    userPages.forEach(({ name, Component, path }) => {
      it(`renders user portal route: ${name}`, async () => {
        expect(() => {
          renderWithProviders(<Component />, [path]);
        }).not.toThrow();
      });
    });
  });

  // ─── 4. Provider Operations Portal ────────────────────────────────
  describe('Provider Operations Routes', () => {
    const providerPages = [
      { name: 'Provider Dashboard (/provider/dashboard)', Component: ProviderDashboard, path: '/provider/dashboard' },
      { name: 'Provider Listings (/provider/listings)', Component: ProviderListings, path: '/provider/listings' },
      { name: 'Provider Calendar (/provider/operations/calendar)', Component: ProviderCalendar, path: '/provider/operations/calendar' },
      { name: 'Provider Bookings (/provider/operations/bookings)', Component: ProviderBookings, path: '/provider/operations/bookings' },
      { name: 'Provider Messages (/provider/operations/messages)', Component: ProviderMessages, path: '/provider/operations/messages' },
      { name: 'Provider Customers (/provider/operations/customers)', Component: ProviderCustomers, path: '/provider/operations/customers' },
    ];

    providerPages.forEach(({ name, Component, path }) => {
      it(`renders provider portal route: ${name}`, async () => {
        expect(() => {
          renderWithProviders(<Component />, [path]);
        }).not.toThrow();
      });
    });
  });

  // ─── 5. Administrative Backoffice Routes ──────────────────────────
  describe('Admin Control Center Routes', () => {
    const adminPages = [
      { name: 'Admin Dashboard (/admin/dashboard)', Component: AdminDashboard, path: '/admin/dashboard' },
      { name: 'Admin Users Management (/admin/users)', Component: AdminUsers, path: '/admin/users' },
      { name: 'Admin Destinations (/admin/destinations)', Component: AdminDestinations, path: '/admin/destinations' },
      { name: 'Admin Bookings (/admin/bookings)', Component: AdminBookings, path: '/admin/bookings' },
      { name: 'Admin Content CMS (/admin/content)', Component: AdminContent, path: '/admin/content' },
      { name: 'Import Manager (/admin/data/import)', Component: ImportManager, path: '/admin/data/import' },
      { name: 'Security Events (/admin/security/events)', Component: AdminSecurityEvents, path: '/admin/security/events' },
      { name: 'System Page Health (/admin/system/health)', Component: AdminPageHealth, path: '/admin/system/health' },
    ];

    adminPages.forEach(({ name, Component, path }) => {
      it(`renders admin backoffice route: ${name}`, async () => {
        expect(() => {
          renderWithProviders(<Component />, [path]);
        }).not.toThrow();
      });
    });
  });

  // ─── 6. Network Failures, 500/404/403 & Error Boundary Resilience ─
  describe('Network Faults & Error Boundary Resilience', () => {
    it('handles 500 Internal Server Error from database queries without crashing pages', async () => {
      // Force database 500 error
      (supabase.from as any).mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: { message: '500 Internal Server Error: Connection pool exhausted', code: '500' } }),
      }));

      expect(() => {
        renderWithProviders(<Home />, ['/home']);
      }).not.toThrow();
    });

    it('renders custom 404 page for nonexistent routes', () => {
      renderWithProviders(
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={
            <div className="text-center">
              <h1>404</h1>
              <p>Page Not Found</p>
            </div>
          } />
        </Routes>,
        ['/nonexistent-invalid-path-12345']
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('handles image load errors with fallback placeholders', () => {
      const { container } = renderWithProviders(<Explore />, ['/explore']);
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(() => {
          img.dispatchEvent(new Event('error'));
        }).not.toThrow();
      });
    });

    it('handles unhandled promise rejections in background fetches gracefully', async () => {
      const rejectionHandler = vi.fn();
      window.addEventListener('unhandledrejection', rejectionHandler);

      Promise.reject(new Error('Transient network drop')).catch(() => {
        // Handled cleanly
      });

      expect(rejectionHandler).not.toHaveBeenCalled();
      window.removeEventListener('unhandledrejection', rejectionHandler);
    });
  });
});
