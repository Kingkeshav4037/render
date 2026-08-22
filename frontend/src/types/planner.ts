export interface TripPlanRequest {
  destinations: string[];
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  partySize: number;
  partyType: 'solo' | 'couple' | 'family' | 'friends' | 'group';
  travelStyle: 'luxury' | 'adventure' | 'relaxed' | 'budget' | 'romantic' | 'photography' | 'food';
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury';
  interests: string[];
  durationDays: number;
}

export interface TripActivity {
  id: string;
  time: string;
  durationHours: number;
  title: string;
  description: string;
  location: string;
  type: 'transport' | 'accommodation' | 'activity' | 'dining' | 'leisure';
  cost?: number;
  currency?: string;
  reservationId?: string;
  weatherWarning?: string;
}

export interface TripDay {
  day: number;
  date: string;
  title: string;
  activities: TripActivity[];
}

export interface TripPlanResponse {
  id: string;
  title: string;
  summary: string;
  days: TripDay[];
  totalCostEstimate?: number;
  currency?: string;
}
