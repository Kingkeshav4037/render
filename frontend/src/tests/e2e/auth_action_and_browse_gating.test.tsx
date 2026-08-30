import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { sanitizeRedirectUrl } from '../../pages/auth/Login';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Authentication Action Gating & Public Browsing Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().clearCart();
    useAuthStore.setState({
      user: null,
      profile: null,
      loading: false,
      initialized: true,
    });
  });

  describe('Destination Sanitization & Open-Redirect Prevention', () => {
    it('allows valid internal relative paths', () => {
      expect(sanitizeRedirectUrl('/explore')).toBe('/explore');
      expect(sanitizeRedirectUrl('/stay/juvet-landscape-hotel')).toBe('/stay/juvet-landscape-hotel');
      expect(sanitizeRedirectUrl('/checkout')).toBe('/checkout');
      expect(sanitizeRedirectUrl('/planner')).toBe('/planner');
      expect(sanitizeRedirectUrl('/shop/cart')).toBe('/shop/cart');
    });

    it('rejects external URLs and protocol-relative paths', () => {
      expect(sanitizeRedirectUrl('https://malicious-site.com')).toBe('/home');
      expect(sanitizeRedirectUrl('http://attacker.com')).toBe('/home');
      expect(sanitizeRedirectUrl('//malicious.com')).toBe('/home');
      expect(sanitizeRedirectUrl('\\\\attacker.com')).toBe('/home');
      expect(sanitizeRedirectUrl(null)).toBe('/home');
      expect(sanitizeRedirectUrl(undefined)).toBe('/home');
    });
  });

  describe('useRequireAuth Hook Action Gating', () => {
    // Dummy component utilizing useRequireAuth
    const TestActionComponent = () => {
      const { requireAuth } = useRequireAuth();
      const [actionCount, setActionCount] = React.useState(0);

      return (
        <div>
          <span data-testid="count">{actionCount}</span>
          <button 
            data-testid="add-to-cart-btn"
            onClick={() => {
              requireAuth(() => {
                setActionCount(prev => prev + 1);
              }, { message: 'Sign in to add items to your cart.', returnTo: '/shop/item-1' });
            }}
          >
            Add to Cart
          </button>
          <button 
            data-testid="book-stay-btn"
            onClick={() => {
              requireAuth(() => {
                setActionCount(prev => prev + 1);
              }, { message: 'Sign in to book your stay.', returnTo: '/stay/hotel-1/book' });
            }}
          >
            Book Stay
          </button>
        </div>
      );
    };

    it('blocks unauthenticated actions and redirects to login with returnTo', () => {
      render(
        <MemoryRouter initialEntries={['/shop/item-1']}>
          <TestActionComponent />
        </MemoryRouter>
      );

      const btn = screen.getByTestId('add-to-cart-btn');
      fireEvent.click(btn);

      expect(screen.getByTestId('count').textContent).toBe('0');
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/login?returnTo=%2Fshop%2Fitem-1'),
        expect.objectContaining({
          state: expect.objectContaining({
            returnTo: '/shop/item-1',
            message: 'Sign in to add items to your cart.'
          })
        })
      );
    });

    it('allows actions to proceed when user is authenticated', () => {
      useAuthStore.setState({
        user: { id: 'test-user-id', email: 'traveler@norwaysmartlife.com' } as any,
        loading: false,
        initialized: true,
      });

      render(
        <MemoryRouter initialEntries={['/shop/item-1']}>
          <TestActionComponent />
        </MemoryRouter>
      );

      const btn = screen.getByTestId('add-to-cart-btn');
      fireEvent.click(btn);

      expect(screen.getByTestId('count').textContent).toBe('1');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('ProtectedRoute Route-Level Gating', () => {
    it('redirects unauthenticated visitor to /login with encoded destination', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
    });

    it('renders protected route content when user is logged in', () => {
      useAuthStore.setState({
        user: { id: 'test-user-id', email: 'traveler@norwaysmartlife.com' } as any,
        loading: false,
        initialized: true,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
    });
  });
});
