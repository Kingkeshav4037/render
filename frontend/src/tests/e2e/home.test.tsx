import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../../pages/Home';
import { Travel } from '../../pages/Travel';
import SmartMap from '../../pages/SmartMap';
import { homeContentService } from '../../services/home/homeContentService';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { transportService } from '../../services/transportService';
import { HomePlace, HomeFood, HomeHotel } from '../../types/home';

// Mock useNavigate
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
    limit: vi.fn().mockReturnThis(),
    then: vi.fn((onfulfilled) => Promise.resolve({ data: [], error: null }).then(onfulfilled)),
  };
  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
    },
  };
});

// Mock useAuthStore
vi.mock('../../store/useAuthStore', () => {
  const mockStore = (selector: any) => {
    const state = {
      user: { id: 'test-user-id', email: 'test@example.com' },
      profile: { fullName: 'Test User' },
      loading: false,
      initialized: true,
    };
    return typeof selector === 'function' ? selector(state) : state;
  };
  mockStore.getState = () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    profile: { fullName: 'Test User' },
    loading: false,
    initialized: true,
  });
  mockStore.subscribe = () => () => {};
  return { useAuthStore: mockStore };
});

describe('E2E Homepage Quality Requirements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all homepage sections and verifies hero buttons navigation', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // 1. Hero sections & quick links render
    expect(screen.getByText(/Norway SmartLife/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover Norway/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Fjords, Northern Lights, Bergen…/i)).toBeInTheDocument();
    
    // Quick links exist
    expect(screen.getByText(/Fjord Cruises/i)).toBeInTheDocument();
    expect(screen.getByText(/Northern Lights/i)).toBeInTheDocument();
    expect(screen.getByText(/Hiking Trails/i)).toBeInTheDocument();
    expect(screen.getByText(/Wildlife/i)).toBeInTheDocument();

    // 2. Stats strip renders
    expect(screen.getByText(/25,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/km of Coastline/i)).toBeInTheDocument();
    expect(screen.getByText(/1,190/i)).toBeInTheDocument();
    expect(screen.getByText(/Fjords & Inlets/i)).toBeInTheDocument();

    // 3. Search button triggers navigation
    const searchInput = screen.getByPlaceholderText(/Fjords, Northern Lights, Bergen…/i);
    fireEvent.change(searchInput, { target: { value: 'Oslo' } });
    const searchBtn = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/explore?q=Oslo');

    // 4. AI Planner CTA exists and navigates correctly
    expect(screen.getByText(/Your Personal/i)).toBeInTheDocument();
    expect(screen.getByText(/Nordic Concierge/i)).toBeInTheDocument();
    const plannerBtn = screen.getByRole('button', { name: /Plan My Trip/i });
    fireEvent.click(plannerBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/planner');
  });

  it('verifies that featured destination cards render title, image, location, and data, with no duplicate cards', async () => {
    // Inject mock destinations
    const mockDestinations: HomePlace[] = [
      { id: 'dest-1', name: 'Lofoten Islands', slug: 'lofoten', category: 'Island', region: 'Nordland', short_description: 'Archipelago description', image: '/images/lofoten_1787013505867.jpg', latitude: 68.2, longitude: 14.5, rating: 4.9, featured: true },
      { id: 'dest-2', name: 'Preikestolen', slug: 'preikestolen', category: 'Mountain', region: 'Rogaland', short_description: 'Cliff viewpoint', image: '/images/preikestolen_1786936002797.jpg', latitude: 58.99, longitude: 6.19, rating: 4.8, featured: true },
      { id: 'dest-3', name: 'Trolltunga', slug: 'trolltunga', category: 'Mountain', region: 'Vestland', short_description: 'Cliff ledge', image: '/images/trolltunga_1786936111320.jpg', latitude: 60.12, longitude: 6.74, rating: 4.8, featured: true }
    ];

    vi.spyOn(homeContentService, 'getTrendingPlaces').mockResolvedValue(mockDestinations);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify featured destination card content
    await waitFor(() => {
      expect(screen.getByText('Lofoten Islands')).toBeInTheDocument();
    });

    expect(screen.getByText('Preikestolen')).toBeInTheDocument();
    expect(screen.getByText('Trolltunga')).toBeInTheDocument();

    // Verify regions (locations)
    expect(screen.getByText('Nordland')).toBeInTheDocument();
    expect(screen.getByText('Rogaland')).toBeInTheDocument();
    expect(screen.getByText('Vestland')).toBeInTheDocument();

    // Verify ratings (data)
    expect(screen.getAllByText('4.9')[0]).toBeInTheDocument();

    // Verify images
    const images = screen.getAllByRole('img');
    const imageSources = images.map((img: any) => img.src);
    expect(imageSources.some(src => src.includes('lofoten'))).toBe(true);
    expect(imageSources.some(src => src.includes('preikestolen'))).toBe(true);
    expect(imageSources.some(src => src.includes('trolltunga'))).toBe(true);

    // Verify no duplicated destination cards are present
    const cardHeadings = screen.getAllByText(/Lofoten Islands/i);
    expect(cardHeadings.length).toBe(1); // strictly 1
  });

  it('verifies that food cards contain food-related images', async () => {
    const mockFoods: HomeFood[] = [
      { id: 'food-1', name: 'Gravlaks', category: 'Seafood', origin_region: 'Coastal Norway', short_description: 'Cured salmon', image: '/images/food_salmon_1787013684123.jpg' }
    ];

    vi.spyOn(homeContentService, 'getFood').mockResolvedValue(mockFoods);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Gravlaks')).toBeInTheDocument();
    });

    // Check food-related image is set
    const foodImg = screen.getByAltText('Gravlaks') as HTMLImageElement;
    expect(foodImg.src).toContain('food_salmon');
  });

  it('verifies that hotel cards contain correct accommodation images', async () => {
    const mockHotels: HomeHotel[] = [
      { id: 'hotel-1', name: 'Juvet Landscape Hotel', category: 'Cabin', city: 'Valldal', region: 'Møre og Romsdal', rating: 4.9, price_indicator: 'NOK 4 200/night', image: '/images/hotel_juvet_1787013813000.jpg', latitude: 62.22, longitude: 7.68 }
    ];

    vi.spyOn(homeContentService, 'getHotels').mockResolvedValue(mockHotels);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Juvet Landscape Hotel')).toBeInTheDocument();
    });

    const hotelImg = screen.getByAltText('Juvet Landscape Hotel') as HTMLImageElement;
    expect(hotelImg.src).toContain('hotel_juvet');
  });

  it('verifies that transport cards on Travel page render correct transport images/icons', async () => {
    const mockRoutes = [
      { id: 'route-train', type: 'TRAIN', operator: 'Vy Scenic', duration_minutes: 360, price_nok: 450, origin: { name: 'Oslo' }, destination: { name: 'Bergen' } },
      { id: 'route-ferry', type: 'FERRY', operator: 'Fjord1 Electric', duration_minutes: 45, price_nok: 150, origin: { name: 'Hellesylt' }, destination: { name: 'Geiranger' } },
      { id: 'route-car', type: 'CAR_RENTAL', operator: 'Hertz EV', duration_minutes: 120, price_nok: 600, origin: { name: 'Tromsø' }, destination: { name: 'Sommarøy' } },
    ];

    vi.spyOn(transportService, 'getRoutes').mockResolvedValue(mockRoutes as any);

    render(
      <BrowserRouter>
        <Travel />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Vy Scenic')).toBeInTheDocument();
    });

    // Check transport operator texts
    expect(screen.getByText('Fjord1 Electric')).toBeInTheDocument();
    expect(screen.getByText('Hertz EV')).toBeInTheDocument();

    // Verify icons exist inside the card elements
    const trainCard = screen.getByText('Vy Scenic').closest('.group');
    expect(trainCard?.querySelector('svg')).toBeInTheDocument();

    const ferryCard = screen.getByText('Fjord1 Electric').closest('.group');
    expect(ferryCard?.querySelector('svg')).toBeInTheDocument();

    const carCard = screen.getByText('Hertz EV').closest('.group');
    expect(carCard?.querySelector('svg')).toBeInTheDocument();
  });

  it('verifies map-related components show Norway-related content', async () => {
    render(
      <BrowserRouter>
        <SmartMap />
      </BrowserRouter>
    );

    // Verify Norway-related text/map placeholders exist
    await waitFor(() => {
      expect(screen.getByText(/Norway at your fingertips/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Discover places, plan journeys, and monitor infrastructure/i)).toBeInTheDocument();
  });

  it('handles empty database responses gracefully and falls back without crashing', async () => {
    // Mock getTrendingPlaces to resolve to empty array
    vi.spyOn(homeContentService, 'getTrendingPlaces').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getActivities').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getFood').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getWildlife').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getHotels').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getRestaurants').mockResolvedValue([]);
    vi.spyOn(homeContentService, 'getEvents').mockResolvedValue([]);

    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify the page still renders (does not crash)
    expect(container).not.toBeEmptyDOMElement();
    
    // Verify hero section is still present
    expect(screen.getByText(/Discover Norway/i)).toBeInTheDocument();
    
    // Verify loaders or skeletons do not remain permanently
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBe(0);
  });

  it('verifies layout CSS classes preventing horizontal overflow and card overlapping, and ensuring text readability', async () => {
    const mockDestinations: HomePlace[] = [
      { id: 'dest-1', name: 'Lofoten Islands', slug: 'lofoten', category: 'Island', region: 'Nordland', short_description: 'Archipelago description', image: '/images/lofoten_1787013505867.jpg', latitude: 68.2, longitude: 14.5, rating: 4.9, featured: true }
    ];
    vi.spyOn(homeContentService, 'getTrendingPlaces').mockResolvedValue(mockDestinations);

    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lofoten Islands')).toBeInTheDocument();
    });

    // 1. Mobile horizontal overflow: Verify layout wrappers use overflow-hidden or max-w / container padding
    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toContain('w-full');
    expect(outerContainer.className).toContain('bg-deep-night');

    const subContainers = container.querySelectorAll('.max-w-4xl, .max-w-3xl, .grid-cols-1');
    expect(subContainers.length).toBeGreaterThan(0);

    // 2. Card overlapping: Verify responsive grid classes are applied to destination, activity, food/wildlife grids
    const grids = container.querySelectorAll('.grid');
    grids.forEach(grid => {
      const className = grid.className;
      if (className.includes('grid-cols')) {
        // Assert responsive column definitions are set up to adapt on tablets/mobiles
        expect(
          className.includes('md:grid-cols-') || 
          className.includes('lg:grid-cols-') || 
          className.includes('sm:grid-cols-')
        ).toBe(true);
      }
    });

    // 3. Text readability: Verify text overlays have dark/gradient layers protecting text over image backgrounds
    const textOverlays = container.querySelectorAll('[class*="bg-gradient-to-"]');
    expect(textOverlays.length).toBeGreaterThan(0);
  });
});
