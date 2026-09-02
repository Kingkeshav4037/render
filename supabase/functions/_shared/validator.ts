/**
 * Server-Side Input Validation and Sanitization for Edge Functions
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function sanitizeString(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and dangerous script/html tags
  let sanitized = input
    .replace(/\0/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function validateUUID(id: unknown, fieldName = 'id'): string {
  if (typeof id !== 'string') {
    throw new ValidationError(`${fieldName} must be a string.`);
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new ValidationError(`Invalid ${fieldName}: must be a valid UUID.`);
  }

  return id;
}

export function validateEmail(email: unknown): string {
  if (typeof email !== 'string') {
    throw new ValidationError('Email must be a string.');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    throw new ValidationError('Invalid email address format.');
  }

  return email.trim().toLowerCase();
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): number {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    throw new ValidationError(`${fieldName} must be a valid number between ${min} and ${max}.`);
  }
  return num;
}
