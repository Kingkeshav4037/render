import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

export const NotificationPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [prefs, setPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    booking_updates: true,
    trip_reminders: true,
    weather_alerts: false,
    aurora_alerts: false,
    marketing: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('notification_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setPrefs({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
          sms_notifications: data.sms_notifications ?? false,
          booking_updates: data.booking_updates ?? true,
          trip_reminders: data.trip_reminders ?? true,
          weather_alerts: data.weather_alerts ?? false,
          aurora_alerts: data.aurora_alerts ?? false,
          marketing: data.marketing ?? false,
        });
      }
    });
  }, [userId]);

  const toggle = (key: keyof typeof prefs) => {
    setDirty(true); setSaved(false);
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('notification_preferences').upsert({
      user_id: userId, ...prefs, updated_at: new Date().toISOString()
    });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Notifications</h2>
          <p className="text-gray-500">Stay updated on your journey.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-navy-800 flex items-center gap-2">
          {saving ? 'Saving...' : saved ? '✓ Saved' : <><Save size={18} /> Save</>}
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-navy-900">Channels</h3>
        <ToggleItem label="Email Notifications" desc="Receive updates via email" field="email_notifications" value={prefs.email_notifications} onToggle={toggle} />
        <ToggleItem label="Push Notifications" desc="Receive updates on your device" field="push_notifications" value={prefs.push_notifications} onToggle={toggle} />
        <ToggleItem label="SMS Notifications" desc="Get critical alerts via text" field="sms_notifications" value={prefs.sms_notifications} onToggle={toggle} />
        
        <h3 className="text-lg font-bold text-navy-900 pt-4">Categories</h3>
        <ToggleItem label="Booking Updates" desc="Confirmations and changes" field="booking_updates" value={prefs.booking_updates} onToggle={toggle} />
        <ToggleItem label="Trip Reminders" desc="Upcoming itinerary alerts" field="trip_reminders" value={prefs.trip_reminders} onToggle={toggle} />
        <ToggleItem label="Weather Alerts" desc="Severe weather warnings" field="weather_alerts" value={prefs.weather_alerts} onToggle={toggle} />
        <ToggleItem label="Aurora Alerts" desc="Northern Lights activity nearby" field="aurora_alerts" value={prefs.aurora_alerts} onToggle={toggle} />
      </div>
    </div>
  );
};

interface ToggleItemProps {
  label: string;
  desc: string;
  field: any;
  value: boolean;
  onToggle: (field: any) => void;
}

const ToggleItem = ({ label, desc, field, value, onToggle }: ToggleItemProps) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div>
      <h4 className="font-bold text-navy-900">{label}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <button onClick={() => onToggle(field)} className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-aurora-green' : 'bg-gray-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

