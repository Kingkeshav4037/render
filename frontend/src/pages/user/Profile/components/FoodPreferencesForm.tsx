import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

const CUISINES = ['Norwegian Traditional', 'Seafood', 'Nordic Fusion', 'Italian', 'Asian', 'International', 'Street Food'];
const DIETS = ['None', 'Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Halal'];

export const FoodPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('food_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setCuisines(data.favorite_cuisines || []);
        setDiets(data.dietary_preferences || []);
      }
    });
  }, [userId]);

  const toggleArr = (item: string, state: string[], setState: any) => {
    setDirty(true); setSaved(false);
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('food_preferences').upsert({
      user_id: userId, favorite_cuisines: cuisines, dietary_preferences: diets, updated_at: new Date().toISOString()
    });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Food & Dietary</h2>
          <p className="text-gray-500">Configure your culinary journey.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2">
          {saving ? 'Saving...' : saved ? '✓ Saved' : <><Save size={18} /> Save</>}
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Dietary Restrictions</h3>
          <div className="flex flex-wrap gap-3">
            {DIETS.map(d => (
              <button key={d} onClick={() => toggleArr(d, diets, setDiets)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${diets.includes(d) ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-600'}`}>{d}</button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Favorite Cuisines</h3>
          <div className="flex flex-wrap gap-3">
            {CUISINES.map(c => (
              <button key={c} onClick={() => toggleArr(c, cuisines, setCuisines)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${cuisines.includes(c) ? 'bg-aurora-green border-green-500 text-navy-900' : 'bg-white border-gray-200 text-gray-600'}`}>{c}</button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
