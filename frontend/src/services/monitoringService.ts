/**
 * Production Monitoring & Telemetry Service
 * 
 * Tracks technical events (frontend runtime errors, API latencies, unhandled rejections,
 * auth/payment failures) as well as critical business events (registrations, logins, searches,
 * favorites, bookings, orders, cancellations, refunds, trip creations, exports).
 */

export type BusinessEvent =
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'SEARCH_PERFORMED'
  | 'FAVORITE_SAVED'
  | 'FAVORITE_REMOVED'
  | 'TRIP_CREATED'
  | 'TRIP_DUPLICATED'
  | 'TRIP_SHARED'
  | 'STAY_HELD'
  | 'STAY_RELEASED'
  | 'CHECKOUT_STARTED'
  | 'ORDER_PLACED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'ORDER_CANCELLED'
  | 'REFUND_REQUESTED'
  | 'INVOICE_DOWNLOADED'
  | 'PDF_EXPORTED'
  | 'ICAL_EXPORTED';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'ERROR' | 'API_PERFORMANCE' | 'AUTH_FAILURE' | 'PAYMENT_FAILURE' | 'BUSINESS_EVENT';
  name: string;
  data?: Record<string, any>;
  url?: string;
  userAgent?: string;
}

const TELEMETRY_STORAGE_KEY = 'nsl_telemetry_logs_v1';
const MAX_LOGS = 100;

class MonitoringService {
  private logs: TelemetryLog[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(TELEMETRY_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch {
      this.logs = [];
    }

    // Global uncaught error listener
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Global unhandled promise rejection listener
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason || 'Unhandled Promise Rejection', {
        type: 'UNHANDLED_PROMISE_REJECTION',
      });
    });

    this.isInitialized = true;
  }

  private persistLog(log: TelemetryLog) {
    this.logs.unshift(log);
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(this.logs));
      }
    } catch {
      // Storage full or unavailable
    }
  }

  /**
   * Track runtime errors and boundary exceptions
   */
  trackError(error: Error | string | unknown, context?: Record<string, any>) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const log: TelemetryLog = {
      id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      name: message,
      data: {
        ...context,
        stack,
      },
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.persistLog(log);
    if (import.meta.env?.DEV) {
      console.warn('[Telemetry:Error]', log);
    }
    return log;
  }

  /**
   * Track API latency and request outcomes
   */
  trackApiPerformance(endpoint: string, durationMs: number, status: number, meta?: Record<string, any>) {
    const log: TelemetryLog = {
      id: `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'API_PERFORMANCE',
      name: endpoint,
      data: {
        durationMs,
        status,
        isSlow: durationMs > 2000,
        ...meta,
      },
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    this.persistLog(log);
    return log;
  }

  /**
   * Track authentication failures
   */
  trackAuthFailure(reason: string, details?: Record<string, any>) {
    const log: TelemetryLog = {
      id: `auth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'AUTH_FAILURE',
      name: reason,
      data: details,
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    this.persistLog(log);
    return log;
  }

  /**
   * Track payment failures and transaction anomalies
   */
  trackPaymentFailure(orderId: string, error: string | Error, meta?: Record<string, any>) {
    const log: TelemetryLog = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'PAYMENT_FAILURE',
      name: `Payment Failed for Order ${orderId}`,
      data: {
        orderId,
        error: error instanceof Error ? error.message : error,
        ...meta,
      },
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    this.persistLog(log);
    return log;
  }

  /**
   * Track key business milestones & interactions
   */
  trackEvent(event: BusinessEvent, properties?: Record<string, any>) {
    const log: TelemetryLog = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'BUSINESS_EVENT',
      name: event,
      data: properties,
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    this.persistLog(log);
    if (import.meta.env?.DEV) {
      console.log(`[Telemetry:${event}]`, properties);
    }
    return log;
  }

  /**
   * Get all captured telemetry logs
   */
  getLogs(): TelemetryLog[] {
    return [...this.logs];
  }

  /**
   * Clear captured telemetry logs
   */
  clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TELEMETRY_STORAGE_KEY);
    }
  }
}

export const monitoringService = new MonitoringService();
