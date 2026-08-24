import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, CloudSun, MapPin, Navigation, Calendar, Plus } from 'lucide-react';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';

export const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      
      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <OptimizedImage 
          src="https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80" 
          alt="Lofoten" 
          category="landscape"
          className="w-full h-full object-cover" 
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-navy-900/40 to-navy-900/60 pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex justify-between items-center z-10">
          <button onClick={() => navigate('/trips')} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-navy-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="px-4 py-2 rounded-full bg-aurora-green text-navy-900 font-bold text-xs uppercase tracking-widest">
            Upcoming
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-[1440px] mx-auto z-10">
          <p className="text-white/80 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-3 drop-shadow-md">
            <Calendar size={14} /> 12 — 18 September
          </p>
          <h1 className="text-6xl md:text-8xl font-display font-black text-navy-900 drop-shadow-sm leading-none mb-6">
            LOFOTEN
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Timeline Column */}
        <div className="lg:col-span-8">
          
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold text-navy-900">Itinerary</h2>
            <button className="text-xs font-bold text-navy-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
              <Map size={14} /> View Map
            </button>
          </div>

          <div className="space-y-12">
            {/* Day 1 */}
            <div className="relative">
              <div className="absolute left-[27px] top-12 bottom-0 w-[2px] bg-gray-100"></div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 z-10 shadow-lg">
                  <span className="text-[10px] font-bold uppercase">Sep</span>
                  <span className="text-xl font-black leading-none">12</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900">Arrival & Settling In</h3>
                  <p className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <CloudSun size={12} className="text-aurora-green" /> 12°C • Partly Cloudy
                  </p>
                </div>
              </div>

              <div className="pl-[70px] space-y-6">
                {/* Event */}
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Navigation size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">14:00</p>
                      <h4 className="font-bold text-navy-900 text-lg mb-1">Flight SK4082 to Svolvær</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/> OSL to SVJ</p>
                    </div>
                  </div>
                </div>

                {/* Event */}
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">16:30</p>
                      <h4 className="font-bold text-navy-900 text-lg mb-1">Check-in at Aurora Lodge</h4>
                      <p className="text-sm text-gray-500 mb-4">Confirmation: #NSL-8942</p>
                      <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-navy-900 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                        View Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Suggestion */}
            <div className="pl-[70px]">
              <div className="p-6 bg-aurora-green/10 border border-aurora-green/20 rounded-3xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy-900 mb-1">Free evening in Svolvær</h4>
                  <p className="text-sm text-gray-600">You have a gap before tomorrow's activities. Explore local dining?</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-white text-navy-900 flex items-center justify-center shadow-sm shrink-0">
                  <Plus size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Trip Budget</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-display font-black text-navy-900">NOK 17,450</span>
              <span className="text-sm font-bold text-gray-500">/ 25,000</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-navy-900 w-[70%]"></div>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-4 text-center">You have used 70% of your allocated budget.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Important Notes</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-aurora-green mt-1.5 shrink-0"></div>
                Bring thermal layers for the Fjord Safari.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-aurora-green mt-1.5 shrink-0"></div>
                Restaurant Under requires smart casual dress code.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
