import { supabase } from '../../lib/supabase';

export interface AuroraData {
  location: { lat: number; lon: number };
  score: number;
  kpIndex: number;
  activity: string;
  cloudCover: number;
  visibility: string;
  darkness: string;
  recommendation: string;
  timestamp: string;
}

class AuroraService {
  private cache: Map<string, { data: AuroraData; timestamp: number }> = new Map();
  private CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes local cache

  private getCacheKey(lat: number, lon: number): string {
    return `${lat.toFixed(1)},${lon.toFixed(1)}`;
  }

  async getAuroraForecast(lat: number, lon: number): Promise<AuroraData | null> {
    const key = this.getCacheKey(lat, lon);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('aurora-forecast', {
        body: { lat, lon }
      });

      if (error) throw error;
      
      this.cache.set(key, { data: data as AuroraData, timestamp: Date.now() });
      return data as AuroraData;
    } catch (err) {
      console.error('Failed to fetch aurora forecast:', err);
      return cached ? cached.data : null;
    }
  }
}

export const auroraService = new AuroraService();
