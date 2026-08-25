import React, { useState, useEffect } from 'react';
import { Download, Trash2, ShieldCheck, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { toast } from '../../../store/useToastStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const ProfilePrivacy = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const [privacy, setPrivacy] = useState({
    marketing: false,
    personalization: true,
    analytics: true,
    aiPersonalization: true
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nsl_user_privacy');
      if (stored) {
        setPrivacy(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Privacy prefs load notice:', e);
    }
  }, []);

  const handleToggle = (key: keyof typeof privacy) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    localStorage.setItem('nsl_user_privacy', JSON.stringify(updated));
    
    if (user?.id) {
      (supabase.from('profiles') as any)
        .update({ privacy_settings: updated, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => toast.success('Privacy preferences updated.'))
        .catch(() => toast.success('Privacy preferences saved locally.'));
    } else {
      toast.success('Privacy preferences updated.');
    }
  };

  const handleExportData = () => {
    try {
      const tripsData = localStorage.getItem('nsl_user_saved_trips');
      const favoritesData = localStorage.getItem('nsl_user_favorites');
      const preferencesData = localStorage.getItem('nsl_user_preferences');
      const profileData = localStorage.getItem('nsl_user_profile');

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          email: user?.email,
          fullName: profile?.fullName,
          phone: profile?.phone,
          country: profile?.country,
          city: profile?.city
        },
        privacySettings: privacy,
        preferences: preferencesData ? JSON.parse(preferencesData) : {},
        savedFavorites: favoritesData ? JSON.parse(favoritesData) : [],
        plannedTrips: tripsData ? JSON.parse(tripsData) : [],
        profileOverview: profileData ? JSON.parse(profileData) : {}
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `norway_smartlife_data_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Your Norway SmartLife data export has been downloaded.');
    } catch (err) {
      console.error('Data export error:', err);
      toast.error('Failed to generate data export.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      if (user?.id) {
        await supabase.from('profiles').delete().eq('id', user.id);
      }
      localStorage.clear();
      await signOut();
      toast.success('Your account has been deleted.');
      navigate('/home');
    } catch (err: any) {
      console.warn('Delete account notice:', err);
      localStorage.clear();
      await signOut();
      toast.success('Account data cleared.');
      navigate('/home');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Privacy Center</h2>
        <p className="text-gray-500">Control GDPR compliance, AI telemetry, and personal travel data usage.</p>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Data Usage & Permissions</h3>
        <div className="space-y-4">
          
          <div 
            onClick={() => handleToggle('marketing')}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-all"
          >
            <div className="max-w-md">
              <span className="font-bold text-navy-900 block mb-1">Marketing Communications</span>
              <span className="text-sm text-gray-500 block">Receive curated travel deals, seasonal aurora alerts, and cultural stories via email.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${privacy.marketing ? 'bg-aurora-green' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy.marketing ? 'translate-x-6' : ''}`} />
            </div>
          </div>

          <div 
            onClick={() => handleToggle('aiPersonalization')}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-all"
          >
            <div className="max-w-md">
              <span className="font-bold text-navy-900 block mb-1">AI Recommendation Engine</span>
              <span className="text-sm text-gray-500 block">Allow our Nordic travel engine to tailor destinations and fjord routes to your style.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${privacy.aiPersonalization ? 'bg-aurora-green' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy.aiPersonalization ? 'translate-x-6' : ''}`} />
            </div>
          </div>

          <div 
            onClick={() => handleToggle('analytics')}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-all"
          >
            <div className="max-w-md">
              <span className="font-bold text-navy-900 block mb-1">Anonymous Analytics & Telemetry</span>
              <span className="text-sm text-gray-500 block">Help improve Norway SmartLife route navigation and trail maps through anonymized metrics.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${privacy.analytics ? 'bg-aurora-green' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy.analytics ? 'translate-x-6' : ''}`} />
            </div>
          </div>

        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Data Management & GDPR</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-navy-900 mb-4">
                <Download size={18} />
              </div>
              <h4 className="font-bold text-navy-900 mb-2">Export Data (JSON)</h4>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                Download a complete, machine-readable export of your planned trips, saved bookmarks, preferences, and profile.
              </p>
            </div>
            <button 
              onClick={handleExportData} 
              className="w-full py-3 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              Download Export (.json)
            </button>
          </div>
          
          <div className="p-6 border border-red-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <Trash2 size={18} />
              </div>
              <h4 className="font-bold text-red-600 mb-2">Delete Account</h4>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                Permanently purge your account, itinerary history, travel preferences, and saved favorites.
              </p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-night/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-red-100"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-500" /> Confirm Deletion
                </h3>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                This action is irreversible. All your custom trip itineraries, saved destinations, reviews, and profile data will be permanently wiped.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Type <span className="text-red-600 font-black">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Purging...' : 'Permanently Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
