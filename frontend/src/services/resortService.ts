import { supabase } from '../lib/supabase';

export interface SkiResort {
  id: string;
  name: string;
  region: string;
  lifts: number;
  slopes: number;
  snow_depth_cm: number;
  status: string;
  current_temp: number;
  image: string;
}

export const resortService = {
  getResortBySlug: async (slug: string): Promise<SkiResort | null> => {
    // 1. Fetch location by slug
    const { data: locData, error: locErr } = await supabase
      .from('locations')
      .select('id, name, region')
      .eq('slug', slug)
      .single();

    if (locErr || !locData) return null;

    // 2. Fetch ski_resort details using location_id
    const { data: resortData, error: resortErr } = await supabase
      .from('ski_resorts')
      .select('id, lifts, runs, content_media ( media_url, media_type )')
      .eq('location_id', locData.id)
      .single();

    if (resortErr || !resortData) return null;

    const resortDataAny = resortData as any;
    const heroImage = resortDataAny.content_media?.find((m: any) => m.media_type === 'HERO')?.media_url;
    const firstImage = resortDataAny.content_media?.[0]?.media_url;

    // Seasonal conditions engine (Norway winter season: Nov - May)
    const currentMonth = new Date().getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    const isWinterSeason = currentMonth >= 10 || currentMonth <= 4;
    
    // Altitude/latitude adjusted estimates
    const isNorthern = (locData.region || '').toLowerCase().includes('nord') || (locData.region || '').toLowerCase().includes('troms');
    const estimatedSnowDepth = isWinterSeason ? (isNorthern ? 165 : 120) : 15;
    const estimatedTemp = isWinterSeason ? (isNorthern ? -8 : -3) : 14;
    const resortStatus = isWinterSeason ? 'Open' : 'Summer Operations / Hiking';

    return {
      id: resortData.id,
      name: locData.name,
      region: locData.region || 'Norway',
      lifts: resortData.lifts || 6,
      slopes: resortData.runs || 14,
      snow_depth_cm: estimatedSnowDepth,
      status: resortStatus,
      current_temp: estimatedTemp,
      image: heroImage || firstImage || '/images/galdhopiggen_1786936412055.jpg'
    };
  }
};
