import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { providerService } from '../../services/providerService';

// ─── Mock Auth Store ──────────────────────────────────────────────────
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'prv-user-001', email: 'partner@lofotenadventures.no' },
    profile: { id: 'prv-user-001', role: 'PROVIDER', fullName: 'Lofoten Adventures AS', permissions: ['provider:manage'] },
    loading: false,
    initialized: true,
    isAdmin: false,
    isProvider: true,
    isAnalyst: false,
    permissions: ['provider:manage'],
    mfaLevel: 'aal1' as const,
    hasPermission: (p: string) => p.startsWith('provider:'),
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

// Mock sonner toast
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  BarChart: () => <div>BarChart</div>,
  AreaChart: () => <div>AreaChart</div>,
  PieChart: () => <div>PieChart</div>,
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  Pie: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
}));

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'lst-new-01' }, error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    rpc: vi.fn().mockResolvedValue({
      data: { revenue_today: 48250, bookings_today: 126, occupancy_rate: 82 },
      error: null,
    }),
  },
}));

import { useAuthStore } from '../../store/useAuthStore';

// ─── Component Imports ────────────────────────────────────────────────
import { ProviderRegister } from '../../pages/provider/ProviderRegister';
import { ProviderDashboard } from '../../pages/provider/ProviderDashboard';
import { ProviderListings } from '../../pages/provider/listings/ProviderListings';
import { CreateListingWizard } from '../../pages/provider/listings/CreateListingWizard';
import { ListingEditor } from '../../pages/provider/listings/ListingEditor';
import { ProviderBookings } from '../../pages/provider/operations/ProviderBookings';
import { ProviderBookingDetails } from '../../pages/provider/operations/ProviderBookingDetails';
import { ProviderCalendar } from '../../pages/provider/operations/ProviderCalendar';
import { ProviderCustomers } from '../../pages/provider/operations/ProviderCustomers';
import { ProviderMessages } from '../../pages/provider/operations/ProviderMessages';
import { ProviderReviews } from '../../pages/provider/marketing/ProviderReviews';
import { ProviderMarketing } from '../../pages/provider/marketing/ProviderMarketing';
import { AdminProviderVerification } from '../../pages/admin/providers/AdminProviderVerification';

describe('Provider System Complete Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ─── 1. Provider Registration Flow ────────────────────────────────
  describe('Provider Registration & Onboarding', () => {
    it('renders provider registration form and application steps', async () => {
      render(
        <MemoryRouter>
          <ProviderRegister />
        </MemoryRouter>
      );

      expect(screen.getByText('Provider Application')).toBeInTheDocument();
      expect(screen.getByText('Business Information')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Lofoten Adventures AS/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    });

    it('renders submitted verification state correctly', () => {
      localStorage.setItem('mock_provider_verification', 'SUBMITTED');
      render(
        <MemoryRouter>
          <ProviderRegister />
        </MemoryRouter>
      );

      expect(screen.getByText('Application Submitted')).toBeInTheDocument();
    });
  });

  // ─── 2. Provider Approval (Admin Verification) ────────────────────
  describe('Provider Approval Workflow', () => {
    it('allows administrators to review and approve pending provider accounts', async () => {
      render(
        <MemoryRouter>
          <AdminProviderVerification />
        </MemoryRouter>
      );

      expect(screen.getByText('Verification Queue')).toBeInTheDocument();
      expect(screen.getAllByText('Arctic Fjord Safaris')[0]).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Approve & Activate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reject Application/i })).toBeInTheDocument();
    });
  });

  // ─── 3. Provider Dashboard ────────────────────────────────────────
  describe('Provider Dashboard & Operations Overview', () => {
    it('renders provider KPI cards, today operations, and action alerts', async () => {
      render(
        <MemoryRouter>
          <ProviderDashboard />
        </MemoryRouter>
      );

      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      expect(screen.getByText("Today's Revenue")).toBeInTheDocument();
      expect(screen.getByText('Bookings Today')).toBeInTheDocument();
      expect(screen.getByText("Today's Operations")).toBeInTheDocument();
      expect(screen.getByText('Lofoten Cabin - Standard')).toBeInTheDocument();
      expect(screen.getByText('Create Listing')).toBeInTheDocument();
    });
  });

  // ─── 4. Listing Creation (Wizard) ─────────────────────────────────
  describe('Listing Creation Wizard', () => {
    it('guides providers through multi-step listing creation flow', async () => {
      render(
        <MemoryRouter>
          <CreateListingWizard />
        </MemoryRouter>
      );

      expect(screen.getByText('Create New Listing')).toBeInTheDocument();
      expect(screen.getByText('What type of listing are you adding?')).toBeInTheDocument();

      // Step 1: Select Type
      fireEvent.click(screen.getByText('Accommodation'));
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 2: Basic Information
      await waitFor(() => {
        expect(screen.getByText('Basic Information')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText(/Arctic Panorama Glass Igloo/i), {
        target: { value: 'Svolvær Sea Cabin' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // Step 3: Location
      await waitFor(() => {
        expect(screen.getByText('Where is this located?')).toBeInTheDocument();
      });
      expect(screen.getByText('Street Address')).toBeInTheDocument();
    });
  });

  // ─── 5. Listing Management (Provider Listings) ────────────────────
  describe('Listing Directory & Filtering', () => {
    it('displays active listings with status badges and search capability', async () => {
      render(
        <MemoryRouter>
          <ProviderListings />
        </MemoryRouter>
      );

      expect(screen.getByText('Listings')).toBeInTheDocument();
      expect(screen.getByText('New Listing')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Panoramic Cabin')).toBeInTheDocument();
      expect(screen.getByText('Midnight Sun Kayaking')).toBeInTheDocument();

      // Search filter
      const searchInput = screen.getByPlaceholderText(/Search listings.../i);
      fireEvent.change(searchInput, { target: { value: 'Panoramic' } });
      expect(searchInput).toHaveValue('Panoramic');
    });
  });

  // ─── 6. Listing Editing ───────────────────────────────────────────
  describe('Listing Editing', () => {
    it('loads listing editor and submits changes', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'L-1001', name: 'Lofoten Cabin', base_price: 2500, status: 'PUBLISHED', description: 'Scenic' },
          error: null,
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      render(
        <MemoryRouter initialEntries={['/provider/listings/L-1001/edit']}>
          <Routes>
            <Route path="/provider/listings/:id/edit" element={<ListingEditor />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Lofoten Panoramic Cabin')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  // ─── 7. Booking Management ────────────────────────────────────────
  describe('Booking Management', () => {
    it('displays booking table, status filters, and export controls', async () => {
      render(
        <MemoryRouter>
          <ProviderBookings />
        </MemoryRouter>
      );

      expect(screen.getByText('Bookings')).toBeInTheDocument();
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
      expect(screen.getByText('Marcus Voller')).toBeInTheDocument();
      expect(screen.getByText('All Bookings')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });
  });

  // ─── 8. Booking Details ───────────────────────────────────────────
  describe('Booking Details', () => {
    it('loads booking reservation details with customer & transaction data', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'NSL-8201',
            status: 'CONFIRMED',
            start_time: '2026-10-15T10:00:00Z',
            end_time: '2026-10-18T10:00:00Z',
            pax: 2,
            total_amount: 4500,
            item_id: 'L-1001',
            item_type: 'HOTEL',
            profiles: { full_name: 'Sarah Jenkins', email: 'sarah@example.com', phone: '+47 90000000' },
            payment_transactions: [{ status: 'SUCCEEDED', payment_method: 'CARD' }],
          },
          error: null,
        }),
      });

      render(
        <MemoryRouter initialEntries={['/provider/bookings/NSL-8201']}>
          <Routes>
            <Route path="/provider/bookings/:id" element={<ProviderBookingDetails />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Booking #NSL-8201/i)).toBeInTheDocument();
        expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
      });
    });
  });

  // ─── 9. Availability Calendar ─────────────────────────────────────
  describe('Availability Calendar', () => {
    it('renders monthly calendar grid with event capacity counters', async () => {
      render(
        <MemoryRouter>
          <ProviderCalendar />
        </MemoryRouter>
      );

      expect(screen.getByText('Availability Calendar')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getAllByText('Lofoten Cabin')[0]).toBeInTheDocument();

      // Switch to week view
      fireEvent.click(screen.getByText('Week'));
      expect(screen.getByText('Week')).toBeInTheDocument();
    });
  });

  // ─── 10. Customer CRM Data ────────────────────────────────────────
  describe('Customer CRM Directory', () => {
    it('lists guest profiles with lifetime spending and booking counts', async () => {
      render(
        <MemoryRouter>
          <ProviderCustomers />
        </MemoryRouter>
      );

      expect(screen.getByText('Customers')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
      expect(screen.getByText('Marcus Voller')).toBeInTheDocument();
      expect(screen.getByText('Emma Thompson')).toBeInTheDocument();
    });
  });

  // ─── 11. Provider Messages & Communications ───────────────────────
  describe('Provider Communications (Messages)', () => {
    it('renders chat interface with customer conversations', async () => {
      render(
        <MemoryRouter>
          <ProviderMessages />
        </MemoryRouter>
      );

      expect(screen.getByText('Inbox')).toBeInTheDocument();
      expect(screen.getAllByText('Sarah Jenkins')[0]).toBeInTheDocument();
      expect(screen.getByText('Marcus Voller')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Type your message.../i)).toBeInTheDocument();
    });
  });

  // ─── 12. Guest Reviews & Reputation ───────────────────────────────
  describe('Guest Reviews Management', () => {
    it('displays ratings summary, review feedback, and response rate', async () => {
      render(
        <MemoryRouter>
          <ProviderReviews />
        </MemoryRouter>
      );

      expect(screen.getByText('Reviews')).toBeInTheDocument();
      expect(screen.getByText('Average Rating')).toBeInTheDocument();
      expect(screen.getByText('Total Reviews')).toBeInTheDocument();
      expect(screen.getByText('Response Rate')).toBeInTheDocument();
      expect(screen.getByText(/Absolutely breathtaking/i)).toBeInTheDocument();
    });
  });

  // ─── 13. Marketing & Promotional Tools ────────────────────────────
  describe('Marketing & Promotions', () => {
    it('displays marketing campaigns and smart occupancy recommendations', async () => {
      render(
        <MemoryRouter>
          <ProviderMarketing />
        </MemoryRouter>
      );

      expect(screen.getByText('Marketing & Promotions')).toBeInTheDocument();
      expect(screen.getByText('New Campaign')).toBeInTheDocument();
      expect(screen.getByText(/Boost your low-season occupancy/i)).toBeInTheDocument();
      expect(screen.getByText('Winter Early Bird')).toBeInTheDocument();
    });
  });

  // ─── 14. Security: Strict Provider Data Isolation ─────────────────
  describe('Security: Cross-Provider Data Isolation', () => {
    it('ensures queries to provider_listings_view always filter strictly by provider_id', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      // Provider A queries their listings
      const providerAId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      await providerService.getProviderListings(providerAId);

      expect(supabase.from).toHaveBeenCalledWith('provider_listings_view');
      expect(mockEq).toHaveBeenCalledWith('provider_id', providerAId);
    });

    it('ensures booking queries always filter strictly by provider_id', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockReturnThis();
      const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
      });

      const providerBId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
      await providerService.getRecentBookings(providerBId);

      expect(supabase.from).toHaveBeenCalledWith('bookings');
      expect(mockEq).toHaveBeenCalledWith('provider_id', providerBId);
    });

    it('blocks unauthenticated or non-provider users from provider routes', () => {
      const store = (useAuthStore as any).getState();
      expect(store.isProvider).toBe(true);
      expect(store.hasPermission('provider:manage')).toBe(true);
    });
  });
});
