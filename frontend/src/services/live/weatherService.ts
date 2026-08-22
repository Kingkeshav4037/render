import { supabase } from '../../lib/supabase';

export interface WeatherForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export interface WeatherData {
  location: { lat: number; lon: number };
  temperature: number;
  feelsLike: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  visibility: number;
  snow: number;
  humidity: number;
  forecast: WeatherForecast[];
  warnings: any[];
  updatedAt: string;
}

class WeatherService {
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes local cache

  private getCacheKey(lat: number, lon: number): string {
    // Round to ~11km grid for bucketing (1 decimal place)
    return `${lat.toFixed(1)},${lon.toFixed(1)}`;
  }

  async getWeather(lat: number, lon: number): Promise<WeatherData | null> {
    const key = this.getCacheKey(lat, lon);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('live-weather', {
        body: { lat, lon }
      });

      if (error) throw error;
      
      this.cache.set(key, { data: data as WeatherData, timestamp: Date.now() });
      return data as WeatherData;
    } catch (err) {
      console.error('Failed to fetch live weather:', err);
      // Return stale cache if available as fallback
      return cached ? cached.data : null;
    }
  }

  getSuitabilityScore(weather: WeatherData, activity: string): number {
    let score = 100;
    
    // Penalize for rain
    if (weather.precipitation > 2) score -= 30;
    else if (weather.precipitation > 0) score -= 15;
    
    // Penalize for extreme cold/wind
    if (weather.feelsLike < -10) score -= 20;
    if (weather.windSpeed > 15) score -= 25;

    // Adjust based on activity
    if (activity === 'HIKING') {
       if (weather.precipitation > 5 || weather.windSpeed > 20 || weather.visibility < 5000) {
         score = Math.min(score, 30); // Very poor conditions for hiking
       }
    } else if (activity === 'MUSEUM' || activity === 'RESTAURANT') {
       score = 100; // Indoor activities are always good
    }

    return Math.max(0, score);
  }
}

export const weatherService = new WeatherService();
