import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Pages
import { Explore } from '../../pages/Explore';
import { DestinationDetails } from '../../pages/DestinationDetails';
import { Wildlife } from '../../pages/nature/Wildlife';
import { WildlifeDetail } from '../../pages/nature/WildlifeDetail';
import { Flora } from '../../pages/nature/Flora';
import { History } from '../../pages/History';
import { Activities } from '../../pages/Activities';
import { ActivityDetails } from '../../pages/ActivityDetails';
import { Guides } from '../../pages/travel/Guides';
import { Events } from '../../pages/events/Events';
import { Deals } from '../../pages/travel/Deals';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null })
    }
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Priority 3: Tourism Content, Discovery & Detail Experience Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Explore & Destination Details (/explore, /explore/:slug)', () => {
    it('renders Explore page with search and category filters', async () => {
      renderWithProviders(<Explore />, ['/explore']);
      expect(screen.getByPlaceholderText(/search destinations/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Norway/i)).toBeInTheDocument();
    });

    it('renders DestinationDetails page for Tromsø', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/explore/:slug" element={<DestinationDetails />} />
        </Routes>,
        ['/explore/tromso']
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Tromsø/i)[0]).toBeInTheDocument();
      });
    });

    it('renders DestinationDetails page for /destinations/:slug and resolves aliases like Lofoten', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/destinations/:slug" element={<DestinationDetails />} />
        </Routes>,
        ['/destinations/lofoten']
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Lofoten/i)[0]).toBeInTheDocument();
      });
    });
  });

  describe('2. Wildlife Explorer & Species Detail (/wildlife, /wildlife/:id)', () => {
    it('renders Wildlife page with hero and filters', async () => {
      renderWithProviders(<Wildlife />, ['/wildlife']);
      expect(screen.getByText(/Norway's Wildlife/i)).toBeInTheDocument();
    });

    it('renders WildlifeDetail page for a species', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/wildlife/:id" element={<WildlifeDetail />} />
        </Routes>,
        ['/wildlife/polar-bear']
      );

      await waitFor(() => {
        expect(screen.getByText(/Back to Wildlife/i)).toBeInTheDocument();
      });
    });
  });

  describe('3. Botanical Field Guide (/flora)', () => {
    it('renders Flora page with categories and search input', async () => {
      renderWithProviders(<Flora />, ['/flora']);
      expect(screen.getByText(/Norway's Flora & Forests/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search by English, Norwegian/i)).toBeInTheDocument();
    });
  });

  describe('4. Historical Heritage & Museums (/history)', () => {
    it('renders History page with 10,000 Years of Heritage header', async () => {
      renderWithProviders(<History />, ['/history']);
      expect(screen.getByText(/Norwegian History & Heritage/i)).toBeInTheDocument();
      expect(screen.getByText(/10,000 Years of Heritage/i)).toBeInTheDocument();
    });
  });

  describe('5. Activities & Activity Details (/activities, /activities/:id)', () => {
    it('renders Activities page with discovery categories', async () => {
      renderWithProviders(<Activities />, ['/activities']);
      expect(screen.getByText(/Discover Norway's Wild/i)).toBeInTheDocument();
      expect(screen.getByText(/All Experiences/i)).toBeInTheDocument();
    });

    it('renders ActivityDetails page with pricing and gear info', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/activities/:id" element={<ActivityDetails />} />
        </Routes>,
        ['/activities/act-001']
      );

      await waitFor(() => {
        expect(screen.getByText(/ACTIVITIES/i)).toBeInTheDocument();
      });
    });

    it('handles invalid activity ID gracefully without blank screen', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/activities/:id" element={<ActivityDetails />} />
        </Routes>,
        ['/activities/non-existent-id-999']
      );

      await waitFor(() => {
        expect(screen.getByText('Activity Not Found')).toBeInTheDocument();
      });
    });

    it('renders accessible and working Details links on activity cards', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
        </Routes>,
        ['/activities']
      );

      const detailsLinks = await screen.findAllByRole('link', { name: /details/i });
      expect(detailsLinks.length).toBeGreaterThan(0);
      expect(detailsLinks[0]).toHaveAttribute('href', expect.stringMatching(/^\/activities\//));
    });
  });

  describe('6. Travel Guides (/guides)', () => {
    it('renders Travel Guides page with curated articles', async () => {
      renderWithProviders(<Guides />, ['/guides']);
      expect(screen.getByText(/Travel Guides/i)).toBeInTheDocument();
      expect(screen.getByText(/The Ultimate Guide to Chasing the Northern Lights/i)).toBeInTheDocument();
    });
  });

  describe('7. Local Events (/events)', () => {
    it('renders Events page with festival and cultural categories', async () => {
      renderWithProviders(<Events />, ['/events']);
      expect(screen.getByText(/Local/i)).toBeInTheDocument();
      expect(screen.getByText(/Events/i)).toBeInTheDocument();
    });
  });

  describe('8. Deals & Packages (/deals)', () => {
    it('renders Deals page with exclusive discounts and filter categories', async () => {
      renderWithProviders(<Deals />, ['/deals']);
      expect(screen.getByText(/Curated Travel Deals/i)).toBeInTheDocument();
      expect(screen.getByText(/Exclusive Offers/i)).toBeInTheDocument();
    });
  });

  describe('9. History & Heritage Timeline (/history)', () => {
    it('renders Norway Through Time structured timeline', async () => {
      renderWithProviders(<History />, ['/history']);
      expect(screen.getByText(/Norway Through Time/i)).toBeInTheDocument();
      expect(screen.getByText(/The Viking Age/i)).toBeInTheDocument();
      expect(screen.getByText(/Medieval Stave Churches & Kings/i)).toBeInTheDocument();
    });
  });

  describe('10. Wildlife Error Recovery (/wildlife/:id)', () => {
    it('handles invalid wildlife species slug gracefully', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/wildlife/:id" element={<WildlifeDetail />} />
        </Routes>,
        ['/wildlife/non-existent-creature-999']
      );

      await waitFor(() => {
        expect(screen.getByText(/Species Not Found|Back to Wildlife/i)).toBeInTheDocument();
      });
    });
  });

  describe('11. Cross-Page Navigation & Related Experiences', () => {
    it('renders nearby experiences and stays in DestinationDetails', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/explore/:slug" element={<DestinationDetails />} />
        </Routes>,
        ['/explore/tromso']
      );

      await waitFor(() => {
        expect(screen.getByText(/About Tromsø|Nearby Places to Stay|Experiences & Activities/i)).toBeInTheDocument();
      });
    });
  });
});


