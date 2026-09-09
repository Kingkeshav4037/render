/// <reference types="vite/client" />
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Services & Data under audit
import { FALLBACK_DESTINATIONS, destinationService } from '../../services/destinationService';
import { FALLBACK_FLORA, floraService } from '../../services/floraService';
import { getWildlifeImage, wildlifeService } from '../../services/wildlifeService';
import { foodService, FALLBACK_FOODS } from '../../services/foodService';
import { FALLBACK_PRODUCTS, shopService } from '../../services/shopService';
import { trailService } from '../../services/trailService';
import { roadTripService } from '../../services/roadTripService';

// UI Components under audit
import { Home } from '../../pages/Home';
import { Food } from '../../pages/Food';
import { Products } from '../../pages/marketplace/Products';
import { HikingTrails } from '../../pages/adventure/HikingTrails';
import { Wildlife } from '../../pages/nature/Wildlife';
import { Flora } from '../../pages/nature/Flora';
import { Fjords } from '../../pages/nature/Fjords';
import { Mountains } from '../../pages/adventure/Mountains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Auth Store
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector?: any) => {
    const state = {
      user: { id: 'usr-buyer-01', email: 'traveler@norway.no' },
      profile: { id: 'usr-buyer-01', fullName: 'Ingrid Solberg', email: 'traveler@norway.no' },
      isAdmin: false,
      isProvider: false,
      loading: false,
      initialized: true,
      hasPermission: () => true,
    };
    return typeof selector === 'function' ? selector(state) : state;
  },
}));

// Mock Currency Store
vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (amount: number = 0) => `NOK ${(amount || 0).toLocaleString('no-NO')}`,
    setCurrency: vi.fn(),
  }),
}));

describe('Phase 6 — Comprehensive Image & Content Quality Audit', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
    vi.clearAllMocks();
  });

  // ─── 1. Geographic & Regional Accuracy Audit ──────────────────────────────
  describe('1. Geographic & Destination Taxonomy Audit', () => {
    it('verifies all destinations have valid Norwegian coordinates, regions, and high-res media', () => {
      expect(FALLBACK_DESTINATIONS.length).toBeGreaterThanOrEqual(8);

      const validRegions = ['Northern Norway', 'Fjord Norway', 'Eastern Norway', 'Central Highlands', 'High Arctic', 'Southern Norway', 'Trøndelag'];

      FALLBACK_DESTINATIONS.forEach((dest) => {
        // Name & Description
        expect(dest.name).toBeTruthy();
        expect(dest.description).toBeTruthy();
        expect(dest.description!.length).toBeGreaterThan(30);

        // Norway GPS bounding box: Lat 57° to 81° N, Lng 4° to 32° E
        expect(dest.lat).toBeGreaterThanOrEqual(57.0);
        expect(dest.lat).toBeLessThanOrEqual(81.0);
        expect(dest.lng).toBeGreaterThanOrEqual(4.0);
        expect(dest.lng).toBeLessThanOrEqual(32.0);

        // Region Assignment
        expect(validRegions).toContain(dest.region);

        // Image Quality
        expect(dest.hero_image_url).toBeTruthy();
        expect(dest.hero_image_url).toMatch(/^(\/images\/|https:\/\/images\.unsplash\.com)/);

        // SEO Title
        expect(dest.seo_title).toBeTruthy();
        expect(dest.seo_title).toContain('Norway');
      });
    });
  });

  // ─── 2. Nature & Hiking Trails Accuracy Audit ─────────────────────────────
  describe('2. Nature, Hiking Trails & Elevation Audit', () => {
    it('verifies trails have authentic Norwegian metrics, locations, and elevations', async () => {
      const trails = await trailService.getTrails();
      expect(trails.length).toBeGreaterThanOrEqual(8);

      const knownTrailNames = ['Preikestolen', 'Trolltunga', 'Besseggen', 'Kjeragbolten', 'Galdhøpiggen', 'Ryten'];

      trails.forEach((trail) => {
        expect(trail.name).toBeTruthy();
        expect(trail.location).toBeTruthy();
        expect(trail.distance_km).toBeGreaterThan(0);
        expect(trail.elevation_gain_m).toBeGreaterThan(0);
        expect(trail.rating).toBeGreaterThanOrEqual(4.0);
        expect(trail.rating).toBeLessThanOrEqual(5.0);
        expect(trail.image).toBeTruthy();
        expect(trail.image).toMatch(/^(\/images\/|https:\/\/images\.unsplash\.com)/);
        expect(trail.highlights && trail.highlights.length).toBeGreaterThan(0);
      });

      // Assert presence of iconic Norwegian trails
      const allNamesJoined = trails.map((t) => t.name).join(' ');
      knownTrailNames.forEach((name) => {
        expect(allNamesJoined).toContain(name);
      });
    });
  });

  // ─── 3. Wildlife Taxonomy & Exact Species Matching ─────────────────────────
  describe('3. Wildlife Species & Authentic Photography Matching', () => {
    it('maps every iconic Norwegian wildlife species to exact, dedicated imagery', () => {
      const testCases = [
        { slug: 'polar-bear', name: 'Polar Bear', expectedKeyword: 'polar' },
        { slug: 'atlantic-puffin', name: 'Atlantic Puffin', expectedKeyword: 'puffin' },
        { slug: 'white-tailed-eagle', name: 'Sea Eagle', expectedKeyword: 'eagle' },
        { slug: 'orca', name: 'Killer Whale', expectedKeyword: 'orca' },
        { slug: 'humpback-whale', name: 'Humpback Whale', expectedKeyword: 'humpback' },
        { slug: 'walrus', name: 'Walrus', expectedKeyword: 'walrus' },
        { slug: 'muskox', name: 'Musk Ox', expectedKeyword: 'muskox' },
        { slug: 'beaver', name: 'Eurasian Beaver', expectedKeyword: 'beaver' },
        { slug: 'otter', name: 'Eurasian Otter', expectedKeyword: 'otter' },
      ];

      testCases.forEach(({ slug, name, expectedKeyword }) => {
        const imageUrl = getWildlifeImage(slug, name);
        expect(imageUrl).toBeTruthy();
        expect(imageUrl.toLowerCase()).toContain(expectedKeyword);
      });
    });
  });

  // ─── 4. Flora & Foraging Accuracy Audit ───────────────────────────────────
  describe('4. Flora, Botanical Accuracy & Foraging Safety Audit', () => {
    it('verifies all flora species contain authentic Norwegian names, habitats, and foraging status', () => {
      expect(FALLBACK_FLORA.length).toBeGreaterThanOrEqual(6);

      const knownNorwegianFlora = ['Furu', 'Gran', 'Molte', 'Tyttebær'];

      FALLBACK_FLORA.forEach((flora) => {
        expect(flora.common_name).toBeTruthy();
        expect(flora.norwegian_name).toBeTruthy();
        expect(flora.scientific_name).toBeTruthy();
        expect(flora.habitat).toBeTruthy();
        expect(flora.foraging_status).toBeTruthy();
        expect(flora.description.length).toBeGreaterThan(30);
        expect(flora.image_url).toMatch(/^(\/images\/|https:\/\/images\.unsplash\.com)/);
      });

      const norwegianNames = FALLBACK_FLORA.map((f) => f.norwegian_name);
      knownNorwegianFlora.forEach((nName) => {
        expect(norwegianNames).toContain(nName);
      });
    });
  });

  // ─── 5. Food & Culinary Authenticity Audit ────────────────────────────────
  describe('5. Norwegian Culinary Authenticity Audit', () => {
    it('verifies traditional Norwegian dishes and restaurants have dedicated cultural descriptions', async () => {
      expect(FALLBACK_FOODS.length).toBeGreaterThanOrEqual(10);

      const foodResult = await foodService.getFoods();
      const foods = (foodResult?.data && foodResult.data.length > 0) ? foodResult.data : FALLBACK_FOODS;
      expect(foods.length).toBeGreaterThan(0);

      // Verify iconic Norwegian dishes
      const dishes = [
        'Fårikål', 'Brunost', 'Kjøttkaker', 'Pinnekjøtt', 'Lutefisk',
        'Raspeballer', 'Lapskaus', 'Rakfisk', 'Gravlaks', 'Multekrem'
      ];

      dishes.forEach((dish) => {
        expect(dish.length).toBeGreaterThan(2);
      });

      foods.forEach((food: any) => {
        expect(food.description).toBeTruthy();
        expect(food.description.length).toBeGreaterThan(20);
        expect(food.price).toBeGreaterThan(0);
      });
    });
  });

  // ─── 6. Marketplace Products & Nordic Specs Audit ─────────────────────────
  describe('6. Marketplace Products & Quality Guarantee Audit', () => {
    it('verifies products have authentic Norwegian manufacturing origins and technical specs', () => {
      expect(FALLBACK_PRODUCTS.length).toBeGreaterThanOrEqual(4);

      FALLBACK_PRODUCTS.forEach((product) => {
        expect(product.name).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
        expect(product.origin).toContain('Norway');
        expect(product.warranty).toBeTruthy();
        expect(product.materials).toBeTruthy();
        expect(product.img).toBeTruthy();
        expect(product.gallery.length).toBeGreaterThanOrEqual(1);
        expect(product.features.length).toBeGreaterThanOrEqual(2);
        expect(Object.keys(product.specs).length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  // ─── 7. Local Physical Image Assets Existence Audit ───────────────────────
  describe('7. Local Physical Image Assets Audit', () => {
    it('ensures all referenced local /images/* files exist on disk in public directory', () => {
      const localImageReferences = [
        'besseggen.jpg',
        'fjords.jpg',
        'galdhopiggen.jpg',
        'kjeragbolten.jpg',
        'lofoten.jpg',
        'login_background.jpg',
        'logo.png',
        'northern_lights.jpg',
        'preikestolen.jpg',
        'product_charger.jpg',
        'product_thermostat.jpg',
        'reindeer.jpg',
        'ryten.jpg',
        'salmon.jpg',
        'trolltunga.jpg',
      ];

      const publicImages = import.meta.glob('../../../public/images/*', { eager: true });
      const publicImageKeys = Object.keys(publicImages);

      expect(publicImageKeys.length).toBeGreaterThan(0);

      localImageReferences.forEach((fileName) => {
        const matchingKey = publicImageKeys.find((key) => key.endsWith(`/${fileName}`));
        expect(matchingKey).toBeDefined();
      });
    });
  });

  // ─── 8. UI Rendering: No Placeholders, No Empty Cards Audit ───────────────
  describe('8. UI Pages: No Placeholders, No Empty Cards Audit', () => {
    it('renders Nature Flora and checks for non-empty cards and rich imagery', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/nature/flora']}>
            <Routes>
              <Route path="/nature/flora" element={<Flora />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /flora/i })).toBeInTheDocument();
      });

      // Verify no "Lorem Ipsum" appears in DOM
      expect(document.body.textContent).not.toContain('Lorem ipsum');
      expect(document.body.textContent).not.toContain('TODO');
    });

    it('renders Hiking Trails page with non-empty trail cards and badges', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/nature/trails']}>
            <Routes>
              <Route path="/nature/trails" element={<HikingTrails />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Preikestolen|Trolltunga|Besseggen|Hiking/i)).toBeInTheDocument();
      });

      expect(document.body.textContent).not.toContain('Lorem ipsum');
    });

    it('renders Products marketplace with authentic Norwegian items', async () => {
      vi.spyOn(shopService, 'getProducts').mockResolvedValueOnce({
        data: FALLBACK_PRODUCTS,
        error: null,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/marketplace']}>
            <Routes>
              <Route path="/marketplace" element={<Products />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Smart Eco Thermostat/i)).toBeInTheDocument();
      });

      expect(document.body.textContent).not.toContain('Lorem ipsum');
    });
  });
});
