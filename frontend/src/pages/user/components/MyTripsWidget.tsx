import React, { useState } from 'react';
import { Trip } from '../../../types/dashboard';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  trips: Trip[];
}

export const MyTripsWidget: React.FC<Props> = ({ trips }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed' | 'drafts'>('upcoming');

  const filteredTrips = trips.filter(t => {
    const now = new Date();
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    
    if (activeTab === 'upcoming') return start > now && t.status !== 'PLANNING';
    if (activeTab === 'active') return start <= now && end >= now;
    if (activeTab === 'completed') return end < now;
    if (activeTab === 'drafts') return t.status === 'PLANNING';
    return false;
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-navy-900">My Trips</h3>
        <Link to="/planner" className="text-sm font-semibold text-aurora-green hover:text-green-500 transition-colors">
          + New Trip
        </Link>
      </div>

      <div className="flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['upcoming', 'active', 'completed', 'drafts'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-navy-900 text-white' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredTrips.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No {activeTab} trips found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map(trip => (
            <Link key={trip.id} to={`/dashboard/trips/${trip.id}`} className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 relative overflow-hidden">
                <img src={trip.coverImage || '/images/placeholder.jpg'} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h4 className="absolute bottom-3 left-4 text-white font-bold">{trip.destinationName || trip.title}</h4>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-navy-900 mb-2 truncate">{trip.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {trip.itinerary?.length || 0} items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
