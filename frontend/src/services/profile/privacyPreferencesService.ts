// @ts-nocheck
import { supabase } from '../../lib/supabase';
import type { PrivacyPreferences } from '../../types/profile';

export const privacyPreferencesService = {
  async get(userId: string): Promise<PrivacyPreferences | null> {
    const { data, error } = await supabase
      .from('privacy_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      profileVisibility: (data.profile_visibility as PrivacyPreferences['profileVisibility']) || 'private',
      locationAccess: (data.location_access as PrivacyPreferences['locationAccess']) || 'denied',
      personalizedRecommendations: data.personalized_recommendations ?? true,
      analyticsTracking: data.analytics_tracking ?? true,
      locationHistory: (data as any).location_history ?? false,
      recommendationData: (data as any).recommendation_data ?? true,
      marketingCommunications: (data as any).marketing_communications ?? false,
      dataSharing: (data as any).data_sharing ?? false,
    };
  },

  async upsert(userId: string, prefs: Partial<PrivacyPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.profileVisibility !== undefined) dbData.profile_visibility = prefs.profileVisibility;
    if (prefs.locationAccess !== undefined) dbData.location_access = prefs.locationAccess;
    if (prefs.personalizedRecommendations !== undefined) dbData.personalized_recommendations = prefs.personalizedRecommendations;
    if (prefs.analyticsTracking !== undefined) dbData.analytics_tracking = prefs.analyticsTracking;
    if (prefs.locationHistory !== undefined) dbData.location_history = prefs.locationHistory;
    if (prefs.recommendationData !== undefined) dbData.recommendation_data = prefs.recommendationData;
    if (prefs.marketingCommunications !== undefined) dbData.marketing_communications = prefs.marketingCommunications;
    if (prefs.dataSharing !== undefined) dbData.data_sharing = prefs.dataSharing;

    const { error } = await supabase
      .from('privacy_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};

