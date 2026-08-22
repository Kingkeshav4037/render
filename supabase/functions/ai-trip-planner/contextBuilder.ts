import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!; // Ideally use service_role for bypassing RLS in edge function
// Using anon key requires passing the user's auth header down if we want RLS to apply.
// For RAG geographic queries, anon key is fine as public locations are readable.

const supabase = createClient(supabaseUrl, supabaseKey);

export async function buildContext(destination: string, budget: string, authHeader: string) {
  let context = "--- CONTEXT ---\n";

  // 1. We could fetch user profile here if we used the authHeader
  // Skipping full user profile for brevity in this initial implementation, 
  // but it's where Phase 4 integrates.

  // 2. We need to determine rough Lat/Lon of destination to fetch Candidates.
  // Hardcoding popular destinations for this example, but real app would use a Geocoder.
  const cities: Record<string, {lat: number, lon: number}> = {
    "oslo": {lat: 59.9139, lon: 10.7522},
    "bergen": {lat: 60.3913, lon: 5.3221},
    "tromso": {lat: 69.6492, lon: 18.9553},
    "tromsø": {lat: 69.6492, lon: 18.9553},
    "geiranger": {lat: 62.1015, lon: 7.2059}
  };

  const destKey = destination.toLowerCase().trim();
  const coords = cities[destKey] || cities["oslo"]; // default to Oslo

  // Fetch geographic candidates using Phase 10 RPC
  const { data: candidates, error } = await supabase.rpc('get_nearby_candidates', {
    p_lat: coords.lat,
    p_lon: coords.lon,
    p_radius_km: 50,
    p_limit: 30 // Give AI 30 good options to choose from
  });

  if (error) {
    console.error("Error fetching candidates:", error);
  }

  context += "\n[VERIFIED DATABASE LOCATIONS]\n";
  context += "You MUST ONLY use location_ids from this list. DO NOT hallucinate locations.\n";
  
  if (candidates) {
    candidates.forEach((c: any) => {
      context += `- ID: ${c.location_id} | Name: ${c.name} | Category: ${c.category} | Sub: ${c.subcategory} | Price: ${c.base_price_nok || 'Unknown'} NOK | Rating: ${c.average_rating || 'N/A'}\n`;
    });
  }

  // 3. Fetch Live Weather & Aurora (Phase 9 integration)
  // To avoid circular Edge Function calls, we might do it directly, 
  // or fetch from the API gateway if configured.
  // Mocking the context injection for brevity.
  context += "\n[LIVE WEATHER INTELLIGENCE]\n";
  context += `Current forecast for ${destination}: High likelihood of rain tomorrow. Recommend indoor activities if planning for tomorrow.\n`;

  if (coords.lat > 66) {
     context += "\n[LIVE AURORA INTELLIGENCE]\n";
     context += `Current Aurora Score for ${destination}: 85%. Excellent viewing conditions tonight. Recommend night activities.\n`;
  }

  return context;
}
