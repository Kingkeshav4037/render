import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Compass, Map, Tent, Fish, CloudRain, ShieldAlert } from 'lucide-react';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { AdventureMap } from './components/AdventureMap';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

export interface AdventureCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export const ADVENTURE_CATEGORIES: AdventureCategory[] = [
  { id: 'hiking',   name: 'Hiking',    description: 'Norwegian mountain trails.',          image: '/images/trolltunga_1786936111320.jpg',      count: 245 },
  { id: 'skiing',   name: 'Skiing',    description: 'Alpine and cross-country experiences.',image: '/images/galdhopiggen.jpg',               count: 120 },
  { id: 'kayaking', name: 'Kayaking',  description: 'Fjords and coastal exploration.',       image: '/images/fjords_1786935800026.jpg',           count: 85  },
  { id: 'cycling',  name: 'Cycling',   description: 'Scenic roads and mountain routes.',     image: '/images/besseggen_1786936349992.jpg',        count: 150 },
  { id: 'fishing',  name: 'Fishing',   description: 'Freshwater and coastal fishing.',       image: '/images/lofoten_1787013505867.jpg',          count: 320 },
  { id: 'camping',  name: 'Camping',   description: 'Wilderness stays.',                     image: '/images/ryten_1786936427556.jpg',             count: 400 },
  { id: 'climbing', name: 'Climbing',  description: 'Rock and mountain climbing.',           image: '/images/kjeragbolten_1786936275605.jpg',     count: 65  },
  { id: 'wildlife', name: 'Wildlife',  description: 'Wildlife experiences.',                 image: '/images/reindeer.jpg',                       count: 45  },
];
export const Activities = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-pine-forest text-white">
      <CinematicBackground 
        imageUrl="/images/kjeragbolten_1786936275605.jpg"
        overlayOpacity={0.6}
        theme="pineForest"
      />

      <div className="relative z-10 pt-32 pb-24">
        <Container>
          {/* Hero Section */}
          <div className="max-w-4xl mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-tight"
            >
              Go beyond the <span className="text-nordic-sage italic">ordinary.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mb-12"
            >
              From quiet fjord trails to dramatic Arctic peaks, discover Norway on your own terms.
            </motion.p>

            {/* Smart Adventure Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-2 max-w-3xl"
            >
              <div className="flex-1 flex items-center px-4 py-3 bg-black/20 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text"
                  placeholder='e.g., "Easy hikes near Bergen" or "Wildlife in northern Norway"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-400"
                />
              </div>
              <button className="bg-nordic-sage hover:bg-moss text-pine-forest font-bold px-8 py-4 rounded-xl transition-colors">
                Find Adventure
              </button>
            </motion.div>
          </div>

          {/* Quick Navigation Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-24"
          >
            <Link to="/trails" className="glass-panel px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              <Compass className="w-4 h-4 text-nordic-sage" /> Explore Hiking
            </Link>
            <Link to="/winter" className="glass-panel px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-glacier-blue" /> Winter Adventures
            </Link>
            <Link to="/wildlife" className="glass-panel px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              <Tent className="w-4 h-4 text-amber-500" /> Wildlife
            </Link>
            <Link to="/aurora" className="glass-panel px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-aurora-violet" /> Aurora Tracker
            </Link>
          </motion.div>

          {/* Asymmetric Category Grid */}
          <div className="mb-24">
            <h2 className="text-3xl font-display font-bold mb-10 border-b border-white/20 pb-4">Into the Wild</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
              {ADVENTURE_CATEGORIES.map((category, index) => {
                // Create asymmetric sizing based on index
                let spanClasses = 'col-span-1 row-span-1';
                if (index === 0) spanClasses = 'col-span-1 md:col-span-2 row-span-2'; // Hiking (Large)
                if (index === 1) spanClasses = 'col-span-1 md:col-span-2 row-span-1'; // Skiing (Wide)
                if (index === 5) spanClasses = 'col-span-1 md:col-span-2 row-span-1'; // Camping (Wide)

                return (
                  <Link 
                    to={category.id === 'hiking' ? '/trails' : category.id === 'skiing' ? '/winter' : category.id === 'wildlife' ? '/wildlife' : `/adventure/${category.id}`}
                    key={category.id} 
                    className={`group relative rounded-3xl overflow-hidden glass-panel block ${spanClasses}`}
                  >
                    <OptimizedImage 
                      src={category.image} 
                      alt={category.name}
                      category="activity"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      containerClassName="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end z-10">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-gray-300 text-sm">{category.description}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 text-nordic-sage">
                        {category.count} routes
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Intelligent Recommendation */}
          <div className="mb-24 bg-gradient-to-r from-nordic-sage/20 to-transparent border border-nordic-sage/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nordic-sage/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <span className="text-nordic-sage font-bold tracking-wider uppercase text-sm mb-4 block">Perfect for today</span>
              <h3 className="text-3xl font-display font-bold mb-4 max-w-xl">Because the weather is clear around Tromsø...</h3>
              <p className="text-gray-300 mb-8 max-w-lg">We recommend taking advantage of the high visibility and low winds for these exceptional experiences.</p>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-pine-forest px-6 py-3 rounded-xl font-bold hover:bg-nordic-sage transition-colors">
                  Fjord Kayaking
                </button>
                <button className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">
                  Aurora Preparation
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Adventure Map */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-display font-bold border-b border-white/20 pb-4 inline-block">Expedition Map</h2>
            </div>
            <AdventureMap />
          </div>

        </Container>
      </div>
    </div>
  );
};
