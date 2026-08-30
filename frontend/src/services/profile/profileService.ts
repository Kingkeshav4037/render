// @ts-nocheck
import { supabase } from '../../lib/supabase';
import type { UserProfile, AppRole } from '../../types/profile';
import { normalizeRole, PROFILE_COMPLETION_WEIGHTS } from '../../types/profile';

export type { AppRole };

export interface UserProfileWithPermissions extends UserProfile {
  permissions?: string[];
}

export { type UserProfile };

export const profileService = {
  async getProfile(userId: string): Promise<UserProfileWithPermissions | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      const normalizedRole = normalizeRole(data.role);

      // Fetch profile
      const profileData: UserProfileWithPermissions = {
        id: data.id,
        email: data.email || '',
        fullName: data.full_name || '',
        avatarUrl: data.avatar_url || undefined,
        phone: data.phone || undefined,
        phoneVerified: data.phone_verified || Boolean(data.phone),
        country: data.country || undefined,
        city: data.city || undefined,
        address: data.address || undefined,
        postalCode: data.postal_code || undefined,
        dateOfBirth: data.date_of_birth || undefined,
        gender: data.gender || undefined,
        preferredLanguage: data.preferred_language || 'en',
        role: normalizedRole,
        permissions: [] as string[]
      };

      // If user is SUPER_ADMIN or ADMIN, grant global permissions automatically
      if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'ADMIN') {
        profileData.permissions = [
          'users.read', 'users.manage',
          'orders.read', 'orders.manage',
          'bookings.read', 'bookings.manage',
          'cms.read', 'cms.manage',
          'system.manage', 'analytics.read'
        ];
      }

      // Attempt to fetch granular permissions from Phase 10 RBAC tables
      try {
        const { data: perms } = await supabase.rpc('get_user_permissions', { p_user_id: userId });
        if (perms && Array.isArray(perms)) {
          const rbacPerms = perms.map((p: any) => p.name);
          profileData.permissions = Array.from(new Set([...(profileData.permissions || []), ...rbacPerms]));
        }
      } catch {
        // RBAC permissions optional or gracefully omitted
      }

      return profileData;
    } catch (err) {
      console.warn('Error fetching profile:', err);
      return null;
    }
  },

  async ensureProfileExists(userId: string, email: string, role: string = 'USER') {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) {
        const safeEmail = email || `${userId}@user.norwaysmartlife.local`;
        const { error } = await supabase.from('profiles').insert({ id: userId, email: safeEmail, role });
        if (error) {
          console.warn('Note during ensureProfileExists insert:', error.message);
        }
      }
    } catch (err) {
      console.warn('ensureProfileExists error:', err);
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile & { full_name?: string; preferences?: any }>) {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.fullName !== undefined || updates.full_name !== undefined)
      dbUpdates.full_name = updates.fullName ?? updates.full_name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.country !== undefined) dbUpdates.country = updates.country;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.postalCode !== undefined || (updates as any).postal_code !== undefined)
      dbUpdates.postal_code = updates.postalCode ?? (updates as any).postal_code;
    if (updates.dateOfBirth !== undefined || (updates as any).date_of_birth !== undefined)
      dbUpdates.date_of_birth = updates.dateOfBirth ?? (updates as any).date_of_birth;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.preferredLanguage !== undefined) dbUpdates.preferred_language = updates.preferredLanguage;
    if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences;

    // Remove undefined fields
    Object.keys(dbUpdates).forEach(
      (key) => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]
    );

    const { error } = await supabase.from('profiles').update(dbUpdates as any).eq('id', userId);
    if (error) throw error;
  },

  async updateTravelPreferences(userId: string, data: any) {
    const { error } = await supabase.from('travel_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async updateFoodPreferences(userId: string, data: any) {
    const { error } = await supabase.from('food_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async updateAccommodationPreferences(userId: string, data: any) {
    const { error } = await supabase.from('accommodation_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async updateTransportPreferences(userId: string, data: any) {
    const { error } = await supabase.from('transport_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async updateNotificationPreferences(userId: string, data: any) {
    const { error } = await supabase.from('notification_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async updatePrivacyPreferences(userId: string, data: any) {
    const { error } = await supabase.from('privacy_preferences').upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  // â”€â”€ Avatar Upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/profile.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Add cache-busting query param
    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    // Update profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl } as any)
      .eq('id', userId);

    if (updateError) throw updateError;

    return avatarUrl;
  },

  // â”€â”€ Deterministic Profile Completion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async getProfileCompletion(userId: string): Promise<{
    score: number;
    sections: Record<string, { filled: boolean; weight: number }>;
  }> {
    const [profile, travel, food, acc, trans, notif, emergency, privacy] = await Promise.all([
      this.getProfile(userId),
      supabase.from('travel_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('food_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('accommodation_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('transport_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('notification_preferences').select('*').eq('user_id', userId).single(),
      supabase.from('emergency_contacts').select('*').eq('user_id', userId).limit(1),
      supabase.from('privacy_preferences').select('*').eq('user_id', userId).single(),
    ]);

    const sections: Record<string, { filled: boolean; weight: number }> = {};
    let completedWeight = 0;
    const totalWeight = Object.values(PROFILE_COMPLETION_WEIGHTS).reduce((a, b) => a + b, 0);

    // Personal: fullName, phone, country, city, dateOfBirth, avatarUrl â€” need at least 3
    const personalFields = [
      profile?.fullName,
      profile?.phone,
      profile?.country,
      profile?.city,
      profile?.dateOfBirth,
      profile?.avatarUrl,
    ].filter(Boolean).length;
    sections.personal = {
      filled: personalFields >= 3,
      weight: PROFILE_COMPLETION_WEIGHTS.personal,
    };
    if (sections.personal.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.personal;

    // Travel: at least 1 trip_style, budget set, 2+ interests
    const travelData = travel.data;
    const travelFilled =
      travelData &&
      ((travelData as any).preferred_trip_style?.length > 0 ||
        (travelData as any).activity_interests?.length >= 2 ||
        (travelData as any).budget_level !== 'moderate');
    sections.travel = {
      filled: !!travelFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.travel,
    };
    if (sections.travel.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.travel;

    // Food: at least 1 diet OR allergy OR cuisine set
    const foodData = food.data;
    const foodFilled =
      foodData &&
      ((foodData as any).dietary_preferences?.length > 0 ||
        (foodData as any).allergies?.length > 0 ||
        (foodData as any).favorite_cuisines?.length > 0);
    sections.food = {
      filled: !!foodFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.food,
    };
    if (sections.food.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.food;

    // Accommodation: price range set, at least 1 type selected
    const accData = acc.data;
    const accFilled = accData && ((accData as any).preferred_types?.length > 0);
    sections.accommodation = {
      filled: !!accFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.accommodation,
    };
    if (sections.accommodation.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.accommodation;

    // Transport: at least 1 mode selected
    const transData = trans.data;
    const transFilled = transData && ((transData as any).preferred_modes?.length > 0);
    sections.transport = {
      filled: !!transFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.transport,
    };
    if (sections.transport.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.transport;

    // Notifications: at least 1 channel enabled for any event
    const notifFilled = !!notif.data;
    sections.notifications = {
      filled: notifFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.notifications,
    };
    if (sections.notifications.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.notifications;

    // Emergency: at least 1 contact
    const emergencyFilled = emergency.data && (emergency.data as any[]).length > 0;
    sections.emergency = {
      filled: !!emergencyFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.emergency,
    };
    if (sections.emergency.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.emergency;

    // Privacy: any non-default value
    const privacyData = privacy.data;
    const privacyFilled =
      privacyData &&
      ((privacyData as any).profile_visibility !== 'private' ||
        (privacyData as any).analytics_tracking === false ||
        (privacyData as any).personalized_recommendations === false);
    sections.privacy = {
      filled: !!privacyFilled,
      weight: PROFILE_COMPLETION_WEIGHTS.privacy,
    };
    if (sections.privacy.filled) completedWeight += PROFILE_COMPLETION_WEIGHTS.privacy;

    return {
      score: Math.round((completedWeight / totalWeight) * 100),
      sections,
    };
  },
};

