import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeRole } from '../../types/profile';
import { profileService } from '../../services/profile/profileService';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

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
        mfa: {
          getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({ data: { currentLevel: 'aal1' } }),
          listFactors: vi.fn().mockResolvedValue({ data: { totp: [] } }),
        },
      },
      rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  };
});

describe('Super Admin & Admin Role Authorization', () => {
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

  describe('normalizeRole() helper', () => {
    it('normalizes various casing and spacing for SUPER_ADMIN', () => {
      expect(normalizeRole('SUPER_ADMIN')).toBe('SUPER_ADMIN');
      expect(normalizeRole('super_admin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('Super Admin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('super admin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('superadmin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('SUPER-ADMIN')).toBe('SUPER_ADMIN');
    });

    it('normalizes various casing and spacing for ADMIN', () => {
      expect(normalizeRole('ADMIN')).toBe('ADMIN');
      expect(normalizeRole('admin')).toBe('ADMIN');
      expect(normalizeRole('Admin')).toBe('ADMIN');
      expect(normalizeRole('administrator')).toBe('ADMIN');
    });

    it('handles standard and fallback roles', () => {
      expect(normalizeRole('PROVIDER')).toBe('PROVIDER');
      expect(normalizeRole('provider')).toBe('PROVIDER');
      expect(normalizeRole('USER')).toBe('USER');
      expect(normalizeRole('user')).toBe('USER');
      expect(normalizeRole(null)).toBe('USER');
      expect(normalizeRole(undefined)).toBe('USER');
    });
  });

  describe('profileService with Super Admin roles', () => {
    it('grants global admin permissions when profile.role is SUPER_ADMIN or super admin', async () => {
      const mockAdminDbRow = {
        id: 'adm-999',
        email: 'admin@norwaysmartlife.no',
        full_name: 'Platform Super Admin',
        role: 'super admin',
        phone: '+4799999999',
        country: 'Norway',
        city: 'Oslo',
      };

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockAdminDbRow, error: null }),
        }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock };
        return { select: vi.fn() };
      });

      const profile = await profileService.getProfile('adm-999');

      expect(profile).toBeDefined();
      expect(profile?.role).toBe('SUPER_ADMIN');
      expect(profile?.permissions).toContain('users.manage');
      expect(profile?.permissions).toContain('orders.manage');
      expect(profile?.permissions).toContain('cms.manage');
      expect(profile?.permissions).toContain('system.manage');
    });
  });

  describe('useAuthStore with Super Admin state', () => {
    it('sets isAdmin=true and hasPermission=true for all permissions when profile has role SUPER_ADMIN', async () => {
      useAuthStore.setState({
        user: { id: 'adm-999', email: 'admin@norwaysmartlife.no' } as any,
        profile: {
          id: 'adm-999',
          email: 'admin@norwaysmartlife.no',
          fullName: 'Platform Super Admin',
          role: 'SUPER_ADMIN',
          country: 'Norway',
          city: 'Oslo',
          phoneVerified: true,
          permissions: [],
        },
        isAdmin: true,
      });

      const state = useAuthStore.getState();
      expect(state.isAdmin).toBe(true);
      expect(state.hasPermission('anything.arbitrary')).toBe(true);
      expect(state.hasPermission('system.wipe')).toBe(true);
    });

    it('refreshProfile correctly updates isAdmin when database role is updated to SUPER_ADMIN', async () => {
      useAuthStore.setState({
        user: { id: 'user-to-admin', email: 'promoted@norwaysmartlife.no' } as any,
        profile: {
          id: 'user-to-admin',
          email: 'promoted@norwaysmartlife.no',
          fullName: 'Promoted User',
          role: 'USER',
          country: 'Norway',
          city: 'Bergen',
          phoneVerified: true,
          permissions: [],
        },
        isAdmin: false,
      });

      const mockPromotedRow = {
        id: 'user-to-admin',
        email: 'promoted@norwaysmartlife.no',
        full_name: 'Promoted User',
        role: 'SUPER_ADMIN',
        country: 'Norway',
        city: 'Bergen',
      };

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockPromotedRow, error: null }),
        }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock };
        return { select: vi.fn() };
      });

      await useAuthStore.getState().refreshProfile();

      const state = useAuthStore.getState();
      expect(state.profile?.role).toBe('SUPER_ADMIN');
      expect(state.isAdmin).toBe(true);
      expect(state.hasPermission('admin.access')).toBe(true);
    });
  });
});
