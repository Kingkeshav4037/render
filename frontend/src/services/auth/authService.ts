import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabase';

/**
 * Normalizes phone numbers to standard E.164 format (+[country_code][number])
 */
export const normalizePhoneNumber = (phone: string, defaultCountryCode = '+47'): string => {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  }
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.replace(/^0+/, '');
    }
    cleaned = `${defaultCountryCode}${cleaned}`;
  }
  return cleaned;
};

export const authService = {
  async getAuthSettings() {
    try {
      if (typeof fetch !== 'undefined' && supabaseUrl) {
        const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
          headers: { apikey: supabaseAnonKey },
        });
        if (res.ok) {
          return await res.json();
        }
      }
    } catch {
      // Optional preflight; ignore network/offline issues
    }
    return null;
  },

  async loginWithEmail(email: string, password?: string) {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });
      if (error) throw error;
      return data;
    }
  },

  async sendPhoneOtp(phone: string) {
    const normalizedPhone = normalizePhoneNumber(phone);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });
    if (error) throw error;
    return data;
  },

  async verifyPhoneOtp(phone: string, token: string) {
    const normalizedPhone = normalizePhoneNumber(phone);
    const cleanToken = token.trim();

    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: cleanToken,
      type: 'sms',
    });

    if (error) throw error;
    return data;
  },

  async loginWithGoogle(redirectTo?: string) {
    const redirectUrl = redirectTo || `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) throw error;
    if (data?.url && typeof window !== 'undefined' && window.location) {
      window.location.assign(data.url);
    }
    return data;
  },

  async loginWithApple() {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) throw error;
    if (data?.url && typeof window !== 'undefined' && window.location) {
      window.location.assign(data.url);
    }
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },
  
  async logoutAllDevices() {
    await this.logout();
  }
};
