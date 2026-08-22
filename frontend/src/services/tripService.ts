import { supabase } from '../lib/supabase';

export interface TripLocation {
  name: string;
}

export interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  budget_nok: number;
  status: string;
  total_co2_kg?: number;
}

export interface TripSegment {
  id: string;
  sequence_order: number;
  transport_mode: string;
  start_time: string;
  end_time: string;
  distance_km: number;
  start_location?: TripLocation;
  end_location?: TripLocation;
  co2_kg?: number;
}

export interface TripStay {
  id: string;
  accommodation_name: string;
  check_in: string;
  check_out: string;
  location?: TripLocation;
  co2_kg?: number;
}

export interface TripActivity {
  id: string;
  activity_title: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  location?: TripLocation;
  co2_kg?: number;
}

export const tripService = {
  async fetchTrip(tripId: string) {
    // Remove mock logic
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, title, start_date, end_date, budget_nok, status, total_co2_kg')
      .eq('id', tripId)
      .single();
      
    if (tripError || !trip) {
      console.error(tripError);
      return null;
    }

    const { data: segments } = await supabase
      .from('trip_segments')
      .select('id, sequence_order, transport_mode, start_time, end_time, distance_km, co2_kg, start_location:start_location_id(name), end_location:end_location_id(name)')
      .eq('trip_id', tripId)
      .order('sequence_order', { ascending: true });

    const { data: stays } = await supabase
      .from('trip_stays')
      .select('id, accommodation_name, check_in, check_out, co2_kg, location:location_id(name)')
      .eq('trip_id', tripId)
      .order('check_in', { ascending: true });

    const { data: activities } = await supabase
      .from('trip_activities')
      .select('id, activity_title, activity_type, start_time, end_time, co2_kg, location:location_id(name)')
      .eq('trip_id', tripId)
      .order('start_time', { ascending: true });

    return {
      trip: trip as Trip,
      segments: (segments || []) as TripSegment[],
      stays: (stays || []) as TripStay[],
      activities: (activities || []) as TripActivity[]
    };
  },

  async fetchUserTrips(userId: string) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('trips')
      .select('id, title, start_date, end_date, budget_nok, status, total_co2_kg')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user trips:', error);
      return [];
    }
    return data as Trip[];
  }
};
