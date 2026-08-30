import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, MapPin, Sparkles } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { toast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import { sanitizeRedirectUrl } from './Login';
import { GENDER_OPTIONS, POPULAR_COUNTRIES } from '../../types/profile';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const rawRedirect = searchParams.get('returnTo') || searchParams.get('redirect') || location.state?.returnTo || location.state?.from?.pathname;
  const targetRedirect = sanitizeRedirectUrl(rawRedirect);
  const urlMessage = searchParams.get('message') || location.state?.message;

  const contextualMessage = React.useMemo(() => {
    if (urlMessage) return urlMessage;
    if (!rawRedirect || targetRedirect === '/home') return null;
    if (targetRedirect.includes('/stay') || targetRedirect.includes('/book')) return 'Register to book your stay';
    if (targetRedirect.includes('/shop') || targetRedirect.includes('/cart') || targetRedirect.includes('/checkout')) return 'Register to complete checkout';
    if (targetRedirect.includes('/planner') || targetRedirect.includes('/trips')) return 'Register to create & save your personalized trip plan';
    if (targetRedirect.includes('/wishlist') || targetRedirect.includes('/favorites')) return 'Register to save your favorite places';
    if (targetRedirect.includes('/dashboard') || targetRedirect.includes('/profile')) return 'Register to create your traveler account';
    return 'Register to continue';
  }, [urlMessage, rawRedirect, targetRedirect]);

  // Section 1: Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  // Section 2: Personal Information
  const [gender, setGender] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  // Section 3: Location
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('Norway');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Today's date for max DOB attribute
  const maxDobDate = new Date().toISOString().split('T')[0];

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(targetRedirect, { replace: true });
    }
  }, [user, navigate, targetRedirect]);

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, message: '' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let message = '';
    if (score <= 2) message = 'Weak';
    else if (score <= 3) message = 'Medium';
    else message = 'Strong';
    
    return { score, message };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(checkPasswordStrength(val));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim() || 'Oslo';
    const trimmedPostalCode = postalCode.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

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
      setLoading(true);
      setError('');

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            role: isProvider ? 'PROVIDER' : 'USER',
            gender,
            date_of_birth: dateOfBirth,
            address: trimmedAddress,
            city: trimmedCity,
            postal_code: trimmedPostalCode,
            country,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Handle duplicate user registration edge case
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email address already exists. Please sign in instead.');
        setLoading(false);
        return;
      }

      // Initialize/Update user profile in profiles table
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedName,
            role: isProvider ? 'PROVIDER' : 'USER',
            gender,
            date_of_birth: dateOfBirth,
            address: trimmedAddress,
            city: trimmedCity,
            postal_code: trimmedPostalCode,
            country,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id', ignoreDuplicates: false });
        } catch (profileErr) {
          console.warn('Profile initialization note:', profileErr);
        }

        // Cache initial local profile for fast hydration
        localStorage.setItem('nsl_user_profile', JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          gender,
          dateOfBirth,
          address: trimmedAddress,
          city: trimmedCity,
          postalCode: trimmedPostalCode,
          country,
          role: isProvider ? 'PROVIDER' : 'USER',
          updatedAt: new Date().toISOString()
        }));
      }

      // Check if email confirmation is required (Supabase returns a user but no session)
      if (data?.user && !data.session) {
        setRegisteredEmail(trimmedEmail);
        setRequiresEmailConfirmation(true);
        toast.info('Verification email sent. Please check your inbox.');
      } else {
        toast.success('Account created successfully! Welcome to Norway SmartLife.');
        navigate(targetRedirect, { replace: true });
      }
    } catch (err: any) {
      console.warn('Registration failure:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      if (targetRedirect && targetRedirect !== '/home') {
        sessionStorage.setItem('returnTo', targetRedirect);
      }
      setGoogleLoading(true);
      setLoading(true);
      setError('');
      await authService.loginWithGoogle();
    } catch (e: any) {
      console.warn('Google sign-in error:', e);
      setError(e.message || 'Unable to connect to Google sign-in. Please try again.');
      setGoogleLoading(false);
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join Norway SmartLife to unlock tailored Nordic experiences"
      bgImage="/images/fjords.jpg"
    >
      {/* Contextual Action Prompt Banner */}
      {contextualMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{contextualMessage}</span>
        </div>
      )}

      {requiresEmailConfirmation ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-aurora-green/20 border border-aurora-green/40 flex items-center justify-center">
            <Mail className="w-7 h-7 text-aurora-green animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-snow">Check Your Email</h3>
            <p className="text-sm text-snow/70">
              We have sent a verification link to <span className="font-semibold text-aurora-green">{registeredEmail}</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-deep-night/40 border border-white/10 text-xs text-snow/60 text-left space-y-2">
            <div className="font-semibold text-snow/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-aurora-green"></span>
              Next Steps
            </div>
            <p>1. Open your inbox and look for an email from Norway SmartLife.</p>
            <p>2. Click the confirmation link to activate your traveler credentials.</p>
            <p>3. Once verified, sign in to start planning your journeys.</p>
          </div>

          <div className="pt-2">
            <Link 
              to={`/login${rawRedirect ? `?returnTo=${encodeURIComponent(rawRedirect)}` : ''}`}
              state={{ returnTo: rawRedirect }}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-sm font-bold text-navy-900 bg-aurora-green hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] cursor-pointer"
            >
              Return to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <form className="space-y-6" onSubmit={handleRegister}>
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
          
          {/* SECTION 1: ACCOUNT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-snow/70">1. Account Details</span>
            </div>

            <div className="relative group">
              <label htmlFor="register-name" className="sr-only">Full Name</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-name"
                name="name" 
                type="text" 
                autoComplete="name"
                required 
                className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                minLength={2}
                maxLength={60}
              />
            </div>

            <div className="relative group">
              <label htmlFor="register-email" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-email"
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative group">
                <label htmlFor="register-password" className="sr-only">Password</label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
                </div>
                <input 
                  id="register-password"
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  required 
                  className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all text-xs sm:text-sm" 
                  placeholder="Password" 
                  value={password} 
                  onChange={handlePasswordChange} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-snow/40 hover:text-snow transition-colors cursor-pointer outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative group">
                <label htmlFor="register-confirm-password" className="sr-only">Confirm Password</label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
                </div>
                <input 
                  id="register-confirm-password"
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  required 
                  className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all text-xs sm:text-sm" 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-snow/40 hover:text-snow transition-colors cursor-pointer outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <div className="pt-0.5">
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-[11px] text-snow/60">Strength</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${
                    passwordStrength.message === 'Weak' ? 'text-red-400' : 
                    passwordStrength.message === 'Medium' ? 'text-amber-400' : 'text-aurora-green'
                  }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="w-full bg-deep-night/60 rounded-full h-1 flex gap-1 overflow-hidden">
                  <div className={`h-1 rounded-full ${passwordStrength.score >= 1 ? (passwordStrength.message === 'Weak' ? 'bg-red-400' : passwordStrength.message === 'Medium' ? 'bg-amber-400' : 'bg-aurora-green') : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                  <div className={`h-1 rounded-full ${passwordStrength.score >= 3 ? (passwordStrength.message === 'Medium' ? 'bg-amber-400' : 'bg-aurora-green') : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                  <div className={`h-1 rounded-full ${passwordStrength.score >= 4 ? 'bg-aurora-green' : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PERSONAL INFORMATION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-snow/70">2. Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Gender Selector */}
              <div>
                <label htmlFor="register-gender" className="block text-[11px] font-semibold text-snow/70 mb-1">
                  Gender
                </label>
                <select
                  id="register-gender"
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
                <label htmlFor="register-dob" className="block text-[11px] font-semibold text-snow/70 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    id="register-dob"
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
          </div>

          {/* SECTION 3: LOCATION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-snow/70">3. Location Details</span>
            </div>

            {/* Street Address */}
            <div className="relative group">
              <label htmlFor="register-address" className="sr-only">Street Address</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-address"
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
                  id="register-city"
                  name="city" 
                  type="text" 
                  autoComplete="address-level2"
                  className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent transition-all text-xs sm:text-sm" 
                  placeholder="City" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                />
                <input 
                  id="register-postal"
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
                  id="register-country"
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
          
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="isProvider"
              checked={isProvider}
              onChange={(e) => setIsProvider(e.target.checked)}
              className="w-4 h-4 text-aurora-green bg-deep-night/40 border-white/20 rounded focus:ring-aurora-green focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 transition-colors cursor-pointer"
            />
            <label htmlFor="isProvider" className="ml-2.5 text-xs font-semibold tracking-wide text-snow/80 cursor-pointer select-none">
              Register as a Tour / Stay Provider
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] mt-4 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="px-3 bg-navy-900/80 text-snow/40 rounded-full">Or register with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full flex justify-center items-center gap-2.5 py-3 px-4 border border-white/10 rounded-xl text-snow bg-deep-night/40 hover:bg-deep-night/80 hover:border-white/20 transition-all group cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="h-4 w-4 border-2 border-aurora-green border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                )}
                <span className="text-xs font-semibold group-hover:text-white transition-colors">
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-snow/60">
              Already have a Norway SmartLife account?{' '}
              <Link 
                to={`/login${rawRedirect ? `?returnTo=${encodeURIComponent(rawRedirect)}` : ''}`}
                state={{ returnTo: rawRedirect }}
                className="font-bold text-aurora-green hover:underline cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default Register;
