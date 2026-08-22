import { supabase } from '../../lib/supabase';
import type { AccommodationPreferences } from '../../types/profile';

export const accommodationPreferencesService = {
  async get(userId: string): Promise<AccommodationPreferences | null> {
    const { data, error } = await supabase
      .from('accommodation_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      preferredTypes: data.preferred_types || [],
      priceRange: (data.price_range as AccommodationPreferences['priceRange']) || 'moderate',
      priceMin: (data as any).price_min ?? undefined,
      priceMax: (data as any).price_max ?? undefined,
      currency: (data as any).currency || 'NOK',
      starRating: data.star_rating || 3,
      amenities: (data.amenities as Record<string, boolean>) || {},
      locationPreference: (data.location_preference as AccommodationPreferences['locationPreference']) || 'city_center',
      privateRoom: (data as any).private_room ?? true,
      breakfastRequired: (data as any).breakfast_required ?? false,
      cancellationPreference: ((data as any).cancellation_preference as AccommodationPreferences['cancellationPreference']) || 'flexible',
      accessibilityRequired: (data as any).accessibility_required ?? false,
      petFriendly: (data as any).pet_friendly ?? false,
      familyFriendly: (data as any).family_friendly ?? false,
      ecoCertified: (data as any).eco_certified ?? false,
      maxDistanceCenterKm: (data as any).max_distance_center_km ?? undefined,
      maxDistanceTransportKm: (data as any).max_distance_transport_km ?? undefined,
    };
  },

  async upsert(userId: string, prefs: Partial<AccommodationPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.preferredTypes !== undefined) dbData.preferred_types = prefs.preferredTypes;
    if (prefs.priceRange !== undefined) dbData.price_range = prefs.priceRange;
    if (prefs.priceMin !== undefined) dbData.price_min = prefs.priceMin;
    if (prefs.priceMax !== undefined) dbData.price_max = prefs.priceMax;
    if (prefs.currency !== undefined) dbData.currency = prefs.currency;
    if (prefs.starRating !== undefined) dbData.star_rating = prefs.starRating;
    if (prefs.amenities !== undefined) dbData.amenities = prefs.amenities;
    if (prefs.locationPreference !== undefined) dbData.location_preference = prefs.locationPreference;
    if (prefs.privateRoom !== undefined) dbData.private_room = prefs.privateRoom;
    if (prefs.breakfastRequired !== undefined) dbData.breakfast_required = prefs.breakfastRequired;
    if (prefs.cancellationPreference !== undefined) dbData.cancellation_preference = prefs.cancellationPreference;
    if (prefs.accessibilityRequired !== undefined) dbData.accessibility_required = prefs.accessibilityRequired;
    if (prefs.petFriendly !== undefined) dbData.pet_friendly = prefs.petFriendly;
    if (prefs.familyFriendly !== undefined) dbData.family_friendly = prefs.familyFriendly;
    if (prefs.ecoCertified !== undefined) dbData.eco_certified = prefs.ecoCertified;
    if (prefs.maxDistanceCenterKm !== undefined) dbData.max_distance_center_km = prefs.maxDistanceCenterKm;
    if (prefs.maxDistanceTransportKm !== undefined) dbData.max_distance_transport_km = prefs.maxDistanceTransportKm;

    const { error } = await supabase
      .from('accommodation_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};
