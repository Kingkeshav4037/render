import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { edgeLogger } from '../_shared/logger.ts'
import { checkRateLimit } from '../_shared/rateLimiter.ts'

// Razorpay signature verifier
async function verifyRazorpaySignature(payload: string, sigHeader: string, secret: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify', 'sign']
  )

  const signatureData = encoder.encode(payload)
  const expectedSig = await crypto.subtle.sign('HMAC', key, signatureData)
  
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  if (expectedHex !== sigHeader) {
    edgeLogger.error('Razorpay webhook signature verification failed: signature mismatch');
    throw new Error('Signature mismatch');
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 100,
    windowMs: 60000,
    keyPrefix: 'webhook-razorpay',
  });

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { ...rateLimit.headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawBody = await req.text()
    let gatewayOrderId = '';
    const razorpaySig = req.headers.get('x-razorpay-signature')

    if (razorpaySig) {
      const endpointSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
      if (!endpointSecret) {
        edgeLogger.error('Missing RAZORPAY_WEBHOOK_SECRET environment variable');
        throw new Error('RAZORPAY_WEBHOOK_SECRET missing, cannot verify signature.')
      }
      await verifyRazorpaySignature(rawBody, razorpaySig, endpointSecret)

      const event = JSON.parse(rawBody)
      const eventType = event.event;
      
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = event.payload?.payment?.entity || {};
        gatewayOrderId = paymentEntity.order_id || event.payload?.order?.entity?.id || '';
        const paymentId = paymentEntity.id || '';

        if (!gatewayOrderId) {
          edgeLogger.warn('Webhook received capture event without gateway order id', event);
          return new Response(JSON.stringify({ received: true, error: 'Missing order_id in payload' }), { status: 200 });
        }
        
        edgeLogger.operationalEvent('WEBHOOK_PAYMENT_CAPTURED', {
          gateway: 'Razorpay',
          gatewayOrderId,
          paymentId,
          eventType
        });

        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Call RPC to handle the entire transaction atomically
        const { data: success, error: rpcError } = await supabaseAdmin
          .rpc('process_payment_webhook', {
            p_gateway_order_id: gatewayOrderId
          });
          
        if (rpcError) {
          edgeLogger.error('Webhook RPC database execution failed', rpcError, { gatewayOrderId });
          throw new Error(`Webhook RPC failed: ${rpcError.message}`);
        }

        if (paymentId) {
          await supabaseAdmin
            .from('payment_transactions')
            .update({
              gateway_payment_id: paymentId,
              status: 'SUCCESS',
              updated_at: new Date().toISOString()
            })
            .eq('gateway_order_id', gatewayOrderId);
        }

        edgeLogger.operationalEvent('WEBHOOK_PROCESSING_SUCCEEDED', {
          gatewayOrderId,
          success
        });

        return new Response(JSON.stringify({ success: true, received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });

      } else if (eventType === 'payment.failed') {
        const paymentEntity = event.payload?.payment?.entity || {};
        gatewayOrderId = paymentEntity.order_id || '';
        const paymentId = paymentEntity.id || '';
        const failReason = paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed';

        edgeLogger.warn('Webhook received payment.failed event', { gatewayOrderId, failReason });

        if (gatewayOrderId) {
          const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          );

          await supabaseAdmin
            .from('payment_transactions')
            .update({
              status: 'FAILED',
              gateway_payment_id: paymentId,
              updated_at: new Date().toISOString()
            })
            .eq('gateway_order_id', gatewayOrderId);
        }

        return new Response(JSON.stringify({ received: true, status: 'failed_recorded' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });

      } else {
        edgeLogger.info(`Ignoring non-payment event: ${eventType}`);
        return new Response(JSON.stringify({ received: true, ignored: true }), { status: 200 });
      }
    } else {
      edgeLogger.error('Rejected webhook: missing x-razorpay-signature header');
      throw new Error('No supported webhook signature found');
    }

  } catch (error: any) {
    edgeLogger.error('Webhook handling terminated with error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Webhook processing failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
