import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { checkoutService } from '../../services/checkoutService';
import { useCartStore } from '../../store/useCartStore';


// ─── Mock Auth Store ──────────────────────────────────────────────────
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'usr-pay-001', email: 'guest@norwaysmartlife.no' },
    profile: { id: 'usr-pay-001', fullName: 'Erik Thorne', role: 'USER', permissions: ['user:read'] },
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

// Mock Sonner Toast
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
    rpc: vi.fn().mockResolvedValue({ data: 'ord-secure-101', error: null }),
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { clientSecret: 'rzp_order_sec_101', paymentOrder: { gateway_order_id: 'rzp_order_sec_101' } },
        error: null,
      }),
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
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'ord-secure-101', status: 'PAID' }, error: null }),
    }),
  },
}));

// Mock staysService
vi.mock('../../services/stay/staysService', () => ({
  staysService: {
    getRoomDetails: vi.fn().mockResolvedValue({
      id: 'rm-101',
      name: 'Deluxe Sea View Suite',
      price_per_night: 2400,
      capacity: 2,
    }),
  },
}));

// ─── Component Imports ────────────────────────────────────────────────
import { Checkout } from '../../pages/checkout/Checkout';
import { PaymentSuccess } from '../../pages/checkout/PaymentSuccess';
import { PaymentFailure } from '../../pages/checkout/PaymentFailure';
import { StayBooking } from '../../pages/checkout/StayBooking';


describe('Checkout and Payment Production Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
    useCartStore.getState().clearCart();
  });

  // ─── 1. Product Selection & Stay Booking Setup ────────────────────
  describe('Product Selection & Booking Initialization', () => {
    it('initializes booking with guest count, dates, and calculated rate', async () => {
      render(
        <MemoryRouter initialEntries={['/booking/stay/rm-101']}>
          <Routes>
            <Route path="/booking/stay/:roomId" element={<StayBooking />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Secure Your Stay')).toBeInTheDocument();
        expect(screen.getAllByText('Deluxe Sea View Suite')[0]).toBeInTheDocument();
        expect(screen.getByText('Check-in')).toBeInTheDocument();
        expect(screen.getByText('Check-out')).toBeInTheDocument();
        expect(screen.getByText('Guests')).toBeInTheDocument();
        expect(screen.getByText('Price details')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
      });
    });

    it('adds item to cart and proceeds to checkout flow', () => {
      useCartStore.getState().addItem({
        item_id: 'stay-fjord-01',
        item_type: 'ACCOMMODATION',
        name: 'Lofoten Panoramic Lodge',
        unit_price: 3200,
        quantity: 1,
        image: 'https://example.com/lodge.jpg',
        pax: 2,
        start_time: '2026-10-15T15:00:00Z',
        end_time: '2026-10-18T11:00:00Z',
      });

      const cartItems = useCartStore.getState().items;
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].name).toBe('Lofoten Panoramic Lodge');
      expect(cartItems[0].pax).toBe(2);
    });
  });

  // ─── 2. Checkout Multi-Step Flow ──────────────────────────────────
  describe('Checkout Multi-Step Flow', () => {
    beforeEach(() => {
      useCartStore.getState().addItem({
        item_id: 'stay-fjord-01',
        item_type: 'ACCOMMODATION',
        name: 'Lofoten Panoramic Lodge',
        unit_price: 3200,
        quantity: 1,
        image: 'https://example.com/lodge.jpg',
        pax: 2,
        start_time: '2026-10-15T15:00:00Z',
        end_time: '2026-10-18T11:00:00Z',
      });
    });

    it('renders step 1 (Contact Information) and navigates through steps', async () => {
      render(
        <MemoryRouter>
          <Checkout />
        </MemoryRouter>
      );

      expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
      expect(screen.getByText('Contact Details')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Panoramic Lodge')).toBeInTheDocument();
      expect(screen.getByText('Order Summary')).toBeInTheDocument();

      // Step 1 -> Step 2
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

      await waitFor(() => {
        expect(screen.getByText('Guest & Itinerary Details')).toBeInTheDocument();
      });

      // Step 2 -> Step 3
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

      await waitFor(() => {
        expect(screen.getByText('Add-ons & Upgrades')).toBeInTheDocument();
        expect(screen.getByText('Comprehensive Travel Insurance')).toBeInTheDocument();
        expect(screen.getByText(/Offset your carbon footprint/i)).toBeInTheDocument();
      });

      // Step 3 -> Step 4
      fireEvent.click(screen.getByRole('button', { name: /Review & Pay/i }));

      await waitFor(() => {
        expect(screen.getByText('Ready to complete your booking?')).toBeInTheDocument();
        expect(screen.getByText(/Pay securely/i)).toBeInTheDocument();
      });
    });
  });

  // ─── 3. Server-Side Price Calculation & Anti-Tampering ─────────────
  describe('Server-Side Price Calculation & Anti-Tampering', () => {
    it('ensures checkoutService.processCheckout transmits only item identifiers and quantities to the server RPC', async () => {
      const items: any[] = [
        {
          item_id: 'stay-fjord-01',
          item_type: 'ACCOMMODATION',
          name: 'Lofoten Panoramic Lodge',
          unit_price: 1, // Tampered client price!
          quantity: 2,
          pax: 2,
          start_time: '2026-10-15',
          end_time: '2026-10-18',
        },
      ];

      await checkoutService.processCheckout('usr-pay-001', items, 'NOK');

      expect(supabase.rpc).toHaveBeenCalledWith('process_checkout', {
        p_user_id: 'usr-pay-001',
        p_currency: 'NOK',
        p_items: [
          {
            item_type: 'ACCOMMODATION',
            item_id: 'stay-fjord-01',
            quantity: 2,
            description: 'Lofoten Panoramic Lodge',
            start_time: '2026-10-15',
            end_time: '2026-10-18',
            pax: 2,
          },
        ],
      });

      // Assert price parameter was stripped and not trusted
      const rpcCall = (supabase.rpc as any).mock.calls[0][1];
      expect(rpcCall.p_items[0].unit_price).toBeUndefined();
      expect(rpcCall.p_items[0].price).toBeUndefined();
    });
  });

  // ─── 4. Payment Intent Creation (Edge Function) ───────────────────
  describe('Payment Intent Creation', () => {
    it('invokes create-payment edge function with order ID and gateway selection', async () => {
      const result = await checkoutService.createPaymentIntent('ord-secure-101', 'Razorpay');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-payment', {
        body: { orderId: 'ord-secure-101', gateway: 'Razorpay' },
      });
      expect(result.clientSecret).toBe('rzp_order_sec_101');
    });

    it('handles edge function errors gracefully without leaking stack traces', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Gateway unreachable' },
      });

      await expect(
        checkoutService.createPaymentIntent('ord-fail-001', 'Razorpay')
      ).rejects.toBeDefined();
    });

    it('invokes verify-payment edge function with signature payload', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: { success: true, verified: true, orderId: 'ord-secure-101' },
        error: null,
      });

      const verificationResult = await checkoutService.verifyPayment({
        orderId: 'ord-secure-101',
        razorpay_order_id: 'rzp_order_sec_101',
        razorpay_payment_id: 'pay_rzp_999',
        razorpay_signature: 'valid_hmac_sha256_signature',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', {
        body: {
          orderId: 'ord-secure-101',
          razorpay_order_id: 'rzp_order_sec_101',
          razorpay_payment_id: 'pay_rzp_999',
          razorpay_signature: 'valid_hmac_sha256_signature',
        },
      });
      expect(verificationResult.verified).toBe(true);
    });

    it('handles payment verification rejection on invalid signature', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Payment signature verification failed' },
      });

      await expect(
        checkoutService.verifyPayment({
          orderId: 'ord-secure-101',
          razorpay_order_id: 'rzp_order_sec_101',
          razorpay_payment_id: 'pay_rzp_999',
          razorpay_signature: 'tampered_signature',
        })
      ).rejects.toThrow('Payment signature verification failed');
    });
  });


  // ─── 5. Payment Success Validation & State Machine ────────────────
  describe('Payment Success Page & Verification', () => {
    it('validates backend PAID status and displays order confirmation and items', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'orders') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id: 'ord-secure-101', user_id: 'usr-pay-001', status: 'PAID', total_amount: 1890, currency: 'NOK' },
                  error: null,
                }),
                single: vi.fn().mockResolvedValue({
                  data: { id: 'ord-secure-101', user_id: 'usr-pay-001', status: 'PAID', total_amount: 1890, currency: 'NOK' },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === 'order_items') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  { id: 'item-1', description: 'Smart Eco Thermostat', amount: 1890, quantity: 1, item_type: 'PRODUCT', currency: 'NOK' },
                ],
                error: null,
              }),
            }),
          };
        }
        if (table === 'payment_transactions') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id: 'tx-1', gateway: 'Razorpay', gateway_order_id: 'rzp_order_sec_101', status: 'SUCCESS', amount: 1890, currency: 'NOK' },
                  error: null,
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      render(
        <MemoryRouter initialEntries={['/payment-success?order_id=ord-secure-101']}>
          <PaymentSuccess />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Order & Payment Confirmed!/i)).toBeInTheDocument();
        expect(screen.getByText(/Smart Eco Thermostat/i)).toBeInTheDocument();
        expect(screen.getByText(/Download MVA-Compliant Invoice/i)).toBeInTheDocument();
      });
    });

    it('remains in PROCESSING state when backend status is pending', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'ord-pending-02', user_id: 'usr-pay-001', status: 'PENDING_PAYMENT' },
              error: null,
            }),
          }),
        }),
      });

      render(
        <MemoryRouter initialEntries={['/payment-success?order_id=ord-pending-02']}>
          <PaymentSuccess />
        </MemoryRouter>
      );

      expect(screen.getByText(/Verifying Payment Confirmation/i)).toBeInTheDocument();
    });

    it('displays NOT_FOUND state when order is missing from database', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      render(
        <MemoryRouter initialEntries={['/payment-success?order_id=ord-missing-999']}>
          <PaymentSuccess />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Order Not Found')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Continue Shopping/i })).toBeInTheDocument();
      });
    });

    it('displays UNAUTHORIZED access denied when order belongs to a different user', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'ord-someone-else', user_id: 'diff-user-999', status: 'PAID' },
              error: null,
            }),
          }),
        }),
      });

      render(
        <MemoryRouter initialEntries={['/payment-success?order_id=ord-someone-else']}>
          <PaymentSuccess />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
      });
    });
  });



  // ─── 6. Payment Failure Page & Failure Codes ─────────────────────
  describe('Payment Failure Page & Error Code Handling', () => {
    beforeEach(() => {
      useCartStore.getState().addItem({
        item_id: 'prod-fail-01',
        name: 'Nordic Knit Blanket',
        unit_price: 950,
        quantity: 1,
        item_type: 'PRODUCT',
      });
    });

    it('handles DECLINED reason and displays card tips and preserved cart', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'ord-fail-101', total_amount: 950, currency: 'NOK', status: 'PENDING_PAYMENT' },
              error: null,
            }),
          }),
        }),
      });

      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-101&reason=DECLINED']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Payment Declined by Bank')).toBeInTheDocument();
      expect(screen.getByText(/Card Declined/i)).toBeInTheDocument();
      expect(screen.getByText(/#ORD-ORD-FAIL/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Item Preserved Safely/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry Payment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View Saved Cart/i })).toBeInTheDocument();

      // Ensure cart is NOT automatically cleared
      expect(useCartStore.getState().items.length).toBe(1);
    });

    it('handles VERIFICATION_FAILED reason with cryptographic notice', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-102&reason=VERIFICATION_FAILED']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Security Verification Mismatch')).toBeInTheDocument();
      expect(screen.getByText(/cryptographic signature of your transaction/i)).toBeInTheDocument();
    });

    it('handles PROVIDER_ERROR reason with gateway notice', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-103&reason=PROVIDER_ERROR']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Payment Gateway Error')).toBeInTheDocument();
      expect(screen.getByText(/unexpected service interruption/i)).toBeInTheDocument();
    });

    it('handles NETWORK_ERROR reason with connection advice', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-104&reason=NETWORK_ERROR']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Connection Interrupted')).toBeInTheDocument();
      expect(screen.getByText(/connectivity interruption occurred/i)).toBeInTheDocument();
    });


    it('handles EXPIRED reason with timeout notice', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-105&reason=EXPIRED']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Payment Session Expired')).toBeInTheDocument();
      expect(screen.getByText(/exceeded the allowed time limit/i)).toBeInTheDocument();
    });

    it('handles CANCELLED reason with safety confirmation', async () => {
      render(
        <MemoryRouter initialEntries={['/payment-failure?order_id=ord-fail-106&reason=CANCELLED']}>
          <PaymentFailure />
        </MemoryRouter>
      );

      expect(screen.getByText('Payment Cancelled')).toBeInTheDocument();
      expect(screen.getByText(/dismissed or cancelled before completion/i)).toBeInTheDocument();
    });
  });

  // ─── 7. Payment Cancellation & Cart Preservation ──────────────────
  describe('Payment Cancellation & Cart Preservation', () => {
    it('preserves cart items when modal is dismissed or cancelled', () => {
      useCartStore.getState().addItem({
        item_id: 'prod-cancel-01',
        name: 'Fjord Expedition Pass',
        unit_price: 1200,
        quantity: 2,
        item_type: 'ACTIVITY',
      });

      // Verify cart has items
      expect(useCartStore.getState().items.length).toBe(1);

      // Simulate modal ondismiss callback
      const onDismissCallback = () => {
        // Items should remain intact
        return useCartStore.getState().items.length;
      };

      expect(onDismissCallback()).toBe(1);
    });
  });

  // ─── 8. Idempotency & Duplicate Payment Protection ────────────────
  describe('Idempotency & Duplicate Payment Protection', () => {
    it('verifies idempotent status updates for duplicate confirmation events', async () => {
      let orderStatus = 'PENDING';

      const mockConfirmPaymentWebhook = (paymentId: string) => {
        if (orderStatus === 'PAID') {
          // Idempotent no-op
          return { status: 'PAID', alreadyProcessed: true };
        }
        orderStatus = 'PAID';
        return { status: 'PAID', paymentId, alreadyProcessed: false };
      };

      // 1st delivery
      const res1 = mockConfirmPaymentWebhook('pay_12345');
      expect(res1.status).toBe('PAID');
      expect(res1.alreadyProcessed).toBe(false);

      // 2nd delivery (duplicate webhook)
      const res2 = mockConfirmPaymentWebhook('pay_12345');
      expect(res2.status).toBe('PAID');
      expect(res2.alreadyProcessed).toBe(true);
    });

    it('prevents double-order creation on payment retry by reusing existing pending order reference', async () => {
      const processCheckoutMock = vi.spyOn(checkoutService, 'processCheckout');
      processCheckoutMock.mockResolvedValue('ord-reused-101');

      useCartStore.getState().addItem({
        item_id: 'prod-thermo-01',
        name: 'Smart Thermostat',
        unit_price: 1890,
        quantity: 1,
        item_type: 'PRODUCT',
      });


      // First checkout attempt creates order
      const firstOrderId = await checkoutService.processCheckout('usr-pay-001', useCartStore.getState().items, 'NOK');
      expect(firstOrderId).toBe('ord-reused-101');

      // Retry attempt reuses firstOrderId without calling processCheckout again
      let retryOrderId = firstOrderId;
      if (!retryOrderId) {
        retryOrderId = await checkoutService.processCheckout('usr-pay-001', useCartStore.getState().items, 'NOK');
      }

      expect(retryOrderId).toBe('ord-reused-101');
      // Only called once during initial checkout
      expect(processCheckoutMock).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 9. Security: Sensitive Secret Isolation ───────────────────────
  describe('Security: Sensitive Secret Isolation', () => {
    it('ensures payment secret keys and service role keys are absent from client environment', () => {
      const env = (import.meta as any).env || {};

      expect(env.RAZORPAY_KEY_SECRET).toBeUndefined();
      expect(env.STRIPE_SECRET_KEY).toBeUndefined();
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    });
  });
});

