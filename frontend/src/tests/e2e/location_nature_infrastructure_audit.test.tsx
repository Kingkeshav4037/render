import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Priority 4 Pages
import { Places } from '../../pages/places/Places';
import { NatureHub } from '../../pages/nature/NatureHub';
import { Fjords } from '../../pages/nature/Fjords';
import { Mountains } from '../../pages/adventure/Mountains';
import { HikingTrails } from '../../pages/adventure/HikingTrails';
import { TrailDetails } from '../../pages/adventure/TrailDetails';
import { Infrastructure } from '../../pages/industry/Infrastructure';

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

describe('Priority 4: Location, Nature, Trails & Infrastructure Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Places & Cultural Landmarks (/places)', () => {
    it('renders Places page with search input and region controls', async () => {
      renderWithProviders(<Places />, ['/places']);
      expect(screen.getByText(/Iconic Places & Landmarks/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search places, stave churches/i)).toBeInTheDocument();
      expect(screen.getByText(/Historical Monuments & Architecture/i)).toBeInTheDocument();
    });
  });

  describe('2. Nature Gateway Hub (/nature)', () => {
    it('renders NatureHub page with discipline modules and national parks', async () => {
      renderWithProviders(<NatureHub />, ['/nature']);
      expect(screen.getByText(/Norway's Wild Nature/i)).toBeInTheDocument();
      expect(screen.getByText(/Wildlife Field Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/Botanical Encyclopedia/i)).toBeInTheDocument();
      expect(screen.getByText(/Aurora Borealis Live Tracker/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Allemannsretten/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. Fjords & Coastal Wonders (/fjords)', () => {
    it('renders Fjords page with UNESCO heritage and electric cruising banner', async () => {
      renderWithProviders(<Fjords />, ['/fjords']);
      expect(screen.getByText(/The Norwegian Fjords/i)).toBeInTheDocument();
      expect(screen.getByText(/World-Renowned Norwegian Fjords/i)).toBeInTheDocument();
      expect(screen.getByText(/Silent Electric Fjord Expeditions/i)).toBeInTheDocument();
    });
  });

  describe('4. Mountains & Alpine Summits (/mountains)', () => {
    it('renders Mountains page with summit catalog and Fjellvettreglene safety code', async () => {
      renderWithProviders(<Mountains />, ['/mountains']);
      expect(screen.getByText(/Mountains & Alpine Summits/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Galdhøpiggen/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Besseggen Ridge/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Trolltunga/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Fjellvettreglene/i).length).toBeGreaterThan(0);
    });
  });

  describe('5. Trails & Mountain Treks (/trails, /trails/:id)', () => {
    it('renders HikingTrails page with search, statistics, and difficulty filters', async () => {
      renderWithProviders(<HikingTrails />, ['/trails']);
      expect(screen.getByText(/Find your/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search trails, peaks, national parks/i)).toBeInTheDocument();
    });

    it('renders TrailDetails page for Besseggen Ridge', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/trails/:id" element={<TrailDetails />} />
        </Routes>,
        ['/trails/tr-003']
      );

      await waitFor(() => {
        expect(screen.getByText(/Besseggen Ridge/i)).toBeInTheDocument();
        expect(screen.getByText(/Elevation Gain/i)).toBeInTheDocument();
      });
    });

    it('handles invalid trail ID gracefully without crashing', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/trails/:id" element={<TrailDetails />} />
        </Routes>,
        ['/trails/non-existent-trail-999']
      );

      await waitFor(() => {
        expect(screen.getByText(/Trail Not Found/i)).toBeInTheDocument();
        expect(screen.getByText(/Browse All Trails/i)).toBeInTheDocument();
      });
    });
  });

  describe('6. Infrastructure Command Center (/infrastructure)', () => {
    it('renders Infrastructure page with Energy Grid and IoT tabs', async () => {
      renderWithProviders(<Infrastructure />, ['/infrastructure']);
      expect(screen.getByText(/National/i)).toBeInTheDocument();
      expect(screen.getByText(/Infrastructure/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Energy Grid/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/IoT Network/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Renewable Share/i)).toBeInTheDocument();
    });
  });

  describe('7. EV Charging Network (/mobility/ev, /mobility/ev/:id)', () => {
    it('renders EV Charging page with station list and telemetry status', async () => {
      const { EVCharging } = await import('../../pages/mobility/EVCharging');
      renderWithProviders(<EVCharging />, ['/mobility/ev']);
      expect(screen.getByText(/Power your/i)).toBeInTheDocument();
      expect(screen.getByText(/IONITY Oslo/i)).toBeInTheDocument();
      expect(screen.getByText(/Recharge Bergen/i)).toBeInTheDocument();
    });

    it('renders EV Station Details for IONITY Oslo', async () => {
      const { EVStationDetails } = await import('../../pages/mobility/EVStationDetails');
      renderWithProviders(
        <Routes>
          <Route path="/mobility/ev/:id" element={<EVStationDetails />} />
        </Routes>,
        ['/mobility/ev/1']
      );
      expect(screen.getByText(/IONITY Oslo/i)).toBeInTheDocument();
      expect(screen.getByText(/Terminal Status/i)).toBeInTheDocument();
    });

    it('handles non-existent EV station ID gracefully with recovery view', async () => {
      const { EVStationDetails } = await import('../../pages/mobility/EVStationDetails');
      renderWithProviders(
        <Routes>
          <Route path="/mobility/ev/:id" element={<EVStationDetails />} />
        </Routes>,
        ['/mobility/ev/non-existent-station-999']
      );
      expect(screen.getByText(/Charging Station Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Browse Charging Network/i)).toBeInTheDocument();
    });
  });
});
