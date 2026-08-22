import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GeminiProvider } from "./aiProvider.ts";
import { buildContext } from "./contextBuilder.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, destination, budget, startDate, durationDays } = await req.json();

    if (!prompt || !destination) {
      throw new Error("Prompt and Destination are required.");
    }

    const authHeader = req.headers.get('Authorization') || '';

    // 1. Build RAG Context (Phase 2 Data + Phase 4 Profile + Phase 9 Live Data)
    const context = await buildContext(destination, budget, authHeader);

    // 2. Prepare System Prompt
    const systemPrompt = `You are the Norway SmartLife AI Travel Orchestrator.
Your job is to generate a personalized, day-by-day travel itinerary.

CRITICAL RULES:
1. You MUST output strict JSON adhering to the provided schema.
2. DO NOT hallucinate locations. You MUST ONLY use the 'location_id' UUIDs provided in the context below.
3. Respect the user's budget and live weather/aurora conditions provided in the context.

Expected JSON format:
{
  "title": "String",
  "description": "String",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "budget_nok": Number,
  "days": [
    {
      "day_number": Number,
      "date": "YYYY-MM-DD",
      "description": "String",
      "activities": [
         {
           "location_id": "UUID from context",
           "activity_title": "String matching activity name",
           "start_time": "YYYY-MM-DDTHH:MM:SSZ",
           "end_time": "YYYY-MM-DDTHH:MM:SSZ",
           "notes": "String"
         }
      ],
      "stays": [
         {
           "location_id": "UUID from context",
           "accommodation_name": "String matching accommodation name",
           "check_in": "YYYY-MM-DDTHH:MM:SSZ",
           "check_out": "YYYY-MM-DDTHH:MM:SSZ"
         }
      ],
      "segments": [
         {
           "start_location_id": "UUID from context",
           "end_location_id": "UUID from context",
           "start_time": "YYYY-MM-DDTHH:MM:SSZ",
           "end_time": "YYYY-MM-DDTHH:MM:SSZ",
           "transport_mode": "TRAIN | BUS | FERRY | FLIGHT | CAR"
         }
      ]
    }
  ]
}

${context}`;

    // 3. Initialize AI Provider
    const aiProvider = new GeminiProvider();

    // 4. Generate Trip (Force JSON)
    const rawOutput = await aiProvider.generateTrip(systemPrompt, prompt);

    // 5. Output Validation (Basic check)
    if (!rawOutput.title || !rawOutput.days) {
      throw new Error("AI generated malformed itinerary JSON.");
    }

    // In a production system, we would iterate through rawOutput.days[].items[] 
    // and verify that every location_id actually exists in the database.
    // If one fails, we either remove it or ask the LLM to regenerate.

    return new Response(
      JSON.stringify(rawOutput),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("AI Trip Planner Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
