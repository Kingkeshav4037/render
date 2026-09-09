import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Train, Ship, Car, Compass, Calendar, ArrowRight, Clock, Zap, Leaf, MapPin, Search, RotateCcw, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { transportService, RouteWithLocations, Location } from '../services/transportService';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { PageHeader } from '../components/ui/PageHeader';
import { toast } from 'sonner';
import { SEO } from '../components/shared/SEO';

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
    if (origin && destination && origin === destination) {
      toast.error('Origin and destination cannot be the same. Please choose different points.');
      return;
    }
    fetchRoutes(origin, destination);
  };

  const handleResetSearch = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    fetchRoutes();
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-arctic-gold/30">
      <SEO 
        title="Smart Travel & Sustainable Transport | Norway SmartLife"
        description="Discover Norway's zero-emission scenic trains, electric fjord catamarans, and EV travel corridors."
      />
      
      {/* Ocean Steel Hero -> Standard PageHeader */}
      <PageHeader
        title={<>Navigate Norway <br/>Sustainably</>}
        description="Plan your journey through dramatic landscapes using our world-class electric ferries, scenic trains, and EV infrastructure."
        breadcrumb={
          <>
            <Leaf className="w-4 h-4" /> Smart Mobility
          </>
        }
        backgroundImage="/images/flamsbana.jpg"
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
          <button type="submit" className="h-auto py-4 px-10 bg-arctic-gold text-deep-night font-bold hover:bg-snow transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0 rounded-sm cursor-pointer">
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
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-sm border cursor-pointer ${
                modeFilter === mode.id 
                  ? 'bg-arctic-gold border-arctic-gold text-deep-night shadow-md' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-snow'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}

          {(origin || destination || date) && (
            <button
              onClick={handleResetSearch}
              className="ml-auto text-xs font-bold uppercase tracking-wider text-arctic-gold hover:text-snow flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Reset Route Search
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-display font-semibold mb-2 text-white">Available Scenic Corridors</h2>
            <p className="font-sans text-slate-400">Zero-emission railways, electric catamarans, and coastal transit.</p>
          </div>
          <Link
            to="/mobility/ev"
            className="text-xs font-bold uppercase tracking-wider text-glacier-mint hover:text-white flex items-center gap-1.5 border border-white/10 bg-white/5 px-4 py-2 rounded-lg transition-colors"
          >
            <Zap size={14} /> EV Fast Charging Hubs
          </Link>
        </div>

        <AsyncStateWrapper
          isLoading={loading}
          error={error}
          data={routes}
          emptyMessage="No direct scenic routes found for this specific origin and destination. Try searching 'Anywhere' to browse all iconic Norwegian routes."
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
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="text-base font-bold text-[#0F172A]">{route.name || route.operator}</span>
                        {route.operator && route.name && (
                          <span className="text-xs font-sans font-bold text-[#64748B] uppercase tracking-widest">({route.operator})</span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] font-sans font-bold text-[#059669] bg-[#059669]/10 px-2 py-1 uppercase tracking-widest rounded-sm">
                          <Zap size={10} /> Zero Emission
                        </span>
                        {route.co2_saved_kg && (
                          <span className="text-[10px] font-sans font-bold text-[#0284C7] bg-[#0284C7]/10 px-2 py-1 uppercase tracking-widest rounded-sm">
                            {route.co2_saved_kg} kg CO2 Saved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-4 font-display font-semibold text-xl text-[#0F172A]">
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
                        {route.price_estimate} {route.currency || 'NOK'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AsyncStateWrapper>

        {/* Clean Transport Options Overview */}
        <div className="border-t border-white/10 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-arctic-gold/10 text-arctic-gold flex items-center justify-center mb-4">
              <Train size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Electrified Railways</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Norway's mainline rail network runs on 100% renewable hydroelectric power, offering zero-emission travel through mountains and fjords.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-glacier-mint/10 text-glacier-mint flex items-center justify-center mb-4">
              <Ship size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Electric Fjord Ferries</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Silent battery-powered catamarans protect UNESCO fjord waters from emissions while providing undisturbed panoramic views.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-polar-indigo/20 text-polar-indigo flex items-center justify-center mb-4">
              <Car size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">High-Power EV Corridors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              World's dense ultra-fast charging network (150kW-350kW) across national tourist routes and mountain passes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Travel;
