// ─────────────────────────────────────────────────────────────────────
// Zod validation schemas for all Profile preference forms (Phase 4)
// Uses Zod v4 (already installed in project)
// ─────────────────────────────────────────────────────────────────────
import { z } from 'zod';

// ── Personal Info ───────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  dateOfBirth: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        const now = new Date();
        return d < now && d > new Date('1900-01-01');
      },
      { message: 'Date of birth must be in the past' }
    )
    .optional()
    .or(z.literal('')),
  gender: z.string().max(50).optional().or(z.literal('')),
  preferredLanguage: z.string().default('en'),
});

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

// ── Travel Preferences ──────────────────────────────────────────────

const tripStyleOptions = [
  'adventurous', 'cultural', 'luxury', 'relaxed', 'romantic',
  'solo_explorer', 'family', 'backpacker', 'eco_traveler',
] as const;

const budgetLevels = ['budget', 'moderate', 'premium', 'luxury'] as const;
const tripDurations = ['day_trip', 'weekend', 'week', 'two_weeks', 'month'] as const;
const hikingDifficulties = ['easy', 'moderate', 'hard', 'expert'] as const;
const companionTypes = ['solo', 'couple', 'family', 'group'] as const;
const priorityLevels = ['low', 'moderate', 'high'] as const;
const sustainabilityLevels = ['low', 'moderate', 'high', 'essential'] as const;
const adventureLevels = ['low', 'moderate', 'high', 'extreme'] as const;
const paceLevels = ['slow', 'moderate', 'fast'] as const;

export const travelPreferencesSchema = z.object({
  preferredTripStyle: z.array(z.string()).default([]),
  budgetLevel: z.enum(budgetLevels).default('moderate'),
  preferredTripDuration: z.enum(tripDurations).default('week'),
  preferredDestinations: z.array(z.string()).default([]),
  activityInterests: z.array(z.string()).default([]),
  hikingDifficulty: z.enum(hikingDifficulties).default('moderate'),
  accessibilityRequirements: z.array(z.string()).default([]),
  travelCompanions: z.enum(companionTypes).default('solo'),
  childrenAges: z.array(z.number().min(0).max(18)).default([]),
  sustainabilityPriority: z.enum(sustainabilityLevels).default('moderate'),
  preferredTravelPace: z.enum(paceLevels).default('moderate'),
  indoorOutdoorPreference: z.enum(['indoor', 'outdoor', 'both']).default('both'),
  photographyInterest: z.boolean().default(false),
  culturalInterest: z.enum(priorityLevels).default('moderate'),
  nightlifePreference: z.enum(priorityLevels).default('low'),
  adventureLevel: z.enum(adventureLevels).default('moderate'),
});

export type TravelPreferencesForm = z.infer<typeof travelPreferencesSchema>;

// ── Food Preferences ────────────────────────────────────────────────

export const foodPreferencesSchema = z.object({
  favoriteCuisines: z.array(z.string()).default([]),
  dietaryPreferences: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  foodDislikes: z.array(z.string()).default([]),
  seafoodPreference: z.enum(['love', 'neutral', 'avoid']).default('neutral'),
});

export type FoodPreferencesForm = z.infer<typeof foodPreferencesSchema>;

// ── Accommodation Preferences ───────────────────────────────────────

export const accommodationSchema = z
  .object({
    preferredTypes: z.array(z.string()).default([]),
    priceRange: z.enum(budgetLevels).default('moderate'),
    priceMin: z.number().min(0).optional(),
    priceMax: z.number().min(0).optional(),
    currency: z.string().default('NOK'),
    starRating: z.number().min(1).max(5).default(3),
    amenities: z.record(z.string(), z.boolean()).default({}),
    locationPreference: z.enum(['city_center', 'nature', 'coastal']).default('city_center'),
    privateRoom: z.boolean().default(true),
    breakfastRequired: z.boolean().default(false),
    cancellationPreference: z.enum(['flexible', 'moderate', 'strict']).default('flexible'),
    accessibilityRequired: z.boolean().default(false),
    petFriendly: z.boolean().default(false),
    familyFriendly: z.boolean().default(false),
    ecoCertified: z.boolean().default(false),
    maxDistanceCenterKm: z.number().min(0).optional(),
    maxDistanceTransportKm: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.priceMin != null && data.priceMax != null) {
        return data.priceMin <= data.priceMax;
      }
      return true;
    },
    { message: 'Minimum price must be less than or equal to maximum price', path: ['priceMin'] }
  );

export type AccommodationForm = z.infer<typeof accommodationSchema>;

// ── Transport Preferences ───────────────────────────────────────────

export const transportSchema = z.object({
  preferredModes: z.array(z.string()).default([]),
  avoidModes: z.array(z.string()).default([]),
  priority: z
    .enum(['fastest', 'cheapest', 'sustainable', 'comfortable', 'scenic', 'balanced'])
    .default('balanced'),
  drivingLicense: z.boolean().default(false),
  maxWalkingDistanceKm: z.number().min(0).max(50).default(2),
  maxTransferCount: z.number().min(0).max(10).default(3),
  rentalCarPreference: z.boolean().default(false),
  evPreference: z.boolean().default(false),
  scenicRoutePreference: z.boolean().default(false),
});

export type TransportForm = z.infer<typeof transportSchema>;

// ── Notification Preferences ────────────────────────────────────────

const channelSchema = z.object({
  email: z.boolean().default(false),
  push: z.boolean().default(false),
  sms: z.boolean().default(false),
});

export const notificationSchema = z.object({
  bookingUpdates: channelSchema.default({ email: true, push: true, sms: false }),
  tripReminders: channelSchema.default({ email: true, push: true, sms: false }),
  weatherAlerts: channelSchema.default({ email: false, push: true, sms: false }),
  auroraAlerts: channelSchema.default({ email: false, push: true, sms: false }),
  safetyAlerts: channelSchema.default({ email: true, push: true, sms: false }),
  marketing: channelSchema.default({ email: false, push: false, sms: false }),
});

export type NotificationForm = z.infer<typeof notificationSchema>;

// ── Privacy Preferences ─────────────────────────────────────────────

export const privacySchema = z.object({
  profileVisibility: z.enum(['private', 'friends', 'public']).default('private'),
  locationAccess: z.enum(['allowed', 'denied', 'while_using']).default('denied'),
  personalizedRecommendations: z.boolean().default(true),
  analyticsTracking: z.boolean().default(true),
  locationHistory: z.boolean().default(false),
  recommendationData: z.boolean().default(true),
  marketingCommunications: z.boolean().default(false),
  dataSharing: z.boolean().default(false),
});

export type PrivacyForm = z.infer<typeof privacySchema>;

// ── Emergency Contact ───────────────────────────────────────────────

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number'),
  alternatePhone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
});

export type EmergencyContactForm = z.infer<typeof emergencyContactSchema>;

// ── Avatar Upload ───────────────────────────────────────────────────

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const validateAvatarFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'File must be a JPEG, PNG, WebP, or GIF image';
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return 'File size must be under 2MB';
  }
  return null; // valid
};
