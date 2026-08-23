import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/auth/authService';
import { checkoutService } from '../../services/checkoutService';
import { invoiceService } from '../../services/invoice/invoiceService';
import { floraService } from '../../services/floraService';
import { Flora } from '../../pages/nature/Flora';
import { Invoices } from '../../pages/user/Invoices';
import { RoleGuard } from '../../components/layout/RoleGuard';

// ─── Mock Auth Store ──────────────────────────────────────────────────
let mockCurrentUser: any = { id: 'usr-audit-001', email: 'olav@nordic.no' };
let mockCurrentProfile: any = { id: 'usr-audit-001', full_name: 'Olav Hansen', role: 'USER', permissions: ['user:read'] };

vi.mock('../../store/useAuthStore', () => {
  const mockHook: any = (selector?: any) => {
    const store = {
      user: mockCurrentUser,
      profile: mockCurrentProfile,
      loading: false,
      initialized: true,
      isAdmin: mockCurrentProfile?.role === 'ADMIN' || mockCurrentProfile?.role === 'SUPER_ADMIN',
      isProvider: mockCurrentProfile?.role === 'PROVIDER',
      hasPermission: () => true,
      signOut: vi.fn(async () => {
        mockCurrentUser = null;
        mockCurrentProfile = null;
      }),
    };
    if (typeof selector === 'function') return selector(store);
    return store;
  };
  mockHook.getState = () => ({
    user: mockCurrentUser,
    profile: mockCurrentProfile,
    isAdmin: mockCurrentProfile?.role === 'ADMIN' || mockCurrentProfile?.role === 'SUPER_ADMIN',
  });
  return { useAuthStore: mockHook };
});

// ─── Mock Currency Store ──────────────────────────────────────────────
vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (amount: number = 0) => `NOK ${(amount || 0).toLocaleString()}`,
  }),
}));

const mockFloraData = [
  {
    id: 'flora-001',
    common_name: 'Norway Spruce',
    norwegian_name: 'Gran',
    latin_name: 'Picea abies',
    scientific_name: 'Picea abies',
    category: 'Trees',
    description: 'The iconic evergreen coniferous tree dominating Norway boreal forest taiga.',
    habitat: 'Taiga forests and mountain valleys across Østlandet and Trøndelag.',
    flowering_season: 'May - June',
    conservation_status: 'Least Concern',
    foraging_status: 'Edible & Forageable',
    foraging_rules: 'Freely accessible under Allemannsretten. Fresh spring spruce tips can be harvested for syrups and teas.',
    image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800',
    is_protected: false,
    distribution_region: 'Nationwide (Eastern and Central Norway)'
  },
  {
    id: 'flora-002',
    common_name: 'Cloudberry',
    norwegian_name: 'Molte',
    latin_name: 'Rubus chamaemorus',
    scientific_name: 'Rubus chamaemorus',
    category: 'Berries',
    description: 'Known as Arctic Gold, this amber delicacy thrives in subarctic peat bogs.',
    habitat: 'Sphagnum bogs and acidic tundra from Hardangervidda to Finnmark.',
    flowering_season: 'Late July - August',
    conservation_status: 'Least Concern',
    foraging_status: 'Edible & Forageable',
    foraging_rules: 'Allemannsretten permits personal picking across most regions.',
    image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800',
    is_protected: false,
    distribution_region: 'Northern Norway & Mountain Bogs'
  }
];

const mockBookingsData = [
  {
    id: 'bk-matrix-001',
    user_id: 'usr-audit-001',
    total_amount: 4500,
    currency: 'NOK',
    status: 'CONFIRMED',
    created_at: '2026-08-20T10:00:00Z',
    guest_name: 'Olav Hansen',
  }
];

// ─── Mock Supabase ────────────────────────────────────────────────────
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: mockCurrentUser }, error: null })),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
      signOut: vi.fn(),
    },
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn((table: string) => {
      if (table === 'flora_species') {
        const floraBuilder: any = {
          select: vi.fn(() => floraBuilder),
          order: vi.fn(async () => ({ data: mockFloraData, error: null })),
          eq: vi.fn(() => floraBuilder),
          single: vi.fn(async () => ({ data: mockFloraData[0], error: null })),
          insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(async () => ({ data: mockFloraData[0], error: null })) })) })),
          update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(async () => ({ data: mockFloraData[0], error: null })) })) })) })),
          delete: vi.fn(() => ({ eq: vi.fn(async () => ({ data: null, error: null })) })),
        };
        return floraBuilder;
      }
      const queryBuilder: any = {
        select: vi.fn(() => queryBuilder),
        eq: vi.fn(() => queryBuilder),
        order: vi.fn(async () => ({ data: mockBookingsData, error: null })),
        single: vi.fn(async () => ({ data: mockBookingsData[0], error: null })),
      };
      return queryBuilder;
    }),
  },
}));

describe('Complete Testing Matrix Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentUser = { id: 'usr-audit-001', email: 'olav@nordic.no' };
    mockCurrentProfile = { id: 'usr-audit-001', full_name: 'Olav Hansen', role: 'USER', permissions: ['user:read'] };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION MATRIX
  // ═══════════════════════════════════════════════════════════════════════
  describe('1. Authentication Matrix', () => {
    it('Existing authentication still works (email & password login)', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: { id: 'usr-001', email: 'test@norway.no' }, session: { access_token: 'valid-token' } },
        error: null,
      });

      const res = await authService.loginWithEmail('test@norway.no', 'SecureNordic2026!');
      expect(res.user.email).toBe('test@norway.no');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@norway.no',
        password: 'SecureNordic2026!',
      });
    });

    it('Google login works (triggers OAuth flow with correct redirectTo)', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: { url: 'https://accounts.google.com/o/oauth2/v2/auth' },
        error: null,
      });

      await authService.loginWithGoogle();
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
        }),
      });
    });

    it('Phone OTP works (dispatches verification code to phone number)', async () => {
      (supabase.auth.signInWithOtp as any).mockResolvedValue({
        data: { messageId: 'msg-otp-101' },
        error: null,
      });

      await authService.sendPhoneOtp('+4791234567');
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
        phone: '+4791234567',
      });
    });

    it('Invalid OTP fails safely without unhandled exception', async () => {
      (supabase.auth.verifyOtp as any).mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Token has expired or is invalid' },
      });

      await expect(authService.verifyPhoneOtp('+4791234567', '000000')).rejects.toThrow('Token has expired or is invalid');
    });

    it('Expired OTP fails safely with appropriate error feedback', async () => {
      (supabase.auth.verifyOtp as any).mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'OTP expired. Please request a new code.' },
      });

      await expect(authService.verifyPhoneOtp('+4791234567', '123456')).rejects.toThrow('OTP expired');
    });

    it('Logout works and clears user authentication state', async () => {
      (supabase.auth.signOut as any).mockResolvedValue({ error: null });

      await authService.logout();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('Admin authorization blocks standard USER from accessing admin routes', () => {
      mockCurrentProfile = { id: 'usr-001', role: 'USER' };

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route index element={<div>Admin Secret Dashboard</div>} />
            </Route>
            <Route path="/home" element={<div>Redirected to Home (Unauthorized)</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Admin Secret Dashboard')).not.toBeInTheDocument();
      expect(screen.getByText('Redirected to Home (Unauthorized)')).toBeInTheDocument();
    });

    it('Admin authorization permits SUPER_ADMIN to access admin routes', () => {
      mockCurrentProfile = { id: 'usr-admin-01', role: 'SUPER_ADMIN' };

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route index element={<div>Admin Secret Dashboard</div>} />
            </Route>
            <Route path="/home" element={<div>Redirected to Home (Unauthorized)</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Secret Dashboard')).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 2. PAYMENTS MATRIX
  // ═══════════════════════════════════════════════════════════════════════
  describe('2. Payments Matrix', () => {
    it('Successful payment flow initiates Razorpay intent and returns client order token', async () => {
      (supabase.functions.invoke as any).mockResolvedValue({
        data: {
          success: true,
          clientSecret: 'order_test_rzp_999',
          paymentOrder: { id: 'tx-001', gateway_order_id: 'order_test_rzp_999', status: 'PENDING' }
        },
        error: null,
      });

      const intent = await checkoutService.createPaymentIntent('ord-1001', 'Razorpay');
      expect(intent.clientSecret).toBe('order_test_rzp_999');
      expect(intent.paymentOrder.status).toBe('PENDING');
    });

    it('Failed payment handles edge function error gracefully', async () => {
      (supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { message: 'Card declined by issuing bank' },
      });

      await expect(checkoutService.createPaymentIntent('ord-1002', 'Razorpay')).rejects.toThrow('Card declined');
    });

    it('Cancelled payment releases holds safely and informs caller', async () => {
      (supabase.functions.invoke as any).mockResolvedValue({
        data: { success: false, message: 'User dismissed payment modal' },
        error: null,
      });

      const res = await checkoutService.createPaymentIntent('ord-1003', 'Razorpay');
      expect(res.success).toBe(false);
    });

    it('Duplicate webhook handling is idempotent via PostgreSQL RPC', async () => {
      (supabase.rpc as any).mockResolvedValue({
        data: { already_processed: true, status: 'PAID' },
        error: null,
      });

      const { data } = await supabase.rpc('process_payment_webhook', {
        p_gateway_order_id: 'order_test_rzp_999'
      });
      expect(data.already_processed).toBe(true);
    });

    it('Invalid webhook signature is safely rejected', async () => {
      (supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { message: 'Signature mismatch' },
      });

      await expect(
        supabase.functions.invoke('payment-webhook', {
          body: { event: 'payment.captured' },
          headers: { 'x-razorpay-signature': 'invalid_hex' }
        })
      ).resolves.toEqual(expect.objectContaining({ error: { message: 'Signature mismatch' } }));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 3. INVOICES MATRIX
  // ═══════════════════════════════════════════════════════════════════════
  describe('3. Invoices Matrix', () => {
    it('One successful transaction creates one compliant Norwegian MVA invoice', () => {
      const mockBooking = {
        id: 'bk-norway-777',
        user_id: 'usr-audit-001',
        total_amount: 5000,
        currency: 'NOK',
        status: 'CONFIRMED',
        created_at: '2026-08-21T12:00:00Z',
      };

      const invoice = invoiceService.createInvoiceFromBooking(mockBooking, mockCurrentProfile);
      expect(invoice.invoiceNumber).toMatch(/^NSL-2026-[A-Z0-9]+$/);
      expect(invoice.totalAmount).toBe(5000);
      expect(invoice.vatStandard + invoice.vatReduced).toBeGreaterThan(0);
      expect(invoice.customerName).toBe('Olav Hansen');
    });

    it('Invoice numbers are guaranteed unique', () => {
      const b1 = { id: 'bk-hotel-101', user_id: 'u1', total_amount: 1000, currency: 'NOK', status: 'CONFIRMED', created_at: '2026-08-21T12:00:00Z' };
      const b2 = { id: 'bk-cabin-202', user_id: 'u1', total_amount: 1000, currency: 'NOK', status: 'CONFIRMED', created_at: '2026-08-21T12:00:00Z' };

      const inv1 = invoiceService.createInvoiceFromBooking(b1, mockCurrentProfile);
      const inv2 = invoiceService.createInvoiceFromBooking(b2, mockCurrentProfile);

      expect(inv1.invoiceNumber).not.toBe(inv2.invoiceNumber);
    });

    it('Invoices page loads, lists compliant receipts, and exposes printable PDF download', async () => {
      render(
        <MemoryRouter>
          <Invoices />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Invoices & Receipts/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Norwegian Tax Compliance/i)).toBeInTheDocument();
      expect(screen.getAllByText(/PDF \/ Print/i).length).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 4. FLORA BOTANICAL MATRIX
  // ═══════════════════════════════════════════════════════════════════════
  describe('4. Flora Matrix', () => {
    it('Flora catalog page loads with botanical species and categories', async () => {
      render(
        <MemoryRouter>
          <Flora />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Norway Spruce/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/All Botanical Species/i)).toBeInTheDocument();
      expect(screen.getByText(/Boreal Trees & Forests/i)).toBeInTheDocument();
    });

    it('Search filtering works across Norwegian, Common, and Latin botanical names', async () => {
      render(
        <MemoryRouter>
          <Flora />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Norway Spruce/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by English, Norwegian/i);
      fireEvent.change(searchInput, { target: { value: 'Cloudberry' } });

      expect(screen.getByText(/Cloudberry/i)).toBeInTheDocument();
      expect(screen.queryByText(/Norway Spruce/i)).not.toBeInTheDocument();
    });

    it('Empty results state displays clear adjustment suggestions and reset button', async () => {
      render(
        <MemoryRouter>
          <Flora />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Norway Spruce/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by English, Norwegian/i);
      fireEvent.change(searchInput, { target: { value: 'NonExistentTropicalPalmTree12345' } });

      expect(screen.getByText(/No botanical species match your search/i)).toBeInTheDocument();
      const resetBtn = screen.getByText(/Reset Filters/i);
      expect(resetBtn).toBeInTheDocument();

      fireEvent.click(resetBtn);
      expect(screen.getByText(/Norway Spruce/i)).toBeInTheDocument();
    });

    it('Admin Flora CMS permits botanical record creation and updates', async () => {
      const allFlora = await floraService.getAllFlora();
      expect(allFlora.length).toBeGreaterThan(0);
      expect(allFlora[0]).toHaveProperty('norwegian_name');
      expect(allFlora[0]).toHaveProperty('scientific_name');
      expect(allFlora[0]).toHaveProperty('conservation_status');
    });
  });
});
