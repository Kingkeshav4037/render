/**
 * In-memory sliding window rate limiter for Supabase Edge Functions
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < 60000);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60s)
  maxRequests?: number; // Max allowed requests in window (default: 30)
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
  headers: Record<string, string>;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 60000;
  const maxRequests = options.maxRequests ?? 30;
  const prefix = options.keyPrefix ?? 'global';
  const key = `${prefix}:${identifier}`;

  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  const currentCount = record.timestamps.length;
  const remaining = Math.max(0, maxRequests - currentCount - 1);
  const resetTimeMs = record.timestamps.length > 0 ? record.timestamps[0] + windowMs : now + windowMs;

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTimeMs / 1000).toString(),
  };

  if (currentCount >= maxRequests) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetTimeMs,
      headers,
    };
  }

  record.timestamps.push(now);

  return {
    allowed: true,
    limit: maxRequests,
    remaining,
    resetTimeMs,
    headers,
  };
}
