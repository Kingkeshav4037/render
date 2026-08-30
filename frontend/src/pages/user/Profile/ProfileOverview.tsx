import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Camera, Mail, Phone, Globe, Edit2, Check, FileText, ArrowRight, X, MapPin, User as UserIcon, Upload, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../../store/useToastStore';
import { profileService } from '../../../services/profile/profileService';
import { motion, AnimatePresence } from 'framer-motion';
import { GENDER_OPTIONS, POPULAR_COUNTRIES, isProfileComplete } from '../../../types/profile';

export const ProfileOverview = () => {
  const { user, profile, refreshProfile } = useAuthStore();
  const [completion, setCompletion] = useState(80);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    gender: profile?.gender || '',
    dateOfBirth: profile?.dateOfBirth || '',
    address: profile?.address || '',
    city: profile?.city || 'Oslo',
    postalCode: profile?.postalCode || '',
    country: profile?.country || 'Norway',
    phone: profile?.phone || '',
    avatarUrl: profile?.avatarUrl || '',
    bio: (profile as any)?.bio || 'Exploring the fjords, peaks, and arctic wilderness of Norway.'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        city: profile.city || 'Oslo',
        postalCode: profile.postalCode || '',
        country: profile.country || 'Norway',
        phone: profile.phone || '',
        avatarUrl: profile.avatarUrl || '',
        bio: (profile as any)?.bio || 'Exploring the fjords, peaks, and arctic wilderness of Norway.'
      });
    }
  }, [profile]);

  // Completion calculation
  useEffect(() => {
    let score = 20; // baseline email
    if (formData.fullName) score += 15;
    if (formData.gender) score += 15;
    if (formData.dateOfBirth) score += 15;
    if (formData.address) score += 15;
    if (formData.country) score += 10;
    if (formData.phone) score += 5;
    if (formData.avatarUrl) score += 5;
    setCompletion(Math.min(score, 100));
  }, [formData]);

  const maxDobDate = new Date().toISOString().split('T')[0];

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image file exceeds the 2MB size limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        toast.info('Avatar preview updated. Click "Save Profile" to persist changes.');
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (user?.id) {
        await profileService.updateProfile(user.id, {
          fullName: formData.fullName.trim(),
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim(),
          phone: formData.phone.trim(),
          avatarUrl: formData.avatarUrl
        });
      }

      await refreshProfile();

      // Local storage backup
      localStorage.setItem('nsl_user_profile', JSON.stringify({
        ...formData,
        email: user?.email,
        updatedAt: new Date().toISOString()
      }));

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.warn('Profile save note:', err);
      localStorage.setItem('nsl_user_profile', JSON.stringify({
        ...formData,
        email: user?.email,
        updatedAt: new Date().toISOString()
      }));
      toast.success('Profile saved locally!');
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
            {formData.avatarUrl || profile?.avatarUrl ? (
              <img 
                src={formData.avatarUrl || profile?.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-gray-300 bg-slate-100">
                {formData.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-0 w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-aurora-green hover:text-navy-900 transition-colors opacity-90 group-hover:opacity-100 cursor-pointer"
            aria-label="Change profile photo"
          >
            <Camera size={16} />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-display font-bold text-navy-900">{formData.fullName || 'Traveler'}</h2>
            <span className="bg-aurora-green/20 text-navy-900 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
              Active Member
            </span>
          </div>
          <p className="text-gray-500 font-medium">{formData.city || 'Oslo'}, {formData.country || 'Norway'} • Member since 2026</p>
          <p className="text-sm text-gray-600 mt-2 max-w-xl">{formData.bio}</p>
        </div>
      </div>

      {/* Quick Action: Invoices & Tax Receipts */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="font-bold text-navy-900 text-base">Invoices & Tax Receipts (MVA)</h3>
            <p className="text-xs text-gray-500 mt-0.5">View and download your universal booking receipts and Norwegian tax invoices.</p>
          </div>
        </div>
        <Link 
          to="/user/invoices"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          View Invoices
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Completion Meter */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-navy-900">Profile Completion</span>
          <span className="text-aurora-green bg-navy-900 px-3 py-1 rounded-full text-xs">{completion}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-aurora-green h-full rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500">
          {completion === 100 
            ? 'Your traveler profile is fully complete! You have unrestricted access to all Nordic adventures and bookings.' 
            : 'Complete all traveler information (Gender, Date of Birth, Address, Country) for instant booking access and safety alerts.'}
        </p>
      </div>

      {/* Personal Info Grid */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-navy-900">Personal Information</h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-aurora-green transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Name</span>
            <p className="text-navy-900 font-medium">{formData.fullName || 'Not provided'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</span>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <p className="text-navy-900 font-medium">{user?.email || 'traveler@norwaysmartlife.local'}</p>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Check size={10} /> Verified
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gender</span>
            <p className="text-navy-900 font-medium">{formData.gender || 'Not specified'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date of Birth</span>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <p className="text-navy-900 font-medium">{formData.dateOfBirth || 'Not specified'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Street Address</span>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              <p className="text-navy-900 font-medium">{formData.address || 'Not provided'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">City & Postal Code</span>
            <p className="text-navy-900 font-medium">
              {formData.city || 'Oslo'}{formData.postalCode ? `, ${formData.postalCode}` : ''}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Country</span>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <p className="text-navy-900 font-medium">{formData.country || 'Norway'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Number</span>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <p className="text-navy-900 font-medium">{formData.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Traveler Bio</span>
            <p className="text-navy-900 font-medium text-sm leading-relaxed">{formData.bio || 'Exploring Norway’s majestic fjords and landscapes.'}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <Edit2 size={18} className="text-aurora-green" /> Edit Profile
                </h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar Uploader Section */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Profile Avatar
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200 shrink-0 flex items-center justify-center">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFileUpload}
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-aurora-green hover:text-navy-900 transition-colors cursor-pointer"
                        >
                          <Upload size={12} /> Upload Photo
                        </button>
                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">JPG, PNG, or WEBP (Max 2MB)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                      Or Image URL:
                    </label>
                    <input
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-xs"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                    placeholder="e.g. Henrik Ibsen"
                  />
                </div>

                {/* Gender and Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm bg-white"
                    >
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      max={maxDobDate}
                      min="1900-01-01"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                    placeholder="Karl Johans gate 1"
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                      placeholder="Oslo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                      placeholder="0154"
                    />
                  </div>
                </div>

                {/* Country and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm bg-white"
                    >
                      {POPULAR_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                      placeholder="+47 123 45 678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Traveler Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                    placeholder="Tell other travelers about your Nordic adventures..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-aurora-green hover:text-navy-900 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileOverview;
