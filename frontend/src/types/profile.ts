// ─────────────────────────────────────────────────────────────────────
// Domain types for the Profile Preference System (Phase 4)
// These are the canonical frontend types. DB ↔ domain mapping happens
// in the service layer.
// ─────────────────────────────────────────────────────────────────────

export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'PROVIDER' | 'USER' | 'DATA_MANAGER' | 'ANALYST';

/**
 * Normalizes raw role strings from Supabase (e.g. 'super admin', 'Super Admin', 'super_admin', 'ADMIN')
 * to standard canonical AppRole values.
 */
export function normalizeRole(rawRole?: string | null): AppRole {
  if (!rawRole) return 'USER';
  const clean = String(rawRole).trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (clean === 'SUPER_ADMIN' || clean === 'SUPERADMIN' || clean === 'SUPER_ADMINISTRATOR') return 'SUPER_ADMIN';
  if (clean === 'ADMIN' || clean === 'ADMINISTRATOR') return 'ADMIN';
  if (clean === 'MODERATOR') return 'MODERATOR';
  if (clean === 'PROVIDER') return 'PROVIDER';
  if (clean === 'ANALYST') return 'ANALYST';
  if (clean === 'DATA_MANAGER' || clean === 'DATAMANAGER') return 'DATA_MANAGER';
  return 'USER';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  phoneVerified: boolean;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  role?: string;
}

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say'
] as const;

export type GenderType = typeof GENDER_OPTIONS[number];

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export const POPULAR_COUNTRIES: CountryOption[] = [
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'OTHER', name: 'Other / International', flag: '🌍' },
];

/**
 * Checks if all required traveler profile fields are present and non-empty.
 */
export function isProfileComplete(profile: Partial<UserProfile> | null | undefined): boolean {
  if (!profile) return false;
  
  const hasGender = Boolean(profile.gender && profile.gender.trim().length > 0);
  const hasDob = Boolean(profile.dateOfBirth && profile.dateOfBirth.trim().length > 0);
  const hasAddress = Boolean(profile.address && profile.address.trim().length > 0);
  const hasCountry = Boolean(profile.country && profile.country.trim().length > 0);

  return hasGender && hasDob && hasAddress && hasCountry;
}

// ── Travel ──────────────────────────────────────────────────────────

export interface TravelPreferences {
  preferredTripStyle: string[];
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury';
  preferredTripDuration: 'day_trip' | 'weekend' | 'week' | 'two_weeks' | 'month';
  preferredDestinations: string[];
  activityInterests: string[];
  hikingDifficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  accessibilityRequirements: string[];
  travelCompanions: 'solo' | 'couple' | 'family' | 'group';
  childrenAges: number[];
  sustainabilityPriority: 'low' | 'moderate' | 'high' | 'essential';
  preferredTravelPace: 'slow' | 'moderate' | 'fast';
  indoorOutdoorPreference: 'indoor' | 'outdoor' | 'both';
  photographyInterest: boolean;
  culturalInterest: 'low' | 'moderate' | 'high';
  nightlifePreference: 'low' | 'moderate' | 'high';
  adventureLevel: 'low' | 'moderate' | 'high' | 'extreme';
}

// ── Food ────────────────────────────────────────────────────────────

export interface FoodPreferences {
  favoriteCuisines: string[];
  dietaryPreferences: string[];
  allergies: string[];           // Safety-critical
  foodDislikes: string[];
  seafoodPreference: 'love' | 'neutral' | 'avoid';
}

// ── Accommodation ───────────────────────────────────────────────────

export interface AccommodationPreferences {
  preferredTypes: string[];
  priceRange: 'budget' | 'moderate' | 'premium' | 'luxury';
  priceMin?: number;
  priceMax?: number;
  currency: string;
  starRating: number;
  amenities: Record<string, boolean>;
  locationPreference: 'city_center' | 'nature' | 'coastal';
  privateRoom: boolean;
  breakfastRequired: boolean;
  cancellationPreference: 'flexible' | 'moderate' | 'strict';
  accessibilityRequired: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  ecoCertified: boolean;
  maxDistanceCenterKm?: number;
  maxDistanceTransportKm?: number;
}

// ── Transport ───────────────────────────────────────────────────────

export interface TransportPreferences {
  preferredModes: string[];
  avoidModes: string[];
  priority: 'fastest' | 'cheapest' | 'sustainable' | 'comfortable' | 'scenic' | 'balanced';
  drivingLicense: boolean;
  maxWalkingDistanceKm: number;
  maxTransferCount: number;
  rentalCarPreference: boolean;
  evPreference: boolean;
  scenicRoutePreference: boolean;
}

// ── Notifications ───────────────────────────────────────────────────

export interface NotificationChannel {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface NotificationPreferences {
  bookingUpdates: NotificationChannel;
  tripReminders: NotificationChannel;
  weatherAlerts: NotificationChannel;
  auroraAlerts: NotificationChannel;
  safetyAlerts: NotificationChannel;
  marketing: NotificationChannel;
}

// ── Privacy ─────────────────────────────────────────────────────────

export interface PrivacyPreferences {
  profileVisibility: 'private' | 'friends' | 'public';
  locationAccess: 'allowed' | 'denied' | 'while_using';
  personalizedRecommendations: boolean;
  analyticsTracking: boolean;
  locationHistory: boolean;
  recommendationData: boolean;
  marketingCommunications: boolean;
  dataSharing: boolean;
}

// ── Emergency ───────────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  country?: string;
  isPrimary: boolean;
}

// ── Connected Accounts ──────────────────────────────────────────────

export interface ConnectedAccount {
  id: string;
  provider: 'google' | 'email' | 'phone' | 'apple';
  providerId?: string;
  status: 'connected' | 'disconnected';
  connectedAt: string;
}

// ── Profile Completion ──────────────────────────────────────────────

export const PROFILE_COMPLETION_WEIGHTS = {
  personal: 20,
  travel: 20,
  food: 10,
  accommodation: 15,
  transport: 10,
  notifications: 10,
  emergency: 10,
  privacy: 5,
} as const;

export type ProfileSection = keyof typeof PROFILE_COMPLETION_WEIGHTS;

// ── Personalization Context (for AI Planner) ────────────────────────

export interface PersonalizationContext {
  travelPreferences: TravelPreferences;
  foodPreferences: FoodPreferences;
  accommodationPreferences: AccommodationPreferences;
  transportPreferences: TransportPreferences;
  accessibilityNeeds: string[];
  preferredCurrency: string;
  language: string;
}

// ── Profile Tab IDs ─────────────────────────────────────────────────

export type ProfileTabId =
  | 'personal'
  | 'travel'
  | 'food'
  | 'accommodation'
  | 'transport'
  | 'notifications'
  | 'privacy'
  | 'security'
  | 'emergency';
