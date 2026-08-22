import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate "Feels Like" temperature using basic wind chill formula
function calculateFeelsLike(tempC: number, windSpeedMs: number): number {
  if (tempC > 10 || windSpeedMs < 1.3) return tempC; // Formula only applies <= 10C and > 1.3 m/s
  // Wind chill in Celsius
  const windKmh = windSpeedMs * 3.6;
  const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
  return Math.round(windChill * 10) / 10;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }

    const userAgent = 'NorwaySmartLifeApp/5.0 (contact@norwaysmartlife.com)';
    
    // Call MET Norway Locationforecast 2.0 API
    const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': userAgent,
      }
    });

    if (!response.ok) {
      throw new Error(`MET Norway API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract current weather from the timeseries
    const current = data.properties.timeseries[0].data.instant.details;
    const nextHour = data.properties.timeseries[0].data.next_1_hours;
    
    const condition = nextHour?.summary?.symbol_code || 'unknown';
    const precipitation = nextHour?.details?.precipitation_amount || 0;
    
    const temp = current.air_temperature;
    const windSpeed = current.wind_speed;

    // Create normalized Norway SmartLife Weather Object
    const normalizedWeather = {
      location: { lat, lon },
      temperature: temp,
      feelsLike: calculateFeelsLike(temp, windSpeed),
      condition: condition,
      precipitation: precipitation,
      windSpeed: windSpeed,
      windDirection: current.wind_from_direction,
      cloudCover: current.cloud_area_fraction || 0,
      visibility: 10000, // MET compact doesn't provide visibility, mock as good
      snow: condition.includes('snow') ? precipitation : 0,
      humidity: current.relative_humidity || 0,
      forecast: data.properties.timeseries.slice(1, 25).map((t: any) => ({
        time: t.time,
        temperature: t.data.instant.details.air_temperature,
        condition: t.data.next_1_hours?.summary?.symbol_code || 'unknown',
        precipitation: t.data.next_1_hours?.details?.precipitation_amount || 0
      })),
      warnings: [], // We'd call metalerts API for this in a full prod setup
      updatedAt: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(normalizedWeather),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error('Weather fetch error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
