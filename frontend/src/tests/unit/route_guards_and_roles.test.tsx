/**
 * Unit Tests: Route Guards & Role / Permission Checks
 *
 * Verifies:
 * - ProtectedRoute: Redirects unauthenticated users to /login, shows loader while loading, renders Outlet when authenticated
 * - RoleGuard: Allows users with authorized roles, redirects unauthorized users to custom path, redirects unauthenticated to /login with state.from
 * - ProviderGuard: Authorizes PROVIDER, ADMIN, SUPER_ADMIN; redirects standard USER to /home
 * - useAuthStore: Role flags (isAdmin, isProvider, isAnalyst), permission checks (hasPermission), SUPER_ADMIN wildcard bypass
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { RoleGuard } from '../../components/layout/RoleGuard';
import { ProviderGuard } from '../../components/layout/ProviderGuard';
import { useAuthStore } from '../../store/useAuthStore';

describe('Unit Tests: Route Guards & Role / Permission Checks', () => {

  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({
      user: null,
      profile: null,
      loading: false,
      initialized: true,
      isAdmin: false,
      isProvider: false,
      isAnalyst: false,
      permissions: [],
      mfaLevel: 'aal1',
    });
  });

  // ─── 1. ProtectedRoute ─────────────────────────────────────────────────────
  describe('ProtectedRoute', () => {
    it('shows loading message when auth state is loading', () => {
      useAuthStore.setState({ user: null, loading: true });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Secret</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/loading\.\.\./i)).toBeTruthy();
      expect(screen.queryByText('Protected Secret')).toBeNull();
    });

    it('redirects unauthenticated user to /login', () => {
      useAuthStore.setState({ user: null, loading: false });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Secret</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeTruthy();
      expect(screen.queryByText('Protected Secret')).toBeNull();
    });

    it('renders protected content when user is logged in', () => {
      useAuthStore.setState({
        user: { id: 'u1', email: 'user@test.no' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Secret</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Secret')).toBeTruthy();
    });
  });

  // ─── 2. RoleGuard ──────────────────────────────────────────────────────────
  describe('RoleGuard', () => {
    it('redirects unauthenticated user to /login with location state', () => {
      useAuthStore.setState({ user: null, profile: null, loading: false });

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<div>Admin Panel</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeTruthy();
      expect(screen.queryByText('Admin Panel')).toBeNull();
    });

    it('redirects authenticated user without the required role to custom redirectPath', () => {
      useAuthStore.setState({
        user: { id: 'u1' } as any,
        profile: { id: 'u1', role: 'USER' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route element={<RoleGuard allowedRoles={['ADMIN']} redirectPath="/home" />}>
              <Route path="/admin/users" element={<div>Admin Users</div>} />
            </Route>
            <Route path="/home" element={<div>Public Home</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Public Home')).toBeTruthy();
      expect(screen.queryByText('Admin Users')).toBeNull();
    });

    it('renders protected children when user has an allowed role', () => {
      useAuthStore.setState({
        user: { id: 'admin-01' } as any,
        profile: { id: 'admin-01', role: 'ADMIN' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/admin/destinations']}>
          <Routes>
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/admin/destinations" element={<div>Destinations CMS</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Destinations CMS')).toBeTruthy();
    });
  });

  // ─── 3. ProviderGuard ──────────────────────────────────────────────────────
  describe('ProviderGuard', () => {
    it('authorizes PROVIDER role to view provider portal', () => {
      useAuthStore.setState({
        user: { id: 'p1' } as any,
        profile: { id: 'p1', role: 'PROVIDER' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/provider/listings']}>
          <Routes>
            <Route element={<ProviderGuard />}>
              <Route path="/provider/listings" element={<div>Provider Listings Hub</div>} />
            </Route>
            <Route path="/home" element={<div>Home</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Provider Listings Hub')).toBeTruthy();
    });

    it('allows SUPER_ADMIN and ADMIN into provider portal as well', () => {
      useAuthStore.setState({
        user: { id: 'sa1' } as any,
        profile: { id: 'sa1', role: 'SUPER_ADMIN' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/provider/dashboard']}>
          <Routes>
            <Route element={<ProviderGuard />}>
              <Route path="/provider/dashboard" element={<div>Provider Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Provider Dashboard')).toBeTruthy();
    });

    it('blocks regular USER from accessing provider portal', () => {
      useAuthStore.setState({
        user: { id: 'u1' } as any,
        profile: { id: 'u1', role: 'USER' } as any,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/provider/dashboard']}>
          <Routes>
            <Route element={<ProviderGuard />}>
              <Route path="/provider/dashboard" element={<div>Provider Dashboard</div>} />
            </Route>
            <Route path="/home" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Home Page')).toBeTruthy();
      expect(screen.queryByText('Provider Dashboard')).toBeNull();
    });
  });

  // ─── 4. useAuthStore Permission & Role Logic ───────────────────────────────
  describe('useAuthStore: Role & Permission Evaluations', () => {
    it('grants all permissions implicitly for SUPER_ADMIN role', () => {
      useAuthStore.setState({
        user: { id: 'sa-01' } as any,
        profile: { id: 'sa-01', role: 'SUPER_ADMIN' } as any,
        permissions: [], // empty permissions array
      });

      const store = useAuthStore.getState();
      expect(store.hasPermission('destinations:delete')).toBe(true);
      expect(store.hasPermission('users:manage')).toBe(true);
      expect(store.hasPermission('system:nuke')).toBe(true);
    });

    it('checks explicit permission list for non-SUPER_ADMIN users', () => {
      useAuthStore.setState({
        user: { id: 'mod-01' } as any,
        profile: { id: 'mod-01', role: 'MODERATOR' } as any,
        permissions: ['reviews:moderate', 'content:edit'],
      });

      const store = useAuthStore.getState();
      expect(store.hasPermission('reviews:moderate')).toBe(true);
      expect(store.hasPermission('content:edit')).toBe(true);
      expect(store.hasPermission('users:delete')).toBe(false);
    });

    it('resets state properly on signOut', async () => {
      useAuthStore.setState({
        user: { id: 'u1' } as any,
        profile: { id: 'u1', role: 'ADMIN' } as any,
        isAdmin: true,
        permissions: ['*'],
      });

      await useAuthStore.getState().signOut();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.isAdmin).toBe(false);
      expect(state.permissions).toEqual([]);
    });
  });
});
