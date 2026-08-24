import React from 'react';
import { Trip } from '../../../types/dashboard';
import { Map, Calendar, Settings, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';

interface Props {
  trip: Trip | null;
  isActive: boolean;
}

export const UpcomingTripWidget: React.FC<Props> = ({ trip, isActive }) => {
  if (!trip) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <Plane size={32} />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">No trips planned yet</h2>
        <p className="text-gray-500 mb-6 max-w-md">Your next great Norwegian adventure awaits. Start planning today with our AI assistant or browse destinations.</p>
        <Link to="/planner" className="px-6 py-3 bg-aurora-green text-navy-900 font-bold rounded-xl hover:bg-green-400 transition-colors shadow-sm">
          Plan a Trip
        </Link>
      </div>
    );
  }

  const daysRemaining = Math.ceil((new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  // Format dates: e.g. "December 14–20"
  const startMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(trip.startDate));
  const startDay = new Date(trip.startDate).getDate();
  const endDay = new Date(trip.endDate).getDate();
  const dateRangeStr = `${startMonth} ${startDay}–${endDay}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row group">
      <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden">
        <OptimizedImage 
          src={trip.coverImage} 
          alt={trip.title} 
          category="landscape"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          containerClassName="w-full h-full"
        />
        {isActive && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse z-10">
            <span className="w-2 h-2 bg-white rounded-full"></span> HAPPENING NOW
          </div>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{isActive ? 'ACTIVE TRIP' : 'NEXT TRIP'}</h3>
            {!isActive && daysRemaining > 0 && (
              <span className="text-sm font-bold text-aurora-green bg-green-50 px-3 py-1 rounded-full">{daysRemaining} days to go</span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-navy-900 mb-2">{trip.destinationName || trip.title}</h2>
          <p className="text-xl text-gray-600 font-medium mb-6">{trip.title}</p>
          
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 mb-8">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Calendar size={18} className="text-blue-500" />
              {dateRangeStr}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <UserIcon />
              {trip.travelers} Travelers
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link to={`/dashboard/trips/${trip.id}`} className="px-5 py-2.5 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors shadow-sm">
            View Itinerary
          </Link>
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-navy-900 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <Map size={18} /> Open Map
          </button>
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm ml-auto">
            <Settings size={18} /> Manage
          </button>
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
