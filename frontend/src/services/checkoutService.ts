import { supabase } from '../lib/supabase';
import { CartItem } from '../store/useCartStore';

export const checkoutService = {
  async processCheckout(userId: string, items: CartItem[], currency: string = 'NOK') {
    // 1. Prepare payload for RPC
    const payloadItems = items.map(item => ({
      item_type: item.item_type,
      item_id: item.item_id,
      quantity: item.quantity,
      description: item.name,
      start_time: item.start_time || null,
      end_time: item.end_time || null,
      pax: item.pax || 1
    }));

    // 2. Call the RPC (backend calculates total)
    const { data: orderId, error } = await supabase.rpc('process_checkout' as any, {
      p_user_id: userId,
      p_currency: currency,
      p_items: payloadItems
    });

    if (error) {
      console.error('Checkout failed:', error);
      throw error;
    }

    return orderId;
  },

  async createPaymentIntent(orderId: string, gateway: string = 'Razorpay') {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: { orderId, gateway }
    });

    if (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
    
    return data;
  },

  async verifyPayment(params: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: params
    });

    if (error) {
      console.error('Failed to verify payment with server:', error);
      throw error;
    }

    return data;
  }
};

