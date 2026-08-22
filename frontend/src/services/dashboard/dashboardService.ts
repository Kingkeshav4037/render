// @ts-nocheck
import { supabase } from '../../lib/supabase';
import { DashboardData, SmartAlert, AuroraForecast, WeatherForecast } from '../../types/dashboard';

export const dashboardService = {
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Parallel execution of independent data domains
      const [
        profileRes,
        statsRes,
        tripsRes,
        impactRes,
        favoritesRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        this.getStats(userId),
        this.getTrips(userId),
        supabase.from('user_sustainability_impact').select('*').eq('user_id', userId).single(),
        supabase.from('favorites').select('*').eq('user_id', userId).limit(5)
      ]);

      // Mock Alerts & Weather for Phase 3 (Placeholder for Live API)
      const alerts: SmartAlert[] = [
        {
          id: '1',
          severity: 'high',
          type: 'Weather',
          message: 'Heavy snow expected near your upcoming TromsÃ¸ destination.',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: '2',
          severity: 'medium',
          type: 'Ferry',
          message: 'Ferry schedule from BodÃ¸ to Moskenes changed due to high winds.',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        }
      ];

      const weather: WeatherForecast = {
        location: 'TromsÃ¸',
        temperature: -5,
        condition: 'Light Snow',
        windSpeed: 15,
        visibility: 8,
        forecast: [
          { day: 'Mon', temp: -5, condition: 'Snow' },
          { day: 'Tue', temp: -8, condition: 'Clear' },
          { day: 'Wed', temp: -3, condition: 'Cloudy' }
        ],
        sunrise: '10:00',
        sunset: '14:30'
      };

      const aurora: AuroraForecast = {
        activityLevel: 'Good',
        visibilityProbability: 75,
        cloudCoverage: 20,
        bestViewingTime: '22:00 - 01:00',
        recommendedLocations: ['Ersfjordbotn', 'SommarÃ¸y']
      };

      // Extract Active Trip (If any trip is happening right now)
      const now = new Date();
      const trips = tripsRes || [];
      const activeTrip = trips.find((t: any) => 
        new Date(t.startDate) <= now && new Date(t.endDate) >= now
      ) || null;

      const upcomingTrips = trips.filter((t: any) => 
        new Date(t.startDate) > now
      );

      return {
        user: {
          id: userId,
          name: profileRes.data?.full_name || 'Traveler',
          email: profileRes.data?.email || '',
          avatarUrl: profileRes.data?.avatar_url || undefined,
          preferences: {
            travelStyles: [],
            dietaryRequirements: [],
            accessibilityNeeds: [],
            interests: [],
            preferredCurrency: 'NOK'
          },
          sustainability: impactRes.data ? {
            co2SavedKg: impactRes.data.co2_saved_kg || 0,
            trainJourneys: impactRes.data.train_journeys || 0,
            ecoBookings: impactRes.data.eco_bookings || 0,
            publicTransportUsage: impactRes.data.public_transport_usage || 0
          } : {
            co2SavedKg: 0, trainJourneys: 0, ecoBookings: 0, publicTransportUsage: 0
          }
        },
        stats: statsRes || { trips: 0, bookings: 0, saved: 0, reviews: 0 },
        upcomingTrips,
        activeTrip,
        bookings: [], // Fetched via BookingService normally
        favorites: (favoritesRes.data || []).map((f: any) => ({
          id: f.id,
          itemId: f.item_id,
          itemType: f.item_type,
          name: 'Favorite Item', // Missing in db, add placeholder
          image: '', // Placeholder
          url: ''
        })),
        alerts,
        notifications: [],
        recommendations: [], // Rule-based recommendations to be populated
        weather,
        aurora,
        nearby: [],
        sustainability: impactRes.data ? {
          co2SavedKg: impactRes.data.co2_saved_kg || 0,
          trainJourneys: 0,
          ecoBookings: 0,
          publicTransportUsage: 0
        } : { co2SavedKg: 0, trainJourneys: 0, ecoBookings: 0, publicTransportUsage: 0 },
        spending: {
          totalBudget: 15000,
          spent: 8500,
          remaining: 6500,
          categories: { Accommodation: 4000, Activities: 3000, Transport: 1500 }
        }
      };

    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    }
  },

  async getStats(userId: string) {
    try {
      const [trips, bookings, favorites] = await Promise.all([
        supabase.from('trips').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', userId)
      ]);
      return {
        trips: trips.count || 0,
        bookings: bookings.count || 0,
        saved: favorites.count || 0,
        reviews: 0
      };
    } catch {
      return { trips: 0, bookings: 0, saved: 0, reviews: 0 };
    }
  },

  async getTrips(userId: string) {
    const { data } = await supabase
      .from('trips')
      .select('*, itinerary_items(*)')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });
    
    if (!data) return [];
    
    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      destinationId: t.destination_id,
      startDate: t.start_date,
      endDate: t.end_date,
      budgetNok: t.budget_nok,
      status: t.status,
      travelers: t.travelers || 1,
      coverImage: t.cover_image,
      itinerary: (t.itinerary_items || []).map((i: any) => ({
        id: i.id,
        dayNumber: i.day_number,
        startTime: i.start_time,
        endTime: i.end_time,
        activityTitle: i.activity_title,
        locationName: i.location_name,
        completed: i.completed || false
      }))
    }));
  }
};

