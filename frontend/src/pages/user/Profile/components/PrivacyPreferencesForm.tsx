import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

export const PrivacyPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [prefs, setPrefs] = useState({
    profile_visibility: 'private',
    share_activity: false,
    allow_recommendations: true,
    location_access: false,
    personalized_recommendations: true,
    analytics_tracking: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('privacy_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setPrefs({
          profile_visibility: data.profile_visibility || 'private',
          share_activity: data.share_activity || false,
          allow_recommendations: data.allow_recommendations ?? true,
          location_access: data.location_access || false,
          personalized_recommendations: data.personalized_recommendations ?? true,
          analytics_tracking: data.analytics_tracking || false
        });
      }
    });
  }, [userId]);

  const toggle = (key: keyof typeof prefs) => {
    if (typeof prefs[key] === 'boolean') {
      setDirty(true); setSaved(false);
      setPrefs(p => ({ ...p, [key]: !p[key] }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('privacy_preferences').upsert({
      user_id: userId, ...prefs, updated_at: new Date().toISOString()
    });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Privacy & Data</h2>
          <p className="text-gray-500">Control how your data is used.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2">
          {saving ? 'Saving...' : saved ? '✓ Saved' : <><Save size={18} /> Save</>}
        </button>
      </div>

      <div className="space-y-6">
        <ToggleItem label="Location Access" desc="Allow background location for live weather and transport routing" field="location_access" value={prefs.location_access} onToggle={toggle} />
        <ToggleItem label="Personalized AI Recommendations" desc="Allow AI to analyze preferences for trip building" field="personalized_recommendations" value={prefs.personalized_recommendations} onToggle={toggle} />
        <ToggleItem label="Share Activity" desc="Let friends see your upcoming public trips" field="share_activity" value={prefs.share_activity} onToggle={toggle} />
        <ToggleItem label="Analytics Tracking" desc="Help us improve by sharing anonymous usage data" field="analytics_tracking" value={prefs.analytics_tracking} onToggle={toggle} />
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
    <button onClick={() => onToggle(field)} className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-500' : 'bg-gray-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

