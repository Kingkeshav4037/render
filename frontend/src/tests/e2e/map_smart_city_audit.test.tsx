import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { mapService, getSmartMapMarkers, getLocationsNearby } from '../../services/map/mapService';
import { weatherService } from '../../services/live/weatherService';
import { auroraService } from '../../services/live/auroraService';
import { routingService } from '../../services/live/routingService';

// ─── Component Imports ────────────────────────────────────────────────
import { DestinationMap } from '../../components/destinations/DestinationMap';
import { AdventureMap } from '../../pages/adventure/components/AdventureMap';
import { Insights } from '../../pages/Insights';
import { EVCharging } from '../../pages/mobility/EVCharging';

// ─── Mock Supabase ───────────────────────────────────────────────────
vi.mock('../../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
    }),
  },
}));

describe('Map, Smart City and Live Data Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── 1. Smart Map Initial Rendering & Norway Centering ────────────
  describe('Smart Map Initial Rendering & Norway Centering', () => {
    it('renders DestinationMap with valid Norway coordinates (Geiranger: 62.1, 7.2)', () => {
      render(
        <DestinationMap
          lat={62.1008}
          lng={7.2059}
          name="Geirangerfjord Viewpoint"
        />
      );

      expect(screen.getByText('Geirangerfjord Viewpoint')).toBeInTheDocument();
    });

    it('renders AdventureMap centered on Norway (62.0°N, 10.0°E) with nature layers', () => {
      render(
        <MemoryRouter>
          <AdventureMap />
        </MemoryRouter>
      );

      expect(screen.getByText('Trolltunga')).toBeInTheDocument();
      expect(screen.getByText('Jotunheimen')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Safari')).toBeInTheDocument();
      expect(screen.getByText('Map Layers')).toBeInTheDocument();
    });
  });

  // ─── 2. Marker Loading & RPC Data Consistency ────────────────────
  describe('Marker Loading & RPC Data Consistency', () => {
    it('fetches smart map markers across Norway bounding box via Supabase RPC', async () => {
      const mockMarkers = [
        {
          id: 'loc-01',
          location_id: 'loc-01',
          name: 'Flåm Railway Station',
          slug: 'flam-railway',
          type: 'TRANSPORT',
          category: 'TRAIN',
          latitude: 60.8633,
          longitude: 7.1136,
          image_url: 'https://example.com/flam.jpg',
          featured: true,
          average_rating: 4.9,
        },
        {
          id: 'loc-02',
          location_id: 'loc-02',
          name: 'Preikestolen Trailhead',
          slug: 'preikestolen',
          type: 'ACTIVITY',
          category: 'HIKING',
          latitude: 58.9864,
          longitude: 6.1364,
          image_url: 'https://example.com/preikestolen.jpg',
          featured: true,
          average_rating: 4.8,
        },
      ];

      (supabase.rpc as any).mockResolvedValueOnce({
        data: mockMarkers,
        error: null,
      });

      const markers = await getSmartMapMarkers(5.0, 58.0, 30.0, 71.0, ['TRANSPORT', 'ACTIVITY']);

      expect(supabase.rpc).toHaveBeenCalledWith('get_smart_map_markers', {
        min_lng: 5.0,
        min_lat: 58.0,
        max_lng: 30.0,
        max_lat: 71.0,
        filter_layers: ['TRANSPORT', 'ACTIVITY'],
      });
      expect(markers.length).toBe(2);
      expect(markers[0].name).toBe('Flåm Railway Station');
      expect(markers[0].latitude).toBe(60.8633);
    });

    it('fetches nearby locations within defined radius', async () => {
      const mockNearby = [
        {
          id: 'loc-03',
          location_id: 'loc-03',
          name: 'Bergen Bryggen',
          slug: 'bryggen',
          type: 'LANDMARK',
          category: 'CULTURE',
          latitude: 60.3975,
          longitude: 5.3246,
          image_url: null,
          featured: true,
          average_rating: 4.7,
        },
      ];

      (supabase.rpc as any).mockResolvedValueOnce({
        data: mockNearby,
        error: null,
      });

      const results = await getLocationsNearby(5.3246, 60.3975, 25000);

      expect(supabase.rpc).toHaveBeenCalledWith('get_nearby_locations', {
        target_lng: 5.3246,
        target_lat: 60.3975,
        radius_meters: 25000,
        max_results: 50,
      });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Bergen Bryggen');
    });
  });

  // ─── 3. Crash Prevention: Missing, Null & Invalid Coordinates ───────
  describe('Crash Prevention: Missing & Invalid Coordinates', () => {
    it('safely prevents crash on null coordinates', () => {
      const { container } = render(
        <DestinationMap lat={null as any} lng={null as any} name="Invalid Spot" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('safely prevents crash on undefined coordinates', () => {
      const { container } = render(
        <DestinationMap lat={undefined as any} lng={undefined as any} name="Undefined Spot" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('safely handles empty marker list without crashing RPC or caller', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const markers = await mapService.getSmartMapMarkers(0, 0, 0, 0);
      expect(markers).toEqual([]);
    });

    it('handles RPC database failure gracefully with fallback empty array', async () => {
      (supabase.rpc as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'PostGIS extension unavailable' },
      });

      const markers = await mapService.getSmartMapMarkers(5.0, 58.0, 30.0, 71.0);
      expect(markers).toEqual([]);
    });
  });

  // ─── 4. Live Weather Data Service ─────────────────────────────────
  describe('Live Weather Data Service', () => {
    it('fetches live weather data and calculates suitability score', async () => {
      const mockWeather = {
        location: { lat: 68.234, lon: 14.56 },
        temperature: 12,
        feelsLike: 10,
        condition: 'Partly Cloudy',
        precipitation: 0,
        windSpeed: 4.5,
        windDirection: 180,
        cloudCover: 30,
        visibility: 10000,
        snow: 0,
        humidity: 65,
        forecast: [
          { time: '2026-10-15T12:00:00Z', temperature: 12, condition: 'Clear', precipitation: 0 },
        ],
        warnings: [],
        updatedAt: '2026-10-15T10:00:00Z',
      };

      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: mockWeather,
        error: null,
      });

      const data = await weatherService.getWeather(68.234, 14.56);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('live-weather', {
        body: { lat: 68.234, lon: 14.56 },
      });
      expect(data).toBeDefined();
      expect(data?.temperature).toBe(12);

      // Verify activity suitability score
      const hikeScore = weatherService.getSuitabilityScore(data!, 'HIKING');
      expect(hikeScore).toBe(100);

      const museumScore = weatherService.getSuitabilityScore(data!, 'MUSEUM');
      expect(museumScore).toBe(100);
    });

    it('returns null safely when weather API throws error or times out', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'MET Norway API timeout' },
      });

      const data = await weatherService.getWeather(70.0, 25.0);
      expect(data).toBeNull();
    });
  });

  // ─── 5. Live Aurora Forecast & Tracker ────────────────────────────
  describe('Live Aurora Forecast & Intelligence', () => {
    it('fetches aurora forecast with Kp index and visibility conditions', async () => {
      const mockAurora = {
        location: { lat: 69.6492, lon: 18.9553 },
        score: 85,
        kpIndex: 5.2,
        activity: 'HIGH',
        cloudCover: 15,
        visibility: 'EXCELLENT',
        darkness: 'OPTIMAL',
        recommendation: 'Outstanding viewing conditions tonight in Tromsø!',
        timestamp: '2026-10-15T22:00:00Z',
      };

      (supabase.functions.invoke as any).mockResolvedValueOnce({
        data: mockAurora,
        error: null,
      });

      const aurora = await auroraService.getAuroraForecast(69.6492, 18.9553);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('aurora-forecast', {
        body: { lat: 69.6492, lon: 18.9553 },
      });
      expect(aurora?.kpIndex).toBe(5.2);
      expect(aurora?.activity).toBe('HIGH');
    });

    it('renders Aurora Intelligence Dashboard (Insights.tsx) with map overlays', () => {
      render(
        <MemoryRouter>
          <Insights />
        </MemoryRouter>
      );

      expect(screen.getByText('Aurora Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Current Activity')).toBeInTheDocument();
      expect(screen.getByText('3-Day Forecast')).toBeInTheDocument();
      expect(screen.getByText('Map Legend')).toBeInTheDocument();
      expect(screen.getByText('Tromsø Fjellheisen')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Islands')).toBeInTheDocument();
    });
  });

  // ─── 6. Route Calculation & OSRM Engine ───────────────────────────
  describe('Route Calculation Engine', () => {
    it('calculates driving route geometry and duration via OSRM endpoint', async () => {
      const mockOsrmResponse = {
        code: 'Ok',
        routes: [
          {
            distance: 480000, // 480 km
            duration: 25200,  // 7 hours
            geometry: {
              type: 'LineString',
              coordinates: [
                [10.7522, 59.9139], // Oslo
                [5.3221, 60.3913],  // Bergen
              ],
            },
          },
        ],
      };

      // Mock global fetch for OSRM
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockOsrmResponse),
      } as any);

      const route = await routingService.getRoute(59.9139, 10.7522, 60.3913, 5.3221, 'driving');

      expect(route).toBeDefined();
      expect(route?.distance).toBe(480000);
      expect(route?.geometry.coordinates.length).toBe(2);
    });

    it('handles routing network failure gracefully without crashing caller', async () => {
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const route = await routingService.getRoute(59.0, 10.0, 60.0, 11.0, 'driving');
      expect(route).toBeNull();
    });
  });

  // ─── 7. Smart Mobility & EV Charging Network ──────────────────────
  describe('Smart Mobility & EV Charging Network', () => {
    it('renders EV Charging Station hub with live capacity metrics', () => {
      render(
        <MemoryRouter>
          <EVCharging />
        </MemoryRouter>
      );

      expect(screen.getByText('Power your')).toBeInTheDocument();
      expect(screen.getByText('Smart Mobility')).toBeInTheDocument();
      expect(screen.getByText('IONITY Oslo')).toBeInTheDocument();
      expect(screen.getByText('350 kW')).toBeInTheDocument();
      expect(screen.getByText('4/6 available')).toBeInTheDocument();
      expect(screen.getByText('Recharge Bergen')).toBeInTheDocument();
      expect(screen.getByText('Mer Tromsø')).toBeInTheDocument();
    });
  });
});
