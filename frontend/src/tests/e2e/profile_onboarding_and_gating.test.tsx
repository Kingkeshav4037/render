import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isProfileComplete, GENDER_OPTIONS, POPULAR_COUNTRIES, UserProfile } from '../../types/profile';
import { profileService } from '../../services/profile/profileService';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

// Mock Supabase
vi.mock('../../lib/supabase', () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn(),
      },
    },
  };
});

describe('Profile Information & Onboarding Requirements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      loading: false,
      initialized: true,
      isAdmin: false,
      isProvider: false,
      isAnalyst: false,
      permissions: [],
    });
  });

  describe('Profile Completeness Rules (isProfileComplete)', () => {
    it('returns false if gender is missing', () => {
      const profile: Partial<UserProfile> = {
        fullName: 'Astrid Lind',
        dateOfBirth: '1995-06-15',
        address: 'Storgata 10',
        country: 'Norway',
      };
      expect(isProfileComplete(profile as UserProfile)).toBe(false);
    });

    it('returns false if dateOfBirth is missing', () => {
      const profile: Partial<UserProfile> = {
        fullName: 'Astrid Lind',
        gender: 'Female',
        address: 'Storgata 10',
        country: 'Norway',
      };
      expect(isProfileComplete(profile as UserProfile)).toBe(false);
    });

    it('returns false if address is missing or empty', () => {
      const profile: Partial<UserProfile> = {
        fullName: 'Astrid Lind',
        gender: 'Female',
        dateOfBirth: '1995-06-15',
        address: '   ',
        country: 'Norway',
      };
      expect(isProfileComplete(profile as UserProfile)).toBe(false);
    });

    it('returns false if country is missing', () => {
      const profile: Partial<UserProfile> = {
        fullName: 'Astrid Lind',
        gender: 'Female',
        dateOfBirth: '1995-06-15',
        address: 'Storgata 10',
      };
      expect(isProfileComplete(profile as UserProfile)).toBe(false);
    });

    it('returns true when all 4 required fields (gender, dob, address, country) are present', () => {
      const profile: Partial<UserProfile> = {
        fullName: 'Astrid Lind',
        gender: 'Female',
        dateOfBirth: '1995-06-15',
        address: 'Storgata 10',
        city: 'Tromsø',
        postalCode: '9008',
        country: 'Norway',
      };
      expect(isProfileComplete(profile as UserProfile)).toBe(true);
    });
  });

  describe('Gender & Country Options', () => {
    it('contains all standard gender options required by specification', () => {
      expect(GENDER_OPTIONS).toContain('Male');
      expect(GENDER_OPTIONS).toContain('Female');
      expect(GENDER_OPTIONS).toContain('Non-binary');
      expect(GENDER_OPTIONS).toContain('Prefer not to say');
    });

    it('has standard countries with names and flags', () => {
      expect(POPULAR_COUNTRIES.length).toBeGreaterThan(10);
      const norway = POPULAR_COUNTRIES.find(c => c.name === 'Norway');
      expect(norway).toBeDefined();
      expect(norway?.code).toBe('NO');
      expect(norway?.flag).toBe('🇳🇴');
    });
  });

  describe('Profile Service Database Mapping', () => {
    it('fetches and maps address, postalCode, gender, and dateOfBirth correctly', async () => {
      const mockDbRow = {
        id: 'usr-123',
        email: 'astrid@example.no',
        full_name: 'Astrid Lind',
        avatar_url: 'https://images.pexels.com/user.jpg',
        role: 'USER',
        phone: '+4798765432',
        phone_verified: true,
        gender: 'Female',
        date_of_birth: '1995-06-15',
        address: 'Karl Johans gate 1',
        city: 'Oslo',
        postal_code: '0154',
        country: 'Norway',
      };

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockDbRow, error: null }),
        }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock };
        if (table === 'user_roles') return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ data: [] }) }) };
        return { select: vi.fn() };
      });

      const profile = await profileService.getProfile('usr-123');

      expect(profile).toBeDefined();
      expect(profile?.gender).toBe('Female');
      expect(profile?.dateOfBirth).toBe('1995-06-15');
      expect(profile?.address).toBe('Karl Johans gate 1');
      expect(profile?.postalCode).toBe('0154');
      expect(profile?.city).toBe('Oslo');
      expect(profile?.country).toBe('Norway');
      expect(isProfileComplete(profile)).toBe(true);
    });

    it('updates profile record with snake_case column names in database', async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') return { update: updateMock };
        return { update: vi.fn() };
      });

      await profileService.updateProfile('usr-123', {
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        address: 'Bryggen 5',
        city: 'Bergen',
        postalCode: '5003',
        country: 'Norway',
      });

      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: 'Male',
          date_of_birth: '1990-01-01',
          address: 'Bryggen 5',
          city: 'Bergen',
          postal_code: '5003',
          country: 'Norway',
        })
      );
    });
  });

  describe('useAuthStore.refreshProfile() Integration', () => {
    it('re-fetches profile and updates auth store profile state', async () => {
      useAuthStore.setState({
        user: { id: 'usr-456', email: 'olav@nordic.no' } as any,
        profile: {
          id: 'usr-456',
          email: 'olav@nordic.no',
          fullName: 'Olav Tryggvason',
          country: 'Norway',
          city: 'Trondheim',
          permissions: [],
        },
      });

      const mockUpdatedProfile = {
        id: 'usr-456',
        email: 'olav@nordic.no',
        full_name: 'Olav Tryggvason',
        gender: 'Male',
        date_of_birth: '1988-12-10',
        address: 'Kongens gate 1',
        city: 'Trondheim',
        postal_code: '7013',
        country: 'Norway',
        role: 'USER',
      };

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockUpdatedProfile, error: null }),
        }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock };
        if (table === 'user_roles') return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ data: [] }) }) };
        return { select: vi.fn() };
      });

      const refreshed = await useAuthStore.getState().refreshProfile();

      expect(refreshed).toBeDefined();
      expect(refreshed?.gender).toBe('Male');
      expect(refreshed?.dateOfBirth).toBe('1988-12-10');
      expect(refreshed?.address).toBe('Kongens gate 1');
      expect(refreshed?.postalCode).toBe('7013');
      expect(useAuthStore.getState().profile?.gender).toBe('Male');
      expect(isProfileComplete(useAuthStore.getState().profile)).toBe(true);
    });
  });
});
