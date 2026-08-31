import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import '@testing-library/jest-dom';

// Lazy or direct component imports
import { SmartMap } from '../../pages/SmartMap';
import { Travel } from '../../pages/Travel';
import { TransportDetails } from '../../pages/TransportDetails';
import { LiveWeather } from '../../pages/nature/LiveWeather';
import { EVCharging } from '../../pages/mobility/EVCharging';
import { EVStationDetails } from '../../pages/mobility/EVStationDetails';
import { TripPlanner } from '../../pages/planner/TripPlanner';
import { ItineraryView } from '../../pages/planner/ItineraryView';
import { TripsList } from '../../pages/user/Trips/TripsList';
import { TripDetails } from '../../pages/user/Trips/TripDetails';
import { ProfilePreferences } from '../../pages/user/Profile/ProfilePreferences';

// Mock leaflet CSS and leaflet prototype
vi.mock('leaflet/dist/leaflet.css', () => ({}));
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, position }: any) => <div data-testid="map-marker" data-lat={position[0]} data-lng={position[1]}>{children}</div>,
  Popup: ({ children }: any) => <div data-testid="map-popup">{children}</div>,
  Polyline: () => <div data-testid="map-polyline" />,
  useMap: () => ({ setView: vi.fn(), getZoom: () => 6 })
}));

vi.mock('../../services/live/weatherService', () => ({
  weatherService: {
    getWeather: vi.fn().mockResolvedValue({
      temperature: 14,
      condition: 'Partly Cloudy',
      humidity: 74,
      windSpeed: 3.4,
      visibility: 10000,
      precipitation: 0,
      cloudCover: 25,
      feelsLike: 12
    }),
    getSuitabilityScore: vi.fn().mockReturnValue(88)
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Priority 5: Smart Travel, Map, Weather, EV & Trip Planning System Audit', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Smart Map Geospatial Layer (/map)', () => {
    it('renders SmartMap with OpenStreetMap container, live telemetry and search', async () => {
      renderWithProviders(<SmartMap />, ['/map']);
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
      expect(screen.getByText(/Norway at your fingertips/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Filter destinations, trails, stays/i)).toBeInTheDocument();
    });

    it('renders category filter layers on map sidebar', async () => {
      renderWithProviders(<SmartMap />, ['/map']);
      expect(screen.getByText(/Destinations/i)).toBeInTheDocument();
      expect(screen.getByText(/EV Fast Charging/i)).toBeInTheDocument();
      expect(screen.getByText(/Hiking Trails/i)).toBeInTheDocument();
    });
  });

  describe('2. Travel & Scenic Transport Corridors (/travel, /travel/route/:id)', () => {
    it('renders Travel page with scenic transport corridors and search bar', async () => {
      renderWithProviders(<Travel />, ['/travel']);
      expect(screen.getByText(/Navigate Norway/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Scenic Trains/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Electric Ferries/i).length).toBeGreaterThan(0);

      await waitFor(() => {
        expect(screen.getByText(/The Flåm Railway/i)).toBeInTheDocument();
        expect(screen.getByText(/The Bergen Line/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('renders TransportDetails for The Flåm Railway with stops and zero-emission badge', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/travel/route/:id" element={<TransportDetails />} />
        </Routes>,
        ['/travel/route/rt-flam']
      );

      await waitFor(() => {
        expect(screen.getByText(/The Flåm Railway/i)).toBeInTheDocument();
        expect(screen.getByText(/Zero Emission/i)).toBeInTheDocument();
        expect(screen.getByText(/Flåm Station/i)).toBeInTheDocument();
        expect(screen.getByText(/Kjosfossen Waterfall/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('3. Weather Intelligence & Safety Rules (/weather)', () => {
    it('renders LiveWeather with city selection chips and 7-day forecast', async () => {
      renderWithProviders(<LiveWeather />, ['/weather']);
      expect(screen.getByText(/MET Norway Telemetry/i)).toBeInTheDocument();
      expect(screen.getByText(/7-Day Norwegian Forecast/i)).toBeInTheDocument();
      expect(screen.getByText(/Outdoor Activity Suitability Index/i)).toBeInTheDocument();
      expect(screen.getByText(/Hiking & Alpine Treks/i)).toBeInTheDocument();
    });

    it('displays prominent mountain weather safety disclaimer and does not guarantee safety', async () => {
      renderWithProviders(<LiveWeather />, ['/weather']);
      expect(screen.getByText(/Weather Safety & Alpine Rules/i)).toBeInTheDocument();
      expect(screen.getByText(/Forecasts are advisory and do NOT guarantee trail safety/i)).toBeInTheDocument();
      expect(screen.getByText(/View Official Safety Alerts/i)).toBeInTheDocument();
    });

    it('renders localized weather for Bergen when queried via URL parameters', async () => {
      renderWithProviders(<LiveWeather />, ['/weather?city=Bergen']);
      expect(screen.getByRole('heading', { name: /Bergen/i })).toBeInTheDocument();
      expect(screen.getByText(/Fjord Coast, Western Norway/i)).toBeInTheDocument();
    });
  });

  describe('4. EV Charging Network & Accuracy (/mobility/ev, /mobility/ev/:id)', () => {
    it('renders EV Charging network with speed filters and search', async () => {
      renderWithProviders(<EVCharging />, ['/mobility/ev']);
      expect(screen.getByText(/Smart Mobility/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Find station, city, or operator/i)).toBeInTheDocument();
      expect(screen.getByText(/IONITY Oslo/i)).toBeInTheDocument();
      expect(screen.getByText(/Tesla Supercharger Dombås/i)).toBeInTheDocument();
    });

    it('renders EVStationDetails with static infrastructure specs vs dynamic live telemetry', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/mobility/ev/:id" element={<EVStationDetails />} />
        </Routes>,
        ['/mobility/ev/1']
      );

      expect(screen.getByRole('heading', { name: /IONITY Oslo/i })).toBeInTheDocument();
      expect(screen.getByText(/Infrastructure Specifications/i)).toBeInTheDocument();
      expect(screen.getByText(/Live Telemetry/i)).toBeInTheDocument();
      expect(screen.getByText(/Terminal Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Open Navigation/i)).toBeInTheDocument();
    });
  });

  describe('5. Trip Planning, Digital Journal, Collections & Saved Trips', () => {
    it('renders TripPlanner multi-step form', async () => {
      renderWithProviders(<TripPlanner />, ['/planner']);
      expect(screen.getByText(/Where would you like to go/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Norway/i)).toBeInTheDocument();
    });

    it('renders TripsList with separation between Planned Trips and Saved Favorites', async () => {
      renderWithProviders(<TripsList />, ['/trips']);
      expect(screen.getByText(/Digital Travel/i)).toBeInTheDocument();
      expect(screen.getByText(/Journal/i)).toBeInTheDocument();
      expect(screen.getByText(/Planned Trips \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Saved Favorites/i)).toBeInTheDocument();
      expect(screen.getByText(/Create Trip/i)).toBeInTheDocument();
    });

    it('renders TripDetails for Lofoten with destinations, activities, stays, and notes', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/trips/:id" element={<TripDetails />} />
        </Routes>,
        ['/trips/1']
      );

      expect(screen.getByRole('heading', { name: /Lofoten/i })).toBeInTheDocument();
      expect(screen.getByText(/Destinations in this Trip/i)).toBeInTheDocument();
      expect(screen.getByText(/Saved Activities/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Stays & Cabins/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Reinebringen Summit Hike/i)).toBeInTheDocument();
      expect(screen.getByText(/Edit Dates/i)).toBeInTheDocument();
    });

    it('handles non-existent trip ID gracefully with 404 recovery', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/trips/:id" element={<TripDetails />} />
        </Routes>,
        ['/trips/non-existent-trip-999']
      );

      expect(screen.getByText(/Trip Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Back to Travel Journal/i)).toBeInTheDocument();
    });
  });

  describe('6. Travel Preferences & Personalized Recommendations (/profile/preferences, /recommendations)', () => {
    it('renders ProfilePreferences, allows toggling styles and saves to localStorage', async () => {
      renderWithProviders(<ProfilePreferences />, ['/profile/preferences']);
      expect(screen.getByText(/Travel Preferences & Interests/i)).toBeInTheDocument();
      expect(screen.getByText(/Travel Style/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Interests & Highlights/i)).toBeInTheDocument();
      expect(screen.getByText(/Preferred Norwegian Regions/i)).toBeInTheDocument();

      const saveBtn = screen.getByText(/Save Preferences/i);
      fireEvent.click(saveBtn);

      const saved = localStorage.getItem('nsl_user_preferences');
      expect(saved).toBeTruthy();
    });
  });
});
