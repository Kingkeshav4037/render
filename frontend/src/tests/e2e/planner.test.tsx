import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TripPlanner } from '../../pages/planner/TripPlanner';
import { generateTripPlan } from '../../services/api/plannerApi';

// Mock plannerApi
vi.mock('../../services/api/plannerApi', () => ({
  generateTripPlan: vi.fn(),
}));

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
    }
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('E2E Journey 2: Trip Planner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows a user to generate a trip plan by going through steps', async () => {
    (generateTripPlan as any).mockResolvedValue({
      id: 'test-trip-id',
      name: 'Test Trip to Norway',
    });

    render(
      <BrowserRouter>
        <TripPlanner />
      </BrowserRouter>
    );

    // Step 1: Select destination 'Lofoten' and click Continue
    const lofotenBtn = screen.getByRole('button', { name: /Lofoten/i });
    fireEvent.click(lofotenBtn);
    
    const continueBtn1 = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn1);

    // Step 2: Duration, click Continue
    const continueBtn2 = await screen.findByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn2);

    // Step 3: Party type, click Continue
    const continueBtn3 = await screen.findByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn3);

    // Step 4: Budget, click Continue
    const continueBtn4 = await screen.findByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn4);

    // Step 5: Interests, click Generate Trip Plan
    const generateBtn = await screen.findByRole('button', { name: /Generate Trip Plan/i });
    fireEvent.click(generateBtn);

    // Wait for API call
    await waitFor(() => {
      expect(generateTripPlan).toHaveBeenCalled();
    });

    // Should redirect to the itinerary page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/planner/itinerary/test-trip-id', expect.anything());
    });
  });
});
