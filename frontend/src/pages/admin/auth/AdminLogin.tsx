import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, LogIn, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('admin')) {
        setStep('mfa');
      } else {
        toast.error('Unauthorized access. This incident has been logged.');
      }
    }, 800);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = mfaCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit MFA code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mocking a SUPER_ADMIN login
      useAuthStore.setState({ 
        profile: { 
          id: 'adm-001', 
          role: 'SUPER_ADMIN', 
          email: email, 
          fullName: 'System Administrator'
        } as any, 
        isAdmin: true,
        user: { id: 'adm-001', email, app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } as any
      });
      toast.success('Identity verified. Access granted.');
      navigate('/admin');
    }, 1200);
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Topology / Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-500" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Shield size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Norway SmartLife Administration
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Restricted access. Authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700">
          
          {step === 'credentials' && (
            <form className="space-y-6 animate-in fade-in zoom-in-95" onSubmit={handleCredentialsSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Administrative Email
                </label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3 pl-10 bg-slate-900 text-white shadow-inner ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-slate-600 transition-all"
                    placeholder="admin@norwaysmartlife.no"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Secure Password
                </label>
                <div className="mt-2 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3 pl-10 bg-slate-900 text-white shadow-inner ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                    Remember this device
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-400 hover:text-blue-300">
                    Forgot credentials?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Authenticate <LogIn size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'mfa' && (
            <form className="space-y-6 animate-in slide-in-from-right-4 fade-in" onSubmit={handleMfaSubmit}>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-700">
                  <Fingerprint size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Identity Verification</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`mfa-${index}`}
                    type="text"
                    maxLength={1}
                    value={mfaCode[index]}
                    onChange={(e) => handleMfaChange(index, e.target.value)}
                    className="w-10 h-12 rounded-lg bg-slate-900 border border-slate-700 text-center text-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Access <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Protected by Platform Governance & RLS Policies.</p>
          <p>All administrative actions are logged and audited.</p>
        </div>
      </div>
    </div>
  );
};
