import { supabase } from '../../lib/supabase';
import type { TravelPreferences } from '../../types/profile';

export const travelPreferencesService = {
  async get(userId: string): Promise<TravelPreferences | null> {
    const { data, error } = await supabase
      .from('travel_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      preferredTripStyle: data.preferred_trip_style || [],
      budgetLevel: (data.budget_level as TravelPreferences['budgetLevel']) || 'moderate',
      preferredTripDuration: (data.preferred_trip_duration as TravelPreferences['preferredTripDuration']) || 'week',
      preferredDestinations: data.preferred_destinations || [],
      activityInterests: data.activity_interests || [],
      hikingDifficulty: (data.hiking_difficulty as TravelPreferences['hikingDifficulty']) || 'moderate',
      accessibilityRequirements: data.accessibility_requirements || [],
      travelCompanions: (data.travel_companions as TravelPreferences['travelCompanions']) || 'solo',
      childrenAges: data.children_ages || [],
      sustainabilityPriority: (data.sustainability_priority as TravelPreferences['sustainabilityPriority']) || 'moderate',
      preferredTravelPace: (data.preferred_travel_pace as TravelPreferences['preferredTravelPace']) || 'moderate',
      indoorOutdoorPreference: (data.indoor_outdoor_preference as TravelPreferences['indoorOutdoorPreference']) || 'both',
      photographyInterest: data.photography_interest || false,
      culturalInterest: (data.cultural_interest as TravelPreferences['culturalInterest']) || 'moderate',
      nightlifePreference: (data.nightlife_preference as TravelPreferences['nightlifePreference']) || 'low',
      adventureLevel: (data.adventure_level as TravelPreferences['adventureLevel']) || 'moderate',
    };
  },

  async upsert(userId: string, prefs: Partial<TravelPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.preferredTripStyle !== undefined) dbData.preferred_trip_style = prefs.preferredTripStyle;
    if (prefs.budgetLevel !== undefined) dbData.budget_level = prefs.budgetLevel;
    if (prefs.preferredTripDuration !== undefined) dbData.preferred_trip_duration = prefs.preferredTripDuration;
    if (prefs.preferredDestinations !== undefined) dbData.preferred_destinations = prefs.preferredDestinations;
    if (prefs.activityInterests !== undefined) dbData.activity_interests = prefs.activityInterests;
    if (prefs.hikingDifficulty !== undefined) dbData.hiking_difficulty = prefs.hikingDifficulty;
    if (prefs.accessibilityRequirements !== undefined) dbData.accessibility_requirements = prefs.accessibilityRequirements;
    if (prefs.travelCompanions !== undefined) dbData.travel_companions = prefs.travelCompanions;
    if (prefs.childrenAges !== undefined) dbData.children_ages = prefs.childrenAges;
    if (prefs.sustainabilityPriority !== undefined) dbData.sustainability_priority = prefs.sustainabilityPriority;
    if (prefs.preferredTravelPace !== undefined) dbData.preferred_travel_pace = prefs.preferredTravelPace;
    if (prefs.indoorOutdoorPreference !== undefined) dbData.indoor_outdoor_preference = prefs.indoorOutdoorPreference;
    if (prefs.photographyInterest !== undefined) dbData.photography_interest = prefs.photographyInterest;
    if (prefs.culturalInterest !== undefined) dbData.cultural_interest = prefs.culturalInterest;
    if (prefs.nightlifePreference !== undefined) dbData.nightlife_preference = prefs.nightlifePreference;
    if (prefs.adventureLevel !== undefined) dbData.adventure_level = prefs.adventureLevel;

    const { error } = await supabase
      .from('travel_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};
