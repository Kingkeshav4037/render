import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

const STAY_TYPES = ['Hotel', 'Cabin', 'Hostel', 'Resort', 'Apartment', 'Camping', 'Glamping'];
const LOCATIONS = ['City Center', 'Nature/Remote', 'Fjord View', 'Mountain', 'Coastal'];

export const StayPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [types, setTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('moderate');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('accommodation_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setTypes(data.preferred_types || []);
        if (data.location_preference) setLocations([data.location_preference]);
        setPriceRange(data.price_range || 'moderate');
      }
    });
  }, [userId]);

  const toggleType = (type: string) => {
    setDirty(true); setSaved(false);
    setTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('accommodation_preferences').upsert({
      user_id: userId,
      preferred_types: types,
      location_preference: locations[0] || 'city_center',
      price_range: priceRange,
      updated_at: new Date().toISOString()
    });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Stay Preferences</h2>
          <p className="text-gray-500">How do you prefer to rest in Norway?</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70">
          {saving ? 'Saving...' : saved ? '✓ Saved' : <><Save size={18} /> Save</>}
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Accommodation Types</h3>
          <div className="flex flex-wrap gap-3">
            {STAY_TYPES.map(type => (
              <button key={type} onClick={() => toggleType(type)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${types.includes(type) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>{type}</button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Budget Level</h3>
          <select value={priceRange} onChange={(e) => { setPriceRange(e.target.value); setDirty(true); setSaved(false); }} className="w-full max-w-md p-4 bg-white rounded-xl text-navy-900 border border-gray-200 font-medium">
            <option value="budget">Budget / Hostels</option>
            <option value="moderate">Moderate / Standard Hotels</option>
            <option value="luxury">Luxury / Premium</option>
          </select>
        </section>
      </div>
    </div>
  );
};
