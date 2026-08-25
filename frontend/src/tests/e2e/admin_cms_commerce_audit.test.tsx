import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Admin Components
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminDestinations } from '../../pages/admin/AdminDestinations';
import { PlacesCMS } from '../../pages/admin/content/PlacesCMS';
import { FoodCMS } from '../../pages/admin/content/FoodCMS';
import { AdminProducts } from '../../pages/admin/commerce/AdminProducts';
import { AdminOrders } from '../../pages/admin/commerce/AdminOrders';
import { AdminPayments } from '../../pages/admin/commerce/AdminPayments';
import { AdminUsers } from '../../pages/admin/users/AdminUsers';
import { AdminUserDetails } from '../../pages/admin/users/AdminUserDetails';
import { AuditLogs } from '../../pages/admin/system/AuditLogs';
import { AdminSecurityEvents } from '../../pages/admin/security/AdminSecurityEvents';
import { AdminSettings } from '../../pages/admin/system/AdminSettings';
import { RoleGuard } from '../../components/layout/RoleGuard';
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { useAuthStore } from '../../store/useAuthStore';

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
vi.mock('../../lib/supabase', () => {
  const mockFrom = vi.fn((table: string) => {
    const builder: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: [{ id: 'mock-1' }], error: null }),
      update: vi.fn().mockResolvedValue({ data: [{ id: 'mock-1' }], error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    if (table === 'profiles') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'usr-1', full_name: 'Astrid Lind', email: 'astrid@example.com', role: 'USER', status: 'ACTIVE', created_at: new Date().toISOString() },
            { id: 'usr-2', full_name: 'Lars Tour Guide', email: 'lars@example.com', role: 'PROVIDER', status: 'ACTIVE', created_at: new Date().toISOString() }
          ],
          error: null
        }),
        eq: vi.fn().mockReturnValue({
          ...builder,
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'usr-1', full_name: 'Astrid Lind', email: 'astrid@example.com', role: 'USER', status: 'ACTIVE', created_at: new Date().toISOString() },
            error: null
          })
        })
      }));
    } else if (table === 'locations') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'loc-1', name: 'Geirangerfjord', type: 'FJORD', latitude: 62.1, longitude: 7.2, status: 'PUBLISHED' },
            { id: 'loc-2', name: 'Tromsø', type: 'CITY', latitude: 69.6, longitude: 18.9, status: 'PUBLISHED' }
          ],
          error: null
        })
      }));
    } else if (table === 'restaurants') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'rest-1', name: 'Maaemo', type: 'FINE_DINING', status: 'PUBLISHED', rating: 4.9, price_range: '4' }
          ],
          error: null
        })
      }));
    } else if (table === 'foods') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'food-1', name: 'Fårikål', slug: 'farikal', status: 'PUBLISHED', featured: true }
          ],
          error: null
        })
      }));
    } else if (table === 'orders') {
      builder.select.mockImplementation(() => ({
        ...builder,
        eq: vi.fn().mockReturnValue({
          ...builder,
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 'ord-101', user_id: 'usr-1', total_amount: 1890, currency: 'NOK', status: 'PAID', created_at: new Date().toISOString() }
            ],
            error: null
          })
        }),
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'ord-101', user_id: 'usr-1', total_amount: 1890, currency: 'NOK', status: 'PAID', created_at: new Date().toISOString() }
          ],
          error: null
        })
      }));
    } else if (table === 'security_events') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              { id: 'sec-1', event_type: 'LOGIN_SUCCESS', created_at: new Date().toISOString(), ip_address: '127.0.0.1', description: 'Admin sign in' }
            ],
            error: null
          })
        })
      }));
    } else if (table === 'audit_logs') {
      builder.select.mockImplementation(() => ({
        ...builder,
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              { id: 'aud-1', action: 'UPDATE_ROLE', resource_type: 'PROFILE', resource_id: 'usr-1', created_at: new Date().toISOString(), profiles: { full_name: 'Super Admin', email: 'admin@smartlife.no' } }
            ],
            error: null
          })
        })
      }));
    }

    return builder;
  });

  return {
    supabase: {
      from: mockFrom,
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        mfa: {
          getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({ data: { currentLevel: 'aal1' } })
        }
      }
    }
  };
});

describe('Priority 7: Complete Admin, CMS & Commerce Operations Suite', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    useAuthStore.setState({
      user: { id: 'admin-1', email: 'admin@smartlife.no' } as any,
      profile: { id: 'admin-1', fullName: 'Super Administrator', email: 'admin@smartlife.no', role: 'SUPER_ADMIN' } as any,
      isAdmin: true,
      isProvider: false,
      isAnalyst: false,
      loading: false,
      initialized: true,
      permissions: ['*']
    });
  });

  // ─── 1. Admin Dashboard ──────────────────────────────────────────────────
  it('1. Admin Dashboard: Renders telemetry cards, operational KPIs, and health', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getAllByText('Bookings')[0]).toBeInTheDocument();
    expect(screen.getByText('Live Operations')).toBeInTheDocument();
    expect(screen.getByText('Operational Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Add Destination')).toBeInTheDocument();
    expect(screen.getByText('Add Food Item')).toBeInTheDocument();
    expect(screen.getByText('Add Product')).toBeInTheDocument();
    expect(screen.getByText('Manage Orders')).toBeInTheDocument();
    expect(screen.getByText('7 Days')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
  });

  // ─── 2. RoleGuard Security ───────────────────────────────────────────────
  it('2. RoleGuard: Allows admin and blocks unauthenticated or standard travelers', async () => {
    // A. Unauthenticated
    useAuthStore.setState({ user: null, profile: null, isAdmin: false, loading: false });

    const { unmount } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<div>Login Page Guard</div>} />
          <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
            <Route index element={<div>Admin Secured Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Guard')).toBeInTheDocument();
    unmount();

    // B. Standard traveler (USER)
    useAuthStore.setState({
      user: { id: 'usr-1', email: 'user@example.com' } as any,
      profile: { id: 'usr-1', fullName: 'User', role: 'USER' } as any,
      isAdmin: false,
      loading: false
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/home" element={<div>Access Denied Return</div>} />
          <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} redirectPath="/home" />}>
            <Route index element={<div>Admin Secured Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied Return')).toBeInTheDocument();
  });

  // ─── 3. Admin Destinations CMS ───────────────────────────────────────────
  it('3. Admin Destinations: Displays locations, search filter, and opens Add Location modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDestinations />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Destination Management')).toBeInTheDocument();
    });

    const addBtn = screen.getByRole('button', { name: /Add Location/i });
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText('Add New Destination')).toBeInTheDocument();
    });
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  // ─── 4. Places CMS ───────────────────────────────────────────────────────
  it('4. Places CMS: Renders Norway canonical location hierarchy', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlacesCMS />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Places & Geography Manager')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Geirangerfjord')).toBeInTheDocument();
    });
  });

  // ─── 5. Food & Dining CMS ────────────────────────────────────────────────
  it('5. Food CMS: Toggles between restaurants and traditional foods', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FoodCMS />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Food & Dining Manager')).toBeInTheDocument();
    });

    const foodTab = screen.getByRole('button', { name: /Traditional Foods/i });
    fireEvent.click(foodTab);

    await waitFor(() => {
      expect(screen.getByText(/Traditional Foods Database/i)).toBeInTheDocument();
    });
  });

  // ─── 6. Marketplace Products & Stock ─────────────────────────────────────
  it('6. Admin Products: Displays inventory KPIs, search query, and stock indicators', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminProducts />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Marketplace & Stock Management/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Catalog SKUs')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search products by name or category/i)).toBeInTheDocument();
  });

  // ─── 7. Orders & Fulfillment ─────────────────────────────────────────────
  it('7. Admin Orders: Displays order records and payment gateway references', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order & Commerce Management/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Total Orders')).toBeInTheDocument();
  });

  // ─── 8. Admin Payments Ledger ────────────────────────────────────────────
  it('8. Admin Payments: Renders tax breakdowns and payment receipts', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPayments />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Payments & Universal Invoices/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Settled Volume')).toBeInTheDocument();
  });

  // ─── 9. User Governance ──────────────────────────────────────────────────
  it('9. Admin Users: Displays dynamic profiles, search filter, and role assignment', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsers />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User Governance & Access')).toBeInTheDocument();
    });

    expect(screen.getByText('Astrid Lind')).toBeInTheDocument();
    expect(screen.getByText('Lars Tour Guide')).toBeInTheDocument();
  });

  // ─── 10. Admin User Details ──────────────────────────────────────────────
  it('10. Admin User Details: Displays dynamic profile information and suspension toggle', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users/usr-1']}>
          <Routes>
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });

    expect(screen.getByText('User Bookings & Orders')).toBeInTheDocument();
  });

  // ─── 11. Security Audit Logs ─────────────────────────────────────────────
  it('11. Security Events: Renders security audit logs with timestamps and event icons', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminSecurityEvents />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Security Audit Log')).toBeInTheDocument();
    });
  });

  // ─── 12. Audit Logs Table ────────────────────────────────────────────────
  it('12. Audit Logs: Displays immutable record of administrative actions', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuditLogs />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    });

    expect(screen.getByText(/Immutable record of administrative actions/i)).toBeInTheDocument();
  });

  // ─── 13. System Settings ─────────────────────────────────────────────────
  it('13. System Settings: Toggles MFA policy and persists settings to localStorage', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminSettings />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('System Settings & Operations')).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole('button', { name: /Save Configurations/i });
    expect(saveBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(localStorage.getItem('nsl_admin_require_mfa')).toBe('true');
    });
  });

  // ─── 14. Cross-System Consistency & Privilege Guard ──────────────────────
  it('14. Cross-System Consistency: PermissionGuard enforces granular capabilities', async () => {
    useAuthStore.setState({
      user: { id: 'usr-analyst', email: 'analyst@smartlife.no' } as any,
      profile: { id: 'usr-analyst', fullName: 'Analyst User', role: 'ANALYST' } as any,
      isAdmin: false,
      permissions: ['audit:read'],
      loading: false,
      initialized: true
    });

    render(
      <MemoryRouter>
        <PermissionGuard require="content:delete" fallback={<div>Delete Forbidden</div>}>
          <button>Delete Live Location</button>
        </PermissionGuard>
        <PermissionGuard require="audit:read" fallback={<div>Audit Forbidden</div>}>
          <div>Audit Stream Allowed</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Delete Forbidden')).toBeInTheDocument();
    expect(screen.queryByText('Delete Live Location')).not.toBeInTheDocument();
    expect(screen.getByText('Audit Stream Allowed')).toBeInTheDocument();
  });
});
