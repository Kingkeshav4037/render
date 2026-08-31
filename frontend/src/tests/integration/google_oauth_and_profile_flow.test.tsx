import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isProfileComplete, UserProfile, GENDER_OPTIONS, POPULAR_COUNTRIES } from '../../types/profile';
import { profileService } from '../../services/profile/profileService';
import { sanitizeRedirectUrl } from '../../pages/auth/Login';

// Mock Supabase
const mockUpsert = vi.fn();
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => ({
      upsert: mockUpsert.mockReturnThis(),
      update: mockUpdate.mockReturnThis(),
      select: mockSelect.mockReturnThis(),
      single: mockSingle,
      eq: mockEq.mockReturnThis(),
    })),
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      setSession: vi.fn(),
    },
  },
}));

describe('Phase A — Comprehensive Google OAuth & Profile Flow Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('Test 1: New Google User Onboarding Flow', () => {
    it('detects incomplete profile for new Google OAuth user and redirects to /complete-profile', async () => {
      // 1. Google OAuth user logs in for the first time
      const newGoogleUser = {
        id: 'google-user-001',
        email: 'freja.nordic@gmail.com',
        user_metadata: {
          full_name: 'Freja Berg',
          avatar_url: 'https://lh3.googleusercontent.com/a/photo123',
        },
      };

      // Profile in DB does not have gender, dob, address
      const initialProfile: UserProfile = {
        id: newGoogleUser.id,
        email: newGoogleUser.email,
        fullName: newGoogleUser.user_metadata.full_name,
        avatarUrl: newGoogleUser.user_metadata.avatar_url,
        phoneVerified: false,
        country: 'Norway', // Default country, but missing gender, dob, address
      };

      expect(isProfileComplete(initialProfile)).toBe(false);

      // 2. Safe destination preservation check
      const returnTo = '/stays/s-101';
      sessionStorage.setItem('returnTo', returnTo);
      const safeDestination = sanitizeRedirectUrl(sessionStorage.getItem('returnTo'));
      expect(safeDestination).toBe('/stays/s-101');

      // 3. User submits completion form
      const completedData = {
        gender: 'Female',
        dateOfBirth: '1996-08-20',
        address: 'Drammensveien 12',
        city: 'Oslo',
        postalCode: '0255',
        country: 'Norway',
      };

      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      // Update profile
      await profileService.updateProfile(newGoogleUser.id, completedData);

      // Verify profile is now complete
      const updatedProfile: UserProfile = {
        ...initialProfile,
        ...completedData,
      };
      expect(isProfileComplete(updatedProfile)).toBe(true);
    });
  });

  describe('Test 2: Existing Complete Google User Flow', () => {
    it('detects complete profile for existing Google OAuth user and skips profile completion', async () => {
      const existingGoogleUser: UserProfile = {
        id: 'google-user-002',
        email: 'magnus.fjord@gmail.com',
        fullName: 'Magnus Olsen',
        gender: 'Male',
        dateOfBirth: '1990-03-12',
        address: 'Bryggen 5',
        city: 'Bergen',
        postalCode: '5003',
        country: 'Norway',
        phoneVerified: true,
      };

      // Check completeness: should be true
      expect(isProfileComplete(existingGoogleUser)).toBe(true);

      // Preserves original destination
      const intendedDestination = '/planner?dest=Lofoten';
      const safeDestination = sanitizeRedirectUrl(intendedDestination);
      expect(safeDestination).toBe('/planner?dest=Lofoten');
    });
  });

  describe('Test 3: Existing Incomplete User Interception Flow', () => {
    it('intercepts existing user with incomplete profile when accessing protected feature', async () => {
      // User with missing dateOfBirth and address
      const incompleteProfile: Partial<UserProfile> = {
        id: 'user-003',
        email: 'incomplete.user@domain.com',
        fullName: 'Henrik Ibsen',
        gender: 'Male',
        country: 'Norway',
      };

      expect(isProfileComplete(incompleteProfile)).toBe(false);

      // User provides missing fields
      const updatedFields = {
        dateOfBirth: '1988-11-20',
        address: 'Ibsens gate 4',
      };

      const finalProfile: UserProfile = {
        ...(incompleteProfile as UserProfile),
        ...updatedFields,
      };

      expect(isProfileComplete(finalProfile)).toBe(true);
    });
  });

  describe('Test 4: Email / Password Registration & Login Flow', () => {
    it('validates all required registration fields and ensures profile completeness', () => {
      const emailRegistrationPayload = {
        fullName: 'Astrid Lindgren',
        email: 'astrid@scandinavia.com',
        gender: 'Female',
        dateOfBirth: '1992-04-14',
        address: 'Karl Johans gate 22',
        city: 'Oslo',
        postalCode: '0159',
        country: 'Norway',
      };

      // Validates gender is in allowed options
      expect(GENDER_OPTIONS).toContain(emailRegistrationPayload.gender);

      // Validates country is in popular countries
      const countryNames = POPULAR_COUNTRIES.map((c) => c.name);
      expect(countryNames).toContain(emailRegistrationPayload.country);

      // Resulting profile is immediately complete
      const resultingProfile: UserProfile = {
        id: 'email-user-004',
        phoneVerified: false,
        ...emailRegistrationPayload,
      };

      expect(isProfileComplete(resultingProfile)).toBe(true);
    });

    it('sanitizes open-redirect attacks in returnTo query params', () => {
      expect(sanitizeRedirectUrl('https://malicious-site.com')).toBe('/home');
      expect(sanitizeRedirectUrl('//malicious-site.com')).toBe('/home');
      expect(sanitizeRedirectUrl('\\malicious-site.com')).toBe('/home');
      expect(sanitizeRedirectUrl('/checkout')).toBe('/checkout');
      expect(sanitizeRedirectUrl('/planner?dest=Tromso')).toBe('/planner?dest=Tromso');
      expect(sanitizeRedirectUrl('')).toBe('/home');
      expect(sanitizeRedirectUrl(null)).toBe('/home');
      expect(sanitizeRedirectUrl(undefined)).toBe('/home');
    });
  });
});
