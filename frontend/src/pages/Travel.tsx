import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Train, Ship, Car, Compass, Calendar, ArrowRight, Clock, Zap, Leaf, MapPin, Search } from 'lucide-react';
import { transportService, RouteWithLocations, Location } from '../services/transportService';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { PageHeader } from '../components/ui/PageHeader';

const MODES = [
  { id: 'all', label: 'All Modes' },
  { id: 'train', label: 'Scenic Trains', icon: <Train size={16} /> },
  { id: 'ferry', label: 'Electric Ferries', icon: <Ship size={16} /> },
  { id: 'car_rental', label: 'EV Rentals', icon: <Car size={16} /> },
];

export const Travel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFilter = searchParams.get('mode') || 'all';

  const [locations, setLocations] = useState<Location[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  
  const [routes, setRoutes] = useState<RouteWithLocations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoutes = useCallback(async (searchOrigin?: string, searchDest?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await transportService.getRoutes({ 
        mode: modeFilter, 
        originId: searchOrigin || undefined,
        destinationId: searchDest || undefined
      });
      setRoutes(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [modeFilter]);

  useEffect(() => {
    supabase.from('locations').select('*').eq('status', 'PUBLISHED').order('name')
      .then(({data}) => setLocations((data as unknown as Location[]) || []));
    fetchRoutes();
  }, [fetchRoutes]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutes(origin, destination);
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-arctic-gold/30">
      
      {/* Ocean Steel Hero -> Standard PageHeader */}
      <PageHeader
        title={<>Navigate Norway <br/>Sustainably</>}
        description="Plan your journey through dramatic landscapes using our world-class electric ferries, scenic trains, and EV infrastructure."
        breadcrumb={
          <>
            <Leaf className="w-4 h-4" /> Smart Mobility
          </>
        }
        backgroundImage="/images/infra_windfarm_1786938637138.jpg"
      >
        {/* Smart Routing Bar */}
        <form onSubmit={handleSearch} className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 flex flex-col md:flex-row gap-2 max-w-5xl shadow-2xl rounded-sm">
          <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group text-snow">
            <MapPin className="w-5 h-5 text-arctic-gold group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">From</span>
              <select value={origin} onChange={e => setOrigin(e.target.value)} className="bg-transparent text-sm outline-none placeholder:text-slate-500 w-full font-medium appearance-none cursor-pointer">
                <option value="" className="bg-deep-night text-snow">Anywhere</option>
                {locations.map(l => <option key={l.id} value={l.id} className="bg-deep-night text-snow">{l.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center px-2 text-slate-500">
            <ArrowRight size={20} />
          </div>
          <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group text-snow">
            <MapPin className="w-5 h-5 text-arctic-gold group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">To</span>
              <select value={destination} onChange={e => setDestination(e.target.value)} className="bg-transparent text-sm outline-none placeholder:text-slate-500 w-full font-medium appearance-none cursor-pointer">
                <option value="" className="bg-deep-night text-snow">Anywhere</option>
                {locations.map(l => <option key={l.id} value={l.id} className="bg-deep-night text-snow">{l.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group text-snow">
            <Calendar className="w-5 h-5 text-arctic-gold group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date</span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-transparent text-sm font-medium outline-none w-full cursor-pointer text-snow [color-scheme:dark]" />
            </div>
          </div>
          <button type="submit" className="h-auto py-4 px-10 bg-arctic-gold text-deep-night font-bold hover:bg-snow transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0 rounded-sm">
            <Search className="w-4 h-4" /> Find Route
          </button>
        </form>
      </PageHeader>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* Navigation Modes */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 mb-12 pb-6 bg-deep-night">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                if (mode.id === 'all') searchParams.delete('mode');
                else searchParams.set('mode', mode.id);
                setSearchParams(searchParams);
              }}
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-sm border ${
                modeFilter === mode.id 
                  ? 'bg-arctic-gold border-arctic-gold text-deep-night shadow-md' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-snow'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-semibold mb-2 text-[#0F172A]">Available Routes</h2>
          <p className="font-sans text-[#64748B]">Zero-emission transport options for your journey.</p>
        </div>

        <AsyncStateWrapper
          isLoading={loading}
          error={error}
          data={routes}
          emptyMessage="No routes found. Try adjusting your origin/destination or switching transport modes."
          errorMessage="Unable to load routes."
          skeleton={
            <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#0284C7] rounded-full animate-spin"></div></div>
          }
        >
          {(data) => (
            <div className="flex flex-col gap-4 mb-24">
              {data.map((route, idx) => {
                const hours = Math.floor((route.duration_minutes || 0) / 60);
                const mins = (route.duration_minutes || 0) % 60;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={route.id} 
                    onClick={() => navigate(`/travel/route/${route.id}`)} 
                    className="bg-white border border-[#E2E8F0] hover:border-[#0284C7]/50 p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer transition-all hover:shadow-md group rounded-sm"
                  >
                    {/* Mode Icon */}
                    <div className="w-16 h-16 bg-[#F1F5F9] flex items-center justify-center shrink-0 text-[#64748B] group-hover:bg-[#0284C7] group-hover:text-white transition-colors rounded-sm">
                      {route.type === 'TRAIN' && <Train size={24} />}
                      {route.type === 'FERRY' && <Ship size={24} />}
                      {route.type === 'CAR_RENTAL' && <Car size={24} />}
                    </div>

                    {/* Route Details */}
                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <span className="text-xs font-sans font-bold text-[#64748B] uppercase tracking-widest">{route.operator}</span>
                        <span className="flex items-center gap-1 text-[10px] font-sans font-bold text-[#059669] bg-[#059669]/10 px-2 py-1 uppercase tracking-widest rounded-sm">
                          <Zap size={10} /> Zero Emission
                        </span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-4 font-display font-semibold text-2xl text-[#0F172A]">
                        <span>{route.origin?.name}</span>
                        <ArrowRight size={20} className="text-[#CBD5E1]" />
                        <span>{route.destination?.name}</span>
                      </div>
                    </div>

                    {/* Timing & Price */}
                    <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:items-end md:justify-center border-t border-[#E2E8F0] md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0 gap-2">
                      <div className="flex items-center gap-2 text-[#64748B] font-sans text-sm font-medium">
                        <Clock size={16} className="text-[#0284C7]" />
                        {hours > 0 && `${hours}h `}{mins > 0 && `${mins}m`}
                      </div>
                      <div className="text-2xl font-display font-semibold text-[#0F172A] mt-1 group-hover:text-[#0284C7] transition-colors">
                        {route.price_estimate} {route.currency}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AsyncStateWrapper>
      </div>
    </div>
  );
};

export default Travel;
