import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { startLat, startLon, endLat, endLon, mode = 'driving' } = await req.json();

    if (!startLat || !startLon || !endLat || !endLon) {
      throw new Error('Start and end coordinates are required');
    }

    // Call OSRM Public API
    // Modes in OSRM demo: driving, walking, cycling
    const osrmMode = ['driving', 'walking', 'cycling'].includes(mode) ? mode : 'driving';
    const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmMode}/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true`;
    
    const response = await fetch(osrmUrl);

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
       throw new Error('No route found');
    }

    const route = data.routes[0];

    // Normalize route response for Norway SmartLife
    const normalizedRoute = {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      geometry: route.geometry, // GeoJSON LineString
      steps: route.legs[0]?.steps || [],
      mode: osrmMode,
      elevation: 0, // Not provided by basic OSRM
      warnings: [],
      ferries: route.legs[0]?.steps?.filter((s: any) => s.maneuver.type === 'ferry' || s.maneuver.type === 'notification' && s.name.includes('ferry')) || [],
      tolls: [], // Requires premium provider
      chargingStops: [], // Requires premium provider
    };

    return new Response(
      JSON.stringify(normalizedRoute),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400' // Cache static routes for 24 hours
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error('Routing fetch error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
