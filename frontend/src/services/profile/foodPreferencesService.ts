import { supabase } from '../../lib/supabase';
import type { FoodPreferences } from '../../types/profile';

export const foodPreferencesService = {
  async get(userId: string): Promise<FoodPreferences | null> {
    const { data, error } = await supabase
      .from('food_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      favoriteCuisines: data.favorite_cuisines || [],
      dietaryPreferences: data.dietary_preferences || [],
      allergies: data.allergies || [],
      foodDislikes: data.food_dislikes || [],
      seafoodPreference: (data.seafood_preference as FoodPreferences['seafoodPreference']) || 'neutral',
    };
  },

  async upsert(userId: string, prefs: Partial<FoodPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.favoriteCuisines !== undefined) dbData.favorite_cuisines = prefs.favoriteCuisines;
    if (prefs.dietaryPreferences !== undefined) dbData.dietary_preferences = prefs.dietaryPreferences;
    if (prefs.allergies !== undefined) dbData.allergies = prefs.allergies;
    if (prefs.foodDislikes !== undefined) dbData.food_dislikes = prefs.foodDislikes;
    if (prefs.seafoodPreference !== undefined) dbData.seafood_preference = prefs.seafoodPreference;

    const { error } = await supabase
      .from('food_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};
