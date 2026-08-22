// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save } from 'lucide-react';

interface Props {
  userId: string;
  setDirty: (dirty: boolean) => void;
}

const TRAVEL_STYLES = [
  'Luxury', 'Budget', 'Backpacking', 'Family', 'Romantic', 
  'Adventure', 'Nature', 'Wildlife', 'Culture', 'Food', 
  'Photography', 'Wellness', 'Business', 'Road Trip', 'Slow Travel'
];

const INTERESTS = [
  'Aurora', 'Fjords', 'Mountains', 'Hiking', 'Skiing', 'Fishing',
  'Camping', 'Cycling', 'Cruises', 'Architecture', 'History',
  'Museums', 'Shopping', 'Nightlife', 'Adventure Sports'
];

export const TravelPreferencesForm: React.FC<Props> = ({ userId, setDirty }) => {
  const [styles, setStyles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('travel_preferences').select('*').eq('user_id', userId).single().then(({ data }) => {
      if (data) {
        setStyles(data.travel_styles || []);
        setInterests(data.interests || []);
      }
    });
  }, [userId]);

  const toggleStyle = (style: string) => {
    setDirty(true);
    setSaved(false);
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const toggleInterest = (interest: string) => {
    setDirty(true);
    setSaved(false);
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('travel_preferences').upsert({
      user_id: userId,
      travel_styles: styles,
      interests: interests,
      updated_at: new Date().toISOString()
    });
    setSaving(false);
    setSaved(true);
    setDirty(false);
    
    // Auto-hide saved message
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Travel Preferences</h2>
          <p className="text-gray-500">Help our AI personalize your Norway experience.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
        >
          {saving ? 'Saving...' : saved ? 'âœ“ Saved' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Travel Style</h3>
          <div className="flex flex-wrap gap-3">
            {TRAVEL_STYLES.map(style => {
              const isSelected = styles.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Core Interests</h3>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map(interest => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                    isSelected 
                      ? 'bg-aurora-green border-green-500 text-navy-900 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

