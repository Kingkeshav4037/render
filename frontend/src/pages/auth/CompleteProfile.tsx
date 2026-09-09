import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, MapPin, Globe, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { profileService } from '../../services/profile/profileService';
import { toast } from '../../store/useToastStore';
import { sanitizeRedirectUrl } from './Login';
import { GENDER_OPTIONS, POPULAR_COUNTRIES, isProfileComplete } from '../../types/profile';

export const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, refreshProfile, loading: authLoading } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const rawRedirect = searchParams.get('returnTo') || searchParams.get('redirect') || location.state?.returnTo || location.state?.from?.pathname;
  const targetRedirect = sanitizeRedirectUrl(rawRedirect);

  const [gender, setGender] = useState<string>(profile?.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.dateOfBirth || '');
  const [address, setAddress] = useState<string>(profile?.address || '');
  const [city, setCity] = useState<string>(profile?.city || 'Oslo');
  const [postalCode, setPostalCode] = useState<string>(profile?.postalCode || '');
  const [country, setCountry] = useState<string>(profile?.country || 'Norway');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const maxDobDate = new Date().toISOString().split('T')[0];

  // Populate state when profile loads
  useEffect(() => {
    if (profile) {
      if (profile.gender && !gender) setGender(profile.gender);
      if (profile.dateOfBirth && !dateOfBirth) setDateOfBirth(profile.dateOfBirth);
      if (profile.address && !address) setAddress(profile.address);
      if (profile.city && city === 'Oslo') setCity(profile.city);
      if (profile.postalCode && !postalCode) setPostalCode(profile.postalCode);
      if (profile.country && country === 'Norway') setCountry(profile.country);

      // If already complete, redirect to target immediately
      if (isProfileComplete(profile)) {
        navigate(targetRedirect, { replace: true });
      }
    }
  }, [profile, navigate, targetRedirect]);

  // If user is not authenticated at all, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?returnTo=${encodeURIComponent(targetRedirect)}`, { replace: true });
    }
  }, [user, authLoading, navigate, targetRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedAddress = address.trim();
    const trimmedCity = city.trim() || 'Oslo';
    const trimmedPostalCode = postalCode.trim();

    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    if (!dateOfBirth) {
      setError('Please provide your date of birth.');
      return;
    }

    const birthDateObj = new Date(dateOfBirth);
    const today = new Date();
    const minRealisticDate = new Date('1900-01-01');
    if (isNaN(birthDateObj.getTime()) || birthDateObj > today || birthDateObj < minRealisticDate) {
      setError('Please enter a realistic date of birth not in the future.');
      return;
    }

    if (!trimmedAddress) {
      setError('Please enter your street address.');
      return;
    }

    if (!country) {
      setError('Please select your country.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await profileService.updateProfile(user.id, {
        gender,
        dateOfBirth,
        address: trimmedAddress,
        city: trimmedCity,
        postalCode: trimmedPostalCode,
        country,
      });

      await refreshProfile();

      toast.success('Profile completed successfully! Welcome to Norway SmartLife.');
      navigate(targetRedirect, { replace: true });
    } catch (err: any) {
      console.warn('Profile completion error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.fullName || user?.user_metadata?.full_name || user?.email || 'Traveler';

  return (
    <AuthLayout
      title="Complete Your Profile"
      subtitle={`Welcome, ${displayName}! Please complete your traveler details to unlock personalized Norwegian journeys.`}
      bgImage="/images/lofoten_1787013505867.jpg"
    >
      <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Required Traveler Information</span>
          <span>We need your personal and location details to provide customized safety alerts, accurate bookings, and tailored travel recommendations.</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-sm text-center overflow-hidden"
              role="alert"
              aria-live="polite"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 1: Personal Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-snow/70">1. Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gender Selector */}
            <div>
              <label htmlFor="complete-gender" className="block text-[11px] font-semibold text-snow/70 mb-1">
                Gender
              </label>
              <select
                id="complete-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm"
              >
                <option value="" disabled className="bg-slate-900 text-snow/50">Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-snow">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="complete-dob" className="block text-[11px] font-semibold text-snow/70 mb-1">
                Date of Birth
              </label>
              <input
                id="complete-dob"
                type="date"
                max={maxDobDate}
                min="1900-01-01"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location Information */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-1 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-snow/70">2. Address & Location</span>
          </div>

          {/* Street Address */}
          <div className="relative group">
            <label htmlFor="complete-address" className="sr-only">Street Address</label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
            </div>
            <input
              id="complete-address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all text-xs sm:text-sm"
              placeholder="Street Address (e.g., Karl Johans gate 1)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* City / Postal Code */}
            <div className="grid grid-cols-2 gap-2">
              <input
                id="complete-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                id="complete-postal"
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            {/* Country Selector */}
            <div>
              <select
                id="complete-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name} className="bg-slate-900 text-snow">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] mt-6 cursor-pointer"
        >
          {saving ? 'Saving Profile...' : 'Save & Continue'}
          {!saving && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>
    </AuthLayout>
  );
};

export default CompleteProfile;
