import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { supabase } from '../../lib/supabase';

// Mock admin hook
vi.mock('../../hooks/useAdmin', () => ({
  useAdmin: () => ({
    isAdmin: true,
    hasPermission: () => true,
    user: { id: 'admin-123', email: 'admin@smartlife.no' }
  }),
}));

// Mock rechart components to avoid SVG measurement errors in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div>LineChart</div>,
  BarChart: () => <div>BarChart</div>,
  AreaChart: () => <div>AreaChart</div>,
  PieChart: () => <div>PieChart</div>,
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  Pie: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('E2E Journey 5: Admin Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin dashboard correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Platform Overview/i)).toBeInTheDocument();
    });

    // Verify key metrics exist
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getAllByText('Bookings')[0]).toBeInTheDocument();
  });
});
