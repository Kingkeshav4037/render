import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Snowflake, Mountain, Navigation, Compass, Wind } from 'lucide-react';

const WINTER_CATEGORIES = [
  { id: 'ski-resorts', title: 'Ski Resorts', desc: 'World-class alpine facilities', img: '/images/kjeragbolten_1786936275605.jpg' },
  { id: 'alpine', title: 'Alpine Skiing', desc: 'Steep drops and groomed slopes', img: '/images/trolltunga_1786936111320.jpg' },
  { id: 'cross-country', title: 'Cross-Country', desc: 'Endless miles of prepared tracks', img: '/images/fjords_1786935800026.jpg' },
  { id: 'snowboarding', title: 'Snowboarding', desc: 'Parks and backcountry powder', img: '/images/northern_lights_1786935879330.jpg' },
  { id: 'snowshoeing', title: 'Snowshoeing', desc: 'Quiet walks through winter forests', img: '/images/galdhopiggen_1786936412055.jpg' },
  { id: 'dog-sledding', title: 'Dog Sledding', desc: 'Huskies across the tundra', img: '/images/besseggen_1786936349992.jpg' },
  { id: 'snowmobiling', title: 'Snowmobiling', desc: 'High-speed Arctic exploration', img: '/images/preikestolen_1786936002797.jpg' },
  { id: 'ice-fishing', title: 'Ice Fishing', desc: 'Patience on frozen lakes', img: '/images/lofoten_1787013505867.jpg' },
];

export const WinterSports = () => {
  return (
    <div className="min-h-screen bg-midnight text-white">
      <CinematicBackground 
        imageUrl="/images/northern_lights_1786935879330.jpg"
        overlayOpacity={0.6}
        theme="glacierBlue"
      />

      <div className="relative z-10 pt-32 pb-24">
        <Container>
          {/* Hero Section */}
          <div className="max-w-4xl mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-6"
            >
              Chase <span className="italic text-glacier-blue">winter.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl"
            >
              Discover pristine powder, endless cross-country tracks, and adrenaline-fueled Arctic expeditions.
            </motion.p>
          </div>

          {/* Featured Ski Resorts Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-24 bg-gradient-to-r from-glacier-blue/20 to-transparent border border-glacier-blue/30 rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-glacier-blue/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-xl">
              <span className="flex items-center gap-2 text-glacier-blue font-bold tracking-wider uppercase text-sm mb-4">
                <Snowflake className="w-4 h-4" /> Live Conditions
              </span>
              <h3 className="text-3xl font-display font-bold mb-4">Hemsedal just reported 20cm of fresh powder.</h3>
              <p className="text-gray-300 mb-8">All 21 lifts are operating and the backcountry is prime. Book your ski pass now for weekend access.</p>
              
              <Link to="/winter/hemsedal" className="inline-block bg-glacier-blue text-midnight px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors">
                View Resort Status
              </Link>
            </div>

            <div className="relative z-10 glass-panel p-6 rounded-2xl flex flex-col items-center min-w-[200px]">
              <div className="text-5xl font-display font-bold text-white mb-2">-8°C</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider mb-4">Current Temp</div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-glacier-blue h-full w-[80%]" />
              </div>
              <div className="text-xs text-gray-400">Visibility: Excellent</div>
            </div>
          </motion.div>

          {/* Winter Categories Grid */}
          <div>
            <h2 className="text-3xl font-display font-bold mb-10 border-b border-white/20 pb-4 flex items-center gap-3">
              <Wind className="w-6 h-6 text-glacier-blue" /> Winter Experiences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WINTER_CATEGORIES.map((category, idx) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative h-80 rounded-3xl overflow-hidden glass-panel block cursor-pointer"
                >
                  <img 
                    src={category.img} 
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-glacier-blue text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {category.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
