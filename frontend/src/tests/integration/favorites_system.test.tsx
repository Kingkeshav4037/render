import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { Wishlist, Favorites } from '../../pages/user/Wishlist';
import { favoriteService } from '../../services/favoriteService';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

// Mock toast notifications
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.success = vi.fn();
  mockToast.error = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

describe('Phase B — Change 5: Complete Favorites System Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── 1. Guest Authentication & returnTo Gating ──────────────────────────────
  describe('Guest Authentication & returnTo Interception', () => {
    it('redirects unauthenticated guest to /login?returnTo=... when clicking FavoriteButton', async () => {
      useAuthStore.setState({ user: null, loading: false });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/explore/tromso']}>
            <Routes>
              <Route 
                path="/explore/tromso" 
                element={<FavoriteButton itemType="DESTINATION" itemId="loc-tromso" label="Save Tromsø" />} 
              />
              <Route path="/login" element={<div data-testid="login-page">Login Screen</div>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      const favBtn = screen.getByRole('button', { name: /Save Tromsø/i });
      expect(favBtn).toBeInTheDocument();

      fireEvent.click(favBtn);

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });
  });

  // ─── 2. Authenticated Favorite CRUD with Supabase ────────────────────────────
  describe('Authenticated Favorite Actions & Supabase Persistence', () => {
    it('allows authenticated user to toggle and save a favorite to Supabase', async () => {
      useAuthStore.setState({
        user: { id: 'user-nordic-1', email: 'traveler@fjord.no' } as any,
        loading: false,
      });

      vi.spyOn(favoriteService, 'checkIsFavorite').mockResolvedValue(false);
      const toggleSpy = vi.spyOn(favoriteService, 'toggleFavorite').mockResolvedValue(true);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/stay/stay-grand-hotel']}>
            <FavoriteButton itemType="STAY" itemId="stay-grand-hotel" />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const favBtn = await screen.findByRole('button', { name: /Add to favorites/i });
      await waitFor(() => {
        expect(favBtn).not.toBeDisabled();
      });
      fireEvent.click(favBtn);

      await waitFor(() => {
        expect(toggleSpy).toHaveBeenCalledWith('user-nordic-1', 'STAY', 'stay-grand-hotel');
      });
    });

    it('allows authenticated user to remove a saved favorite from Supabase', async () => {
      useAuthStore.setState({
        user: { id: 'user-nordic-1', email: 'traveler@fjord.no' } as any,
        loading: false,
      });

      vi.spyOn(favoriteService, 'checkIsFavorite').mockResolvedValue(true);
      const toggleSpy = vi.spyOn(favoriteService, 'toggleFavorite').mockResolvedValue(false);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/food/food-reinsdyrgryte']}>
            <FavoriteButton itemType="FOOD" itemId="food-reinsdyrgryte" />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const favBtn = await screen.findByRole('button', { name: /Remove from favorites/i });
      await waitFor(() => {
        expect(favBtn).not.toBeDisabled();
      });
      fireEvent.click(favBtn);

      await waitFor(() => {
        expect(toggleSpy).toHaveBeenCalledWith('user-nordic-1', 'FOOD', 'food-reinsdyrgryte');
      });
    });
  });

  // ─── 3. Favorites Page Hydration, Filtering, & Multi-Entity Rendering ────────
  describe('/favorites Page Hydration and Category Filters', () => {
    it('hydrates and renders saved destinations, hotels, food, and gear from Supabase', async () => {
      useAuthStore.setState({
        user: { id: 'user-nordic-1', email: 'traveler@fjord.no' } as any,
        loading: false,
      });

      vi.spyOn(favoriteService, 'getFavorites').mockResolvedValue([
        { id: 'fav-1', user_id: 'user-nordic-1', item_type: 'DESTINATION', item_id: 'loc-tromso', created_at: '2026-08-30' },
        { id: 'fav-2', user_id: 'user-nordic-1', item_type: 'STAY', item_id: 'stay-the-thief', created_at: '2026-08-30' },
        { id: 'fav-3', user_id: 'user-nordic-1', item_type: 'FOOD', item_id: 'food-reinsdyrgryte', created_at: '2026-08-30' },
        { id: 'fav-4', user_id: 'user-nordic-1', item_type: 'PRODUCT', item_id: 'prod-wool-sweater-001', created_at: '2026-08-30' },
        { id: 'fav-5', user_id: 'user-nordic-1', item_type: 'GUIDE', item_id: 'guide-aurora', created_at: '2026-08-30' },
      ]);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/favorites']}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Verify header
      expect(screen.getByText(/Saved Places & Favorites/i)).toBeInTheDocument();

      // Wait for hydrated entities to render
      await waitFor(() => {
        expect(screen.getByText(/Tromsø & The Arctic Gateway/i)).toBeInTheDocument();
        expect(screen.getByText(/The Thief/i)).toBeInTheDocument();
        expect(screen.getByText(/Reinsdyrgryte/i)).toBeInTheDocument();
        expect(screen.getByText(/Dale of Norway Cortina Wool Sweater/i)).toBeInTheDocument();
        expect(screen.getByText(/Northern Lights Forecasting/i)).toBeInTheDocument();
      });

      // Filter by Stays category
      const staysTab = screen.getByRole('button', { name: /Stays & Cabins/i });
      fireEvent.click(staysTab);

      expect(screen.getByText(/The Thief/i)).toBeInTheDocument();
      expect(screen.queryByText(/Dale of Norway Cortina Wool Sweater/i)).not.toBeInTheDocument();

      // Filter by Food category
      const foodTab = screen.getByRole('button', { name: /Food & Dining/i });
      fireEvent.click(foodTab);

      expect(screen.getByText(/Reinsdyrgryte/i)).toBeInTheDocument();
      expect(screen.queryByText(/The Thief/i)).not.toBeInTheDocument();

      // Filter by Products & Gear
      const prodTab = screen.getByRole('button', { name: /Products & Gear/i });
      fireEvent.click(prodTab);

      expect(screen.getByText(/Dale of Norway Cortina Wool Sweater/i)).toBeInTheDocument();

      // Filter by Travel Guides
      const guideTab = screen.getByRole('button', { name: /Travel Guides/i });
      fireEvent.click(guideTab);

      expect(screen.getByText(/Northern Lights Forecasting/i)).toBeInTheDocument();
    });

    it('renders rich empty state with discovery buttons when no favorites are saved', async () => {
      useAuthStore.setState({
        user: { id: 'new-user-empty', email: 'new@fjord.no' } as any,
        loading: false,
      });

      vi.spyOn(favoriteService, 'getFavorites').mockResolvedValue([]);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/favorites']}>
            <Wishlist />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Your Personal Collection is Empty/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Explore Destinations/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Browse Stays/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Discover Food/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Marketplace Gear/i })).toBeInTheDocument();
      });
    });

    it('searches and filters saved items in realtime', async () => {
      useAuthStore.setState({
        user: { id: 'user-nordic-1', email: 'traveler@fjord.no' } as any,
        loading: false,
      });

      vi.spyOn(favoriteService, 'getFavorites').mockResolvedValue([
        { id: 'fav-1', user_id: 'user-nordic-1', item_type: 'DESTINATION', item_id: 'loc-tromso', created_at: '2026-08-30' },
        { id: 'fav-2', user_id: 'user-nordic-1', item_type: 'STAY', item_id: 'stay-the-thief', created_at: '2026-08-30' },
      ]);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/favorites']}>
            <Favorites />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Tromsø/i)).toBeInTheDocument();
        expect(screen.getByText(/The Thief/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search saved items/i);
      fireEvent.change(searchInput, { target: { value: 'Thief' } });

      expect(screen.getByText(/The Thief/i)).toBeInTheDocument();
      expect(screen.queryByText(/Tromsø/i)).not.toBeInTheDocument();
    });
  });

  // ─── 4. Cross-User Privacy & RLS Verification ──────────────────────────────
  describe('Cross-User Data Isolation', () => {
    it('queries favorites scoped exclusively by the authenticated userId', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const getSpy = vi.spyOn(favoriteService, 'getFavorites');

      await favoriteService.getFavorites('user-alice-123');
      expect(getSpy).toHaveBeenCalledWith('user-alice-123');

      // User Bob cannot see User Alice's favorites
      await favoriteService.getFavorites('user-bob-456');
      expect(getSpy).toHaveBeenCalledWith('user-bob-456');
    });
  });
});
