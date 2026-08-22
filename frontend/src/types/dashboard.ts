export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  sustainability: SustainabilityImpact;
}

export interface UserPreferences {
  travelStyles: string[];
  dietaryRequirements: string[];
  accessibilityNeeds: string[];
  interests: string[];
  preferredCurrency: string;
}

export interface SustainabilityImpact {
  co2SavedKg: number;
  trainJourneys: number;
  ecoBookings: number;
  publicTransportUsage: number;
}

export interface Trip {
  id: string;
  title: string;
  destinationId?: string;
  destinationName?: string;
  startDate: string;
  endDate: string;
  budgetNok: number;
  status: 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  travelers: number;
  coverImage?: string;
  itinerary: ItineraryItem[];
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  startTime: string;
  endTime: string;
  activityTitle: string;
  locationName?: string;
  estimatedCostNok?: number;
  itemType?: 'flight' | 'train' | 'ferry' | 'hotel' | 'activity' | 'restaurant' | 'place' | 'custom';
  itemId?: string;
  completed: boolean;
}

export interface SmartAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'Weather' | 'Road' | 'Ferry' | 'Train' | 'Flight' | 'Trail' | 'Safety' | 'Booking';
  message: string;
  createdAt: string;
  expiresAt: string;
  relatedEntity?: string;
}

export interface AuroraForecast {
  activityLevel: 'Low' | 'Moderate' | 'Good' | 'High' | 'Extreme';
  visibilityProbability: number;
  cloudCoverage: number;
  bestViewingTime: string;
  recommendedLocations: string[];
}

export interface WeatherForecast {
  location: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  visibility: number;
  forecast: Array<{ day: string; temp: number; condition: string }>;
  sunrise: string;
  sunset: string;
}

export interface FavoriteItem {
  id: string;
  itemType: string;
  itemId: string;
  name: string;
  image: string;
  url: string;
}

export interface Notification {
  id: string;
  category: 'Travel' | 'Booking' | 'Payment' | 'Recommendation' | 'System' | 'Safety';
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardData {
  user: DashboardUser;
  stats: {
    trips: number;
    bookings: number;
    saved: number;
    reviews: number;
  };
  upcomingTrips: Trip[];
  activeTrip: Trip | null;
  bookings: any[]; // Existing booking type
  favorites: FavoriteItem[];
  alerts: SmartAlert[];
  notifications: Notification[];
  recommendations: any[]; 
  weather: WeatherForecast | null;
  aurora: AuroraForecast | null;
  nearby: any[];
  sustainability: SustainabilityImpact;
  spending: {
    totalBudget: number;
    spent: number;
    remaining: number;
    categories: Record<string, number>;
  };
}
