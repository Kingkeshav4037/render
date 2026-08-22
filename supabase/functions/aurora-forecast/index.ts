import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate darkness based on latitude and day of year (simplified approximation)
function isDark(lat: number, date: Date): boolean {
  const month = date.getMonth();
  // Midnight Sun in Northern Norway (May 18 - Jul 25)
  if (lat > 66 && (month === 5 || month === 6)) return false;
  return true; // Simplified: Assume it gets dark eventually. Real implementation would use sunrise/sunset math.
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

    // 1. Fetch NOAA Planetary K-index (real data)
    let kpIndex = 2; // Default fallback
    try {
      const noaaResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
      if (noaaResponse.ok) {
        const data = await noaaResponse.json();
        // data format: [["time_tag", "Kp"], ["2026-08-17 12:00:00", "3.00"], ...]
        // Get the latest reading (last element)
        const latest = data[data.length - 1];
        if (latest && latest[1]) {
          kpIndex = parseFloat(latest[1]);
        }
      }
    } catch (e) {
      console.error("NOAA fetch failed, using fallback Kp:", e);
    }

    // 2. Fetch local cloud cover from MET Norway (real data)
    let cloudCover = 50; // Default 50%
    let visibility = 'GOOD';
    const userAgent = 'NorwaySmartLifeApp/5.0 (contact@norwaysmartlife.com)';
    try {
      const metResponse = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
        headers: { 'User-Agent': userAgent }
      });
      if (metResponse.ok) {
        const data = await metResponse.json();
        const current = data.properties.timeseries[0].data.instant.details;
        cloudCover = current.cloud_area_fraction || 0;
        if (current.fog_area_fraction > 20 || current.precipitation_amount > 2) {
            visibility = 'POOR';
        } else if (cloudCover > 80) {
            visibility = 'FAIR';
        } else {
            visibility = 'EXCELLENT';
        }
      }
    } catch (e) {
      console.error("MET Norway fetch failed, using fallback clouds:", e);
    }

    // 3. Calculate Aurora Viewing Score
    // Kp index: 0-9. Northern Norway (lat > 68) needs Kp 1-2. Southern Norway (lat 60) needs Kp 4-5.
    const isNorth = lat >= 67;
    let activityLevel = 'LOW';
    if (kpIndex >= 5) activityLevel = 'HIGH';
    else if (kpIndex >= 3) activityLevel = 'MEDIUM';
    else if (isNorth && kpIndex >= 2) activityLevel = 'MEDIUM'; // High latitude needs less Kp

    const darkness = isDark(lat, new Date()) ? 'EXCELLENT' : 'POOR';

    // Base score from Kp (0-100 scale)
    let score = (kpIndex / 9) * 100;
    if (isNorth) score += 30; // Boost for Northern Norway due to auroral oval

    // Penalty for clouds
    score = score * (1 - (cloudCover / 100));

    // Penalty for lack of darkness
    if (darkness === 'POOR') score = 0;

    // Cap at 100
    score = Math.min(100, Math.max(0, Math.round(score)));

    // Generate recommendation
    let recommendation = "Conditions are poor tonight.";
    if (score > 80) recommendation = "Excellent conditions! Head away from city lights.";
    else if (score > 50) recommendation = "Good chance of Aurora if the sky stays clear.";

    const auroraData = {
      location: { lat, lon },
      score: score,
      kpIndex: kpIndex,
      activity: activityLevel,
      cloudCover: cloudCover,
      visibility: visibility,
      darkness: darkness,
      recommendation: recommendation,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(auroraData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=900' // Cache for 15 minutes
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error('Aurora fetch error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
