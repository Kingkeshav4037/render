import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { edgeLogger } from '../_shared/logger.ts'
import { checkRateLimit } from '../_shared/rateLimiter.ts'
import { validateUUID, sanitizeString } from '../_shared/validator.ts'

// Razorpay signature verifier: HMAC SHA256 of order_id + "|" + payment_id
async function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify', 'sign']
  )

  const payload = `${orderId}|${paymentId}`
  const signatureData = encoder.encode(payload)
  const expectedSig = await crypto.subtle.sign('HMAC', key, signatureData)
  
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  return expectedHex === signature
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 30,
    windowMs: 60000,
    keyPrefix: 'verify-payment',
  });

  const responseHeaders = {
    ...corsHeaders,
    ...rateLimit.headers,
    'Content-Type': 'application/json',
  };

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ success: false, verified: false, message: 'Too many verification attempts. Please wait.' }),
      { status: 429, headers: responseHeaders }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Valid session required for payment verification');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized: Valid session required for payment verification')
    }

    const body = await req.json()
    const { orderId: rawOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!rawOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required payment verification parameters')
    }

    const orderId = validateUUID(rawOrderId, 'orderId');
    const sanitizedRazorpayOrderId = sanitizeString(razorpay_order_id, 100);
    const sanitizedRazorpayPaymentId = sanitizeString(razorpay_payment_id, 100);
    const sanitizedRazorpaySignature = sanitizeString(razorpay_signature, 100);

    const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || Deno.env.get('RAZORPAY_SECRET')
    if (!razorpaySecret) {
      edgeLogger.error('Missing RAZORPAY_KEY_SECRET on server');
      throw new Error('Payment configuration missing on server')
    }

    // 1. Verify cryptographic signature
    const isValid = await verifyRazorpayPaymentSignature(
      sanitizedRazorpayOrderId,
      sanitizedRazorpayPaymentId,
      sanitizedRazorpaySignature,
      razorpaySecret
    )

    if (!isValid) {
      edgeLogger.error('Payment signature verification failed', {
        orderId,
        sanitizedRazorpayOrderId,
        sanitizedRazorpayPaymentId
      });
      throw new Error('Payment signature verification failed. Fraud attempt logged.')
    }

    edgeLogger.operationalEvent('PAYMENT_SIGNATURE_VERIFIED', {
      orderId,
      razorpay_order_id: sanitizedRazorpayOrderId,
      razorpay_payment_id: sanitizedRazorpayPaymentId
    })

    // 2. Perform authoritative database transaction using Service Role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Idempotency check: Return immediately if already verified and successful
    const { data: existingTx } = await supabaseAdmin
      .from('payment_transactions')
      .select('status, order_id')
      .eq('gateway_order_id', sanitizedRazorpayOrderId)
      .maybeSingle()

    if (existingTx && existingTx.status === 'SUCCESS') {
      return new Response(JSON.stringify({ 
        success: true, 
        verified: true, 
        alreadyProcessed: true,
        orderId, 
        gatewayPaymentId: sanitizedRazorpayPaymentId 
      }), {
        status: 200,
        headers: responseHeaders,
      })
    }

    // Call atomic idempotent RPC
    const { data: success, error: rpcError } = await supabaseAdmin
      .rpc('process_payment_webhook', {
        p_gateway_order_id: sanitizedRazorpayOrderId
      })

    if (rpcError) {
      edgeLogger.error('Payment fulfillment RPC failed', rpcError, { orderId, sanitizedRazorpayOrderId })
      throw new Error(`Database transaction failed: ${rpcError.message}`)
    }

    // Also record gateway_payment_id on payment_transactions
    await supabaseAdmin
      .from('payment_transactions')
      .update({
        gateway_payment_id: sanitizedRazorpayPaymentId,
        status: 'SUCCESS',
        updated_at: new Date().toISOString()
      })
      .eq('gateway_order_id', sanitizedRazorpayOrderId)

    return new Response(JSON.stringify({ 
      success: true, 
      verified: true, 
      orderId, 
      gatewayPaymentId: sanitizedRazorpayPaymentId 
    }), {
      status: 200,
      headers: responseHeaders,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      verified: false, 
      message: error?.message || 'Payment verification failed' 
    }), {
      status: 400,
      headers: responseHeaders,
    })
  }
})
