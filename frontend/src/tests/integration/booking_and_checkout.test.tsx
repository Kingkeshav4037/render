/**
 * Integration Tests: Booking Creation & Checkout Process
 *
 * Verifies:
 * - Cart item transformation to process_checkout RPC payload format
 * - RPC checkout processing ensuring server-side pricing & order creation
 * - Edge Function createPaymentIntent invocation with payment gateway parameters
 * - Error handling for failed checkout or edge function payment gateway failures
 * - Multi-currency checkout payload integrity (NOK, EUR, USD, etc.)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkoutService } from '../../services/checkoutService';
import { supabase } from '../../lib/supabase';
import { CartItem } from '../../store/useCartStore';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'booking-uuid-1', status: 'CONFIRMED' },
            error: null,
          }),
        }),
      }),
    })),
  },
}));

describe('Integration Tests: Booking Creation & Checkout Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCartItems: CartItem[] = [
    {
      id: 'cart-1',
      item_type: 'ACCOMMODATION',
      item_id: 'stay-fjord-hotel',
      name: 'Geiranger Luxury Suite',
      unit_price: 2500,
      quantity: 2,
      start_time: '2026-09-01T14:00:00Z',
      end_time: '2026-09-03T11:00:00Z',
      pax: 2,
    },
    {
      id: 'cart-2',
      item_type: 'ACTIVITY',
      item_id: 'act-kayak-tour',
      name: 'Fjord Kayak Safari',
      unit_price: 750,
      quantity: 2,
      start_time: '2026-09-02T09:00:00Z',
      end_time: '2026-09-02T13:00:00Z',
      pax: 2,
    },
  ];

  // ─── 1. processCheckout Integration ────────────────────────────────────────
  describe('checkoutService.processCheckout', () => {
    it('transforms cart items and invokes process_checkout RPC with payload', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({
        data: 'order-uuid-999',
        error: null,
      });

      const orderId = await checkoutService.processCheckout('user-123', mockCartItems, 'NOK');

      expect(supabase.rpc).toHaveBeenCalledWith('process_checkout', {
        p_user_id: 'user-123',
        p_currency: 'NOK',
        p_items: [
          {
            item_type: 'ACCOMMODATION',
            item_id: 'stay-fjord-hotel',
            quantity: 2,
            description: 'Geiranger Luxury Suite',
            start_time: '2026-09-01T14:00:00Z',
            end_time: '2026-09-03T11:00:00Z',
            pax: 2,
          },
          {
            item_type: 'ACTIVITY',
            item_id: 'act-kayak-tour',
            quantity: 2,
            description: 'Fjord Kayak Safari',
            start_time: '2026-09-02T09:00:00Z',
            end_time: '2026-09-02T13:00:00Z',
            pax: 2,
          },
        ],
      });

      expect(orderId).toBe('order-uuid-999');
    });

    it('propagates database RPC errors when checkout transaction fails', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Inventory unavailable for dates' },
      });

      await expect(
        checkoutService.processCheckout('user-123', mockCartItems, 'NOK')
      ).rejects.toEqual({ message: 'Inventory unavailable for dates' });
    });

    it('passes requested currency to RPC properly (e.g. EUR)', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({
        data: 'order-eur-123',
        error: null,
      });

      const orderId = await checkoutService.processCheckout('user-123', mockCartItems, 'EUR');
      expect(orderId).toBe('order-eur-123');
      expect(supabase.rpc).toHaveBeenCalledWith(
        'process_checkout',
        expect.objectContaining({ p_currency: 'EUR' })
      );
    });
  });

  // ─── 2. createPaymentIntent Integration ────────────────────────────────────
  describe('checkoutService.createPaymentIntent', () => {
    it('invokes create-payment Edge Function with orderId and gateway', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: {
          clientSecret: 'pi_test_secret_123',
          gatewayOrderId: 'razorpay_order_456',
          amount: 6500,
          currency: 'NOK',
        },
        error: null,
      });

      const paymentData = await checkoutService.createPaymentIntent('order-uuid-999', 'Razorpay');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-payment', {
        body: { orderId: 'order-uuid-999', gateway: 'Razorpay' },
      });

      expect(paymentData.clientSecret).toBe('pi_test_secret_123');
      expect(paymentData.amount).toBe(6500);
    });

    it('throws error when Edge Function returns an error', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Payment gateway connection timed out' },
      });

      await expect(
        checkoutService.createPaymentIntent('order-uuid-999', 'Stripe')
      ).rejects.toEqual({ message: 'Payment gateway connection timed out' });
    });
  });
});
