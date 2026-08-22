import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

const MODES = ['Train', 'Bus', 'Ferry', 'Flight', 'Car Rental', 'EV Rental'];

export const TransportPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [modes, setModes] = useState<string[]>([]);
  const [priority, setPriority] = useState('balanced');
  const [drivingLicense, setDrivingLicense] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('transport_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setModes(data.preferred_modes || []);
        setPriority(data.priority || 'balanced');
        setDrivingLicense(data.driving_license || false);
      }
    });
  }, [userId]);

  const toggleMode = (mode: string) => {
    setDirty(true); setSaved(false);
    setModes(modes.includes(mode) ? modes.filter(m => m !== mode) : [...modes, mode]);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('transport_preferences').upsert({
      user_id: userId, preferred_modes: modes, priority, driving_license: drivingLicense, updated_at: new Date().toISOString()
    });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Transport Preferences</h2>
          <p className="text-gray-500">How do you prefer to get around?</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2">
          {saving ? 'Saving...' : saved ? '✓ Saved' : <><Save size={18} /> Save</>}
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Preferred Modes</h3>
          <div className="flex flex-wrap gap-3">
            {MODES.map(m => (
              <button key={m} onClick={() => toggleMode(m)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${modes.includes(m) ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-600'}`}>{m}</button>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Optimization Priority</h3>
          <select value={priority} onChange={(e) => { setPriority(e.target.value); setDirty(true); setSaved(false); }} className="w-full max-w-md p-4 bg-white rounded-xl text-navy-900 border border-gray-200 font-medium">
            <option value="speed">Fastest (Time Optimized)</option>
            <option value="balanced">Balanced</option>
            <option value="cost">Cheapest (Cost Optimized)</option>
            <option value="eco">Most Eco-Friendly (CO2 Optimized)</option>
            <option value="scenic">Most Scenic</option>
          </select>
        </section>

        <section className="flex items-center gap-3">
          <input type="checkbox" id="license" checked={drivingLicense} onChange={(e) => { setDrivingLicense(e.target.checked); setDirty(true); setSaved(false); }} className="w-5 h-5 rounded text-navy-900 focus:ring-navy-900" />
          <label htmlFor="license" className="font-bold text-navy-900">I have a valid driver's license for Norway</label>
        </section>
      </div>
    </div>
  );
};
