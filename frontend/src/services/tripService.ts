import { supabase } from '../lib/supabase';

export interface TripLocation {
  id?: string;
  name: string;
  lat?: number;
  lng?: number;
  region?: string;
}

export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget_nok?: number;
  status: string;
  total_co2_kg?: number;
  visibility?: 'PRIVATE' | 'SHARED_WITH_LINK' | 'PUBLIC';
  share_token?: string;
  notes?: string;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  description?: string;
  notes?: string;
  activities?: TripActivity[];
  stays?: TripStay[];
  segments?: TripSegment[];
}

export interface TripSegment {
  id: string;
  trip_id?: string;
  trip_day_id?: string;
  sequence_order: number;
  transport_mode: 'CAR' | 'TRAIN' | 'FERRY' | 'FLIGHT' | 'BUS' | 'EV' | string;
  start_time?: string;
  end_time?: string;
  distance_km: number;
  estimated_duration_minutes?: number;
  start_location?: TripLocation;
  end_location?: TripLocation;
  start_location_id?: string;
  end_location_id?: string;
  co2_kg?: number;
  notes?: string;
}

export interface TripStay {
  id: string;
  trip_id?: string;
  trip_day_id?: string;
  accommodation_name: string;
  location_id?: string;
  check_in: string;
  check_out: string;
  price_nok?: number;
  location?: TripLocation;
  co2_kg?: number;
  notes?: string;
}

export interface TripActivity {
  id: string;
  trip_id?: string;
  trip_day_id?: string;
  activity_title: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  price_nok?: number;
  location?: TripLocation;
  location_id?: string;
  co2_kg?: number;
  notes?: string;
  duration_minutes?: number;
}

export interface SmartTripWarning {
  id: string;
  type: 'OVERLAP' | 'IMPOSSIBLE_TRAVEL' | 'CLOSED_ATTRACTION' | 'PACKED_DAY' | 'MISSING_STAY' | 'SEASONAL_WARNING';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  day_number?: number;
  item_ids?: string[];
  recommendation?: string;
}

export interface TripCostSummary {
  accommodation_total_nok: number;
  activities_total_nok: number;
  transport_total_nok: number;
  food_estimate_nok: number;
  grand_total_nok: number;
  is_within_budget: boolean;
  budget_nok?: number;
}

// Distance / Travel Time Matrix between major Norwegian Travel Hubs (km, minutes)
export const NORWAY_TRAVEL_MATRIX: Record<string, Record<string, { distance_km: number; drive_minutes: number; flight_minutes?: number }>> = {
  'Oslo': {
    'Bergen': { distance_km: 460, drive_minutes: 420, flight_minutes: 55 },
    'Flåm': { distance_km: 350, drive_minutes: 310 },
    'Geiranger': { distance_km: 440, drive_minutes: 390 },
    'Tromsø': { distance_km: 1650, drive_minutes: 1320, flight_minutes: 115 },
    'Lofoten': { distance_km: 1400, drive_minutes: 1140, flight_minutes: 90 },
    'Stavanger': { distance_km: 550, drive_minutes: 480, flight_minutes: 50 },
    'Ålesund': { distance_km: 540, drive_minutes: 460, flight_minutes: 60 },
  },
  'Bergen': {
    'Oslo': { distance_km: 460, drive_minutes: 420, flight_minutes: 55 },
    'Flåm': { distance_km: 170, drive_minutes: 150 },
    'Geiranger': { distance_km: 370, drive_minutes: 360 },
    'Stavanger': { distance_km: 210, drive_minutes: 270 },
    'Ålesund': { distance_km: 300, drive_minutes: 330 },
    'Tromsø': { distance_km: 1800, drive_minutes: 1500, flight_minutes: 120 },
  },
  'Flåm': {
    'Bergen': { distance_km: 170, drive_minutes: 150 },
    'Oslo': { distance_km: 350, drive_minutes: 310 },
    'Geiranger': { distance_km: 280, drive_minutes: 270 },
  },
  'Tromsø': {
    'Oslo': { distance_km: 1650, drive_minutes: 1320, flight_minutes: 115 },
    'Lofoten': { distance_km: 420, drive_minutes: 360 },
  }
};

export const tripService = {
  /**
   * Fetch complete trip by ID or Share Token
   */
  async fetchTrip(tripId: string, shareToken?: string) {
    try {
      let query = (supabase.from('trips') as any)
        .select('id, user_id, title, description, start_date, end_date, budget_nok, status, total_co2_kg, visibility, share_token, notes, is_archived, created_at, updated_at');

      if (shareToken) {
        query = query.eq('share_token', shareToken);
      } else {
        query = query.eq('id', tripId);
      }

      const { data: trip, error: tripError } = await query.single();

      if (tripError || !trip) {
        console.error('Error fetching trip:', tripError);
        return null;
      }

      // Fetch days
      const { data: days } = await (supabase.from('trip_days') as any)
        .select('id, trip_id, day_number, date, description')
        .eq('trip_id', trip.id)
        .order('day_number', { ascending: true });

      const { data: segments } = await (supabase.from('trip_segments') as any)
        .select('id, trip_id, trip_day_id, sequence_order, transport_mode, start_time, end_time, distance_km, co2_kg, start_location_id, end_location_id, start_location:start_location_id(name), end_location:end_location_id(name)')
        .eq('trip_id', trip.id)
        .order('sequence_order', { ascending: true });

      const { data: stays } = await (supabase.from('trip_stays') as any)
        .select('id, trip_id, trip_day_id, accommodation_name, location_id, check_in, check_out, co2_kg, location:location_id(name)')
        .eq('trip_id', trip.id)
        .order('check_in', { ascending: true });

      const { data: activities } = await (supabase.from('trip_activities') as any)
        .select('id, trip_id, trip_day_id, activity_title, activity_type, start_time, end_time, co2_kg, location_id, location:location_id(name), notes')
        .eq('trip_id', trip.id)
        .order('start_time', { ascending: true });

      // Group into days
      const formattedDays: TripDay[] = (days || []).map((d: any) => ({
        ...d,
        activities: (activities || []).filter((a: any) => a.trip_day_id === d.id),
        stays: (stays || []).filter((s: any) => s.trip_day_id === d.id),
        segments: (segments || []).filter((seg: any) => seg.trip_day_id === d.id),
      }));

      return {
        trip: trip as Trip,
        days: formattedDays,
        segments: (segments || []) as TripSegment[],
        stays: (stays || []) as TripStay[],
        activities: (activities || []) as TripActivity[],
      };
    } catch (err) {
      console.error('Exception fetching trip:', err);
      return null;
    }
  },

  /**
   * Fetch all user trips (excluding archived unless specified)
   */
  async fetchUserTrips(userId: string, includeArchived: boolean = false): Promise<Trip[]> {
    if (!userId) return [];
    try {
      let query = (supabase.from('trips') as any)
        .select('*')
        .eq('user_id', userId);

      if (!includeArchived) {
        query = query.or('is_archived.is.null,is_archived.eq.false');
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Trip[];
    } catch (err) {
      console.warn('Error fetching user trips:', err);
      return [];
    }
  },

  /**
   * Create a new trip with days
   */
  async createTrip(
    userId: string,
    tripData: {
      title: string;
      description?: string;
      start_date: string;
      end_date: string;
      budget_nok?: number;
      visibility?: 'PRIVATE' | 'SHARED_WITH_LINK' | 'PUBLIC';
      notes?: string;
    }
  ): Promise<Trip | null> {
    try {
      const shareToken = `trip_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      const { data: trip, error } = await (supabase.from('trips') as any)
        .insert({
          user_id: userId,
          title: tripData.title,
          description: tripData.description || '',
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          budget_nok: tripData.budget_nok || 15000,
          status: 'PLANNED',
          visibility: tripData.visibility || 'PRIVATE',
          share_token: shareToken,
          notes: tripData.notes || '',
          is_archived: false,
        })
        .select()
        .single();

      if (error || !trip) throw error;

      // Automatically generate trip days
      const start = new Date(tripData.start_date);
      const end = new Date(tripData.end_date);
      const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const daysToInsert = Array.from({ length: totalDays }, (_, idx) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + idx);
        return {
          trip_id: trip.id,
          day_number: idx + 1,
          date: currentDate.toISOString().split('T')[0],
          description: `Day ${idx + 1} Itinerary`,
        };
      });

      await (supabase.from('trip_days') as any).insert(daysToInsert);

      return trip as Trip;
    } catch (err) {
      console.error('Error creating trip:', err);
      return null;
    }
  },

  /**
   * Update an existing trip
   */
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<boolean> {
    try {
      const { error } = await (supabase.from('trips') as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tripId);

      return !error;
    } catch (err) {
      console.error('Error updating trip:', err);
      return false;
    }
  },

  /**
   * Duplicate an existing trip
   */
  async duplicateTrip(tripId: string, userId: string): Promise<Trip | null> {
    try {
      const original = await this.fetchTrip(tripId);
      if (!original || !original.trip) return null;

      const newTrip = await this.createTrip(userId, {
        title: `${original.trip.title} (Copy)`,
        description: original.trip.description,
        start_date: original.trip.start_date,
        end_date: original.trip.end_date,
        budget_nok: original.trip.budget_nok,
        visibility: 'PRIVATE',
        notes: original.trip.notes,
      });

      if (!newTrip) return null;

      // Clone activities & stays into the duplicated trip days
      const newDays = await (supabase.from('trip_days') as any)
        .select('id, day_number')
        .eq('trip_id', newTrip.id);

      const dayMap = new Map<number, string>();
      newDays?.data?.forEach((d: any) => dayMap.set(d.day_number, d.id));

      if (original.days && original.days.length > 0) {
        for (const oldDay of original.days) {
          const targetDayId = dayMap.get(oldDay.day_number);
          if (!targetDayId) continue;

          // Copy activities
          if (oldDay.activities && oldDay.activities.length > 0) {
            await (supabase.from('trip_activities') as any).insert(
              oldDay.activities.map(a => ({
                trip_id: newTrip.id,
                trip_day_id: targetDayId,
                activity_title: a.activity_title,
                activity_type: a.activity_type,
                start_time: a.start_time,
                end_time: a.end_time,
                location_id: a.location_id,
                notes: a.notes,
              }))
            );
          }

          // Copy stays
          if (oldDay.stays && oldDay.stays.length > 0) {
            await (supabase.from('trip_stays') as any).insert(
              oldDay.stays.map(s => ({
                trip_id: newTrip.id,
                trip_day_id: targetDayId,
                accommodation_name: s.accommodation_name,
                location_id: s.location_id,
                check_in: s.check_in,
                check_out: s.check_out,
              }))
            );
          }
        }
      }

      return newTrip;
    } catch (err) {
      console.error('Error duplicating trip:', err);
      return null;
    }
  },

  /**
   * Delete or archive a trip
   */
  async deleteTrip(tripId: string): Promise<boolean> {
    try {
      const { error } = await (supabase.from('trips') as any)
        .delete()
        .eq('id', tripId);
      return !error;
    } catch (err) {
      console.error('Error deleting trip:', err);
      return false;
    }
  },

  async archiveTrip(tripId: string, isArchived: boolean = true): Promise<boolean> {
    return this.updateTrip(tripId, { is_archived: isArchived });
  },

  /**
   * Generate or retrieve public share token
   */
  async getOrGenerateShareToken(tripId: string): Promise<string | null> {
    try {
      const { data: trip } = await (supabase.from('trips') as any)
        .select('share_token, visibility')
        .eq('id', tripId)
        .single();

      if (trip?.share_token) {
        return trip.share_token;
      }

      const newToken = `trip_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      await (supabase.from('trips') as any)
        .update({ share_token: newToken, visibility: 'SHARED_WITH_LINK' })
        .eq('id', tripId);

      return newToken;
    } catch (err) {
      console.error('Error generating share token:', err);
      return null;
    }
  },

  /**
   * Add activity to day itinerary
   */
  async addActivity(tripId: string, tripDayId: string, activity: Omit<TripActivity, 'id'>): Promise<TripActivity | null> {
    try {
      const { data, error } = await (supabase.from('trip_activities' as any) as any)
        .insert({
          trip_id: tripId,
          trip_day_id: tripDayId,
          activity_title: activity.activity_title,
          activity_type: activity.activity_type,
          start_time: activity.start_time,
          end_time: activity.end_time,
          location_id: activity.location_id || null,
          notes: activity.notes || '',
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripActivity;
    } catch (err) {
      console.error('Error adding activity:', err);
      return null;
    }
  },

  /**
   * Remove activity from day itinerary
   */
  async removeActivity(activityId: string): Promise<boolean> {
    try {
      const { error } = await (supabase.from('trip_activities' as any) as any)
        .delete()
        .eq('id', activityId);
      return !error;
    } catch (err) {
      console.error('Error removing activity:', err);
      return false;
    }
  },

  /**
   * Estimate travel duration and distance between locations
   */
  estimateTravel(origin: string, destination: string): { distance_km: number; drive_minutes: number; flight_minutes?: number } {
    if (NORWAY_TRAVEL_MATRIX[origin]?.[destination]) {
      return NORWAY_TRAVEL_MATRIX[origin][destination];
    }
    if (NORWAY_TRAVEL_MATRIX[destination]?.[origin]) {
      return NORWAY_TRAVEL_MATRIX[destination][origin];
    }
    // Default estimated Norwegian fjord road travel
    return { distance_km: 150, drive_minutes: 135 };
  },

  /**
   * Smart Trip Schedule Conflict Analyzer
   */
  analyzeTripSchedule(days: TripDay[], trip?: Trip): SmartTripWarning[] {
    const warnings: SmartTripWarning[] = [];

    days.forEach(day => {
      const activities = day.activities || [];

      // 1. Check for overlapping activities
      for (let i = 0; i < activities.length; i++) {
        for (let j = i + 1; j < activities.length; j++) {
          const a1 = activities[i];
          const a2 = activities[j];
          if (a1.start_time && a1.end_time && a2.start_time && a2.end_time) {
            const start1 = new Date(a1.start_time).getTime();
            const end1 = new Date(a1.end_time).getTime();
            const start2 = new Date(a2.start_time).getTime();
            const end2 = new Date(a2.end_time).getTime();

            if (start1 < end2 && end1 > start2) {
              warnings.push({
                id: `warn-overlap-${day.day_number}-${a1.id}-${a2.id}`,
                type: 'OVERLAP',
                severity: 'HIGH',
                title: `Time Conflict on Day ${day.day_number}`,
                description: `"${a1.activity_title}" overlaps with "${a2.activity_title}".`,
                day_number: day.day_number,
                item_ids: [a1.id, a2.id],
                recommendation: 'Adjust start or end times to prevent double-booking your schedule.',
              });
            }
          }
        }
      }

      // 2. Check for Excessively Packed Days (> 9 hours scheduled)
      let totalDayMinutes = 0;
      activities.forEach(a => {
        if (a.start_time && a.end_time) {
          const diffMin = (new Date(a.end_time).getTime() - new Date(a.start_time).getTime()) / (1000 * 60);
          totalDayMinutes += Math.max(0, diffMin);
        } else {
          totalDayMinutes += 120; // default 2 hours per untimed activity
        }
      });

      if (totalDayMinutes > 540) {
        warnings.push({
          id: `warn-packed-${day.day_number}`,
          type: 'PACKED_DAY',
          severity: 'MEDIUM',
          title: `Overly Packed Day ${day.day_number}`,
          description: `You have over ${Math.round(totalDayMinutes / 60)} hours of activities scheduled. Norwegian weather and mountain roads require leisure time.`,
          day_number: day.day_number,
          recommendation: 'Consider moving 1 or 2 activities to another day for a more relaxing pace.',
        });
      }

      // 3. Check for Impossible Travel Times between consecutive locations
      const segments = day.segments || [];
      segments.forEach(seg => {
        const startName = seg.start_location?.name;
        const endName = seg.end_location?.name;
        if (startName && endName && startName !== endName) {
          const estimate = this.estimateTravel(startName, endName);
          if (seg.start_time && seg.end_time) {
            const allocatedMinutes = (new Date(seg.end_time).getTime() - new Date(seg.start_time).getTime()) / (1000 * 60);
            if (allocatedMinutes < estimate.drive_minutes * 0.7) {
              warnings.push({
                id: `warn-travel-${day.day_number}-${seg.id}`,
                type: 'IMPOSSIBLE_TRAVEL',
                severity: 'HIGH',
                title: `Impossible Travel Time on Day ${day.day_number}`,
                description: `Traveling from ${startName} to ${endName} requires at least ${Math.round(estimate.drive_minutes / 60)}h ${estimate.drive_minutes % 60}m, but only ${Math.round(allocatedMinutes)} minutes were allocated.`,
                day_number: day.day_number,
                recommendation: 'Extend the transit window or consider a direct domestic flight.',
              });
            }
          }
        }
      });
    });

    // 4. Check for Multi-Day Trips with Missing Stays
    if (days.length >= 2) {
      days.forEach((day, idx) => {
        if (idx < days.length - 1 && (!day.stays || day.stays.length === 0)) {
          warnings.push({
            id: `warn-stay-${day.day_number}`,
            type: 'MISSING_STAY',
            severity: 'MEDIUM',
            title: `No Accommodation on Night ${day.day_number}`,
            description: `You don't have a hotel or cabin booked for the night of Day ${day.day_number}.`,
            day_number: day.day_number,
            recommendation: 'Reserve a stay nearby to avoid remote mountain availability issues.',
          });
        }
      });
    }

    return warnings;
  },

  /**
   * Calculate Estimated Trip Cost Breakdown
   */
  calculateEstimatedTripCost(days: TripDay[], budgetNok?: number): TripCostSummary {
    let accommodationTotal = 0;
    let activitiesTotal = 0;
    let transportTotal = 0;

    days.forEach(day => {
      (day.stays || []).forEach(s => {
        accommodationTotal += s.price_nok || 2200; // default estimated night rate
      });
      (day.activities || []).forEach(a => {
        activitiesTotal += a.price_nok || 650; // default activity ticket
      });
      (day.segments || []).forEach(seg => {
        transportTotal += seg.transport_mode === 'FLIGHT' ? 1200 : seg.transport_mode === 'FERRY' ? 450 : 350;
      });
    });

    const foodEstimate = Math.max(1, days.length) * 600; // ~600 NOK/day dining estimate
    const grandTotal = accommodationTotal + activitiesTotal + transportTotal + foodEstimate;
    const isWithinBudget = !budgetNok || grandTotal <= budgetNok;

    return {
      accommodation_total_nok: accommodationTotal,
      activities_total_nok: activitiesTotal,
      transport_total_nok: transportTotal,
      food_estimate_nok: foodEstimate,
      grand_total_nok: grandTotal,
      is_within_budget: isWithinBudget,
      budget_nok: budgetNok,
    };
  }
};
