import { supabase } from '../../lib/supabase';
import type { NotificationPreferences, NotificationChannel } from '../../types/profile';

const DEFAULT_CHANNEL: NotificationChannel = { email: false, push: false, sms: false };

function parseChannel(raw: unknown): NotificationChannel {
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      email: Boolean(obj.email),
      push: Boolean(obj.push),
      sms: Boolean(obj.sms),
    };
  }
  return { ...DEFAULT_CHANNEL };
}

export const notificationPreferencesService = {
  async get(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      bookingUpdates: parseChannel(data.booking_updates),
      tripReminders: parseChannel(data.trip_reminders),
      weatherAlerts: parseChannel(data.weather_alerts),
      auroraAlerts: parseChannel(data.aurora_alerts),
      safetyAlerts: parseChannel((data as any).safety_alerts),
      marketing: parseChannel(data.marketing),
    };
  },

  async upsert(userId: string, prefs: Partial<NotificationPreferences>): Promise<void> {
    const dbData: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };

    if (prefs.bookingUpdates !== undefined) dbData.booking_updates = prefs.bookingUpdates;
    if (prefs.tripReminders !== undefined) dbData.trip_reminders = prefs.tripReminders;
    if (prefs.weatherAlerts !== undefined) dbData.weather_alerts = prefs.weatherAlerts;
    if (prefs.auroraAlerts !== undefined) dbData.aurora_alerts = prefs.auroraAlerts;
    if (prefs.safetyAlerts !== undefined) dbData.safety_alerts = prefs.safetyAlerts;
    if (prefs.marketing !== undefined) dbData.marketing = prefs.marketing;

    const { error } = await supabase
      .from('notification_preferences')
      .upsert(dbData as any, { onConflict: 'user_id' });

    if (error) throw error;
  },
};
