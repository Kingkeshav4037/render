import React from 'react';
import { Trip } from '../../../types/dashboard';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  trip: Trip | null;
}

export const TripTimelineWidget: React.FC<Props> = ({ trip }) => {
  if (!trip || !trip.itinerary || trip.itinerary.length === 0) return null;

  // Group itinerary by day
  const days = trip.itinerary.reduce((acc, item) => {
    if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {} as Record<number, typeof trip.itinerary>);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full max-h-[600px] overflow-y-auto">
      <h3 className="text-lg font-bold text-navy-900 mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-100">
        My Itinerary
      </h3>
      
      <div className="space-y-8">
        {Object.entries(days).map(([dayNumber, items]) => (
          <div key={dayNumber} className="relative">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Day {dayNumber}</h4>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {items.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {item.completed ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={10} className="fill-current" />}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={12} /> {item.startTime.substring(0, 5)}
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase">{item.itemType}</span>
                    </div>
                    <h5 className="font-bold text-navy-900 text-sm">{item.activityTitle}</h5>
                    {item.locationName && (
                      <p className="text-xs text-gray-500 mt-1">{item.locationName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
