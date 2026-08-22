import { supabase } from '../lib/supabase';

export interface AITripDay {
  day_number: number;
  date: string;
  description: string;
  activities: {
    location_id: string; // The UUID from the activities/locations database
    activity_title: string;
    start_time: string;
    end_time: string;
    notes: string;
  }[];
  stays: {
    location_id: string; // The UUID from accommodations/locations database
    accommodation_name: string;
    check_in: string;
    check_out: string;
  }[];
  segments: {
    start_location_id: string;
    end_location_id: string;
    start_time: string;
    end_time: string;
    transport_mode: string;
  }[];
}

export interface AITripPlan {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_nok: number;
  days: AITripDay[];
}

export const plannerService = {
  /**
   * Summarizes database context for the AI prompt
   */
  async getDatabaseContext() {
    // We fetch a sampling of top locations, activities, and accommodations to give the AI context.
    const [{ data: locations }, { data: activities }, { data: accommodations }] = await Promise.all([
      (supabase as any).from('locations').select('id, name, region, type').limit(20),
      (supabase as any).from('activities').select('id, location_id, name, type, price').limit(20),
      (supabase as any).from('accommodations').select('id, location_id, name, type, base_price').limit(20)
    ]);

    return {
      locations: locations || [],
      activities: activities || [],
      accommodations: accommodations || []
    };
  },

  /**
   * Calls the Gemini API to generate a structured itinerary
   */
  async generateAITrip(prompt: string, startDate: string): Promise<AITripPlan | null> {
    try {
      // For this canonical flow, the Edge function handles the prompt generation and AI provider logic.
      // We pass the required data to the Edge function.
      const { data, error } = await supabase.functions.invoke('ai-trip-planner', {
        body: { 
          prompt, 
          destination: prompt, // Best effort from prompt, edge function does advanced RAG
          budget: 'medium', 
          startDate, 
          durationDays: 7 
        }
      });

      if (error) {
        console.error("AI Generation failed at Edge:", error);
        throw error;
      }

      // Edge function should return the AITripPlan JSON
      return data as AITripPlan;

    } catch (error) {
      console.error("AI Generation failed:", error);
      return null;
    }
  },

  /**
   * Saves the structured AITripPlan to the Supabase database
   */
  async saveTripToDatabase(userId: string, plan: AITripPlan): Promise<string | null> {
    try {
      // 1. Insert Trip
      const { data: tripData, error: tripError } = await (supabase as any)
        .from('trips')
        .insert({
          user_id: userId,
          title: plan.title,
          description: plan.description,
          start_date: plan.start_date,
          end_date: plan.end_date,
          budget_nok: plan.budget_nok,
          status: 'PLANNED'
        })
        .select()
        .single();

      if (tripError || !tripData) throw tripError;
      const tripId = tripData.id;

      // 2. Iterate Days
      for (const day of plan.days) {
        // Insert Trip Day
        const { data: dayData, error: dayError } = await (supabase as any)
          .from('trip_days')
          .insert({
            trip_id: tripId,
            day_number: day.day_number,
            date: day.date,
            description: day.description
          })
          .select()
          .single();
          
        if (dayError || !dayData) continue;
        const tripDayId = dayData.id;

        // Insert Segments
        if (day.segments && day.segments.length > 0) {
          await (supabase as any).from('trip_segments').insert(
            day.segments.map((seg, idx) => ({
              trip_id: tripId,
              trip_day_id: tripDayId,
              start_location_id: seg.start_location_id,
              end_location_id: seg.end_location_id,
              start_time: seg.start_time,
              end_time: seg.end_time,
              sequence_order: idx,
              transport_mode: seg.transport_mode
            }))
          );
        }

        // Insert Stays
        if (day.stays && day.stays.length > 0) {
          await (supabase as any).from('trip_stays').insert(
            day.stays.map(stay => ({
              trip_id: tripId,
              trip_day_id: tripDayId,
              location_id: stay.location_id,
              accommodation_name: stay.accommodation_name,
              check_in: stay.check_in,
              check_out: stay.check_out
            }))
          );
        }

        // Insert Activities
        if (day.activities && day.activities.length > 0) {
          await (supabase as any).from('trip_activities').insert(
            day.activities.map(act => ({
              trip_id: tripId,
              trip_day_id: tripDayId,
              location_id: act.location_id,
              activity_title: act.activity_title,
              start_time: act.start_time,
              end_time: act.end_time,
              notes: act.notes
            }))
          );
        }
      }

      return tripId;
    } catch (err) {
      console.error("Save trip failed:", err);
      return null;
    }
  }
};
