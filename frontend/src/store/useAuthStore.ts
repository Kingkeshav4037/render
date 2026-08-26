import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profileService, type UserProfileWithPermissions, type AppRole } from '../services/profile/profileService';

export type { AppRole } from '../services/profile/profileService';
interface AuthState {
  user: User | null;
  profile: UserProfileWithPermissions | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  isProvider: boolean;
  isAnalyst: boolean;
  permissions: string[];
  mfaLevel: 'aal1' | 'aal2';
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;
  signOut: () => Promise<void>;
  initialize: () => (() => void) | void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  isAdmin: false,
  isProvider: false,
  isAnalyst: false,
  permissions: [],
  mfaLevel: 'aal1',
  setUser: (user) => set({ user, loading: false }),
  hasPermission: (permission) => {
    const state = get();
    // Super admins and admins have global admin permissions in frontend checks
    if (state.profile?.role === 'SUPER_ADMIN' || state.profile?.role === 'ADMIN') return true;
    return state.permissions.includes(permission);
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false, isProvider: false, isAnalyst: false, permissions: [], mfaLevel: 'aal1' });
  },
  initialize: () => {
    if (get().initialized) return;

    set({ initialized: true });

    const fetchProfile = async (user: User) => {
      const email = user.email || (user.phone ? `${user.phone.replace(/\D/g, '')}@phone.norwaysmartlife.local` : '');
      await profileService.ensureProfileExists(user.id, email);
      let profile = await profileService.getProfile(user.id);
      
      if (!profile) {
        profile = {
          id: user.id,
          email: email,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || (user.phone ? `Traveler ${user.phone.slice(-4)}` : 'Traveler'),
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          phone: user.phone || undefined,
          phoneVerified: !!user.phone || !!user.phone_confirmed_at,
          role: (user.user_metadata?.role as AppRole) || 'USER',
          country: 'Norway',
          city: 'Oslo',
          permissions: [],
        };
      } else if (user.phone && !profile.phone) {
        try {
          await profileService.updateProfile(user.id, {
            phone: user.phone,
            phoneVerified: true,
          });
          profile.phone = user.phone;
          profile.phoneVerified = true;
        } catch {
          // Graceful fallback if update is blocked
        }
      }
      
      const role = profile?.role as AppRole | undefined;
      const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
      const isProvider = role === 'PROVIDER';
      const isAnalyst = role === 'ANALYST';
      
      const permissions = profile?.permissions || [];
      
      let mfaLevel: 'aal1' | 'aal2' = 'aal1';
      try {
        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        mfaLevel = (mfaData?.currentLevel as 'aal1' | 'aal2') || 'aal1';
      } catch {
        // MFA optional in dev
      }
      
      set({ user, profile, isAdmin, isProvider, isAnalyst, permissions, mfaLevel, loading: false });
    };

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        set({ user: null, profile: null, isAdmin: false, isProvider: false, isAnalyst: false, permissions: [], mfaLevel: 'aal1', loading: false });
      }
    });

    // Listen for auth changes — only re-fetch profile on meaningful events (ISSUE-018)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        if (event === 'MFA_CHALLENGE_VERIFIED') {
           supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }: { data: any }) => {
              set({ mfaLevel: (data?.currentLevel as 'aal1' | 'aal2') || 'aal1' });
           });
           return; // don't re-fetch profile for MFA only
        }
        // Only re-fetch profile when the user actually signs in or updates account.
        // Note: SIGNED_IN also fires on new sign-ups, so SIGNED_UP is not needed.
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          fetchProfile(session.user);
        } else if (event === 'TOKEN_REFRESHED') {
          // Just update the user object without a DB round-trip
          set({ user: session.user });
        }
      } else {
        set({ user: null, profile: null, isAdmin: false, isProvider: false, isAnalyst: false, permissions: [], mfaLevel: 'aal1', loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
      set({ initialized: false });
    };
  }
}));
