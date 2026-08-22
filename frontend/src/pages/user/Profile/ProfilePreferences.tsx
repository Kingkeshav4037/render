import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const STYLES = ['Luxury', 'Budget', 'Adventure', 'Relaxed', 'Family', 'Romantic', 'Solo', 'Cultural'];
const INTERESTS = ['Fjords', 'Hiking', 'Skiing', 'Aurora', 'Wildlife', 'Food', 'Culture', 'Photography', 'Shopping', 'Road trips'];

export const ProfilePreferences = () => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Adventure', 'Relaxed']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Fjords', 'Aurora', 'Food']);
  
  const [accessibility, setAccessibility] = useState({
    reducedMotion: false,
    largerText: false,
    highContrast: false
  });
  
  const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem('mock_offline_mode') === 'true');

  const toggleOfflineMode = (checked: boolean) => {
    setOfflineMode(checked);
    localStorage.setItem('mock_offline_mode', checked.toString());
    window.dispatchEvent(new Event('offlineModeToggled'));
    if (checked) {
      toast.success('Offline Travel Mode Enabled. Your wallet and itinerary are now cached.');
    } else {
      toast.info('Offline Travel Mode Disabled.');
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = () => {
    toast.success('Preferences updated successfully');
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Travel Preferences</h2>
        <p className="text-gray-500">We use this to curate your recommendations and smart suggestions.</p>
      </div>

      {/* Travel Style */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Your Travel Style</h3>
        <div className="flex flex-wrap gap-3">
          {STYLES.map(style => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
                  isSelected 
                    ? 'bg-navy-900 text-white border-navy-900 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-navy-900'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </section>

      {/* Interests */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Key Interests</h3>
        <div className="flex flex-wrap gap-3">
          {INTERESTS.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                  isSelected 
                    ? 'bg-aurora-green/10 text-navy-900 border-aurora-green' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-aurora-green'
                }`}
              >
                {isSelected && <Check size={14} className="text-aurora-green" />}
                {interest}
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Accessibility Preferences */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Accessibility</h3>
        <div className="space-y-4 max-w-lg">
          {Object.entries(accessibility).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="font-bold text-navy-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-aurora-green' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : ''}`} />
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={value}
                onChange={(e) => setAccessibility(prev => ({ ...prev, [key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* System Preferences */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">System Preferences</h3>
        <div className="space-y-4 max-w-lg">
          <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:shadow-sm transition-all">
            <div>
              <span className="font-bold text-navy-900 block mb-1">Offline Travel Mode</span>
              <span className="text-xs text-gray-500">Cache your Wallet and Itinerary for access without internet.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${offlineMode ? 'bg-aurora-green' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${offlineMode ? 'translate-x-6' : ''}`} />
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={offlineMode}
              onChange={(e) => toggleOfflineMode(e.target.checked)}
            />
          </label>
        </div>
      </section>

      <div className="pt-6">
        <button onClick={handleSave} className="px-8 py-4 bg-navy-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-navy-800 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
};
