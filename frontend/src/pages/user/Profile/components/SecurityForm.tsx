import React, { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Lock, ShieldAlert } from 'lucide-react';

export const SecurityForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) setMessage(`Error: ${error.message}`);
      else setMessage('Password reset email sent! Check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-900">Security & Login</h2>
        <p className="text-gray-500">Protect your account and authenticate securely.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="p-6 border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-navy-900">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">Change Password</h3>
              <p className="text-sm text-gray-500">Send a password reset link to your email.</p>
            </div>
          </div>
          <button 
            onClick={handlePasswordReset} 
            disabled={loading}
            className="w-full mt-4 py-3 bg-white border-2 border-navy-900 text-navy-900 rounded-xl font-bold hover:bg-gray-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <div className="p-6 border border-red-200 rounded-2xl bg-red-50/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Danger Zone</h3>
              <p className="text-sm text-red-600">Permanently delete your account and all data.</p>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
