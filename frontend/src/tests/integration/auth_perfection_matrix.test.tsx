import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/auth/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { RoleGuard } from '../../components/layout/RoleGuard';
import { ProviderGuard } from '../../components/layout/ProviderGuard';
import { Login } from '../../pages/auth/Login';
import { Register } from '../../pages/auth/Register';
import { ResetPassword } from '../../pages/auth/ResetPassword';
import { AuthCallback } from '../../pages/auth/AuthCallback';
import { CompleteProfile } from '../../pages/auth/CompleteProfile';

// ─── Polyfills & State Reset ──────────────────────────────────────────
beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  useAuthStore.setState({
    user: null,
    profile: null,
    isAdmin: false,
    isProvider: false,
    isAnalyst: false,
    loading: false,
    initialized: true,
  });
  vi.clearAllMocks();
});

// Mock Supabase Auth & Profile services
vi.mock('../../lib/supabase', () => {
  return {
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-anon-key',
    supabase: {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signInWithOtp: vi.fn(),
        verifyOtp: vi.fn(),
        signInWithOAuth: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        setSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        getUser: vi.fn(),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
        mfa: {
          getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
            data: { currentLevel: 'aal1', nextLevel: 'aal1' },
            error: null,
          }),
        },
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    },
  };
});

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Phase 4 — Authentication & Multi-Role RBAC Perfection Matrix', () => {

  // ─── 1. Email Authentication Workflows ──────────────────────────────────────
  describe('1. Email Authentication: Registration, Login & Sign Out', () => {
    it('successfully registers new user with role metadata via UI and prompts email confirmation', async () => {
      (supabase.auth.signUp as any).mockResolvedValueOnce({
        data: {
          user: { id: 'usr-new-01', email: 'norway.explorer@fjord.no', user_metadata: { role: 'USER', full_name: 'Astrid Lind' } },
          session: null,
        },
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      const nameInput = screen.getByPlaceholderText(/full name/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/^password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm password/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const addressInput = screen.getByPlaceholderText(/street address/i);

      fireEvent.change(nameInput, { target: { value: 'Astrid Lind' } });
      fireEvent.change(emailInput, { target: { value: 'norway.explorer@fjord.no' } });
      fireEvent.change(passwordInput, { target: { value: 'SecureNordic2026!' } });
      fireEvent.change(confirmInput, { target: { value: 'SecureNordic2026!' } });
      fireEvent.change(genderSelect, { target: { value: 'Female' } });
      fireEvent.change(dobInput, { target: { value: '1995-06-15' } });
      fireEvent.change(addressInput, { target: { value: 'Karl Johans gate 1' } });

      const submitBtn = screen.getByRole('button', { name: /complete registration/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({
          email: 'norway.explorer@fjord.no',
          password: 'SecureNordic2026!',
          options: expect.objectContaining({
            data: expect.objectContaining({
              full_name: 'Astrid Lind',
              gender: 'Female',
              address: 'Karl Johans gate 1',
            }),
          }),
        }));
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('handles duplicate email registration conflict with human-readable error', async () => {
      (supabase.auth.signUp as any).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Register />
        </MemoryRouter>
      );

      const nameInput = screen.getByPlaceholderText(/full name/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/^password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm password/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const addressInput = screen.getByPlaceholderText(/street address/i);

      fireEvent.change(nameInput, { target: { value: 'Existing User' } });
      fireEvent.change(emailInput, { target: { value: 'existing@norway.no' } });
      fireEvent.change(passwordInput, { target: { value: 'SecureNordic2026!' } });
      fireEvent.change(confirmInput, { target: { value: 'SecureNordic2026!' } });
      fireEvent.change(genderSelect, { target: { value: 'Male' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.change(addressInput, { target: { value: 'Bryggen 5' } });

      const submitBtn = screen.getByRole('button', { name: /complete registration/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
      });
    });

    it('authenticates user with valid email & password and stores credentials', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
        data: {
          user: { id: 'usr-valid-01', email: 'traveler@norway.no' },
          session: { access_token: 'valid_jwt_token', user: { id: 'usr-valid-01' } },
        },
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<div>Home Portal</div>} />
          </Routes>
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/^password/i);

      fireEvent.change(emailInput, { target: { value: 'traveler@norway.no' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

      const loginBtn = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'traveler@norway.no',
          password: 'Password123!',
        });
      });
    });

    it('rejects invalid password with human-readable error', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/^password/i);

      fireEvent.change(emailInput, { target: { value: 'traveler@norway.no' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPassword!' } });

      const loginBtn = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
      });
    });

    it('destroys session and resets store on signOut', async () => {
      useAuthStore.setState({
        user: { id: 'usr-01', email: 'test@norway.no' } as any,
        profile: { id: 'usr-01', role: 'USER', email: 'test@norway.no' } as any,
        isAdmin: false,
        isProvider: false,
        loading: false,
      });

      await useAuthStore.getState().signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.isAdmin).toBe(false);
    });
  });

  // ─── 2. Google OAuth & Auth Callback ────────────────────────────────────────
  describe('2. Google OAuth & Auth Callback Flow', () => {
    it('initiates Google OAuth redirect with proper redirectTo options', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValueOnce({ data: { url: 'https://accounts.google.com/o/oauth2/auth' }, error: null });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      );

      const googleBtn = screen.getByRole('button', { name: /google/i });
      fireEvent.click(googleBtn);

      await waitFor(() => {
        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith(expect.objectContaining({
          provider: 'google',
          options: expect.objectContaining({
            redirectTo: expect.stringContaining('/auth/callback'),
          }),
        }));
      });
    });

    it('AuthCallback handles successful token exchange and navigates to complete-profile or home', async () => {
      (supabase.auth.getSession as any).mockResolvedValue({
        data: {
          session: {
            user: { id: 'oauth-user-01', email: 'google.traveler@gmail.com' },
          },
        },
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/auth/callback']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<div>Complete Profile View</div>} />
            <Route path="/home" element={<div>Welcome Home Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/complete profile view|welcome home page/i)).toBeInTheDocument();
      });
    });

    it('AuthCallback handles unauthenticated state by redirecting to login', async () => {
      (supabase.auth.getSession as any).mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/auth/callback']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<div>Login Target Portal</div>} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Target Portal')).toBeInTheDocument();
      });
    });

    it('CompleteProfile renders and accepts missing profile fields', async () => {
      useAuthStore.setState({
        user: { id: 'oauth-user-01', email: 'google.traveler@gmail.com' } as any,
        profile: { id: 'oauth-user-01', email: 'google.traveler@gmail.com', role: 'USER' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/complete-profile']}>
          <CompleteProfile />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /complete your profile/i })).toBeInTheDocument();
    });
  });

  // ─── 3. Password Management (Forgot & Reset) ────────────────────────────────
  describe('3. Password Management: Recovery & Update', () => {
    it('dispatches password reset email instructions via authService', async () => {
      (supabase.auth.resetPasswordForEmail as any).mockResolvedValueOnce({ data: {}, error: null });

      await authService.resetPasswordForEmail('forgot@norway.no');
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'forgot@norway.no',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback?type=recovery'),
        })
      );
    });

    it('updates password when user calls updatePassword in recovery session', async () => {
      (supabase.auth.updateUser as any).mockResolvedValueOnce({
        data: { user: { id: 'usr-01', email: 'forgot@norway.no' } },
        error: null,
      });

      await authService.updatePassword('BrandNewNordicPassword2026!');

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'BrandNewNordicPassword2026!',
      });
    });

    it('renders ResetPassword form and updates credentials when recovery session is present', async () => {
      (supabase.auth.getSession as any).mockResolvedValue({
        data: {
          session: {
            user: { id: 'usr-recovery-01', email: 'recovery@norway.no' },
          },
        },
        error: null,
      });
      (supabase.auth.updateUser as any).mockResolvedValue({
        data: { user: { id: 'usr-recovery-01', email: 'recovery@norway.no' } },
        error: null,
      });

      useAuthStore.setState({
        user: { id: 'usr-recovery-01', email: 'recovery@norway.no' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <ResetPassword />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/^new password/i)).toBeInTheDocument();
      });

      const newPassInput = screen.getByPlaceholderText(/^new password/i);
      const confirmPassInput = screen.getByPlaceholderText(/confirm new password/i);

      fireEvent.change(newPassInput, { target: { value: 'BrandNewNordicPassword2026!' } });
      fireEvent.change(confirmPassInput, { target: { value: 'BrandNewNordicPassword2026!' } });

      const setPasswordBtn = screen.getByRole('button', { name: /set new password/i });
      fireEvent.click(setPasswordBtn);

      await waitFor(() => {
        expect(supabase.auth.updateUser).toHaveBeenCalledWith({
          password: 'BrandNewNordicPassword2026!',
        });
      });
    });
  });

  // ─── 4. Session Persistence & Refresh Lifecycle ─────────────────────────────
  describe('4. Session Lifecycle & Persistence', () => {
    it('restores user session on page hydration via getSession', async () => {
      (supabase.auth.getSession as any).mockResolvedValueOnce({
        data: {
          session: {
            user: { id: 'stored-user-01', email: 'persisted@norway.no' },
          },
        },
        error: null,
      });

      useAuthStore.setState({ initialized: false, user: null, loading: true });
      useAuthStore.getState().initialize();

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.user?.email).toBe('persisted@norway.no');
        expect(state.loading).toBe(false);
      });
    });

    it('handles unauthenticated state gracefully when getSession returns null', async () => {
      (supabase.auth.getSession as any).mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      useAuthStore.setState({ initialized: false, user: null, loading: true });
      useAuthStore.getState().initialize();

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.loading).toBe(false);
      });
    });
  });

  // ─── 5. Multi-Role RBAC Authorization Matrix ────────────────────────────────
  describe('5. Multi-Role RBAC Authorization Matrix', () => {

    // ── GUEST (Unauthenticated) ──
    describe('Guest Role (Unauthenticated)', () => {
      beforeEach(() => {
        useAuthStore.setState({
          user: null,
          profile: null,
          isAdmin: false,
          isProvider: false,
          loading: false,
        });
      });

      it('blocks guest from protected traveler route and redirects to /login', () => {
        render(
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['USER', 'PROVIDER', 'ADMIN']} />}>
                <Route path="/profile" element={<div>Private Profile View</div>} />
              </Route>
              <Route path="/login" element={<div>Login Page Destination</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Login Page Destination')).toBeInTheDocument();
        expect(screen.queryByText('Private Profile View')).not.toBeInTheDocument();
      });

      it('blocks guest from provider portal and redirects to /login', () => {
        render(
          <MemoryRouter initialEntries={['/provider']}>
            <Routes>
              <Route element={<ProviderGuard />}>
                <Route path="/provider" element={<div>Provider Portal</div>} />
              </Route>
              <Route path="/login" element={<div>Login Page Destination</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Login Page Destination')).toBeInTheDocument();
        expect(screen.queryByText('Provider Portal')).not.toBeInTheDocument();
      });

      it('blocks guest from admin portal and redirects to /admin/login', () => {
        render(
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} redirectPath="/admin/login" />}>
                <Route path="/admin" element={<div>Admin Control Center</div>} />
              </Route>
              <Route path="/admin/login" element={<div>Admin Login Portal</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Admin Login Portal')).toBeInTheDocument();
        expect(screen.queryByText('Admin Control Center')).not.toBeInTheDocument();
      });
    });

    // ── USER (Traveler) ──
    describe('User Role (Standard Traveler)', () => {
      beforeEach(() => {
        useAuthStore.setState({
          user: { id: 'usr-traveler-01', email: 'traveler@norway.no' } as any,
          profile: { id: 'usr-traveler-01', role: 'USER', email: 'traveler@norway.no' } as any,
          isAdmin: false,
          isProvider: false,
          loading: false,
        });
      });

      it('allows user to access traveler profile and bookings', () => {
        render(
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['USER', 'PROVIDER', 'ADMIN']} />}>
                <Route path="/profile" element={<div>Traveler Profile View</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Traveler Profile View')).toBeInTheDocument();
      });

      it('blocks standard user from provider portal and redirects to /home', () => {
        render(
          <MemoryRouter initialEntries={['/provider']}>
            <Routes>
              <Route element={<ProviderGuard />}>
                <Route path="/provider" element={<div>Provider Secret Hub</div>} />
              </Route>
              <Route path="/home" element={<div>User Home Page</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('User Home Page')).toBeInTheDocument();
        expect(screen.queryByText('Provider Secret Hub')).not.toBeInTheDocument();
      });

      it('blocks standard user from admin portal and redirects to /home', () => {
        render(
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} redirectPath="/home" />}>
                <Route path="/admin" element={<div>Admin Control Center</div>} />
              </Route>
              <Route path="/home" element={<div>User Home Page</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('User Home Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Control Center')).not.toBeInTheDocument();
      });
    });

    // ── PROVIDER (Host / Partner) ──
    describe('Provider Role (Experience Host & Operator)', () => {
      beforeEach(() => {
        useAuthStore.setState({
          user: { id: 'provider-01', email: 'host@geiranger.no' } as any,
          profile: { id: 'provider-01', role: 'PROVIDER', email: 'host@geiranger.no' } as any,
          isAdmin: false,
          isProvider: true,
          loading: false,
        });
      });

      it('allows provider to access provider dashboard', () => {
        render(
          <MemoryRouter initialEntries={['/provider']}>
            <Routes>
              <Route element={<ProviderGuard />}>
                <Route path="/provider" element={<div>Provider Operations Dashboard</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Provider Operations Dashboard')).toBeInTheDocument();
      });

      it('blocks provider from admin portal and redirects to /home', () => {
        render(
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} redirectPath="/home" />}>
                <Route path="/admin" element={<div>Admin Control Center</div>} />
              </Route>
              <Route path="/home" element={<div>Home Portal</div>} />
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Home Portal')).toBeInTheDocument();
        expect(screen.queryByText('Admin Control Center')).not.toBeInTheDocument();
      });
    });

    // ── ADMIN / SUPER_ADMIN ──
    describe('Admin & Super Admin Role', () => {
      beforeEach(() => {
        useAuthStore.setState({
          user: { id: 'admin-01', email: 'admin@norway.no' } as any,
          profile: { id: 'admin-01', role: 'ADMIN', email: 'admin@norway.no' } as any,
          isAdmin: true,
          isProvider: false,
          loading: false,
        });
      });

      it('allows admin to access admin control center', () => {
        render(
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
                <Route path="/admin" element={<div>Admin System Control Center</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Admin System Control Center')).toBeInTheDocument();
      });

      it('allows admin to also access provider hub with oversight permissions', () => {
        render(
          <MemoryRouter initialEntries={['/provider']}>
            <Routes>
              <Route element={<ProviderGuard />}>
                <Route path="/provider" element={<div>Provider Hub (Admin Oversight)</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        );

        expect(screen.getByText('Provider Hub (Admin Oversight)')).toBeInTheDocument();
      });
    });
  });
});
