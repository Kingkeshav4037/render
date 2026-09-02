/**
 * Client-Side Input Sanitization and Validation Utility
 * Defends against XSS, injection attacks, and malformed inputs before network dispatch.
 */

/**
 * Strips script tags, event handlers, and dangerous protocols from user inputs
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    .replace(/\0/g, '') // Strip null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip scripts
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '') // Strip inline event handlers
    .replace(/javascript:/gi, '') // Strip javascript: URIs
    .replace(/<[^>]+>/g, '') // Strip remaining HTML tags
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes search queries for safe database/RPC transmission
 */
export function sanitizeSearchQuery(query: string, maxLength = 100): string {
  if (!query || typeof query !== 'string') return '';
  
  // Remove special regex/SQL injection characters
  return query
    .replace(/['";\\%_]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates UUID v4 format
 */
export function isValidUUID(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id.trim());
}

/**
 * Validates standard email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}
