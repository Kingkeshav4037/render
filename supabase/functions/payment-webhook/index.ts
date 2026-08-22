import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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

  if (expectedHex !== sigHeader) throw new Error('Signature mismatch')
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const rawBody = await req.text()
    
    // Gateway routing
    let gatewayOrderId = '';
    
    const razorpaySig = req.headers.get('x-razorpay-signature')

    if (razorpaySig) {
      const endpointSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
      if (!endpointSecret) {
        throw new Error('RAZORPAY_WEBHOOK_SECRET missing, cannot verify signature.')
      }
      await verifyRazorpaySignature(rawBody, razorpaySig, endpointSecret)

      const event = JSON.parse(rawBody)
      if (event.event !== 'payment.captured') {
        return new Response(JSON.stringify({ received: true }), { status: 200 })
      }
      gatewayOrderId = event.payload.payment.entity.order_id
      
    } else {
      throw new Error('No supported webhook signature found')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Call RPC to handle the entire transaction atomically
    const { data: success, error: rpcError } = await supabaseAdmin
      .rpc('process_payment_webhook', {
        p_gateway_order_id: gatewayOrderId
      });
      
    if (rpcError) {
      throw new Error(`Webhook RPC failed: ${rpcError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
