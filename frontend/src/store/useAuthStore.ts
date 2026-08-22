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
    // Super admins always have all permissions implicitly in frontend checks
    if (state.profile?.role === 'SUPER_ADMIN') return true;
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
      await profileService.ensureProfileExists(user.id, user.email || '');
      let profile = await profileService.getProfile(user.id);
      
      const role = profile?.role as AppRole | undefined;
      const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
      const isProvider = role === 'PROVIDER';
      const isAnalyst = role === 'ANALYST';
      
      const permissions = profile?.permissions || [];
      
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const mfaLevel = (mfaData?.currentLevel as 'aal1' | 'aal2') || 'aal1';
      
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (event === 'MFA_CHALLENGE_VERIFIED') {
           supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => {
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
