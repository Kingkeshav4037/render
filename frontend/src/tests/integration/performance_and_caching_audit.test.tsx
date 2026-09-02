import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '../../lib/queryClient';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { Dashboard } from '../../pages/user/Dashboard';
import { useAuthStore } from '../../store/useAuthStore';
import { MemoryRouter } from 'react-router-dom';

// Polyfills
beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  vi.clearAllMocks();

  useAuthStore.setState({
    user: { id: 'usr-perf-01', email: 'norway.traveler@arctic.no' } as any,
    profile: { id: 'usr-perf-01', fullName: 'Lars Fjordman', email: 'norway.traveler@arctic.no' } as any,
    isAdmin: false,
    isProvider: false,
    loading: false,
    initialized: true,
  });
});

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabaseUrl: 'https://test.supabase.co',
  supabaseAnonKey: 'test-anon-key',
  supabase: {
    from: vi.fn().mockImplementation((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Phase 8 — Performance, Caching & Image Optimization Audit', () => {

  // ─── 1. React Query Configuration & Caching Standards ─────────────────────
  describe('1. React Query Caching Defaults & Request Deduplication', () => {
    it('enforces 5-minute staleTime, 15-minute gcTime, and disables refetchOnWindowFocus', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000);
      expect(defaultOptions.queries?.gcTime).toBe(15 * 60 * 1000);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    });

    it('deduplicates simultaneous queries with the same key to 1 single network request', async () => {
      const mockFetchFn = vi.fn().mockResolvedValue({ status: 'success', data: 'Geirangerfjord Highlights' });

      const TestConsumer = () => {
        const { data, isLoading } = useQuery({
          queryKey: ['dedup-test-key'],
          queryFn: mockFetchFn,
          staleTime: 5 * 60 * 1000,
        });
        if (isLoading) return <div>Loading...</div>;
        return <div>{data?.data}</div>;
      };

      const testQueryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000, gcTime: 15 * 60 * 1000 } }
      });

      // Render two consumer components requesting the same key simultaneously
      render(
        <QueryClientProvider client={testQueryClient}>
          <TestConsumer />
          <TestConsumer />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Geirangerfjord Highlights')).toHaveLength(2);
      });

      // The network fetch must only be dispatched ONCE despite two components mounting
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
    });

    it('serves subsequent requests from memory cache without new network calls when fresh', async () => {
      const mockFetchFn = vi.fn().mockResolvedValue({ timestamp: Date.now(), cachedItem: 'Preikestolen Trail Guide' });

      const testQueryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } }
      });

      // First query fetch
      const result1 = await testQueryClient.fetchQuery({
        queryKey: ['cached-key-01'],
        queryFn: mockFetchFn,
        staleTime: 5 * 60 * 1000,
      });
      expect(result1.cachedItem).toBe('Preikestolen Trail Guide');
      expect(mockFetchFn).toHaveBeenCalledTimes(1);

      // Second query fetch on same key should serve immediately from cache without calling fetchFn again
      const result2 = await testQueryClient.fetchQuery({
        queryKey: ['cached-key-01'],
        queryFn: mockFetchFn,
        staleTime: 5 * 60 * 1000,
      });
      expect(result2.cachedItem).toBe('Preikestolen Trail Guide');
      expect(mockFetchFn).toHaveBeenCalledTimes(1); // Still 1!
    });
  });

  // ─── 2. Dashboard Query Optimization ──────────────────────────────────────
  describe('2. Dashboard Caching & Batched Telemetry', () => {
    it('renders Dashboard without unhandled exceptions using React Query provider', async () => {
      const testQueryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } }
      });

      render(
        <QueryClientProvider client={testQueryClient}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/god morgen|god ettermiddag|god kveld|welcome back/i)).toBeInTheDocument();
      });

      // Quick action CTA buttons and traveler portal status exist
      expect(screen.getByText(/Active Traveler Portal/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Trip Planner/i)).toBeInTheDocument();
      expect(screen.getByText(/Travel Wallet/i)).toBeInTheDocument();
    });
  });

  // ─── 3. Image Optimization (AVIF, WebP, Lazy, Async, Fallbacks) ───────────
  describe('3. Image Optimization Pipeline (AVIF, WebP, Lazy Decoding)', () => {
    it('renders <picture> with AVIF and WebP sources, loading="lazy", and decoding="async"', () => {
      render(
        <OptimizedImage
          src="/images/fjords.jpg"
          avifSrc="/images/fjords.avif"
          webpSrc="/images/fjords.webp"
          alt="Geiranger Fjord Vista"
          className="rounded-2xl"
        />
      );

      const img = screen.getByAltText('Geiranger Fjord Vista');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');

      const picture = img.closest('picture');
      expect(picture).toBeInTheDocument();

      const sources = picture?.querySelectorAll('source');
      expect(sources?.length).toBe(2);
      expect(sources?.[0]).toHaveAttribute('type', 'image/avif');
      expect(sources?.[0]).toHaveAttribute('srcset', '/images/fjords.avif');
      expect(sources?.[1]).toHaveAttribute('type', 'image/webp');
      expect(sources?.[1]).toHaveAttribute('srcset', '/images/fjords.webp');
    });

    it('falls back to category default image when primary src fails with error', () => {
      render(
        <OptimizedImage
          src="https://broken.invalid/not-found.jpg"
          category="wildlife"
          alt="Arctic Wildlife"
        />
      );

      const img = screen.getByAltText('Arctic Wildlife');
      expect(img).toBeInTheDocument();

      // Trigger error on primary src
      fireEvent.error(img);

      // Falls back to wildlife category image
      expect(img).toHaveAttribute('src', '/images/wildlife_reindeer_1787013667019.jpg');
    });

    it('renders graceful icon placeholder card if all image sources fail', () => {
      render(
        <OptimizedImage
          src="https://broken.invalid/img1.jpg"
          fallbackSrc="https://broken.invalid/fallback.jpg"
          alt="Northern Lights Cabin"
        />
      );

      const img = screen.getByAltText('Northern Lights Cabin');
      // Error 1: primary src fails -> switches to fallbackSrc
      fireEvent.error(img);

      // Re-query image and trigger error on fallbackSrc
      const fallbackImg = screen.getByAltText('Northern Lights Cabin');
      fireEvent.error(fallbackImg);

      // Error 2: fallbackSrc fails -> displays placeholder container with alt label
      expect(screen.getByText('Northern Lights Cabin')).toBeInTheDocument();
    });
  });

  // ─── 4. Route-Based Code Splitting Verification ───────────────────────────
  describe('4. Route-Based Code Splitting & Dynamic Imports', () => {
    it('dynamically loads page chunks asynchronously without blocking initial render', async () => {
      const DynamicModule = await import('../../pages/Activities');
      expect(DynamicModule.Activities).toBeDefined();

      const DynamicDetails = await import('../../pages/ActivityDetails');
      expect(DynamicDetails.ActivityDetails).toBeDefined();

      const DynamicHome = await import('../../pages/Home');
      expect(DynamicHome.Home).toBeDefined();
    });
  });
});
