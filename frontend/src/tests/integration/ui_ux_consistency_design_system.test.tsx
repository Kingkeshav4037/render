import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Design Tokens & Primitives
import { colors } from '../../design/tokens/colors';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

// Four Core States
import { LoadingState } from '../../components/ui/LoadingState';
import { 
  CardGridSkeleton, 
  DashboardSkeleton, 
  DetailHeroSkeleton 
} from '../../components/ui/PageLoadingSkeleton';
import { ErrorState, ErrorType } from '../../components/ui/ErrorState';
import { EmptyState, EmptyStatePreset } from '../../components/ui/EmptyState';
import { SuccessState, SuccessStatePreset } from '../../components/ui/SuccessState';

// Icons for testing
import { Search, Sparkles } from 'lucide-react';

describe('Phase 7 — Unified UI/UX Consistency & Design System', () => {

  beforeEach(() => {
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
    vi.clearAllMocks();
  });

  // ─── 1. Standardized Color Tokens ──────────────────────────────────────────
  describe('1. Standardized Color Tokens', () => {
    it('defines exact hex color values for the 4 core brand and nature anchors', () => {
      expect(colors.nordicBlue.toUpperCase()).toBe('#1D4ED8');
      expect(colors.arcticWhite.toUpperCase()).toBe('#FFFFFF');
      expect(colors.fjordBlue.toUpperCase()).toBe('#0F766E');
      expect(colors.auroraGreen.toUpperCase()).toBe('#10B981');
    });

    it('exposes standardized colors in theme dictionary for dynamic styling', () => {
      expect(colors.themes.nordicBlue.toUpperCase()).toBe('#1D4ED8');
      expect(colors.themes.arcticWhite.toUpperCase()).toBe('#FFFFFF');
      expect(colors.themes.fjordBlue.toUpperCase()).toBe('#0F766E');
      expect(colors.themes.auroraGreen.toUpperCase()).toBe('#10B981');
    });
  });

  // ─── 2. Standardized Button Component ──────────────────────────────────────
  describe('2. Standardized Button Component', () => {
    it('renders all button variants with proper styles and text', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'gold', 'emerald'] as const;

      variants.forEach((v) => {
        const { unmount } = render(<Button variant={v}>Action {v}</Button>);
        const btn = screen.getByRole('button', { name: `Action ${v}` });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
        unmount();
      });
    });

    it('renders loading state with disabled interaction and spinner', () => {
      render(<Button isLoading leftIcon={<Sparkles data-testid="left-icon" />}>Processing Booking</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      expect(screen.getByText(/processing booking/i)).toBeInTheDocument();
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument(); // Replaced by spinner when loading
    });

    it('renders left and right icons when provided', () => {
      render(
        <Button 
          leftIcon={<Search data-testid="search-icon" />} 
          rightIcon={<Sparkles data-testid="sparkle-icon" />}
        >
          Discover
        </Button>
      );
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sparkle-icon')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });
  });

  // ─── 3. Standardized Card Component ────────────────────────────────────────
  describe('3. Standardized Card Hierarchy & Variants', () => {
    it('renders solid, glass, and outline card variants with structured content', () => {
      const variants = ['solid', 'glass', 'outline'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <Card variant={variant} data-testid={`card-${variant}`}>
            <CardHeader>
              <CardTitle>Geiranger Lodge</CardTitle>
              <CardDescription>Overlooking the emerald UNESCO waters</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Exclusive rorbu cabin with private sauna.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Book Now</Button>
            </CardFooter>
          </Card>
        );

        expect(screen.getByTestId(`card-${variant}`)).toBeInTheDocument();
        expect(screen.getByText('Geiranger Lodge')).toBeInTheDocument();
        expect(screen.getByText('Overlooking the emerald UNESCO waters')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
        unmount();
      });
    });
  });

  // ─── 4. Standardized Input Component ───────────────────────────────────────
  describe('4. Standardized Input Component', () => {
    it('renders input with accessible icons, placeholder, and handles change events', () => {
      const handleChange = vi.fn();
      render(
        <Input 
          placeholder="Search Norwegian fjords..." 
          leftIcon={<Search data-testid="input-icon" />}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Search Norwegian fjords...');
      expect(input).toBeInTheDocument();
      expect(screen.getByTestId('input-icon')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'Lofoten' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('renders accessible error state with role alert and aria-invalid', () => {
      render(
        <Input 
          placeholder="Email address" 
          error="Please enter a valid Norwegian email address" 
        />
      );

      const input = screen.getByPlaceholderText('Email address');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveTextContent('Please enter a valid Norwegian email address');
    });
  });

  // ─── 5. Standardized Modal Dialog ──────────────────────────────────────────
  describe('5. Standardized Accessible Modal Component', () => {
    it('renders accessible modal dialog when isOpen=true and closes on X click', () => {
      const handleClose = vi.fn();
      const { unmount } = render(
        <Modal isOpen={true} onClose={handleClose} title="Reserve Arctic Kayak Tour">
          <p>Select time and number of participants.</p>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Reserve Arctic Kayak Tour' })).toBeInTheDocument();
      expect(screen.getByText('Select time and number of participants.')).toBeInTheDocument();

      // Click Close X
      const closeBtn = screen.getByRole('button', { name: /close modal dialog/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
      unmount();
    });

    it('closes modal on Escape key press and locks body scroll', () => {
      const handleClose = vi.fn();
      const { unmount } = render(
        <Modal isOpen={true} onClose={handleClose} title="Escape Modal">
          <p>Press Esc to close.</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalled();
      unmount();
    });
  });

  // ─── 6. Four Universal Page States (Loading, Error, Empty, Success) ────────
  describe('6. Universal Four Page States (Loading, Error, Empty, Success)', () => {

    // A. Loading State
    it('Loading State: renders animated loading spinner, logo, and accessible status', () => {
      render(<LoadingState message="Discovering Northern Lights..." submessage="Fetching real-time solar wind data" />);
      expect(screen.getByText('Discovering Northern Lights...')).toBeInTheDocument();
      expect(screen.getByText('Fetching real-time solar wind data')).toBeInTheDocument();
      expect(screen.getByAltText('Norway SmartLife')).toBeInTheDocument();
    });

    it('Loading State: renders skeleton loader variants (CardGrid, Dashboard, DetailHero)', () => {
      const { unmount: u1 } = render(<CardGridSkeleton count={3} />);
      expect(screen.getByRole('status', { name: /loading content cards/i })).toBeInTheDocument();
      u1();

      const { unmount: u2 } = render(<DashboardSkeleton />);
      expect(screen.getByRole('status', { name: /loading dashboard/i })).toBeInTheDocument();
      u2();

      const { unmount: u3 } = render(<DetailHeroSkeleton />);
      expect(screen.getByRole('status', { name: /loading page details/i })).toBeInTheDocument();
      u3();
    });

    // B. Error State
    it('Error State: renders classified error views with recovery actions', () => {
      const errorTypes: ErrorType[] = ['NETWORK', 'AUTH_EXPIRED', 'PERMISSION_DENIED', 'NOT_FOUND', 'DATABASE', 'SERVER'];

      errorTypes.forEach((type) => {
        const handleRetry = vi.fn();
        const { unmount } = render(
          <MemoryRouter>
            <ErrorState type={type} onRetry={handleRetry} showHome showBack />
          </MemoryRouter>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();

        // The first button is the contextual action / retry button
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        fireEvent.click(buttons[0]);
        expect(handleRetry).toHaveBeenCalled();

        expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /return home/i })).toBeInTheDocument();
        unmount();
      });
    });

    // C. Empty State
    it('Empty State: renders pre-configured presets with actionable calls to action', () => {
      const presets: EmptyStatePreset[] = [
        'NO_FAVORITES',
        'NO_BOOKINGS',
        'NO_ORDERS',
        'NO_NOTIFICATIONS',
        'NO_SEARCH_RESULTS',
        'NO_SAVED_TRIPS',
      ];

      presets.forEach((preset) => {
        const handleAction = vi.fn();
        const { unmount } = render(
          <MemoryRouter>
            <EmptyState preset={preset} onAction={handleAction} />
          </MemoryRouter>
        );

        expect(screen.getByRole('region')).toBeInTheDocument();
        // Check for presence of CTA button
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    // D. Success State
    it('Success State: renders confirmation views across all presets without undefined values', () => {
      const presets: SuccessStatePreset[] = [
        'BOOKING_CONFIRMED',
        'PAYMENT_SUCCESSFUL',
        'ORDER_PLACED',
        'MESSAGE_SENT',
        'PROFILE_SAVED',
        'FEEDBACK_SUBMITTED'
      ];

      presets.forEach((preset) => {
        const { unmount } = render(
          <MemoryRouter>
            <SuccessState 
              preset={preset} 
              referenceId="NO-2026-9988" 
            />
          </MemoryRouter>
        );

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('NO-2026-9988')).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1);

        // Verify no undefined text is displayed
        expect(document.body.textContent).not.toContain('undefined');
        expect(document.body.textContent).not.toContain('null');
        expect(document.body.textContent).not.toContain('NaN');
        unmount();
      });
    });
  });

  // ─── 7. Resilience & Crash Prevention ─────────────────────────────────────
  describe('7. Resilience: No Blank Screen, No Undefined, No Layout Breaks', () => {
    it('handles empty or minimal props across all UI primitives without throwing exceptions', () => {
      // Button with no children
      const { unmount: u1 } = render(<Button />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      u1();

      // Card with no children
      const { unmount: u2 } = render(<Card />);
      u2();

      // EmptyState with no preset or custom props
      const { unmount: u3 } = render(<EmptyState />);
      expect(screen.getByText('No items to display')).toBeInTheDocument();
      u3();

      // ErrorState with no props
      const { unmount: u4 } = render(
        <MemoryRouter>
          <ErrorState />
        </MemoryRouter>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      u4();

      // SuccessState with no props
      const { unmount: u5 } = render(
        <MemoryRouter>
          <SuccessState />
        </MemoryRouter>
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
      u5();
    });
  });
});
