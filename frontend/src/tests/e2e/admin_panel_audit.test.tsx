import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { mapService } from '../../services/map/mapService';
import { bookingService } from '../../services/bookingService';
import { importService } from '../../services/importService';

// ─── Mock useAuthStore ────────────────────────────────────────────────
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'adm-001', email: 'admin@smartlife.no' },
    profile: { id: 'adm-001', role: 'SUPER_ADMIN', permissions: ['*'], fullName: 'System Admin' },
    loading: false,
    initialized: true,
    isAdmin: true,
    isProvider: false,
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

// ─── Mock Admin Hook ──────────────────────────────────────────────────
vi.mock('../../hooks/useAdmin', () => ({
  useAdmin: () => ({
    isAdmin: true,
    hasPermission: () => true,
    user: { id: 'adm-001', email: 'admin@smartlife.no' },
  }),
}));

vi.mock('../../services/map/mapService', () => ({
  mapService: {
    fetchLocationsInBounds: vi.fn(),
  },
}));

vi.mock('../../services/bookingService', () => ({
  bookingService: {
    fetchAllBookings: vi.fn(),
  },
}));

vi.mock('../../services/importService', () => ({
  importService: {
    executeBulkImport: vi.fn(),
  },
}));

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
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      ilike: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

import { toast } from 'sonner';

// ─── Component Imports ────────────────────────────────────────────────
import { AdminLogin } from '../../pages/admin/auth/AdminLogin';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminUsers } from '../../pages/admin/AdminUsers';
import { AdminDestinations } from '../../pages/admin/AdminDestinations';
import { AdminBookings } from '../../pages/admin/AdminBookings';
import { AdminProviders } from '../../pages/admin/providers/AdminProviders';
import { PlacesCMS } from '../../pages/admin/content/PlacesCMS';
import { AdminMedia } from '../../pages/admin/content/AdminMedia';
import { ImportManager } from '../../pages/admin/data/ImportManager';
import { AuditLogs } from '../../pages/admin/system/AuditLogs';
import { AdminSecurityEvents } from '../../pages/admin/security/AdminSecurityEvents';
import { AdminPageRegistry } from '../../pages/admin/system/AdminPageRegistry';
import { AdminPageHealth } from '../../pages/admin/system/AdminPageHealth';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Admin Panel Complete Audit', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  // ─── 1. Admin Authentication & Login ──────────────────────────────
  describe('Admin Login & Multi-Factor Authentication', () => {
    it('executes 2-step verification for administrative accounts', async () => {
      render(
        <MemoryRouter>
          <AdminLogin />
        </MemoryRouter>
      );

      expect(screen.getByText(/Norway SmartLife Administration/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/admin@norwaysmartlife.no/i)).toBeInTheDocument();

      // Step 1: Submit credentials with admin email
      fireEvent.change(screen.getByPlaceholderText(/admin@norwaysmartlife.no/i), {
        target: { value: 'admin@norwaysmartlife.no' },
      });
      fireEvent.change(screen.getByPlaceholderText(/••••••••••••••••/i), {
        target: { value: 'SuperSecret123!' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /Authenticate/i }).closest('form')!);

      // Step 2: MFA verification step appears
      await waitFor(() => {
        expect(screen.getByText(/Identity Verification/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Enter 6-digit MFA code
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: String(index + 1) } });
      });

      const verifyBtn = screen.getByRole('button', { name: /Verify & Access/i });
      fireEvent.submit(verifyBtn.closest('form')!);
      await waitFor(() => {
        expect(verifyBtn).toBeDisabled();
      }, { timeout: 3000 });
    });

    it('rejects unauthorized non-admin login attempts', async () => {
      render(
        <MemoryRouter>
          <AdminLogin />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/admin@norwaysmartlife.no/i), {
        target: { value: 'user@external.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/••••••••••••••••/i), {
        target: { value: 'UserPass123!' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /Authenticate/i }).closest('form')!);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  // ─── 2. Dashboard Statistics ──────────────────────────────────────
  describe('Dashboard Statistics & Overview', () => {
    it('renders platform KPIs, system metrics, and analytics charts', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AdminDashboard />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Platform Overview/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getAllByText('Providers')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Bookings')[0]).toBeInTheDocument();
      expect(screen.getByText('Command Center')).toBeInTheDocument();
    });
  });

  // ─── 3. User Management ───────────────────────────────────────────
  describe('User Management', () => {
    it('fetches and renders system user profiles with assigned roles', async () => {
      const mockProfiles = [
        { id: 'usr-1', email: 'olav@nordic.no', full_name: 'Olav Hansen', role: 'ADMIN', created_at: '2026-01-01' },
        { id: 'usr-2', email: 'astrid@bergen.no', full_name: 'Astrid Lind', role: 'USER', created_at: '2026-01-02' },
      ];

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockProfiles, error: null }),
      });

      render(
        <MemoryRouter>
          <AdminUsers />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Olav Hansen')).toBeInTheDocument();
        expect(screen.getByText('astrid@bergen.no')).toBeInTheDocument();
      });

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Invite User')).toBeInTheDocument();
    });
  });

  // ─── 4. Destination Management (CRUD) ─────────────────────────────
  describe('Destination Management (CRUD)', () => {
    it('loads destinations, allows search filtering, and opens create modal', async () => {
      const mockLocations = [
        { id: 'loc-1', name: 'Geirangerfjord', type: 'FJORD', latitude: 62.1, longitude: 7.2, description: 'UNESCO fjord' },
        { id: 'loc-2', name: 'Tromsø', type: 'CITY', latitude: 69.6, longitude: 18.9, description: 'Gateway to Arctic' },
      ];

      (mapService.fetchLocationsInBounds as any).mockResolvedValue(mockLocations);

      render(
        <MemoryRouter>
          <AdminDestinations />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Geirangerfjord')).toBeInTheDocument();
        expect(screen.getByText('Tromsø')).toBeInTheDocument();
      });

      // Filter search
      const searchInput = screen.getByPlaceholderText(/Search by name or type/i);
      fireEvent.change(searchInput, { target: { value: 'Geiranger' } });

      expect(screen.getByText('Geirangerfjord')).toBeInTheDocument();
      expect(screen.queryByText('Tromsø')).toBeNull();

      // Open Add Destination Modal
      fireEvent.click(screen.getByRole('button', { name: /Add Location/i }));
      expect(screen.getByText('Add New Destination')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  // ─── 5. Booking Management ────────────────────────────────────────
  describe('Booking Management', () => {
    it('fetches system-wide bookings and displays status formatting', async () => {
      const mockBookings = [
        { id: 'BK-1001', user_id: 'usr-1', total_amount: 3200, status: 'CONFIRMED', created_at: '2026-02-15T10:00:00Z' },
        { id: 'BK-1002', user_id: 'usr-2', total_amount: 1500, status: 'PENDING_PAYMENT', created_at: '2026-02-16T11:00:00Z' },
      ];

      (bookingService.fetchAllBookings as any).mockResolvedValue(mockBookings);

      render(
        <MemoryRouter>
          <AdminBookings />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('BK-1001')).toBeInTheDocument();
        expect(screen.getByText('BK-1002')).toBeInTheDocument();
      });

      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
      expect(screen.getByText('PENDING_PAYMENT')).toBeInTheDocument();
      expect(screen.getByText('Total Bookings (YTD)')).toBeInTheDocument();
    });
  });

  // ─── 6. Provider Management ───────────────────────────────────────
  describe('Provider Directory & Verification', () => {
    it('renders B2B partner directory with status tags and verification link', async () => {
      render(
        <MemoryRouter>
          <AdminProviders />
        </MemoryRouter>
      );

      expect(screen.getByText('Provider Directory')).toBeInTheDocument();
      expect(screen.getByText('Verification Queue')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Eco-Adventures AS')).toBeInTheDocument();
      expect(screen.getByText('Aurora Cabins Tromsø')).toBeInTheDocument();
    });
  });

  // ─── 7. Content Management (PlacesCMS & GenericDataTable) ─────────
  describe('Content Management (PlacesCMS)', () => {
    it('renders canonical location data in GenericDataTable and enables editing modal', async () => {
      const mockPlaces = [
        { id: 'plc-1', name: 'Preikestolen', type: 'LANDMARK', status: 'PUBLISHED', latitude: 58.98, longitude: 6.18 },
      ];

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockPlaces, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      render(
        <MemoryRouter>
          <PlacesCMS />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Preikestolen')).toBeInTheDocument();
      });

      expect(screen.getByText('Places & Geography Manager')).toBeInTheDocument();
      expect(screen.getByText('Norway Locations Database')).toBeInTheDocument();
    });
  });

  // ─── 8. Media Management ──────────────────────────────────────────
  describe('Media Management', () => {
    it('displays media asset library with folder navigation and search', async () => {
      render(
        <MemoryRouter>
          <AdminMedia />
        </MemoryRouter>
      );

      expect(screen.getByText('Media Library')).toBeInTheDocument();
      expect(screen.getByText('lofoten_hero_summer.jpg')).toBeInTheDocument();
      expect(screen.getByText('Upload Assets')).toBeInTheDocument();
      expect(screen.getByText('Destinations')).toBeInTheDocument();
      expect(screen.getByText('Wildlife')).toBeInTheDocument();
    });
  });

  // ─── 9. Import Management ─────────────────────────────────────────
  describe('Import Management', () => {
    it('provides dataset upload interface with table selection', async () => {
      render(
        <MemoryRouter>
          <ImportManager />
        </MemoryRouter>
      );

      expect(screen.getByText(/Bulk Data Importer/i)).toBeInTheDocument();
      expect(screen.getByText(/Target Table/i)).toBeInTheDocument();
      expect(screen.getByText(/Upload Data File/i)).toBeInTheDocument();
      expect(screen.getByText(/Browse Files/i)).toBeInTheDocument();
    });
  });

  // ─── 10. Audit Logs ───────────────────────────────────────────────
  describe('Audit Logs', () => {
    it('queries immutable audit records and supports action searching', async () => {
      const mockAuditLogs = [
        { id: 'aud-1', action: 'UPDATE_LOCATION', resource: 'locations', created_at: '2026-02-20T08:00:00Z', profiles: { full_name: 'Admin User', email: 'admin@smartlife.no' } },
        { id: 'aud-2', action: 'DELETE_PRODUCT', resource: 'products', created_at: '2026-02-20T09:00:00Z', profiles: { full_name: 'Admin User', email: 'admin@smartlife.no' } },
      ];

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockAuditLogs, error: null }),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AuditLogs />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Audit Logs')).toBeInTheDocument();
        expect(screen.getByText('UPDATE_LOCATION')).toBeInTheDocument();
        expect(screen.getByText('DELETE_PRODUCT')).toBeInTheDocument();
      });
    });
  });

  // ─── 11. Security Events ──────────────────────────────────────────
  describe('Security Events Audit', () => {
    it('fetches security audit records and provides CSV export capabilities', async () => {
      const mockEvents = [
        { id: 'sec-1', event_type: 'login_success', ip_address: '192.168.1.1', created_at: '2026-02-20T08:00:00Z', description: 'User login', metadata: { auth: 'pwd' }, user: { full_name: 'Admin User', email: 'admin@smartlife.no' } },
        { id: 'sec-2', event_type: 'mfa_challenge_failed', ip_address: '192.168.1.2', created_at: '2026-02-20T08:30:00Z', description: 'Invalid token', metadata: null, user: { full_name: 'Unknown Attacker', email: 'attacker@evil.com' } },
      ];

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
      });

      render(
        <MemoryRouter>
          <AdminSecurityEvents />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Security Audit Log')).toBeInTheDocument();
        expect(screen.getByText('Export CSV')).toBeInTheDocument();
      });
    });
  });

  // ─── 12. Page Registry & Zero-Neglect Dashboard ───────────────────
  describe('Page Registry', () => {
    it('displays route readiness metrics and implementation coverage', async () => {
      render(
        <MemoryRouter>
          <AdminPageRegistry />
        </MemoryRouter>
      );

      expect(screen.getByText('Page Registry')).toBeInTheDocument();
      expect(screen.getAllByText('Wildlife')[0]).toBeInTheDocument();
      expect(screen.getByText('Aurora Tracker')).toBeInTheDocument();
      expect(screen.getByText('Total Pages')).toBeInTheDocument();
      expect(screen.getByText('Prod Ready')).toBeInTheDocument();
    });
  });

  // ─── 13. Page Health & Architecture ───────────────────────────────
  describe('Page Health & Verification', () => {
    it('renders zero-neglect page architecture and gate metrics', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [{ id: '1', title: 'Sample' }], count: 5, error: null }),
        }),
      });

      render(
        <MemoryRouter>
          <AdminPageHealth />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Zero-Neglect Route Audit/i)).toBeInTheDocument();
      });
    });
  });
});
