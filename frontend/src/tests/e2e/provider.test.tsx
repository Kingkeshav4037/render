import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProviderDashboard } from '../../pages/provider/ProviderDashboard';
import { useAuthStore } from '../../store/useAuthStore';

// Mock auth store
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
    rpc: vi.fn().mockResolvedValue({ 
      data: { total_bookings: 0, total_revenue: 0, active_listings: 0 }, 
      error: null 
    }),
  },
}));

describe('E2E Journey 4: Provider Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders provider dashboard when authenticated as provider', async () => {
    (useAuthStore as any).mockReturnValue({
      user: { id: 'provider-123' },
      isProvider: true,
      profile: { full_name: 'Test Provider' },
    });

    render(
      <BrowserRouter>
        <ProviderDashboard />
      </BrowserRouter>
    );

    // Initial render might show loading or immediately resolve empty data
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    // Check key components
    expect(screen.getByText(/Today's Operations/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenue \(Last 7 Days\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Action Required/i)).toBeInTheDocument();
  });
});
