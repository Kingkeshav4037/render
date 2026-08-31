export type AnalyticsEventType =
  | 'page_view'
  | 'search'
  | 'destination_view'
  | 'favorite_added'
  | 'favorite_removed'
  | 'trip_created'
  | 'trip_shared'
  | 'booking_started'
  | 'booking_completed'
  | 'order_started'
  | 'order_completed'
  | 'payment_failed'
  | 'cancellation_requested'
  | 'refund_completed'
  | 'invoice_downloaded';

export interface AnalyticsEvent {
  id: string;
  event: AnalyticsEventType;
  timestamp: string;
  userId?: string;
  properties: Record<string, any>;
  path: string;
}

export interface FunnelMetrics {
  views: number;
  searches: number;
  bookingsStarted: number;
  bookingsCompleted: number;
  bookingConversionRatePct: number;
  ordersStarted: number;
  ordersCompleted: number;
  orderConversionRatePct: number;
  cancellations: number;
  cancellationRatePct: number;
}

const STORAGE_KEY = 'nsl_analytics_events_log';
const MAX_LOGS = 500;

export const analyticsService = {
  /**
   * Tracks an analytics event with timestamp and path
   */
  track(event: AnalyticsEventType, properties: Record<string, any> = {}, userId?: string): AnalyticsEvent {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
      event,
      timestamp: new Date().toISOString(),
      userId,
      properties,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
    };

    try {
      const existing = this.getEvents();
      const updated = [newEvent, ...existing].slice(0, MAX_LOGS);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore local storage write errors
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics:${event}]`, properties);
    }

    return newEvent;
  },

  /**
   * Retrieves all recorded analytics events
   */
  getEvents(): AnalyticsEvent[] {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Calculates top viewed destinations
   */
  getMostViewedDestinations(limit = 5): Array<{ destination: string; count: number }> {
    const events = this.getEvents().filter((e) => e.event === 'destination_view');
    const counts: Record<string, number> = {};

    events.forEach((e) => {
      const dest = e.properties.destinationName || e.properties.slug || 'Unknown';
      counts[dest] = (counts[dest] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  /**
   * Calculates most searched terms
   */
  getMostSearchedTerms(limit = 5): Array<{ term: string; count: number }> {
    const events = this.getEvents().filter((e) => e.event === 'search');
    const counts: Record<string, number> = {};

    events.forEach((e) => {
      const query = (e.properties.query || '').trim().toLowerCase();
      if (query) {
        counts[query] = (counts[query] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  /**
   * Computes e-commerce and booking conversion funnel metrics
   */
  getFunnelMetrics(): FunnelMetrics {
    const events = this.getEvents();

    const views = events.filter((e) => e.event === 'page_view' || e.event === 'destination_view').length;
    const searches = events.filter((e) => e.event === 'search').length;
    const bookingsStarted = events.filter((e) => e.event === 'booking_started').length;
    const bookingsCompleted = events.filter((e) => e.event === 'booking_completed').length;
    const ordersStarted = events.filter((e) => e.event === 'order_started').length;
    const ordersCompleted = events.filter((e) => e.event === 'order_completed').length;
    const cancellations = events.filter((e) => e.event === 'cancellation_requested').length;

    const bookingConversionRatePct = bookingsStarted > 0
      ? Math.round((bookingsCompleted / bookingsStarted) * 100 * 10) / 10
      : 0;

    const orderConversionRatePct = ordersStarted > 0
      ? Math.round((ordersCompleted / ordersStarted) * 100 * 10) / 10
      : 0;

    const cancellationRatePct = bookingsCompleted > 0
      ? Math.round((cancellations / bookingsCompleted) * 100 * 10) / 10
      : 0;

    return {
      views,
      searches,
      bookingsStarted,
      bookingsCompleted,
      bookingConversionRatePct,
      ordersStarted,
      ordersCompleted,
      orderConversionRatePct,
      cancellations,
      cancellationRatePct,
    };
  },

  /**
   * Clears in-memory/local event logs
   */
  clearLogs() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
