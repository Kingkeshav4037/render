import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    getChannels: vi.fn().mockReturnValue([]),
    removeChannel: vi.fn(),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    }),
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null })
    })
  }
}));

vi.mock('./store/useAuthStore', () => {
  const mockStore = (selector: any) => {
    const state = {
      user: null,
      loading: false,
      initialized: true,
      initialize: () => () => {},
    };
    return typeof selector === 'function' ? selector(state) : state;
  };
  mockStore.getState = () => ({
    user: null,
    loading: false,
    initialized: true,
    initialize: () => () => {},
  });
  mockStore.subscribe = () => () => {};
  return { useAuthStore: mockStore };
});


describe('App Component Smoke Test', () => {
  it('renders without crashing', async () => {
    // Render the root component
    const { container } = render(<App />);
    
    // Check if the container is not empty
    expect(container).not.toBeEmptyDOMElement();
    
    // Look for a common element that should be on the landing page or navbar
    // e.g. the site title or logo text "SmartLife" (awaited because of Suspense)
    const titleElements = await screen.findAllByText(/SmartLife/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[0]).toBeInTheDocument();
  });
});
