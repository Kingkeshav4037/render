import React, { useEffect, useState } from 'react';
import { Shield, Smartphone, Key, Monitor, Activity, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { supabase } from '../../../lib/supabase';

export const Security = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const { user, mfaLevel } = useAuthStore();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setSessions([{ 
          device: navigator.userAgent.split(' ')[0] || 'Current Device', 
          location: 'Local Session', 
          current: true, 
          time: new Date(sessionData.session.user.last_sign_in_at || Date.now()).toLocaleString() 
        }]);
      }
    };
    fetchSession();
  }, []);

  const setupMFA = async () => {
    setErrorMsg('');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) { setErrorMsg(error.message); return; }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setIsEnrolling(true);
  };

  const verifyMFA = async () => {
    setErrorMsg('');
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) { setErrorMsg(challenge.error.message); return; }
    
    const verify = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.data.id, code: verifyCode });
    if (verify.error) { setErrorMsg(verify.error.message); return; }
    
    setIsEnrolling(false);
    setVerifyCode('');
  };

  const disableMFA = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const totpFactor = data?.totp?.[0];
    if (totpFactor) {
      await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
    }
  };

  const signOutOtherDevices = async () => {
    await supabase.auth.signOut({ scope: 'others' });
  };

  // Events would typically be pulled from audit_logs, which requires service_role
  // We approximate it using user's last sign-in
  const securityEvents = user?.last_sign_in_at ? [
    { action: 'LOGIN', device: navigator.userAgent.split(' ')[0] || 'Current Device', time: new Date(user.last_sign_in_at).toLocaleString() }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-navy-900">Security & Sessions</h1>
        <p className="text-gray-500 mt-1">Manage your account security, multi-factor authentication, and active sessions.</p>
      </div>

      {/* Two-Factor Authentication */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${mfaLevel === 'aal2' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-navy-900 mb-1">Two-Factor Authentication (2FA)</h2>
            <p className="text-gray-500 text-sm mb-4">
              Add an extra layer of security to your account. When enabled, you'll need to enter a code from an authenticator app.
            </p>
            <div className="flex gap-4">
              {mfaLevel === 'aal1' ? (
                <button onClick={setupMFA} className="bg-navy-900 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-navy-800 transition-colors flex items-center gap-2">
                  <Smartphone size={16} /> Setup Authenticator App
                </button>
              ) : (
                <button onClick={disableMFA} className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2">
                  <Shield size={16} /> Disable MFA
                </button>
              )}
            </div>
            
            {isEnrolling && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-bold text-navy-900 mb-2">Scan QR Code</h3>
                <div dangerouslySetInnerHTML={{ __html: qrCode }} className="w-48 h-48 bg-white border border-gray-200 p-2 rounded mb-4" />
                <div className="flex gap-2 max-w-xs">
                  <input 
                    type="text" 
                    placeholder="6-digit code" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                  />
                  <button onClick={verifyMFA} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Verify</button>
                </div>
                {errorMsg && <p className="text-red-500 text-sm mt-2 font-medium">{errorMsg}</p>}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${mfaLevel === 'aal2' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {mfaLevel === 'aal2' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-1">Active Sessions</h2>
            <p className="text-gray-500 text-sm">Manage the devices that are currently logged into your account.</p>
          </div>
          <button onClick={signOutOtherDevices} className="text-red-600 text-sm font-bold hover:underline flex items-center gap-1">
            <LogOut size={16} /> Sign out all other devices
          </button>
        </div>

        <div className="space-y-4">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <Monitor className={s.current ? 'text-aurora-green' : 'text-gray-400'} size={24} />
              <div className="flex-1">
                <div className="font-bold text-navy-900 flex items-center gap-2">
                  {s.device} 
                  {s.current && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {s.location} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {s.time}
                </div>
              </div>
              {!s.current && (
                <button className="text-gray-400 hover:text-red-600 p-2">
                  <LogOut size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security Events */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-navy-900 mb-1">Recent Security Events</h2>
        <p className="text-gray-500 text-sm mb-6">Review recent authentication activity on your account.</p>
        
        <div className="space-y-0">
          {securityEvents.map((e, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0">
              <Activity className="text-blue-500 mt-1" size={20} />
              <div>
                <div className="font-bold text-navy-900 text-sm">{e.action}</div>
                <div className="text-xs text-gray-500">{e.device} • {e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
