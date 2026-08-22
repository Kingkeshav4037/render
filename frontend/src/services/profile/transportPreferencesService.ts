import { supabase } from '../../lib/supabase';
import type { TransportPreferences } from '../../types/profile';

export const transportPreferencesService = {
  async get(userId: string): Promise<TransportPreferences | null> {
    const { data, error } = await supabase
      .from('transport_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      preferredModes: data.preferred_modes || [],
      avoidModes: (data as any).avoid_modes || [],
      priority: (data.priority as TransportPreferences['priority']) || 'balanced',
      drivingLicense: data.driving_license || false,
      maxWalkingDistanceKm: (data as any).max_walking_distance_km ?? 2,
      maxTransferCount: (data as any).max_transfer_count ?? 3,
      rentalCarPreference: (data as any).rental_car_preference ?? false,
      evPreference: (data as any).ev_preference ?? false,
      scenicRoutePreference: (data as any).scenic_route_preference ?? false,
    };
  },

  async upsert(userId: string, prefs: Partial<TransportPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.preferredModes !== undefined) dbData.preferred_modes = prefs.preferredModes;
    if (prefs.avoidModes !== undefined) dbData.avoid_modes = prefs.avoidModes;
    if (prefs.priority !== undefined) dbData.priority = prefs.priority;
    if (prefs.drivingLicense !== undefined) dbData.driving_license = prefs.drivingLicense;
    if (prefs.maxWalkingDistanceKm !== undefined) dbData.max_walking_distance_km = prefs.maxWalkingDistanceKm;
    if (prefs.maxTransferCount !== undefined) dbData.max_transfer_count = prefs.maxTransferCount;
    if (prefs.rentalCarPreference !== undefined) dbData.rental_car_preference = prefs.rentalCarPreference;
    if (prefs.evPreference !== undefined) dbData.ev_preference = prefs.evPreference;
    if (prefs.scenicRoutePreference !== undefined) dbData.scenic_route_preference = prefs.scenicRoutePreference;

    const { error } = await supabase
      .from('transport_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};
