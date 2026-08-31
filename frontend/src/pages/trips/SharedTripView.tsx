import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Printer, Download, Clock, DollarSign, ArrowLeft, Share2, Compass, ShieldCheck } from 'lucide-react';
import { tripService, Trip, TripDay } from '../../services/tripService';
import { tripExportService } from '../../services/tripExportService';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

export const SharedTripView: React.FC = () => {
  const { token, id } = useParams<{ token?: string; id?: string }>();
  const [tripData, setTripData] = useState<{ trip: Trip; days: TripDay[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    const loadSharedTrip = async () => {
      setIsLoading(true);
      try {
        const res = await tripService.fetchTrip(id || '', token);
        if (res && res.trip) {
          setTripData({ trip: res.trip, days: res.days });
        }
      } catch (err) {
        console.error('Error loading shared trip:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedTrip();
  }, [token, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-night flex items-center justify-center text-snow">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-arctic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-snow/60">Loading shared Norway itinerary...</p>
        </div>
      </div>
    );
  }

  if (!tripData || !tripData.trip) {
    return (
      <div className="min-h-screen bg-deep-night flex items-center justify-center text-snow px-4">
        <div className="max-w-md text-center bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-bold">Itinerary Not Found</h2>
          <p className="text-xs text-snow/60 mt-2 mb-6">
            This trip may be private, expired, or the shared link is invalid.
          </p>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-arctic-gold text-deep-night font-bold text-xs hover:bg-arctic-gold/90 transition-colors"
          >
            Create Your Own Trip
          </Link>
        </div>
      </div>
    );
  }

  const { trip, days } = tripData;
  const currentDay = days.find(d => d.day_number === selectedDay) || days[0];
  const costSummary = tripService.calculateEstimatedTripCost(days, trip.budget_nok);

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs text-snow/60 hover:text-arctic-gold transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore Norway SmartLife
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-arctic-gold/10 text-arctic-gold border border-arctic-gold/20 text-[11px] font-bold uppercase tracking-wider">
                Shared Itinerary 🇳🇴
              </span>
              <span className="text-xs text-snow/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-fjord-teal" /> Verified View
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mt-2 text-snow">
              {trip.title}
            </h1>
            {trip.notes && <p className="text-sm text-snow/70 mt-1 max-w-2xl">"{trip.notes}"</p>}
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => tripExportService.exportToPDF({ trip, days })}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-snow text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4 text-arctic-gold" />
              Print / PDF
            </button>
            <button
              onClick={() => tripExportService.exportToCalendar({ trip, days })}
              className="px-4 py-2.5 rounded-xl bg-arctic-gold text-deep-night hover:bg-arctic-gold/90 text-xs font-bold flex items-center gap-2 transition-all"
              title="Add to Google/Apple Calendar"
            >
              <Download className="w-4 h-4" />
              Calendar (.ics)
            </button>
          </div>
        </div>

        {/* Trip Meta Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-snow/50 uppercase font-bold tracking-wider block mb-1">
              Duration
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-snow">
              <Calendar className="w-4 h-4 text-arctic-gold" />
              {days.length} Days
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-snow/50 uppercase font-bold tracking-wider block mb-1">
              Start Date
            </span>
            <div className="text-sm font-bold text-snow">
              {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-GB') : 'Flexible'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-snow/50 uppercase font-bold tracking-wider block mb-1">
              Activities
            </span>
            <div className="text-sm font-bold text-snow">
              {days.reduce((acc, d) => acc + (d.activities?.length || 0), 0)} Scheduled
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-snow/50 uppercase font-bold tracking-wider block mb-1">
              Estimated Cost
            </span>
            <div className="text-sm font-bold text-emerald-400">
              NOK {costSummary.grand_total_nok.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {days.map(day => (
            <button
              key={day.id || day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                selectedDay === day.day_number
                  ? 'bg-arctic-gold text-deep-night border-arctic-gold shadow-lg shadow-arctic-gold/10'
                  : 'bg-white/5 border-white/10 text-snow/70 hover:bg-white/10 hover:text-snow'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>

        {/* Daily Schedule Display */}
        {currentDay && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-display font-bold text-snow">
                    Day {currentDay.day_number}: {currentDay.date ? new Date(currentDay.date).toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' }) : `Day ${currentDay.day_number}`}
                  </h2>
                  <p className="text-xs text-snow/60 mt-0.5">{currentDay.description || 'Exploration schedule'}</p>
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-4">
                {(!currentDay.activities || currentDay.activities.length === 0) && (
                  <p className="text-xs text-snow/50 py-4 italic">No activities planned for this day.</p>
                )}

                {currentDay.activities?.map((act, index) => (
                  <motion.div
                    key={act.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-arctic-gold/30 transition-all gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-arctic-gold/10 border border-arctic-gold/20 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase text-arctic-gold">
                          {act.start_time ? new Date(act.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-sm text-snow">{act.activity_title}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-snow/70 font-semibold uppercase">
                            {act.activity_type || 'Activity'}
                          </span>
                        </div>
                        {act.location?.name && (
                          <p className="text-xs text-snow/50 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-arctic-gold" /> {act.location.name}
                          </p>
                        )}
                        {act.notes && (
                          <p className="text-xs text-snow/60 mt-1 italic">"{act.notes}"</p>
                        )}
                      </div>
                    </div>

                    {act.price_nok && (
                      <div className="text-right sm:self-center">
                        <span className="text-xs font-bold text-emerald-400">
                          NOK {act.price_nok.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Stays on this day */}
              {currentDay.stays && currentDay.stays.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-snow/70 mb-3">
                    Overnight Stay
                  </h4>
                  {currentDay.stays.map((stay, idx) => (
                    <div
                      key={stay.id || idx}
                      className="p-4 rounded-2xl bg-aurora-violet/10 border border-aurora-violet/20 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm text-snow">{stay.accommodation_name}</h4>
                        {stay.location?.name && (
                          <p className="text-xs text-snow/50 mt-0.5">📍 {stay.location.name}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-aurora-violet">Confirmed Lodging</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
