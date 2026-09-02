import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { checkRateLimit } from '../_shared/rateLimiter.ts'
import { validateUUID } from '../_shared/validator.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 20,
    windowMs: 60000,
    keyPrefix: 'create-payment',
  });

  const responseHeaders = {
    ...corsHeaders,
    ...rateLimit.headers,
    'Content-Type': 'application/json',
  };

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ success: false, message: 'Too many payment creation requests. Please try again shortly.' }),
      { status: 429, headers: responseHeaders }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Authentication required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const body = await req.json()
    const rawOrderId = body.orderId;
    const gateway = body.gateway || 'Razorpay';

    if (!rawOrderId) {
      throw new Error('Missing required parameter: orderId');
    }

    const orderId = validateUUID(rawOrderId, 'orderId');

    if (gateway !== 'Razorpay') {
      throw new Error('Invalid gateway. Only Razorpay is supported.')
    }

    // 1. Verify Order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found or access denied')
    }
    
    if (order.status !== 'PENDING_PAYMENT') {
      throw new Error('Order is not pending payment')
    }

    // Use Service Role to inspect and insert payment_transactions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Idempotency: Check if an active PENDING payment transaction already exists for this order
    const { data: existingPendingTx } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('order_id', order.id)
      .eq('status', 'PENDING')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingPendingTx && existingPendingTx.gateway_order_id) {
      return new Response(JSON.stringify({ 
        success: true, 
        paymentOrder: existingPendingTx, 
        clientSecret: existingPendingTx.gateway_order_id,
        reused: true
      }), {
        headers: responseHeaders,
      });
    }

    let gatewayOrderId = '';
    let clientSecret = '';
    
    // Amount is required to be in smallest currency unit (e.g. øre for NOK)
    const amountInSmallestUnit = Math.round(order.total_amount * 100); 

    if (gateway === 'Razorpay') {
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || Deno.env.get('RAZORPAY_SECRET');
      if (!razorpayKeyId || !razorpaySecret) throw new Error('Razorpay configuration missing on server');
      
      const basicAuth = btoa(`${razorpayKeyId}:${razorpaySecret}`);
      
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInSmallestUnit,
          currency: (order.currency || 'NOK').toUpperCase(),
          receipt: `receipt_${order.id.replace(/-/g, '').substring(0, 30)}`,
        }),
      });
      
      const razorpayData = await res.json();
      if (razorpayData.error) throw new Error(razorpayData.error.description);
      
      gatewayOrderId = razorpayData.id;
      clientSecret = razorpayData.id;
    }

    // 3. Create Payment Transaction
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15) // Match inventory hold

    const { data: paymentTx, error: txError } = await supabaseAdmin
      .from('payment_transactions')
      .insert({
        order_id: order.id,
        user_id: user.id,
        gateway: gateway,
        gateway_order_id: gatewayOrderId,
        amount: order.total_amount,
        currency: order.currency || 'NOK',
        status: 'PENDING',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()
      
    if (txError) throw txError

    return new Response(JSON.stringify({ 
      success: true, 
      paymentOrder: paymentTx, 
      clientSecret: clientSecret 
    }), {
      headers: responseHeaders,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 400,
      headers: responseHeaders,
    })
  }
})
