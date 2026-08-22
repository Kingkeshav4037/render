import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

interface SmartSearchProps {
  className?: string;
}

export const SmartSearch = ({ className }: SmartSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    // Pass query params to explore page
    const params = new URLSearchParams({ q: query, dates, guests: guests.toString() });
    navigate(`/explore?${params.toString()}`);
  };

  const suggestions = [
    { label: 'Tromsø', type: 'Destination' },
    { label: 'Lofoten Islands', type: 'Destination' },
    { label: 'Preikestolen', type: 'Activity' },
    { label: 'Aurora Hunting', type: 'Experience' },
  ];

  return (
    <div className={clsx("relative z-50", className)}>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        layout
        className={clsx(
          "relative z-50 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mx-auto transition-all duration-300",
          isExpanded ? "rounded-3xl p-6 w-full max-w-4xl" : "rounded-full p-2 w-full max-w-2xl hover:bg-white/15"
        )}
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Search Input */}
          <div className="flex-1 w-full flex items-center relative group">
            <div className="absolute left-4 text-white/50 group-focus-within:text-aurora-green transition-colors">
              <MapPin size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Where are you going?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full bg-transparent text-white placeholder-white/60 font-medium text-lg pl-12 pr-4 py-3 outline-none"
            />
          </div>

          {/* Expanded Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, width: 0, display: 'none' }}
                animate={{ opacity: 1, width: 'auto', display: 'flex' }}
                exit={{ opacity: 0, width: 0, display: 'none' }}
                className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
              >
                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                
                <div className="flex-1 w-full flex items-center relative group">
                  <div className="absolute left-4 text-white/50 group-focus-within:text-aurora-green transition-colors">
                    <Calendar size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Add dates"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/60 font-medium pl-12 pr-4 py-3 outline-none"
                  />
                </div>

                <div className="h-10 w-px bg-white/20 hidden md:block"></div>

                <div className="flex-1 w-full flex items-center relative group">
                  <div className="absolute left-4 text-white/50 group-focus-within:text-aurora-green transition-colors">
                    <Users size={20} />
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent text-white placeholder-white/60 font-medium pl-12 pr-4 py-3 outline-none"
                  />
                  <span className="absolute right-4 text-white/60 pointer-events-none">Guests</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <button 
            type="submit" 
            className="bg-aurora-green hover:bg-green-400 text-navy-900 rounded-full p-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] shrink-0"
          >
            <Search size={24} className="stroke-[2.5px]" />
          </button>
        </form>

        {/* Dropdown Suggestions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Suggested Searches</h3>
                <button onClick={() => setIsExpanded(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setQuery(suggestion.label); setIsExpanded(false); handleSearch(new Event('submit') as any); }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-aurora-green/30 transition-all group"
                  >
                    <span className="text-white font-medium group-hover:text-aurora-green transition-colors">{suggestion.label}</span>
                    <span className="text-xs text-white/40 uppercase tracking-widest">{suggestion.type}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
