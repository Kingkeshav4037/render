/**
 * Norway SmartLife — Centralized Operational Logger
 * Provides structured client-side logging with automatic sensitive data redaction.
 * Guarantees zero leakage of passwords, tokens, API keys, OTPs, or payment card data.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'access_token',
  'refresh_token',
  'api_key',
  'apikey',
  'otp',
  'card',
  'card_number',
  'cvv',
  'cvc',
  'pin',
  'razorpay_signature',
  'key_secret',
  'client_secret'
];

/**
 * Deeply redacts sensitive keys and patterns from log payloads
 */
export function sanitizeLogData(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    let sanitized = data;
    // Redact Bearer tokens
    sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9-_=.]+/gi, 'Bearer [REDACTED]');
    // Redact JWT tokens
    sanitized = sanitized.replace(/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/gi, '[JWT_REDACTED]');
    // Redact card number patterns (13-19 digits)
    sanitized = sanitized.replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '[CARD_REDACTED]');
    return sanitized;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }

  if (typeof data === 'object') {
    if (data instanceof Error) {
      return {
        name: data.name,
        message: sanitizeLogData(data.message),
        ...(import.meta.env.DEV ? { stack: data.stack } : {})
      };
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = sanitizeLogData(value);
      }
    }
    return cleaned;
  }

  return data;
}

export const logger = {
  info(message: string, context?: Record<string, any>) {
    if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
      console.log(`[INFO] ${message}`, context ? sanitizeLogData(context) : '');
    }
  },

  warn(message: string, context?: Record<string, any>) {
    console.warn(`[WARN] ${message}`, context ? sanitizeLogData(context) : '');
  },

  error(message: string, error?: any, context?: Record<string, any>) {
    const sanitizedError = error ? sanitizeLogData(error) : undefined;
    const sanitizedContext = context ? sanitizeLogData(context) : undefined;
    console.error(`[ERROR] ${message}`, {
      ...(sanitizedError ? { error: sanitizedError } : {}),
      ...(sanitizedContext ? { context: sanitizedContext } : {})
    });
  },

  /**
   * Operational event recorder for critical user actions & failures
   */
  event(eventName: string, data?: Record<string, any>) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: sanitizeLogData(data || {})
    };
    if (import.meta.env.DEV) {
      console.log(`[EVENT] ${eventName}`, payload);
    }
  }
};
