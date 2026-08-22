/**
 * Unit Tests: Validators & Form Schemas
 *
 * Verifies:
 * - personalInfoSchema: Name validation, phone regex, date of birth limits, gender, language
 * - emergencyContactSchema: Name, relationship, phone regex, optional fields
 * - accommodationSchema: Min/max price refinement, star ratings, defaults
 * - travelPreferencesSchema: Trip style, budget levels, hiking difficulty, pace, companion types
 * - foodPreferencesSchema: Dietary preferences, allergies, cuisines, seafood preference
 * - transportSchema: Preferred modes, priority, driving license, walking distance limits
 * - notificationSchema: Channel flags (email, push, sms) for all categories
 * - privacySchema: Profile visibility, analytics, location access, recommendations
 * - validateAvatarFile: MIME types (jpeg, png, webp, gif vs invalid) and file size constraints (<= 2MB)
 */

import { describe, it, expect } from 'vitest';
import {
  personalInfoSchema,
  emergencyContactSchema,
  accommodationSchema,
  travelPreferencesSchema,
  foodPreferencesSchema,
  transportSchema,
  notificationSchema,
  privacySchema,
  validateAvatarFile,
} from '../../lib/validation/profileValidation';

describe('Unit Tests: Validators & Form Schemas', () => {

  // ─── 1. Personal Info Schema ───────────────────────────────────────────────
  describe('personalInfoSchema', () => {
    it('accepts valid complete personal info data', () => {
      const validData = {
        fullName: 'Kari Nordmann',
        phone: '+47 98765432',
        country: 'Norway',
        city: 'Bergen',
        dateOfBirth: '1995-05-15',
        gender: 'female',
        preferredLanguage: 'no',
      };

      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty fullName with descriptive error', () => {
      const invalidData = {
        fullName: '',
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/name is required/i);
      }
    });

    it('validates international phone numbers and rejects invalid characters', () => {
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', phone: '+1 (555) 123-4567' }).success).toBe(true);
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', phone: '4798765432' }).success).toBe(true);
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', phone: 'abc-invalid' }).success).toBe(false);
    });

    it('rejects future dateOfBirth and dates before 1900', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0];
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', dateOfBirth: futureDate }).success).toBe(false);
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', dateOfBirth: '1850-01-01' }).success).toBe(false);
      expect(personalInfoSchema.safeParse({ fullName: 'John Doe', dateOfBirth: '1990-06-20' }).success).toBe(true);
    });

    it('defaults preferredLanguage to "en" if not specified', () => {
      const parsed = personalInfoSchema.parse({ fullName: 'Alice Smith' });
      expect(parsed.preferredLanguage).toBe('en');
    });
  });

  // ─── 2. Emergency Contact Schema ───────────────────────────────────────────
  describe('emergencyContactSchema', () => {
    it('accepts valid emergency contact', () => {
      const validContact = {
        name: 'Ola Nordmann',
        relationship: 'Spouse',
        phone: '+47 91234567',
        email: 'ola@nordmann.no',
        country: 'Norway',
      };
      const result = emergencyContactSchema.safeParse(validContact);
      expect(result.success).toBe(true);
    });

    it('rejects when name or relationship is empty', () => {
      expect(emergencyContactSchema.safeParse({ name: '', relationship: 'Sibling', phone: '1234567' }).success).toBe(false);
      expect(emergencyContactSchema.safeParse({ name: 'Ola', relationship: '', phone: '1234567' }).success).toBe(false);
    });

    it('validates email format if provided', () => {
      expect(emergencyContactSchema.safeParse({
        name: 'Ola', relationship: 'Parent', phone: '1234567', email: 'not-an-email'
      }).success).toBe(false);
      expect(emergencyContactSchema.safeParse({
        name: 'Ola', relationship: 'Parent', phone: '1234567', email: 'ola@example.com'
      }).success).toBe(true);
    });
  });

  // ─── 3. Accommodation Preferences Schema ───────────────────────────────────
  describe('accommodationSchema', () => {
    it('accepts valid price range where priceMin <= priceMax', () => {
      const validData = {
        priceMin: 500,
        priceMax: 2000,
        starRating: 4,
      };
      const result = accommodationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects when priceMin > priceMax via refinement rule', () => {
      const invalidData = {
        priceMin: 3000,
        priceMax: 1000,
      };
      const result = accommodationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/minimum price must be less than or equal to maximum price/i);
      }
    });

    it('enforces starRating boundaries between 1 and 5', () => {
      expect(accommodationSchema.safeParse({ starRating: 0 }).success).toBe(false);
      expect(accommodationSchema.safeParse({ starRating: 6 }).success).toBe(false);
      expect(accommodationSchema.safeParse({ starRating: 3 }).success).toBe(true);
    });
  });

  // ─── 4. Travel & Food Preferences Schemas ──────────────────────────────────
  describe('travelPreferencesSchema and foodPreferencesSchema', () => {
    it('applies standard defaults for travel preferences', () => {
      const parsed = travelPreferencesSchema.parse({});
      expect(parsed.budgetLevel).toBe('moderate');
      expect(parsed.preferredTripDuration).toBe('week');
      expect(parsed.hikingDifficulty).toBe('moderate');
      expect(parsed.travelCompanions).toBe('solo');
      expect(parsed.indoorOutdoorPreference).toBe('both');
    });

    it('rejects invalid enum values for budget and companions', () => {
      expect(travelPreferencesSchema.safeParse({ budgetLevel: 'unlimited_money' }).success).toBe(false);
      expect(travelPreferencesSchema.safeParse({ travelCompanions: 'entire_village' }).success).toBe(false);
    });

    it('validates food preferences and seafood options', () => {
      const parsed = foodPreferencesSchema.parse({
        favoriteCuisines: ['Nordic', 'Italian'],
        seafoodPreference: 'love',
      });
      expect(parsed.favoriteCuisines).toContain('Nordic');
      expect(parsed.seafoodPreference).toBe('love');

      expect(foodPreferencesSchema.safeParse({ seafoodPreference: 'hate' }).success).toBe(false);
    });
  });

  // ─── 5. Transport, Notification & Privacy Schemas ──────────────────────────
  describe('transport, notification, and privacy schemas', () => {
    it('enforces transport priority enum and maxWalkingDistance constraints', () => {
      expect(transportSchema.safeParse({ priority: 'scenic', maxWalkingDistanceKm: 5 }).success).toBe(true);
      expect(transportSchema.safeParse({ priority: 'teleportation' }).success).toBe(false);
      expect(transportSchema.safeParse({ maxWalkingDistanceKm: 100 }).success).toBe(false); // max is 50
    });

    it('provides defaults for notification channels', () => {
      const parsed = notificationSchema.parse({});
      expect(parsed.bookingUpdates.email).toBe(true);
      expect(parsed.bookingUpdates.push).toBe(true);
      expect(parsed.marketing.email).toBe(false);
    });

    it('validates privacy profileVisibility choices', () => {
      expect(privacySchema.safeParse({ profileVisibility: 'public' }).success).toBe(true);
      expect(privacySchema.safeParse({ profileVisibility: 'friends' }).success).toBe(true);
      expect(privacySchema.safeParse({ profileVisibility: 'secret_hidden' }).success).toBe(false);
    });
  });

  // ─── 6. validateAvatarFile ─────────────────────────────────────────────────
  describe('validateAvatarFile', () => {
    it('returns null (valid) for accepted image types under 2MB', () => {
      const validJpeg = new File(['test-bytes'], 'avatar.jpg', { type: 'image/jpeg' });
      const validPng = new File(['test-bytes'], 'avatar.png', { type: 'image/png' });
      const validWebp = new File(['test-bytes'], 'avatar.webp', { type: 'image/webp' });

      expect(validateAvatarFile(validJpeg)).toBeNull();
      expect(validateAvatarFile(validPng)).toBeNull();
      expect(validateAvatarFile(validWebp)).toBeNull();
    });

    it('returns error message for unsupported file types', () => {
      const textFile = new File(['test-bytes'], 'doc.pdf', { type: 'application/pdf' });
      const scriptFile = new File(['test-bytes'], 'script.js', { type: 'text/javascript' });

      expect(validateAvatarFile(textFile)).toMatch(/must be a jpeg, png, webp, or gif/i);
      expect(validateAvatarFile(scriptFile)).toMatch(/must be a jpeg, png, webp, or gif/i);
    });

    it('returns error message for files exceeding 2MB (2 * 1024 * 1024 bytes)', () => {
      // Create a mock large file
      const largeBlob = new Array(3 * 1024 * 1024).fill('a').join('');
      const largeFile = new File([largeBlob], 'huge.png', { type: 'image/png' });

      expect(validateAvatarFile(largeFile)).toMatch(/size must be under 2mb/i);
    });
  });
});
