import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../../pages/auth/Register';
import { Login } from '../../pages/auth/Login';
import { supabase } from '../../lib/supabase';

// Mock supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

// Mock profileService
vi.mock('../../services/profile/profileService', () => ({
  profileService: {
    getProfile: vi.fn().mockResolvedValue({
      id: 'test-user-id',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      address: 'Karl Johans gate 1',
      country: 'Norway',
    }),
    updateProfile: vi.fn().mockResolvedValue({}),
    ensureProfileExists: vi.fn().mockResolvedValue({}),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('E2E Journey 1: Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows a user to register and redirects to login', async () => {
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' }, session: { user: { id: 'test-user-id' } } },
      error: null,
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'SecurePass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'SecurePass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: 'Female' },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: '1995-05-15' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Street Address/i), {
      target: { value: 'Storgata 1' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Complete Registration|Create Account/i }));

    // Wait for Supabase call
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        options: {
          data: expect.objectContaining({
            full_name: 'Test User',
            gender: 'Female',
            date_of_birth: '1995-05-15',
            address: 'Storgata 1',
            country: 'Norway',
            role: 'USER',
          }),
        },
      });
    });

    // Should redirect to home
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });
  });

  it('allows a user to login and redirects to home', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'SecurePass123!' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
      });
    });

    // Wait for navigation with timeout for the 500ms delay
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    }, { timeout: 2000 });
  });
});
