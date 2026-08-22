// ─────────────────────────────────────────────────────────────────────
// Domain types for the Profile Preference System (Phase 4)
// These are the canonical frontend types. DB ↔ domain mapping happens
// in the service layer.
// ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  phoneVerified: boolean;
  country?: string;
  city?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  role?: string;
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
