import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock matchMedia
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

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock Leaflet to prevent hanging in map components
vi.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: any) => children,
    TileLayer: () => null,
    Marker: ({ children }: any) => children,
    Popup: ({ children }: any) => children,
    Polyline: () => null,
    useMapEvents: () => ({}),
    useMap: () => ({ setView: vi.fn(), fitBounds: vi.fn(), getBounds: vi.fn() }),
  };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as any;
globalThis.IntersectionObserver = MockIntersectionObserver as any;

