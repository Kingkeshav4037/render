import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

interface NotificationPayload {
  userId: string;
  type: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
  title: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: NotificationPayload = await req.json()
    const { userId, type, title, message } = payload

    if (!userId || !type || !title || !message) {
      throw new Error("Missing required notification payload fields.");
    }

    // 1. Insert into the database for IN_APP consumption
    const { error: dbError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        is_read: false
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw dbError;
    }

    // 2. Mock external dispatch logic
    if (type === 'EMAIL') {
      console.log(`[EXTERNAL DISPATCH MOCK] Sending EMAIL to User UUID ${userId} via Resend/SendGrid:`);
      console.log(`Title: ${title}\nMessage: ${message}`);
    } else if (type === 'SMS') {
      console.log(`[EXTERNAL DISPATCH MOCK] Sending SMS to User UUID ${userId} via Twilio:`);
      console.log(`Message: ${title} - ${message}`);
    } else if (type === 'PUSH') {
      console.log(`[EXTERNAL DISPATCH MOCK] Sending PUSH to User UUID ${userId} via FCM:`);
      console.log(`Push Alert: ${title}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: `Notification of type ${type} dispatched.` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Notification Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
