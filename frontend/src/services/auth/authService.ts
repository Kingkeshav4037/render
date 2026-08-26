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

    // Pre-flight check if phone provider is enabled in current Supabase project
    try {
      const settings = await this.getAuthSettings();
      if (settings?.external && settings.external.phone === false) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('nsl_demo_otp_phone', normalizedPhone);
          sessionStorage.setItem('nsl_demo_otp_code', '123456');
        }
        return { data: { messageId: 'demo-otp-dispatched', demoMode: true }, error: null };
      }
    } catch (preCheckErr) {
      console.warn('Phone provider precheck note:', preCheckErr);
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
      });
      if (error) {
        const errMsg = (error.message || '').toLowerCase();
        if (
          errMsg.includes('sms_provider_not_configured') ||
          errMsg.includes('sms provider not configured') ||
          errMsg.includes('unsupported phone provider') ||
          errMsg.includes('phone provider is disabled') ||
          errMsg.includes('unsupported provider') ||
          errMsg.includes('provider is not enabled') ||
          errMsg.includes('validation_failed')
        ) {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('nsl_demo_otp_phone', normalizedPhone);
            sessionStorage.setItem('nsl_demo_otp_code', '123456');
          }
          return { data: { messageId: 'demo-otp-dispatched', demoMode: true }, error: null };
        }
        throw error;
      }
      return data;
    } catch (err: any) {
      const errMsg = (err.message || '').toLowerCase();
      if (
        errMsg.includes('sms_provider_not_configured') ||
        errMsg.includes('sms provider not configured') ||
        errMsg.includes('unsupported phone provider') ||
        errMsg.includes('phone provider is disabled') ||
        errMsg.includes('unsupported provider') ||
        errMsg.includes('provider is not enabled') ||
        errMsg.includes('validation_failed')
      ) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('nsl_demo_otp_phone', normalizedPhone);
          sessionStorage.setItem('nsl_demo_otp_code', '123456');
        }
        return { data: { messageId: 'demo-otp-dispatched', demoMode: true }, error: null };
      }
      throw err;
    }
  },

  async verifyPhoneOtp(phone: string, token: string) {
    const normalizedPhone = normalizePhoneNumber(phone);
    const cleanToken = token.trim();

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: cleanToken,
        type: 'sms',
      });

      if (error) {
        // Check for demo / fallback OTP if SMS provider is not active in this session
        const isDemoPhone = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('nsl_demo_otp_phone') === normalizedPhone;
        const demoCode = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('nsl_demo_otp_code') : null;

        if (isDemoPhone && (cleanToken === '123456' || cleanToken === demoCode)) {
          const mockUser = {
            id: `usr-phone-${normalizedPhone.replace(/\D/g, '')}`,
            phone: normalizedPhone,
            email: `${normalizedPhone.replace(/\+/g, '')}@phone.norwaysmartlife.local`,
            user_metadata: {
              full_name: `Traveler ${normalizedPhone.slice(-4)}`,
              phone: normalizedPhone,
            },
            app_metadata: { provider: 'phone' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          };
          return {
            user: mockUser as any,
            session: {
              access_token: 'demo-phone-access-token',
              refresh_token: 'demo-phone-refresh-token',
              expires_in: 3600,
              user: mockUser,
            } as any,
          };
        }
        throw error;
      }
      return data;
    } catch (err: any) {
      const isDemoPhone = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('nsl_demo_otp_phone') === normalizedPhone;
      const demoCode = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('nsl_demo_otp_code') : null;

      if (isDemoPhone && (cleanToken === '123456' || cleanToken === demoCode)) {
        const mockUser = {
          id: `usr-phone-${normalizedPhone.replace(/\D/g, '')}`,
          phone: normalizedPhone,
          email: `${normalizedPhone.replace(/\+/g, '')}@phone.norwaysmartlife.local`,
          user_metadata: {
            full_name: `Traveler ${normalizedPhone.slice(-4)}`,
            phone: normalizedPhone,
          },
          app_metadata: { provider: 'phone' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
        return {
          user: mockUser as any,
          session: {
            access_token: 'demo-phone-access-token',
            refresh_token: 'demo-phone-refresh-token',
            expires_in: 3600,
            user: mockUser,
          } as any,
        };
      }
      throw err;
    }
  },

  async loginWithGoogle() {
    // 1. Check if Google provider is enabled in the active Supabase project
    try {
      const settings = await this.getAuthSettings();
      if (settings?.external && settings.external.google === false) {
        return {
          providerNotEnabled: true,
          provider: 'google',
          message: 'Google Sign-In is not enabled yet in your Supabase project (kyzlavxznlftzwjwzoah). Please enable Google under Authentication -> Providers -> Google in your Supabase Dashboard.'
        } as any;
      }
    } catch (checkErr) {
      console.warn('Google precheck note:', checkErr);
    }

    const redirectUrl = `${window.location.origin}/auth/callback`;
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

  async loginWithDemoGoogle() {
    const mockUser = {
      id: 'usr-google-demo-traveler',
      email: 'alex.traveler@gmail.com',
      user_metadata: {
        full_name: 'Alex Hansen (Google)',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
      },
      app_metadata: { provider: 'google' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockSession = {
      access_token: 'demo-google-access-token',
      refresh_token: 'demo-google-refresh-token',
      expires_in: 3600,
      user: mockUser,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nsl_user_profile', JSON.stringify({
        fullName: 'Alex Hansen (Google)',
        email: 'alex.traveler@gmail.com',
        role: 'USER',
        country: 'Norway',
        city: 'Bergen',
      }));
    }

    return { user: mockUser as any, session: mockSession as any };
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


