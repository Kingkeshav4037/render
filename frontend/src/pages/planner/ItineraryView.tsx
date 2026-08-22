import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { TripPlanResponse } from '../../types/planner';
import { Map, Share2, Download, Calendar, Sun, CloudRain, Clock, Plane, Coffee, Home, Activity, Wind, Navigation } from 'lucide-react';

export const ItineraryView = () => {
  const { id } = useParams();
  const location = useLocation();
  const plan = location.state?.plan as TripPlanResponse;
  const [activeDay, setActiveDay] = useState(1);

  if (!plan) {
    return (
      <div className="min-h-screen bg-deep-night text-white flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip Plan Not Found</h2>
          <Link to="/planner" className="text-lavender-ice hover:underline">Return to Planner</Link>
        </div>
      </div>
    );
  }

  const selectedDay = plan.days.find(d => d.day === activeDay);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Plane className="w-5 h-5 text-gray-400" />;
      case 'accommodation': return <Home className="w-5 h-5 text-blue-400" />;
      case 'dining': return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'activity': return <Activity className="w-5 h-5 text-green-400" />;
      default: return <Wind className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      {/* Premium Digital Travel Journal Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1600')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-night via-deep-night/90 to-deep-night" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ice-silver/5 blur-[120px] rounded-full" />
      </div>

      <Container className="relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-ice-silver mb-4">
              <Calendar className="w-5 h-5" />
              <span className="font-bold tracking-widest uppercase text-sm">{plan.days.length} Day Itinerary</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-4"
            >
              {plan.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 font-light max-w-2xl"
            >
              {plan.summary}
            </motion.p>
          </div>
          
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Map className="w-5 h-5 text-ice-silver" />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Share2 className="w-5 h-5 text-ice-silver" />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Download className="w-5 h-5 text-ice-silver" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Day Navigation Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-32 flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-4 lg:pb-0">
              {plan.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`flex flex-col items-start p-4 rounded-xl border transition-all whitespace-nowrap min-w-[120px] ${
                    activeDay === day.day
                      ? 'bg-ice-silver/10 border-ice-silver text-white'
                      : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider mb-1">Day {day.day}</span>
                  <span className="font-bold">{day.title}</span>
                  <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              {selectedDay && (
                <motion.div
                  key={selectedDay.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  <div className="absolute left-8 md:left-24 top-0 bottom-0 w-px bg-white/10" />

                  {/* Day Header inside timeline */}
                  <div className="relative z-10 flex items-center gap-6 mb-12">
                    <div className="w-16 md:w-48 text-right hidden md:block">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedDay.date}</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-ice-silver/10 border border-ice-silver flex flex-col items-center justify-center shrink-0 shadow-[0_0_15px_rgba(203,213,225,0.1)]">
                      <span className="text-xs uppercase font-bold text-ice-silver">Day</span>
                      <span className="text-xl font-bold text-white">{selectedDay.day}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold">{selectedDay.title}</h2>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-12">
                    {selectedDay.activities.map((activity, idx) => (
                      <div key={activity.id} className="relative z-10 flex items-start gap-6 group cursor-grab active:cursor-grabbing">
                        {/* Time Column */}
                        <div className="w-16 md:w-48 text-right pt-4 shrink-0">
                          <span className="text-xl font-bold text-white block">{activity.time}</span>
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{activity.durationHours}h</span>
                        </div>
                        
                        {/* Timeline Node */}
                        <div className="relative pt-5">
                          <div className="w-4 h-4 rounded-full bg-deep-night border-2 border-white/30 group-hover:border-ice-silver group-hover:scale-125 transition-all z-10 relative" />
                        </div>

                        {/* Activity Card */}
                        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all group-hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                                {getActivityIcon(activity.type)}
                              </div>
                              <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                            </div>
                            {activity.cost && (
                              <div className="text-right">
                                <span className="font-bold text-ice-silver">{activity.cost} {activity.currency}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-400 leading-relaxed mb-6">
                            {activity.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                              <Navigation className="w-4 h-4 text-ice-silver" /> {activity.location}
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                              <Sun className="w-4 h-4 text-amber-400" /> 12°C, Clear
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End of Day Cap */}
                  <div className="relative z-10 flex items-center gap-6 mt-12">
                    <div className="w-16 md:w-48 shrink-0" />
                    <div className="w-4 h-4 rounded-full bg-ice-silver/30 border-2 border-ice-silver shrink-0 ml-[1.1rem] md:ml-[1.1rem]" />
                    <div className="h-px bg-white/10 flex-1" />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </div>
  );
};
