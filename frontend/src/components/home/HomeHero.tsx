import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Bed, Utensils, Mountain, Map, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

const TABS = [
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'stay', label: 'Stay', icon: Bed },
  { id: 'travel', label: 'Travel', icon: MapPin }, // using MapPin as placeholder for Travel
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'activities', label: 'Activities', icon: Mountain },
  { id: 'map', label: 'Map', icon: Map },
];

export const HomeHero = () => {
  const [activeTab, setActiveTab] = useState('places');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}&tab=${activeTab}`);
    }
  };

  return (
    <div className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/northern_lights.jpg" 
          alt="Norway Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/60 to-navy-900/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full flex flex-col items-center mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            Discover Norway.<br/>
          </h1>
          <p className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-aurora-green to-emerald-400 font-bold mb-8">
            Plan smarter. Live better.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Norway
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/plan')}
              leftIcon={<Sparkles className="w-5 h-5 text-aurora-green" />}
            >
              Plan My Trip
            </Button>
          </div>
        </motion.div>

        {/* Universal Search Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-3xl p-3 md:p-4 border border-white/20 shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 px-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-aurora-green text-navy-900 shadow-lg shadow-aurora-green/20' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-2xl overflow-hidden shadow-inner focus-within:ring-4 focus-within:ring-aurora-green/30 transition-all">
            <div className="pl-6 text-gray-400">
              <Search size={24} />
            </div>
            <input
              aria-label="Search destination"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full px-4 py-5 md:py-6 text-lg md:text-xl text-navy-900 focus:outline-none bg-transparent placeholder:text-gray-400 font-medium"
            />
            <button 
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-3 bottom-3 bg-navy-900 text-white px-8 rounded-xl font-bold hover:bg-navy-800 transition-colors shadow-md hidden sm:block"
            >
              Search
            </button>
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-navy-900 text-white w-12 rounded-xl flex items-center justify-center font-bold hover:bg-navy-800 transition-colors shadow-md sm:hidden"
            >
              <Search size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
