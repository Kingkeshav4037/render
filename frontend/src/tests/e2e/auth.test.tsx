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
      data: { user: { id: 'test-user-id' } },
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
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'SecurePass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: 'Test User' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for Supabase call
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        options: {
          data: {
            full_name: 'Test User',
            role: 'USER',
          },
        },
      });
    });

    // Should redirect to home
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
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
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
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

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
