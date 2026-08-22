import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Compass, Leaf, CloudSun, Hotel, ArrowRight, Heart, Bookmark, AlertCircle, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';

export const Dashboard = () => {
  const { user, profile } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Welcome back');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for the "premium" feel
    const timer = setTimeout(() => setLoading(false), 800);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-navy-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const firstName = profile?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-navy-900 font-sans pb-32">
      
      {/* Editorial Hero */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-6xl font-display font-light text-navy-900 tracking-tight mb-2">
              {greeting}, <span className="font-bold">{firstName}</span>.
            </h1>
            <p className="text-xl text-gray-500 font-medium">Your next adventure starts in <span className="text-aurora-green font-bold">12 days</span>.</p>
          </div>
          
          <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-1000 delay-150">
            <button onClick={() => navigate('/planner')} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-all shadow-sm">
              <Compass size={20} />
            </button>
            <button onClick={() => navigate('/wallet')} className="px-6 h-12 rounded-full bg-navy-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-aurora-green hover:text-navy-900 transition-colors shadow-lg">
              Travel Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Immediate Context (Upcoming Trip & Bookings) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Upcoming Trip Card */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Navigation size={14} /> Upcoming Trip
            </h2>
            
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 cursor-pointer" onClick={() => navigate('/trips/1')}>
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80" alt="Lofoten" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent"></div>
              </div>
              
              <div className="relative p-8 md:p-12 min-h-[400px] flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-3 text-white/80 font-bold text-sm uppercase tracking-widest mb-3">
                      <span>12 — 18 September</span>
                      <span className="w-1 h-1 rounded-full bg-aurora-green"></span>
                      <span className="flex items-center gap-1"><CloudSun size={14}/> 12°C</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl font-display font-black text-white leading-none mb-4">Lofoten</h3>
                    <p className="text-white/80 font-medium text-lg">4 nights · 3 activities · 2 transport bookings</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white group-hover:bg-white group-hover:text-navy-900 transition-colors">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Booking (Immediate) */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-navy-900 shrink-0">
                <Hotel size={40} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Upcoming Reservation</p>
                <h4 className="text-2xl font-display font-bold text-navy-900 mb-2">Aurora Lodge</h4>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={16} className="text-gray-400"/> 18 September</span>
                  <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400"/> Check-in: 15:00</span>
                </div>
              </div>
              <button onClick={() => navigate('/user/bookings/1')} className="w-full md:w-auto px-8 py-4 bg-gray-50 hover:bg-gray-100 text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
                View Ticket
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Curation & Insights */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Saved Places */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Bookmark size={14} /> Saved Places
              </h2>
              <Link to="/wishlist" className="text-xs font-bold text-navy-900 hover:text-aurora-green transition-colors">View All</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Tromsø Ice Domes', type: 'Hotel', price: 'NOK 2,400' },
                { name: 'Fjord Safari', type: 'Activity', price: 'NOK 1,200', alert: 'Almost Full' },
                { name: 'Under', type: 'Restaurant', price: '$$$' }
              ].map((item, i) => (
                <div key={i} className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center cursor-pointer">
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm mb-1">{item.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.type} • {item.price}</p>
                  </div>
                  {item.alert ? (
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                      <AlertCircle size={10} /> {item.alert}
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-colors">
                      <Heart size={14} className="fill-current" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Travel Impact */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Leaf size={14} /> Your Norway Impact
            </h2>
            
            <div className="bg-navy-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-aurora-green/20 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <div className="text-5xl font-display font-black text-aurora-green mb-2">42 kg</div>
                <div className="text-sm font-bold uppercase tracking-widest text-white/60 mb-8">CO₂ Avoided</div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="font-medium text-white/80">Sustainable choices</span>
                    <span className="font-bold text-lg">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white/80">EV miles tracked</span>
                    <span className="font-bold text-lg">120 km</span>
                  </div>
                </div>
                
                <button onClick={() => navigate('/impact')} className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                  View Sustainability Profile
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
