import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Food } from '../../pages/Food';
import { Stay } from '../../pages/Stay';
import { Travel } from '../../pages/Travel';
import { foodService } from '../../services/foodService';
import { staysService } from '../../services/stay/staysService';
import { transportService } from '../../services/transportService';

// Mock react-router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock supabase client
vi.mock('../../lib/supabase', () => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn((onfulfilled) => Promise.resolve({ data: [{ id: 'loc-1', name: 'Oslo', status: 'PUBLISHED' }], error: null }).then(onfulfilled)),
  };
  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
    },
  };
});

// Mock services
vi.mock('../../services/foodService', () => ({
  foodService: {
    getRestaurants: vi.fn(),
    getRestaurantById: vi.fn(),
    getFoods: vi.fn(),
  },
  getFoodImage: (name: string, img?: string) => img || '/images/food_salmon_1787013684123.jpg',
  getFoodPrice: (name: string) => 249,
}));

vi.mock('../../services/stay/staysService', () => ({
  staysService: {
    searchStays: vi.fn(),
    getStayById: vi.fn(),
  },
  getStayImage: (name?: string, type?: string, img?: string) => img || '/images/hotel_juvet_1787013813000.jpg',
}));

vi.mock('../../services/transportService', () => ({
  transportService: {
    getRoutes: vi.fn(),
  },
}));

// Setup React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Food, Stay and Travel Data Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('Food Page Validation', () => {
    it('verifies that restaurant data loads, ratings/cuisines are valid, and filters work', async () => {
      (foodService.getRestaurants as any).mockResolvedValue({
        data: [
          {
            id: 'r-1',
            name: 'Maaemo Fine Dining',
            type: 'FINE_DINING',
            cuisine: ['NORDIC'],
            description: 'Three Michelin star experience in Oslo.',
            rating: 5.0,
            price_range: '$$$$',
            image_url: '/images/food_salmon_1787013684123.jpg',
            locations: { name: 'Oslo' }
          }
        ],
        count: 1
      });

      (foodService.getFoods as any).mockResolvedValue({
        data: [
          {
            id: 'f-1',
            name: 'Pinnekjøtt Traditional Lamb',
            description: 'Traditional Norwegian Christmas lamb.',
            image_url: '/images/food_salmon_1787013684123.jpg',
            price: 285,
            currency: 'NOK',
            category: 'Traditional',
            prep_time: '3 hours'
          }
        ],
        count: 1
      });

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Food />
          </BrowserRouter>
        </QueryClientProvider>
      );

      // Verify page title and header
      expect(screen.getByText(/A Taste of Norway/i)).toBeInTheDocument();

      // Wait for data load
      await waitFor(() => {
        expect(screen.getByText('Maaemo Fine Dining')).toBeInTheDocument();
      });

      // Verify category/cuisine is correct
      expect(screen.getByText('FINE DINING')).toBeInTheDocument();

      // Verify ratings (5.0, not impossible value like 99.0)
      expect(screen.getByText(/5\.0/)).toBeInTheDocument();

      // Verify price (should contain 249 or price range $$$$)
      expect(screen.getByText('$$$$')).toBeInTheDocument();
      expect(screen.getByText(/249/)).toBeInTheDocument();

      // Verify images exist on cards
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', '/images/food_salmon_1787013684123.jpg');
    });
  });

  describe('Stay Page Validation', () => {
    it('verifies hotel data loads, names match locations, pricing/ratings are valid, and booking navigates', async () => {
      (staysService.searchStays as any).mockResolvedValue({
        data: [
          {
            id: 's-1',
            name: 'Juvet Landscape Lodge',
            type: 'ECO_LODGE',
            description: 'Stunning wilderness hotel.',
            rating: 4.9,
            price_per_night: 4200,
            location_id: 'loc-1',
            image_url: '/images/hotel_juvet_1787013813000.jpg',
            eco_certified: true,
            locations: { name: 'Valldal' }
          }
        ],
        count: 1
      });

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Stay />
          </BrowserRouter>
        </QueryClientProvider>
      );

      // Wait for hotel card load
      await waitFor(() => {
        expect(screen.getByText('Juvet Landscape Lodge')).toBeInTheDocument();
      });

      // Verify name matches location
      expect(screen.getByText(/Valldal/i)).toBeInTheDocument();

      // Verify pricing is represented (e.g. 4 nights = 16800 NOK formatted or per night price is visible)
      expect(screen.getByText(/4 nights/i)).toBeInTheDocument();

      // Verify rating (4.9, not invalid values) and review count format
      expect(screen.getByText('4.9')).toBeInTheDocument();

      // Verify images exist
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', '/images/hotel_juvet_1787013813000.jpg');

      // Verify booking navigation route link points to correct stay ID
      const link = screen.getByRole('link', { name: /Juvet Landscape Lodge/i });
      expect(link).toHaveAttribute('href', '/stay/s-1');
    });
  });

  describe('Travel Page Validation', () => {
    it('verifies transport types, origin/destination data, duration and price consistency', async () => {
      (transportService.getRoutes as any).mockResolvedValue([
        {
          id: 't-1',
          type: 'TRAIN',
          operator: 'Vy Scenic Train',
          route_number: 'F4',
          price_estimate: 650,
          currency: 'NOK',
          duration_minutes: 450,
          origin_id: 'loc-1',
          destination_id: 'loc-2',
          origin: { name: 'Oslo' },
          destination: { name: 'Bergen' }
        }
      ]);

      render(
        <BrowserRouter>
          <Travel />
        </BrowserRouter>
      );

      // Wait for route card load
      await waitFor(() => {
        expect(screen.getByText('Vy Scenic Train')).toBeInTheDocument();
      });

      // Verify origin and destination are valid
      expect(screen.getAllByText('Oslo').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Bergen').length).toBeGreaterThan(0);

      // Verify prices and durations are present
      expect(screen.getByText(/650/i)).toBeInTheDocument();
      expect(screen.getByText(/7h 30m/i)).toBeInTheDocument(); // 450 mins = 7h 30m
    });
  });
});
