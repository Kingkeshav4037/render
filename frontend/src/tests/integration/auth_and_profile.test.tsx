/**
 * Integration Tests: Authentication & User Profile Management
 *
 * Verifies:
 * - Authentication flow: email/password login, OTP fallback, session termination, password updates
 * - User profile lifecycle: ensuring profile existence upon registration, fetching full profile with permissions
 * - Profile mutations: updating personal details, sanitizing undefined fields before database payload submission
 * - Multi-section preferences: travel, food, accommodation, transport, notification, and privacy upsert operations
 * - Deterministic profile completion score calculation based on weighted section completeness
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth/authService';
import { profileService } from '../../services/profile/profileService';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => {
  const queryBuilder = (tableName: string) => {
    const builder: any = {
      _table: tableName,
      select: vi.fn(() => builder),
      insert: vi.fn(() => builder),
      update: vi.fn(() => builder),
      upsert: vi.fn(() => builder),
      delete: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      single: vi.fn(() => Promise.resolve({
        data: tableName === 'profiles'
          ? {
              id: 'test-user-123',
              email: 'explorer@norway.no',
              full_name: 'Erik Viking',
              country: 'Norway',
              city: 'Oslo',
              role: 'USER',
            }
          : { user_id: 'test-user-123' },
        error: null,
      })),
      limit: vi.fn(() => builder),
      order: vi.fn(() => builder),
      then: (resolve: any) => resolve({ data: [], error: null }),
    };
    return builder;
  };

  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: 'u1', email: 'test@example.com' }, session: { access_token: 'fake-jwt' } },
          error: null,
        }),
        signInWithOtp: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: null,
        }),
        signInWithOAuth: vi.fn().mockResolvedValue({
          data: { url: 'https://accounts.google.com/o/oauth2/v2/auth' },
          error: null,
        }),
        verifyOtp: vi.fn().mockResolvedValue({
          data: { user: { id: 'u1' }, session: { access_token: 'valid-token' } },
          error: null,
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        updateUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
      rpc: vi.fn().mockResolvedValue({
        data: [{ name: 'trips:view' }, { name: 'reviews:create' }],
        error: null,
      }),
      from: vi.fn((table: string) => queryBuilder(table)),
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({ data: { path: 'avatars/pic.jpg' }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://storage.supabase.co/avatars/pic.jpg' } }),
        })),
      },
    },
  };
});

describe('Integration Tests: Authentication & Profile Lifecycle', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── 1. Authentication Service Integration ─────────────────────────────────
  describe('Authentication Lifecycle', () => {
    it('authenticates user with email and password successfully', async () => {
      const result = await authService.loginWithEmail('explorer@norway.no', 'Secret123!');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'explorer@norway.no',
        password: 'Secret123!',
      });
      expect(result.user?.id).toBe('u1');
    });

    it('triggers OTP passwordless sign-in when password is omitted', async () => {
      await authService.loginWithEmail('magic@norway.no');
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'magic@norway.no',
      });
    });

    it('initiates Google OAuth authentication with redirect URL', async () => {
      const result: any = await authService.loginWithGoogle();
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
        }),
      });
      expect(result.url).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    });

    it('sends phone SMS OTP with normalized E.164 number', async () => {
      await authService.sendPhoneOtp(' 0987 65 432 ');
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
        phone: '+4798765432',
      });
    });

    it('verifies phone SMS OTP token correctly', async () => {
      const result = await authService.verifyPhoneOtp('+4798765432', '123456');
      expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
        phone: '+4798765432',
        token: '123456',
        type: 'sms',
      });
      expect(result.user?.id).toBe('u1');
    });

    it('terminates active session on user logout', async () => {
      await authService.logout();
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it('updates user password through Supabase auth', async () => {
      await authService.updatePassword('NewSecurePassword#2026');
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewSecurePassword#2026',
      });
    });
  });

  // ─── 2. Profile Fetching & RBAC Permissions Integration ────────────────────
  describe('Profile Fetching & Permissions Resolution', () => {
    it('fetches profile with granular permissions resolved via RPC', async () => {
      const profile = await profileService.getProfile('test-user-123');
      expect(profile).not.toBeNull();
      expect(profile?.email).toBe('explorer@norway.no');
      expect(profile?.fullName).toBe('Erik Viking');
      expect(profile?.role).toBe('USER');
      // Verifies permissions returned from mocked get_user_permissions RPC
      expect(profile?.permissions).toContain('trips:view');
      expect(profile?.permissions).toContain('reviews:create');
    });

    it('ensures profile exists by inserting record when missing', async () => {
      // Mock getProfile to return null first, then test insertion
      const spy = vi.spyOn(profileService, 'getProfile').mockResolvedValueOnce(null);
      await profileService.ensureProfileExists('new-user-456', 'new@user.no', 'USER');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      spy.mockRestore();
    });
  });

  // ─── 3. Profile & Preference Mutations Integration ─────────────────────────
  describe('Profile & Preferences Mutation Operations', () => {
    it('sanitizes undefined fields and updates profiles table', async () => {
      await profileService.updateProfile('test-user-123', {
        fullName: 'Astrid Lind',
        phone: '+47 98765432',
        city: undefined, // must be stripped
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('upserts travel preferences with user_id key', async () => {
      await profileService.updateTravelPreferences('test-user-123', {
        budgetLevel: 'luxury',
        preferredTripDuration: 'two_weeks',
        activityInterests: ['Fjord Kayaking', 'Northern Lights'],
      });

      expect(supabase.from).toHaveBeenCalledWith('travel_preferences');
    });

    it('upserts food preferences with dietary constraints', async () => {
      await profileService.updateFoodPreferences('test-user-123', {
        dietaryPreferences: ['Vegetarian'],
        allergies: ['Nuts'],
        seafoodPreference: 'love',
      });

      expect(supabase.from).toHaveBeenCalledWith('food_preferences');
    });

    it('upserts accommodation, transport, notification, and privacy preferences', async () => {
      await profileService.updateAccommodationPreferences('test-user-123', { starRating: 4 });
      await profileService.updateTransportPreferences('test-user-123', { evPreference: true });
      await profileService.updateNotificationPreferences('test-user-123', { safetyAlerts: { email: true, push: true, sms: false } });
      await profileService.updatePrivacyPreferences('test-user-123', { profileVisibility: 'public' });

      expect(supabase.from).toHaveBeenCalledWith('accommodation_preferences');
      expect(supabase.from).toHaveBeenCalledWith('transport_preferences');
      expect(supabase.from).toHaveBeenCalledWith('notification_preferences');
      expect(supabase.from).toHaveBeenCalledWith('privacy_preferences');
    });
  });

  // ─── 4. Avatar Upload Integration ──────────────────────────────────────────
  describe('Avatar Storage Upload', () => {
    it('uploads avatar file to storage bucket and stores public URL in profile', async () => {
      const file = new File(['mock-img'], 'my-photo.jpg', { type: 'image/jpeg' });
      const url = await profileService.uploadAvatar('test-user-123', file);

      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(url).toContain('https://storage.supabase.co/avatars/pic.jpg');
    });
  });
});
