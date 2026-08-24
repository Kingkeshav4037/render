import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CloudSun, Calendar } from 'lucide-react';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';

const TRIPS = [
  {
    id: '1',
    name: 'Lofoten',
    dates: '12 — 18 September',
    nights: 4,
    activities: 3,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80',
    weather: '12°C',
  },
  {
    id: '2',
    name: 'Tromsø',
    dates: '15 — 20 January',
    nights: 5,
    activities: 4,
    status: 'Past',
    image: 'https://images.unsplash.com/photo-1579893963495-9b7e7193b2a2?auto=format&fit=crop&q=80',
    weather: '-5°C',
  }
];

export const TripsList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight">
          Digital Travel <span className="font-bold">Journal</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Your planned adventures and past expeditions.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {TRIPS.map((trip, idx) => (
          <div 
            key={trip.id} 
            className="group relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.04)] bg-white cursor-pointer" 
            onClick={() => navigate(`/trips/${trip.id}`)}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="absolute inset-0">
              <OptimizedImage 
                src={trip.image} 
                alt={trip.name} 
                category="landscape"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="relative p-8 md:p-10 min-h-[450px] flex flex-col justify-between">
              
              <div className="flex justify-between items-start">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${
                  trip.status === 'Upcoming' ? 'bg-aurora-green/90 text-navy-900' : 'bg-white/20 text-white'
                }`}>
                  {trip.status}
                </span>
                <span className="flex items-center gap-1 text-white bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                  <CloudSun size={12}/> {trip.weather}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Calendar size={14} /> {trip.dates}
                  </p>
                  <h3 className="text-5xl font-display font-black text-white leading-none mb-3">{trip.name}</h3>
                  <p className="text-white/70 font-medium">{trip.nights} nights · {trip.activities} activities</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy-900 transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* New Trip Planner Card */}
        <div 
          className="rounded-[32px] overflow-hidden border-2 border-dashed border-gray-200 hover:border-aurora-green hover:bg-aurora-green/5 bg-gray-50 cursor-pointer flex flex-col items-center justify-center text-center p-12 transition-all min-h-[450px]"
          onClick={() => navigate('/planner')}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-navy-900 mb-6">
            <Calendar size={24} />
          </div>
          <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">Plan a new trip</h3>
          <p className="text-gray-500">Discover new destinations and let AI build your perfect itinerary.</p>
        </div>

      </div>
    </div>
  );
};
