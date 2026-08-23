/**
 * Norway SmartLife — Edge Function Structured Logger
 * Deno-compatible logger with automated secret and credential redaction.
 */

const SENSITIVE_FIELDS = [
  'password',
  'secret',
  'token',
  'authorization',
  'apikey',
  'api_key',
  'signature',
  'otp',
  'card',
  'cvv',
  'cvc'
];

export function sanitizeEdgeData(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return data
      .replace(/Bearer\s+[A-Za-z0-9-_=.]+/gi, 'Bearer [REDACTED]')
      .replace(/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/gi, '[JWT_REDACTED]')
      .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '[CARD_REDACTED]');
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeEdgeData(item));
  }

  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_FIELDS.some(f => lowerKey.includes(f))) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = sanitizeEdgeData(value);
      }
    }
    return cleaned;
  }

  return data;
}

export const edgeLogger = {
  info(message: string, meta?: Record<string, any>) {
    console.log(JSON.stringify({
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      ...(meta ? { meta: sanitizeEdgeData(meta) } : {})
    }));
  },

  warn(message: string, meta?: Record<string, any>) {
    console.warn(JSON.stringify({
      level: 'WARN',
      message,
      timestamp: new Date().toISOString(),
      ...(meta ? { meta: sanitizeEdgeData(meta) } : {})
    }));
  },

  error(message: string, error?: any, meta?: Record<string, any>) {
    console.error(JSON.stringify({
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : sanitizeEdgeData(error),
      ...(meta ? { meta: sanitizeEdgeData(meta) } : {})
    }));
  },

  operationalEvent(eventType: string, details: Record<string, any>) {
    console.log(JSON.stringify({
      level: 'OPERATIONAL_EVENT',
      event: eventType,
      timestamp: new Date().toISOString(),
      details: sanitizeEdgeData(details)
    }));
  }
};
