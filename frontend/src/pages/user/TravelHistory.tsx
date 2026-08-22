import React from 'react';
import { History, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TravelHistory = () => {
  const navigate = useNavigate();

  const history = [
    { year: 2025, trips: [
      { id: '1', name: 'Oslo City Break', dates: '12-15 May', type: 'City', image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80' }
    ]},
    { year: 2024, trips: [
      { id: '2', name: 'Fjord Roadtrip', dates: '1-10 Aug', type: 'Roadtrip', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80' },
      { id: '3', name: 'Tromsø Northern Lights', dates: '15-20 Jan', type: 'Winter', image: 'https://images.unsplash.com/photo-1579893963495-9b7e7193b2a2?auto=format&fit=crop&q=80' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
          <History size={40} className="text-gray-300" />
          Travel <span className="font-bold">History</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Relive your past adventures across Norway.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 space-y-16">
        
        {history.map(group => (
          <section key={group.year}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-display font-bold text-navy-900">{group.year}</h2>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.trips.map(trip => (
                <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="group cursor-pointer">
                  <div className="rounded-[32px] overflow-hidden aspect-[4/3] mb-4 relative shadow-sm">
                    <img src={trip.image} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1"><Calendar size={12}/> {trip.dates}</p>
                      <h3 className="text-xl font-display font-bold text-navy-900">{trip.name}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-aurora-green group-hover:text-navy-900 transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
