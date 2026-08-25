import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Compass, MapPin, Train, Zap, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '../../../components/shared/SEO';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

const STYLES = ['Adventure', 'Relaxed', 'Eco-Luxury', 'Cultural', 'Family', 'Solo Explorer', 'Photography'];
const INTERESTS = ['Fjords', 'Alpine Hiking', 'Aurora Borealis', 'Wildlife Safaris', 'Local Cuisine', 'Winter Sports', 'Coastal Ferries', 'Historic Stave Churches'];
const REGIONS = ['Western Fjords (Vestland)', 'Northern Norway & Arctic (Troms & Finnmark)', 'Lofoten & Nordland', 'Eastern Norway & Oslofjord', 'Central Mountains (Jotunheimen)', 'Southern Coast (Sørlandet)'];
const TRANSPORT_MODES = ['Scenic Electric Rail', 'Silent Electric Ferries', 'EV Road Trips', 'Express Coastal Boat'];
const TRAVEL_PACES = ['Relaxed & Immersive (1-2 places/day)', 'Balanced Adventure (2-3 places/day)', 'Active Expedition (Full-day pacing)'];

export const ProfilePreferences = () => {
  const { user } = useAuthStore();
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Adventure', 'Relaxed']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Fjords', 'Aurora Borealis', 'Local Cuisine']);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Western Fjords (Vestland)', 'Lofoten & Nordland']);
  const [selectedTransport, setSelectedTransport] = useState<string[]>(['Scenic Electric Rail', 'Silent Electric Ferries']);
  const [selectedPace, setSelectedPace] = useState<string>('Balanced Adventure (2-3 places/day)');
  
  const [accessibility, setAccessibility] = useState({
    reducedMotion: false,
    largerText: false,
    highContrast: false,
    stepFreeAccess: false
  });
  
  const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem('mock_offline_mode') === 'true');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const savedStr = localStorage.getItem('nsl_user_preferences');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (Array.isArray(saved.styles) && saved.styles.length > 0) setSelectedStyles(saved.styles);
        if (Array.isArray(saved.interests) && saved.interests.length > 0) setSelectedInterests(saved.interests);
        if (Array.isArray(saved.regions) && saved.regions.length > 0) setSelectedRegions(saved.regions);
        if (Array.isArray(saved.transport) && saved.transport.length > 0) setSelectedTransport(saved.transport);
        if (saved.pace && TRAVEL_PACES.includes(saved.pace)) setSelectedPace(saved.pace);
        if (saved.accessibility) setAccessibility(prev => ({ ...prev, ...saved.accessibility }));
      }
    } catch (err) {
      console.warn('Error reading user preferences:', err);
    }
  }, []);

  const toggleOfflineMode = (checked: boolean) => {
    setOfflineMode(checked);
    localStorage.setItem('mock_offline_mode', checked.toString());
    window.dispatchEvent(new Event('offlineModeToggled'));
    if (checked) {
      toast.success('Offline Travel Mode Enabled. Your digital wallet and itinerary are now cached.');
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        styles: selectedStyles,
        interests: selectedInterests,
        regions: selectedRegions,
        transport: selectedTransport,
        pace: selectedPace,
        accessibility,
        offlineMode,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to localStorage for instant local responsiveness & guests
      localStorage.setItem('nsl_user_preferences', JSON.stringify(payload));
      window.dispatchEvent(new Event('preferencesUpdated'));

      // 2. If authenticated, sync with Supabase profiles table
      if (user?.id) {
        try {
          await (supabase.from('profiles') as any)
            .update({
              travel_preferences: payload,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
        } catch (dbErr) {
          console.warn('Database preference sync warning (falling back to local):', dbErr);
        }
      }

      toast.success('Preferences saved successfully! Recommendations will now be tailored to your choices.');
    } catch (err) {
      toast.error('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <SEO 
        title="Travel Preferences | Norway SmartLife"
        description="Customize your travel styles, preferred regions, activities, and accessibility settings for smart itinerary planning."
      />

      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-8 rounded-3xl">
        <div className="flex items-center gap-2 text-aurora-green text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={16} /> Personalization Engine
        </div>
        <h2 className="text-3xl font-display font-bold mb-3">Travel Preferences & Interests</h2>
        <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
          Your saved preferences directly shape recommendation rankings, trip generation suggestions, and smart itinerary pacing across the platform.
        </p>
      </div>

      {/* Travel Style */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Travel Style</h3>
        <p className="text-xs text-gray-500">Select all styles that reflect your travel habits in Norway.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {STYLES.map(style => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-navy-900 text-white border-navy-900 shadow-md' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-navy-900'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </section>

      {/* Key Interests */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Key Interests & Highlights</h3>
        <p className="text-xs text-gray-500">Experiences you prioritize seeing during your stay.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {INTERESTS.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected 
                    ? 'bg-aurora-green/15 text-navy-900 border-aurora-green shadow-sm' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-aurora-green'
                }`}
              >
                {isSelected && <Check size={14} className="text-navy-900" />}
                {interest}
              </button>
            );
          })}
        </div>
      </section>

      {/* Preferred Regions */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" /> Preferred Norwegian Regions
        </h3>
        <p className="text-xs text-gray-500">Regions you are most interested in exploring.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {REGIONS.map(region => {
            const isSelected = selectedRegions.includes(region);
            return (
              <button
                key={region}
                onClick={() => toggleSelection(region, selectedRegions, setSelectedRegions)}
                className={`p-4 rounded-2xl text-sm font-bold text-left transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50/60 text-navy-900 border-blue-400 shadow-sm' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <span>{region}</span>
                {isSelected && <Check size={16} className="text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Preferred Transport Modes */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Train size={16} className="text-emerald-500" /> Preferred Clean Transport
        </h3>
        <p className="text-xs text-gray-500">Modes of travel you prefer across Norway's scenic transit network.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {TRANSPORT_MODES.map(mode => {
            const isSelected = selectedTransport.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => toggleSelection(mode, selectedTransport, setSelectedTransport)}
                className={`p-4 rounded-2xl text-sm font-bold text-left transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-50/60 text-navy-900 border-emerald-400 shadow-sm' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300'
                }`}
              >
                <span>{mode}</span>
                {isSelected && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Travel Pace */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Trip Pacing</h3>
        <div className="space-y-3 pt-2">
          {TRAVEL_PACES.map(pace => (
            <label 
              key={pace}
              onClick={() => setSelectedPace(pace)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPace === pace
                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm font-bold">{pace}</span>
              <input 
                type="radio" 
                name="travel_pace" 
                checked={selectedPace === pace} 
                onChange={() => setSelectedPace(pace)} 
                className="hidden" 
              />
              {selectedPace === pace && <Check size={16} className="text-aurora-green" />}
            </label>
          ))}
        </div>
      </section>

      {/* Accessibility Preferences */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Accessibility & Visual Aids</h3>
        <div className="space-y-3 max-w-lg pt-2">
          {Object.entries(accessibility).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="font-bold text-navy-900 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
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

      {/* Offline Travel Mode */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">System & Offline Preferences</h3>
        <label className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:shadow-sm transition-all max-w-lg">
          <div>
            <span className="font-bold text-navy-900 block text-sm mb-1">Offline Travel Mode</span>
            <span className="text-xs text-gray-500">Cache your digital wallet, transit tickets, and saved itineraries for mountain areas without cellular connectivity.</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${offlineMode ? 'bg-aurora-green' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${offlineMode ? 'translate-x-6' : ''}`} />
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={offlineMode}
            onChange={(e) => toggleOfflineMode(e.target.checked)}
          />
        </label>
      </section>

      <div className="pt-4">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-8 py-4 bg-navy-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-colors cursor-pointer shadow-xl flex items-center gap-2"
        >
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePreferences;
