// @ts-nocheck
import { supabase } from '../../lib/supabase';
import { PersonalizationContext } from '../../types/profile';

export const personalizationService = {
  /**
   * Generates the PersonalizationContext object (PRD Section 38 & 39)
   * This object aggregates all profile vectors into a normalized AI-ready context.
   */
  async getPersonalizationContext(userId: string): Promise<PersonalizationContext> {
    const [
      prefs,
      food,
      acc,
      trans,
      profile
    ] = await Promise.all([
      supabase.from('travel_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('food_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('accommodation_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('transport_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('profiles').select('preferred_language').eq('id', userId).single()
    ]);

    return {
      travelPreferences: (prefs.data as any) || {},
      foodPreferences: (food.data as any) || {},
      accommodationPreferences: (acc.data as any) || {},
      transportPreferences: (trans.data as any) || {},
      accessibilityNeeds: prefs.data?.accessibility_needs || [],
      preferredCurrency: prefs.data?.preferred_currency || 'NOK',
      language: profile.data?.preferred_language || 'en',
    } as unknown as PersonalizationContext;
  }
};

