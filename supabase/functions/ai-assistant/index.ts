import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";
import { sanitizeString } from "../_shared/validator.ts";
import { edgeLogger } from "../_shared/logger.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'anonymous';
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 30,
    windowMs: 60000,
    keyPrefix: 'ai-assistant',
  });

  const responseHeaders = {
    ...corsHeaders,
    ...rateLimit.headers,
    'Content-Type': 'application/json',
  };

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Too many requests. Please wait a moment before sending another message.' 
      }),
      { status: 429, headers: responseHeaders }
    );
  }

  try {
    const body = await req.json();
    const rawMessage = body.message || body.prompt || '';
    const userMessage = sanitizeString(rawMessage, 1000);

    if (!userMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'A message prompt is required.' }),
        { status: 400, headers: responseHeaders }
      );
    }

    const isTransactionalIntent = /book|buy|reserve|order|checkout|payment/i.test(userMessage);

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      edgeLogger.warn('GEMINI_API_KEY missing in Edge Function secrets, returning mock guidance');
      return new Response(
        JSON.stringify({
          success: true,
          content: isTransactionalIntent
            ? "I can help you with that booking. Please review the details before proceeding to payment."
            : `Hei! Norway is renowned for its fjords, mountains, and northern lights. You asked: "${userMessage}". How else can I assist your journey?`,
          isTransaction: isTransactionalIntent,
        }),
        { status: 200, headers: responseHeaders }
      );
    }

    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a premium, knowledgeable travel assistant for "Norway SmartLife".
Keep answers concise, inspiring, practical, and strictly focused on sustainable travel, cuisine, transport, weather, and destinations across Norway.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      edgeLogger.error('Gemini API call failed', errBody);
      throw new Error(`AI Provider response status: ${response.status}`);
    }

    const geminiData = await response.json();
    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('AI returned an empty response.');
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: replyText,
        isTransaction: isTransactionalIntent,
      }),
      { status: 200, headers: responseHeaders }
    );

  } catch (error: any) {
    edgeLogger.error('AI Assistant Edge Function error', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process AI assistant request.',
      }),
      { status: 500, headers: responseHeaders }
    );
  }
});
