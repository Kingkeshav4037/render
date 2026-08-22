import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types/profile';
import { profileService } from '../../../services/profile/profileService';
import { ProfileOverview } from './components/ProfileOverview';
import { TravelPreferencesForm } from './components/TravelPreferencesForm';
import { StayPreferencesForm } from './components/StayPreferencesForm';
import { FoodPreferencesForm } from './components/FoodPreferencesForm';
import { TransportPreferencesForm } from './components/TransportPreferencesForm';
import { NotificationPreferencesForm } from './components/NotificationPreferencesForm';
import { PrivacyPreferencesForm } from './components/PrivacyPreferencesForm';
import { SecurityForm } from './components/SecurityForm';
import { 
  User, Map, Utensils, Home, Car, Shield, 
  Bell, Lock, CreditCard, FileText, Settings 
} from 'lucide-react';

import { useAuthStore } from '../../../store/useAuthStore';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <User size={18} /> },
  { id: 'personal', label: 'Personal Information', icon: <Settings size={18} /> },
  { id: 'travel', label: 'Travel Preferences', icon: <Map size={18} /> },
  { id: 'food', label: 'Food & Dietary', icon: <Utensils size={18} /> },
  { id: 'accommodation', label: 'Accommodation', icon: <Home size={18} /> },
  { id: 'transport', label: 'Transport', icon: <Car size={18} /> },
  { id: 'security', label: 'Security & Login', icon: <Lock size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
  { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={18} /> },
  { id: 'documents', label: 'Travel Documents', icon: <FileText size={18} /> },
];

export const Profile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completionScore, setCompletionScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Unsaved changes simulation
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const data = await profileService.getProfile(user.id);
      const score = await profileService.getProfileCompletion(user.id);
      setProfile(data);
      setCompletionScore(score.score);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleTabChange = (tabId: string) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) return;
      setIsDirty(false);
    }
    setActiveTab(tabId);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't load your profile. This usually happens if your login session is stale after a database reset.</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => useAuthStore.getState().signOut()}
            className="px-6 py-2 bg-white text-navy-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">Smart Traveler Profile</h1>
          <p className="text-gray-500">Manage your identity and Norway SmartLife personalization.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-8">
              <nav className="space-y-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-navy-900 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[600px]">
              {activeTab === 'overview' && <ProfileOverview profile={profile} completionScore={completionScore} />}
              {activeTab === 'travel' && <TravelPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'accommodation' && <StayPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'food' && <FoodPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'transport' && <TransportPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'notifications' && <NotificationPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'privacy' && <PrivacyPreferencesForm userId={user?.id || ''} setDirty={setIsDirty} />}
              {activeTab === 'security' && <SecurityForm />}
              
              {['personal', 'payments', 'documents'].includes(activeTab) && (
                <div className="p-8 flex flex-col items-center justify-center text-center h-[500px] opacity-60">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Settings size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">Module Under Construction</h3>
                  <p className="max-w-sm text-gray-500">This section is part of the upcoming Phase 14 update.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
