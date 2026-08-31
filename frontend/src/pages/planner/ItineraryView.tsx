import React, { useState } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { TripPlanResponse } from '../../types/planner';
import { 
  Map, 
  Share2, 
  Download, 
  Calendar, 
  Sun, 
  Clock, 
  Plane, 
  Coffee, 
  Home, 
  Activity, 
  Wind, 
  Navigation,
  BookmarkPlus,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '../../components/shared/SEO';

export const ItineraryView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as TripPlanResponse;
  const [activeDay, setActiveDay] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  if (!plan) {
    return (
      <div className="min-h-screen bg-deep-night text-white flex flex-col items-center justify-center pt-24 text-center px-4 font-sans">
        <h2 className="text-3xl font-display font-bold mb-4">Trip Itinerary Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">The requested trip plan could not be retrieved or has expired from active memory.</p>
        <Link to="/planner" className="bg-glacier-mint text-deep-night px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-white transition-colors">
          Build a New Itinerary
        </Link>
      </div>
    );
  }

  const selectedDay = plan.days.find(d => d.day === activeDay) || plan.days[0];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Plane className="w-5 h-5 text-gray-400" />;
      case 'accommodation': return <Home className="w-5 h-5 text-blue-400" />;
      case 'dining': return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'activity': return <Activity className="w-5 h-5 text-green-400" />;
      default: return <Wind className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSaveTrip = () => {
    try {
      const existingStr = localStorage.getItem('nsl_user_saved_trips');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      const planTitleLower = (plan.title || '').toLowerCase();
      let tripImage = '/images/fjords_1786935800026.jpg';
      if (planTitleLower.includes('lofoten')) tripImage = '/images/lofoten_1787013505867.jpg';
      else if (planTitleLower.includes('tromsø') || planTitleLower.includes('tromso') || planTitleLower.includes('aurora')) tripImage = '/images/northern_lights_1786935879330.jpg';
      else if (planTitleLower.includes('trolltunga')) tripImage = '/images/trolltunga_1786936111320.jpg';
      else if (planTitleLower.includes('kjerag')) tripImage = '/images/kjeragbolten_1786936275605.jpg';
      else if (planTitleLower.includes('besseggen')) tripImage = '/images/besseggen_1786936349992.jpg';

      const newTrip = {
        id: plan.id,
        name: plan.title.includes(' in ') ? plan.title.split(' in ')[1] : plan.title,
        title: plan.title,
        dates: `${plan.days[0]?.date} — ${plan.days[plan.days.length - 1]?.date}`,
        nights: plan.days.length,
        activities: plan.days.reduce((acc, d) => acc + d.activities.length, 0),
        status: 'Upcoming',
        image: tripImage,
        weather: '14°C',
        days: plan.days,
        summary: plan.summary
      };

      const updated = [newTrip, ...existing.filter((t: any) => t.id !== plan.id)];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updated));
      setIsSaved(true);
      toast.success('Trip saved to your Digital Travel Journal!');
      
      setTimeout(() => {
        navigate('/trips');
      }, 600);
    } catch (err) {
      toast.error('Unable to save trip. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <SEO 
        title={`${plan.title} | Trip Itinerary`}
        description={plan.summary}
      />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1600')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-night via-deep-night/90 to-deep-night" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glacier-mint/5 blur-[120px] rounded-full" />
      </div>

      <Container className="relative z-10">
        
        {/* Top Back link */}
        <Link to="/planner" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Planner
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-glacier-mint mb-4">
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
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleSaveTrip}
              className={`px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isSaved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-glacier-mint text-deep-night hover:bg-white'
              }`}
            >
              {isSaved ? <CheckCircle2 size={16} /> : <BookmarkPlus size={16} />}
              {isSaved ? 'Saved to Trips' : 'Save to My Trips'}
            </button>

            <Link
              to="/map"
              className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="View on Map"
            >
              <Map className="w-5 h-5 text-gray-300" />
            </Link>

            <Link
              to={`/weather?city=${encodeURIComponent(selectedDay?.activities[0]?.location || 'Tromsø')}`}
              className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Check Destination Weather"
            >
              <Sun className="w-5 h-5 text-amber-400" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Day Navigation Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-32 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-none pb-4 lg:pb-0">
              {plan.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`flex flex-col items-start p-4 rounded-xl border transition-all whitespace-nowrap min-w-[140px] text-left cursor-pointer ${
                    activeDay === day.day
                      ? 'bg-white/10 border-glacier-mint text-white shadow-lg'
                      : 'bg-transparent border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-glacier-mint mb-1">Day {day.day}</span>
                  <span className="font-bold text-sm truncate w-full">{day.title}</span>
                  <span className="text-[11px] text-gray-500 mt-2">{day.date}</span>
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
                    <div className="w-16 h-16 rounded-full bg-glacier-mint/10 border border-glacier-mint flex flex-col items-center justify-center shrink-0 shadow-[0_0_15px_rgba(203,213,225,0.1)]">
                      <span className="text-[10px] uppercase font-bold text-glacier-mint">Day</span>
                      <span className="text-xl font-bold text-white leading-none">{selectedDay.day}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold">{selectedDay.title}</h2>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-12">
                    {selectedDay.activities.map((activity) => (
                      <div key={activity.id} className="relative z-10 flex items-start gap-6 group">
                        {/* Time Column */}
                        <div className="w-16 md:w-48 text-right pt-4 shrink-0">
                          <span className="text-xl font-bold text-white block">{activity.time}</span>
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{activity.durationHours}h</span>
                        </div>
                        
                        {/* Timeline Node */}
                        <div className="relative pt-5">
                          <div className="w-4 h-4 rounded-full bg-deep-night border-2 border-white/30 group-hover:border-glacier-mint group-hover:scale-125 transition-all z-10 relative" />
                        </div>

                        {/* Activity Card */}
                        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                                {getActivityIcon(activity.type)}
                              </div>
                              <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                            </div>
                            {activity.cost ? (
                              <div className="text-right">
                                <span className="font-bold text-glacier-mint">{activity.cost} {activity.currency}</span>
                              </div>
                            ) : null}
                          </div>
                          
                          <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                            {activity.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                              <Navigation className="w-3.5 h-3.5 text-glacier-mint" /> {activity.location}
                            </div>
                            <Link 
                              to={`/weather?city=${encodeURIComponent(activity.location)}`}
                              className="flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-lg border border-white/5 text-amber-400 transition-colors"
                            >
                              <Sun className="w-3.5 h-3.5" /> Check Weather
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End of Day Cap */}
                  <div className="relative z-10 flex items-center gap-6 mt-12">
                    <div className="w-16 md:w-48 shrink-0" />
                    <div className="w-4 h-4 rounded-full bg-glacier-mint/30 border-2 border-glacier-mint shrink-0 ml-[1.1rem] md:ml-[1.1rem]" />
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

export default ItineraryView;
