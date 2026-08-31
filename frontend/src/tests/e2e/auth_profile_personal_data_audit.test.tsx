import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../../pages/auth/Login';
import { Register } from '../../pages/auth/Register';
import { ForgotPassword } from '../../pages/auth/ForgotPassword';
import { ResetPassword } from '../../pages/auth/ResetPassword';
import { ProfileOverview } from '../../pages/user/Profile/ProfileOverview';
import { ProfilePreferences } from '../../pages/user/Profile/ProfilePreferences';
import { ProfileSecurity } from '../../pages/user/Profile/ProfileSecurity';
import { ProfilePrivacy } from '../../pages/user/Profile/ProfilePrivacy';
import { Wishlist } from '../../pages/user/Wishlist';
import { Notifications } from '../../pages/user/Notifications';
import { NotificationSettings } from '../../pages/user/NotificationSettings';
import { authService } from '../../services/auth/authService';
import { profileService } from '../../services/profile/profileService';
import { useAuthStore } from '../../store/useAuthStore';

describe('Priority 6: Complete User Account, Authentication & Personal Data System Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock authenticated user in useAuthStore
    useAuthStore.setState({
      user: {
        id: 'test-user-id-42',
        email: 'traveler@norway-smartlife.no',
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: { full_name: 'Sigrid Undset' },
        created_at: '2026-01-01T00:00:00Z'
      } as any,
      profile: {
        id: 'test-user-id-42',
        email: 'traveler@norway-smartlife.no',
        fullName: 'Sigrid Undset',
        phone: '+47 987 65 432',
        country: 'Norway',
        city: 'Lillehammer',
        role: 'USER',
        permissions: []
      } as any,
      loading: false,
      initialized: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Authentication Flow (/login, /register, /forgot-password, /reset-password)', () => {
    it('renders Login page with email/password and method switcher', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();

      // Switch to Phone method
      const phoneBtn = screen.getByRole('button', { name: /Phone OTP/i });
      fireEvent.click(phoneBtn);
      expect(screen.getByPlaceholderText(/987 65 432/i)).toBeInTheDocument();
    });

    it('validates empty email, invalid email format, and empty password', async () => {
      // Temporarily set unauthenticated user
      useAuthStore.setState({ user: null, loading: false });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const submitBtn = screen.getByRole('button', { name: /Sign In/i });
      const emailInput = screen.getByPlaceholderText(/Email address/i);
      const passwordInput = screen.getByPlaceholderText(/Password/i);

      const form = submitBtn.closest('form')!;

      // 1. Empty email
      fireEvent.submit(form);
      expect(screen.getByText(/Please enter your email address/i)).toBeInTheDocument();

      // 2. Invalid email format
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();

      // 3. Empty password
      fireEvent.change(emailInput, { target: { value: 'traveler@norway.com' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Please enter your password/i)).toBeInTheDocument();
    });

    it('sanitizes redirect URLs to prevent open-redirect vulnerabilities', async () => {
      const { sanitizeRedirectUrl } = await import('../../pages/auth/Login');

      // Valid internal paths
      expect(sanitizeRedirectUrl('/trips')).toBe('/trips');
      expect(sanitizeRedirectUrl('/user/bookings')).toBe('/user/bookings');
      expect(sanitizeRedirectUrl('/explore/geirangerfjord')).toBe('/explore/geirangerfjord');

      // Invalid / open redirect attempts
      expect(sanitizeRedirectUrl('https://evil-phishing-site.com')).toBe('/home');
      expect(sanitizeRedirectUrl('//evil.com/phish')).toBe('/home');
      expect(sanitizeRedirectUrl('\\\\evil.com')).toBe('/home');
      expect(sanitizeRedirectUrl(null)).toBe('/home');
      expect(sanitizeRedirectUrl(undefined)).toBe('/home');
    });

    it('renders Register page with name, email, password strength indicator', async () => {
      useAuthStore.setState({ user: null, loading: false });

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      const emailInput = screen.getByPlaceholderText(/Email address/i);
      const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
      const passwordInput = passwordInputs[0];
      const confirmInput = screen.getByPlaceholderText(/Confirm Password/i);

      fireEvent.change(nameInput, { target: { value: 'Roald Amundsen' } });
      fireEvent.change(emailInput, { target: { value: 'roald@expedition.no' } });
      fireEvent.change(passwordInput, { target: { value: 'ArcticExplore2026!' } });
      fireEvent.change(confirmInput, { target: { value: 'ArcticExplore2026!' } });

      expect(screen.getByText(/Strong/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Complete Registration|Create Account/i })).toBeInTheDocument();
    });

    it('validates registration form inputs (name, email, password length, mismatch)', async () => {
      useAuthStore.setState({ user: null, loading: false });

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const submitBtn = screen.getByRole('button', { name: /Complete Registration|Create Account/i });
      const form = submitBtn.closest('form')!;
      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      const emailInput = screen.getByPlaceholderText(/Email address/i);
      const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
      const passwordInput = passwordInputs[0];
      const confirmInput = screen.getByPlaceholderText(/Confirm Password/i);

      // 1. Short / empty name
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();

      // 2. Invalid email
      fireEvent.change(nameInput, { target: { value: 'Fridtjof Nansen' } });
      fireEvent.change(emailInput, { target: { value: 'nansen-invalid' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();

      // 3. Short password
      fireEvent.change(emailInput, { target: { value: 'nansen@fram.no' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();

      // 4. Password mismatch
      fireEvent.change(passwordInput, { target: { value: 'PolarBear123!' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPassword123!' } });
      fireEvent.submit(form);
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('displays confirmation screen when email verification is required by Supabase', async () => {
      useAuthStore.setState({ user: null, loading: false });
      const { supabase } = await import('../../lib/supabase');

      // Mock signUp returning user with no active session (requires email confirmation)
      vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: {
          user: { id: 'test-user-123', email: 'traveler@fjord.no', identities: [{ id: '1' }] } as any,
          session: null,
        },
        error: null,
      });

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      const emailInput = screen.getByPlaceholderText(/Email address/i);
      const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
      const passwordInput = passwordInputs[0];
      const confirmInput = screen.getByPlaceholderText(/Confirm Password/i);
      const submitBtn = screen.getByRole('button', { name: /Complete Registration|Create Account/i });

      fireEvent.change(nameInput, { target: { value: 'Fjord Explorer' } });
      fireEvent.change(emailInput, { target: { value: 'traveler@fjord.no' } });
      fireEvent.change(passwordInput, { target: { value: 'NordicSummer2026!' } });
      fireEvent.change(confirmInput, { target: { value: 'NordicSummer2026!' } });

      // Fill required profile fields
      const genderSelect = screen.getByLabelText(/Gender/i);
      const dobInput = screen.getByLabelText(/Date of Birth/i);
      const addressInput = screen.getByPlaceholderText(/Street Address/i);

      fireEvent.change(genderSelect, { target: { value: 'Female' } });
      fireEvent.change(dobInput, { target: { value: '1995-05-15' } });
      fireEvent.change(addressInput, { target: { value: 'Storgata 1' } });

      fireEvent.submit(submitBtn.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Check your email/i)).toBeInTheDocument();
        expect(screen.getByText(/traveler@fjord.no/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Return to Login/i })).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('renders ForgotPassword page and dispatches password recovery link', async () => {
      const resetSpy = vi.spyOn(authService, 'resetPasswordForEmail').mockResolvedValue({} as any);

      render(
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/Email address/i);
      fireEvent.change(emailInput, { target: { value: 'roald@expedition.no' } });

      const submitBtn = screen.getByRole('button', { name: /Send Reset Link/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(resetSpy).toHaveBeenCalledWith('roald@expedition.no');
        expect(screen.getByText(/If an account exists for/i)).toBeInTheDocument();
        expect(screen.getByText(/roald@expedition.no/i)).toBeInTheDocument();
      });
    });

    it('renders ResetPassword invalid link state when unauthenticated/no recovery session', async () => {
      const { supabase } = await import('../../lib/supabase');
      vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({ data: { session: null }, error: null });
      useAuthStore.setState({ user: null, loading: false });

      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Invalid or Expired Link/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Request a New Link/i })).toBeInTheDocument();
      });
    });

    it('renders ResetPassword form when recovery session is valid and updates password', async () => {
      const { supabase } = await import('../../lib/supabase');
      vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
        data: { session: { user: { id: 'test-recovery-user' } } as any },
        error: null
      });
      useAuthStore.setState({ user: { id: 'test-recovery-user', email: 'user@norway.no' } as any, loading: false });

      const updatePasswordSpy = vi.spyOn(authService, 'updatePassword').mockResolvedValue({} as any);

      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/^New Password$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm New Password/i)).toBeInTheDocument();
      });

      const newPassInput = screen.getByPlaceholderText(/^New Password$/i);
      const confirmPassInput = screen.getByPlaceholderText(/Confirm New Password/i);

      fireEvent.change(newPassInput, { target: { value: 'NewNordicSecret2026!' } });
      fireEvent.change(confirmPassInput, { target: { value: 'NewNordicSecret2026!' } });

      const submitBtn = screen.getByRole('button', { name: /Set New Password/i });
      fireEvent.submit(submitBtn.closest('form')!);

      await waitFor(() => {
        expect(updatePasswordSpy).toHaveBeenCalledWith('NewNordicSecret2026!');
        expect(screen.getByText(/Password Updated!/i)).toBeInTheDocument();
      });
    });
  });

  describe('2. Profile Management (/profile, /profile/overview, /profile/security, /profile/privacy)', () => {
    it('renders ProfileOverview with traveler stats, completion tracker, and edit modal', async () => {
      const updateProfileSpy = vi.spyOn(profileService, 'updateProfile').mockResolvedValue({} as any);

      render(
        <BrowserRouter>
          <ProfileOverview />
        </BrowserRouter>
      );

      expect(screen.getAllByText('Sigrid Undset')[0]).toBeInTheDocument();
      expect(screen.getByText(/Invoices & Tax Receipts \(MVA\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Lillehammer, Norway/i)[0]).toBeInTheDocument();

      // Open Edit Modal
      const editBtns = screen.getAllByRole('button', { name: /Edit Profile/i });
      fireEvent.click(editBtns[0]);

      expect(screen.getByDisplayValue('Sigrid Undset')).toBeInTheDocument();
      const cityInput = screen.getByDisplayValue('Lillehammer');
      fireEvent.change(cityInput, { target: { value: 'Tromsø' } });

      const saveBtn = screen.getByRole('button', { name: /Save Profile/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(updateProfileSpy).toHaveBeenCalled();
        const storedProfile = JSON.parse(localStorage.getItem('nsl_user_profile') || '{}');
        expect(storedProfile.city).toBe('Tromsø');
      });
    });

    it('renders ProfileSecurity with password management, 2FA toggle, and remote sessions', async () => {
      render(
        <BrowserRouter>
          <ProfileSecurity />
        </BrowserRouter>
      );

      expect(screen.getByText(/Account Password/i)).toBeInTheDocument();
      expect(screen.getByText(/Two-Factor Authentication/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary Browser Session/i)).toBeInTheDocument();

      // Open Password Update Modal
      const updatePassBtn = screen.getByRole('button', { name: /Update Password/i });
      fireEvent.click(updatePassBtn);

      expect(screen.getByPlaceholderText(/Minimum 6 characters/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Repeat new password/i)).toBeInTheDocument();
    });

    it('renders ProfilePrivacy with data usage toggles and JSON data export trigger', async () => {
      render(
        <BrowserRouter>
          <ProfilePrivacy />
        </BrowserRouter>
      );

      expect(screen.getByText(/Marketing Communications/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Recommendation Engine/i)).toBeInTheDocument();
      expect(screen.getByText(/Download Export \(\.json\)/i)).toBeInTheDocument();

      // Toggle a privacy setting
      const marketingToggle = screen.getByText(/Marketing Communications/i).closest('div');
      fireEvent.click(marketingToggle!);

      const storedPrivacy = JSON.parse(localStorage.getItem('nsl_user_privacy') || '{}');
      expect(storedPrivacy.marketing).toBe(true);
    });
  });

  describe('3. Saved Items & Wishlist (/wishlist, /favorites, /saved)', () => {
    it('renders Wishlist with real saved destinations, categories, add to trip and remove actions', async () => {
      render(
        <BrowserRouter>
          <Wishlist />
        </BrowserRouter>
      );

      expect(screen.getByText(/Saved Places & Favorites/i)).toBeInTheDocument();
      expect(screen.getByText(/Geirangerfjord/i)).toBeInTheDocument();
      expect(screen.getByText(/Reinebringen Ridge Trail/i)).toBeInTheDocument();

      // Filter by category
      const trailTab = screen.getByRole('button', { name: /Trails & Peaks/i });
      fireEvent.click(trailTab);
      expect(screen.getByText(/Reinebringen Ridge Trail/i)).toBeInTheDocument();
      expect(screen.queryByText(/Geirangerfjord/i)).not.toBeInTheDocument();

      // Switch back to All
      const allTab = screen.getByRole('button', { name: /All Saved/i });
      fireEvent.click(allTab);

      // Add to Trip
      const addToTripButtons = screen.getAllByRole('button', { name: /Add to Trip/i });
      fireEvent.click(addToTripButtons[0]);

      const savedTrips = JSON.parse(localStorage.getItem('nsl_user_saved_trips') || '[]');
      expect(savedTrips.length).toBeGreaterThan(0);

      // Remove an item
      const removeBtn = screen.getByLabelText(/Remove Geirangerfjord from favorites/i);
      fireEvent.click(removeBtn);
      expect(screen.queryByText(/Geirangerfjord/i)).not.toBeInTheDocument();
    });
  });

  describe('4. Notification Center & Preferences (/notifications, /settings/notifications)', () => {
    it('renders Notifications list with alert filtering, unread badges, and mark all as read', async () => {
      render(
        <BrowserRouter>
          <Notifications />
        </BrowserRouter>
      );

      expect(screen.getByText(/Notification Center/i)).toBeInTheDocument();
      expect(screen.getByText(/Severe Mountain Weather Advisory/i)).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Scenic Route Departure/i)).toBeInTheDocument();

      // Filter by Bookings & Receipts
      const paymentFilter = screen.getByRole('button', { name: /Bookings & Receipts/i });
      fireEvent.click(paymentFilter);
      expect(screen.getByText(/Booking Payment Confirmed/i)).toBeInTheDocument();
      expect(screen.queryByText(/Upcoming Scenic Route Departure/i)).not.toBeInTheDocument();

      // Reset to All Notifications
      const allFilter = screen.getByRole('button', { name: /All Notifications/i });
      fireEvent.click(allFilter);

      // Mark All Read
      const markAllBtn = screen.getByRole('button', { name: /Mark All Read/i });
      fireEvent.click(markAllBtn);

      const stored = JSON.parse(localStorage.getItem('nsl_user_notifications') || '[]');
      expect(stored.every((n: any) => n.read)).toBe(true);
    });

    it('renders NotificationSettings with multi-channel preferences matrix and persistence', async () => {
      render(
        <BrowserRouter>
          <NotificationSettings />
        </BrowserRouter>
      );

      expect(screen.getByText(/Aurora Alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/Weather Warnings/i)).toBeInTheDocument();
      expect(screen.getByText(/Booking Updates/i)).toBeInTheDocument();

      const saveBtn = screen.getByRole('button', { name: /Save Preferences/i });
      fireEvent.click(saveBtn);

      const stored = JSON.parse(localStorage.getItem('nsl_user_notification_prefs') || '{}');
      expect(stored.push).toBeDefined();
      expect(stored.push.weatherWarnings).toBe(true);
    });

    it('renders ProfilePreferences and persists travel styles, regions, and transport modes', async () => {
      render(
        <BrowserRouter>
          <ProfilePreferences />
        </BrowserRouter>
      );

      expect(screen.getByText(/Travel Preferences & Interests/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Adventure$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Fjords$/i })).toBeInTheDocument();

      // Click save preferences
      const saveBtn = screen.getByRole('button', { name: /Save Preferences/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        const storedPrefs = JSON.parse(localStorage.getItem('nsl_user_preferences') || '{}');
        expect(storedPrefs.styles).toBeDefined();
        expect(storedPrefs.styles).toContain('Adventure');
      });
    });
  });

  describe('5. Authentication Session & Logout Security', () => {
    it('performs complete logout and clears auth state and user credentials', async () => {
      const signOutSpy = vi.spyOn(authService, 'logout').mockResolvedValue({} as any);

      // Verify store has active user before logout
      useAuthStore.setState({
        user: { id: 'test-logged-in-user', email: 'traveler@norway.no' } as any,
        profile: { fullName: 'Active Traveler', email: 'traveler@norway.no', role: 'USER' } as any,
        loading: false,
      });

      expect(useAuthStore.getState().user).not.toBeNull();

      // Invoke signOut on store
      await useAuthStore.getState().signOut();

      // Confirm auth state is completely cleared
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().profile).toBeNull();
      expect(useAuthStore.getState().isAdmin).toBe(false);
      expect(useAuthStore.getState().isProvider).toBe(false);
    });
  });
});
