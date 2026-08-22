import { supabase } from '../../lib/supabase';

export const authService = {
  async loginWithEmail(email: string, password?: string) {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      return data;
    }
  },

  async sendPhoneOtp(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return data;
  },

  async verifyPhoneOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  async loginWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
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
    // Requires a secure edge function to revoke all refresh tokens except the current one.
    // For now, simulating via standard signOut
    await this.logout();
  }
};
