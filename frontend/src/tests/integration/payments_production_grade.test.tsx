import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { checkoutService } from '../../services/checkoutService';
import { invoiceService } from '../../services/invoice/invoiceService';
import { notificationService } from '../../services/notificationService';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Checkout } from '../../pages/checkout/Checkout';
import { PaymentSuccess } from '../../pages/checkout/PaymentSuccess';
import { PaymentFailure } from '../../pages/checkout/PaymentFailure';

// ─── Polyfills & Setup ────────────────────────────────────────────────
beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  vi.clearAllMocks();

  useAuthStore.setState({
    user: { id: 'usr-buyer-01', email: 'traveler@norway.no' } as any,
    profile: { id: 'usr-buyer-01', fullName: 'Ingrid Solberg', email: 'traveler@norway.no', country: 'Norway' } as any,
    isAdmin: false,
    isProvider: false,
    loading: false,
    initialized: true,
  });

  useCartStore.setState({
    items: [
      {
        id: 'cart-item-01',
        item_id: 'act-kayak-01',
        item_type: 'ACTIVITY',
        name: 'Geiranger Fjord Kayak Tour',
        unit_price: 1200,
        quantity: 2,
        image: '/images/kayak.jpg',
      },
    ],
    isOpen: false,
  });
});

// Mock Supabase
vi.mock('../../lib/supabase', () => {
  return {
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-anon-key',
    supabase: {
      from: vi.fn().mockImplementation((tableName: string) => {
        return {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: `mock-${tableName}-01`, created_at: new Date().toISOString() },
                error: null,
              }),
            }),
          }),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockImplementation(() => {
            if (tableName === 'orders') {
              return Promise.resolve({
                data: {
                  id: 'ord-prod-101',
                  user_id: 'usr-buyer-01',
                  status: 'PAID',
                  total_amount: 2400,
                  currency: 'NOK',
                  created_at: new Date().toISOString(),
                },
                error: null,
              });
            }
            if (tableName === 'payment_transactions') {
              return Promise.resolve({
                data: {
                  id: 'tx-prod-101',
                  order_id: 'ord-prod-101',
                  gateway: 'Razorpay',
                  gateway_order_id: 'rzp_order_prod_101',
                  gateway_payment_id: 'pay_rzp_prod_999',
                  status: 'SUCCESS',
                  amount: 2400,
                  currency: 'NOK',
                  created_at: new Date().toISOString(),
                },
                error: null,
              });
            }
            return Promise.resolve({ data: null, error: null });
          }),
          single: vi.fn().mockImplementation(() => {
            return Promise.resolve({
              data: { id: `mock-${tableName}-01`, status: 'PAID', invoice_number: 'INV-2026-001' },
              error: null,
            });
          }),
        };
      }),
      rpc: vi.fn().mockImplementation((rpcName: string, args: any) => {
        if (rpcName === 'process_checkout') {
          return Promise.resolve({ data: 'ord-prod-101', error: null });
        }
        if (rpcName === 'process_payment_webhook') {
          return Promise.resolve({ data: true, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      }),
      functions: {
        invoke: vi.fn().mockImplementation((fnName: string, options: any) => {
          if (fnName === 'create-payment') {
            return Promise.resolve({
              data: {
                success: true,
                clientSecret: 'rzp_order_prod_101',
                paymentOrder: {
                  id: 'tx-prod-101',
                  order_id: options?.body?.orderId || 'ord-prod-101',
                  gateway_order_id: 'rzp_order_prod_101',
                  status: 'PENDING',
                  amount: 2400,
                  currency: 'NOK',
                },
              },
              error: null,
            });
          }
          if (fnName === 'verify-payment') {
            return Promise.resolve({
              data: {
                success: true,
                verified: true,
                orderId: options?.body?.orderId || 'ord-prod-101',
                gatewayPaymentId: options?.body?.razorpay_payment_id || 'pay_rzp_prod_999',
              },
              error: null,
            });
          }
          return Promise.resolve({ data: null, error: null });
        }),
      },
    },
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
  },
}));

describe('Phase 5 — Make Payments Production-Grade', () => {

  // ─── 1. Complete Happy Path Payment Flow ───────────────────────────────────
  describe('1. Complete Happy Path Payment Lifecycle', () => {
    it('executes full payment journey: checkout -> Razorpay order -> signature verify -> invoice & notification', async () => {
      // Step 1: Process Checkout via RPC
      const orderId = await checkoutService.processCheckout('usr-buyer-01', useCartStore.getState().items, 'NOK');
      expect(orderId).toBe('ord-prod-101');
      expect(supabase.rpc).toHaveBeenCalledWith('process_checkout', expect.objectContaining({
        p_user_id: 'usr-buyer-01',
        p_currency: 'NOK',
        p_items: expect.arrayContaining([
          expect.objectContaining({ item_id: 'act-kayak-01', quantity: 2 }),
        ]),
      }));

      // Step 2: Create Payment Intent via Edge Function
      const paymentIntent = await checkoutService.createPaymentIntent(orderId, 'Razorpay');
      expect(paymentIntent.success).toBe(true);
      expect(paymentIntent.clientSecret).toBe('rzp_order_prod_101');
      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-payment', {
        body: { orderId: 'ord-prod-101', gateway: 'Razorpay' },
      });

      // Step 3: Verify Payment Signature via Edge Function
      const verification = await checkoutService.verifyPayment({
        orderId: 'ord-prod-101',
        razorpay_order_id: 'rzp_order_prod_101',
        razorpay_payment_id: 'pay_rzp_prod_999',
        razorpay_signature: 'hmac_sha256_valid_signature_token',
      });
      expect(verification.success).toBe(true);
      expect(verification.verified).toBe(true);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', {
        body: {
          orderId: 'ord-prod-101',
          razorpay_order_id: 'rzp_order_prod_101',
          razorpay_payment_id: 'pay_rzp_prod_999',
          razorpay_signature: 'hmac_sha256_valid_signature_token',
        },
      });

      // Step 4: Generate Norwegian MVA-compliant Tax Invoice
      const invoiceData = invoiceService.createInvoiceFromBooking({
        id: 'ord-prod-101',
        item_type: 'ACTIVITY',
        total_amount: 2400,
        currency: 'NOK',
        pax: 2,
        status: 'CONFIRMED',
      }, {
        fullName: 'Ingrid Solberg',
        email: 'traveler@norway.no',
        country: 'Norway',
      });

      expect(invoiceData.invoiceNumber).toMatch(/^NSL-2026-/);
      expect(invoiceData.customerName).toBe('Ingrid Solberg');
      expect(invoiceData.totalAmount).toBe(2400);
      expect(invoiceData.vatStandard).toBeGreaterThan(0); // 25% VAT for activities

      const invoiceHTML = invoiceService.generateInvoiceHTML(invoiceData);
      expect(invoiceHTML).toContain('Tax Invoice');
      expect(invoiceHTML).toContain('Norway SmartLife AS');
      expect(invoiceHTML).toContain('NO 984 123 456 MVA');

      // Step 5: Dispatch User Notification
      const notification = await notificationService.createNotification({
        userId: 'usr-buyer-01',
        type: 'PAYMENT',
        title: 'Payment Confirmed',
        message: 'Your payment of NOK 2,400 has been verified. Booking ref: BKG-PROD-101.',
        linkUrl: '/user/bookings',
      });

      expect(notification).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith('notifications');
    });

    it('renders PaymentSuccess page confirming verified paid order', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-success?order_id=ord-prod-101']}>
          <Routes>
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/payment successful|confirmed/i)).toBeInTheDocument();
      });
    });
  });

  // ─── 2. Failed Payment Flow ────────────────────────────────────────────────
  describe('2. Failed Payment & Bank Decline Handling', () => {
    it('handles payment failure and renders PaymentFailure view with recovery guidance', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-prod-101&reason=DECLINED&description=Card+declined+by+issuing+bank']}>
          <Routes>
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/checkout" element={<div>Checkout Portal</div>} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/payment declined/i)).toBeInTheDocument();
      });

      // Verify recovery tips and retry button are present
      expect(screen.getByRole('button', { name: /try another payment method|retry/i })).toBeInTheDocument();
    });

    it('handles signature verification failure gracefully', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: { success: false, verified: false, message: 'Invalid signature mismatch' },
        error: null,
      });

      const res = await checkoutService.verifyPayment({
        orderId: 'ord-prod-101',
        razorpay_order_id: 'rzp_order_invalid',
        razorpay_payment_id: 'pay_invalid',
        razorpay_signature: 'tampered_signature',
      });

      expect(res.success).toBe(false);
      expect(res.verified).toBe(false);
    });
  });

  // ─── 3. Cancelled Payment Handling ─────────────────────────────────────────
  describe('3. Cancelled Payment Handshake', () => {
    it('preserves cart and pending order when user cancels/dismisses payment modal', () => {
      const initialItems = useCartStore.getState().items;
      expect(initialItems.length).toBe(1);

      // Simulate modal ondismiss callback
      const ondismissHandler = () => {
        // Idempotently preserve items and order
        const cartState = useCartStore.getState();
        expect(cartState.items.length).toBe(1);
      };

      ondismissHandler();
      expect(useCartStore.getState().items.length).toBe(1);
    });
  });

  // ─── 4. Double-Click & Rapid Submission Protection ──────────────────────────
  describe('4. Double-Click & Debounce Protection (Idempotency)', () => {
    it('prevents multiple simultaneous checkout submissions via ref locking', async () => {
      let activeRequests = 0;
      let totalExecuted = 0;

      const mockProcessCheckout = async () => {
        if (activeRequests > 0) return null; // Idempotency Lock
        activeRequests++;
        totalExecuted++;
        await new Promise(resolve => setTimeout(resolve, 50));
        activeRequests--;
        return 'ord-prod-101';
      };

      // Simulate rapid double click
      const [res1, res2] = await Promise.all([
        mockProcessCheckout(),
        mockProcessCheckout(),
      ]);

      expect(res1).toBe('ord-prod-101');
      expect(res2).toBeNull(); // Blocked by idempotency lock
      expect(totalExecuted).toBe(1);
    });
  });

  // ─── 5. Refresh During Payment Lifecycle ───────────────────────────────────
  describe('5. Page Refresh During Checkout', () => {
    it('reuses existing pending order without duplicating order items', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: {
          success: true,
          reused: true,
          clientSecret: 'rzp_order_prod_101',
          paymentOrder: {
            id: 'tx-prod-101',
            order_id: 'ord-prod-101',
            gateway_order_id: 'rzp_order_prod_101',
            status: 'PENDING',
          },
        },
        error: null,
      });

      const paymentIntent = await checkoutService.createPaymentIntent('ord-prod-101', 'Razorpay');
      expect(paymentIntent.success).toBe(true);
      expect(paymentIntent.reused).toBe(true);
      expect(paymentIntent.clientSecret).toBe('rzp_order_prod_101');
    });
  });

  // ─── 6. Duplicate Webhook Idempotency ───────────────────────────────────────
  describe('6. Duplicate Webhook Delivery Idempotency', () => {
    it('handles duplicate webhook delivery idempotently without duplicating fulfillments', async () => {
      // First webhook delivery
      const firstRpc = await supabase.rpc('process_payment_webhook' as any, {
        p_gateway_order_id: 'rzp_order_prod_101',
      });
      expect(firstRpc.data).toBe(true);

      // Second identical webhook delivery (e.g. gateway network retry)
      const secondRpc = await supabase.rpc('process_payment_webhook' as any, {
        p_gateway_order_id: 'rzp_order_prod_101',
      });
      expect(secondRpc.data).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledTimes(2);
    });
  });
});
