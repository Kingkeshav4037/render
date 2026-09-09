import { supabase } from '../lib/supabase';
import { CartItem } from '../store/useCartStore';

export const checkoutService = {
  async processCheckout(userId: string, items: CartItem[], currency: string = 'NOK') {
    const calculatedTotalAmount = items.reduce((sum, item) => {
      const price = Number(item.unit_price || (item as any).price || 0);
      const qty = Number(item.quantity || 1);
      return sum + (price * qty);
    }, 0);

    // 1. Prepare payload for RPC with explicit pricing amounts
    const payloadItems = items.map(item => {
      let cleanItemId = item.item_id;
      if (item.item_type === 'ACCOMMODATION' && typeof cleanItemId === 'string' && cleanItemId.includes('-room-')) {
        cleanItemId = cleanItemId.split('-room-')[0];
      }
      const itemPrice = Number(item.unit_price || (item as any).price || 0);
      const itemQty = Number(item.quantity || 1);
      const itemAmount = itemPrice * itemQty;

      return {
        item_type: item.item_type,
        item_id: cleanItemId,
        quantity: itemQty,
        description: item.name,
        start_time: item.start_time || null,
        end_time: item.end_time || null,
        pax: item.pax || 1,
        amount: itemAmount,
        price: itemPrice,
        unit_price: itemPrice,
      };
    });

    // 2. Call the RPC (backend creates order and bookings with valid amounts)
    const { data: orderId, error } = await supabase.rpc('process_checkout' as any, {
      p_user_id: userId,
      p_total_amount: calculatedTotalAmount,
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

