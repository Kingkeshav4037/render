import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Snowflake, Wind, Eye, Mountain, Navigation, ArrowLeft, Coffee, Home, Activity, MapPin } from 'lucide-react';
import { resortService, SkiResort } from '../../services/resortService';

export const WinterResortDetails = () => {
  const { id } = useParams();
  const [resort, setResort] = React.useState<SkiResort | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      resortService.getResortBySlug(id).then(data => {
        setResort(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-midnight text-white flex items-center justify-center">Loading...</div>;
  if (!resort) return <div className="min-h-screen bg-midnight text-white flex items-center justify-center">Resort not found</div>;

  return (
    <div className="min-h-screen bg-midnight text-white pb-24">
      {/* Full-screen Hero */}
      <div className="relative h-screen">
        <CinematicBackground 
          imageUrl={resort.image}
          overlayOpacity={0.4}
          theme="glacierBlue"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-32">
          <Container>
            <Link to="/winter" className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit">
              <ArrowLeft className="w-5 h-5" /> Back to Winter Sports
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-display font-bold text-white mb-4 drop-shadow-2xl"
            >
              {resort.name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 text-xl"
            >
              <span className="bg-glacier-blue text-midnight px-3 py-1 rounded-full font-bold text-sm tracking-wider uppercase">
                {resort.status}
              </span>
              <span className="text-gray-200 font-light drop-shadow-xl">{resort.region}, Norway</span>
            </motion.div>
          </Container>
        </div>
        
        {/* Live Data Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-xl border-t border-white/20"
        >
          <Container>
            <div className="flex flex-wrap justify-between items-center py-6 gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Snowflake className="w-3 h-3"/> Snow Depth</span>
                <span className="text-2xl font-bold text-white">{resort.snow_depth_cm} cm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Navigation className="w-3 h-3"/> Lifts Open</span>
                <span className="text-2xl font-bold text-white">{resort.lifts} / 31</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Mountain className="w-3 h-3"/> Slopes Open</span>
                <span className="text-2xl font-bold text-white">{resort.slopes} / 68</span>
              </div>
              <div className="flex flex-col border-l border-white/20 pl-6">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Temperature</span>
                <span className="text-2xl font-bold text-glacier-blue">{resort.current_temp}°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Wind className="w-3 h-3"/> Wind</span>
                <span className="text-2xl font-bold text-white">4 m/s</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Eye className="w-3 h-3"/> Visibility</span>
                <span className="text-2xl font-bold text-white">Excellent</span>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>

      <Container className="pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-glacier-blue" /> Interactive Mountain Map
            </h2>
            {/* Mountain Map Placeholder */}
            <div className="glass-panel rounded-3xl overflow-hidden h-[600px] flex items-center justify-center relative mb-16">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551524164-687a5424ffc6?q=80&w=1200')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-glacier-blue/10 mix-blend-overlay" />
              <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold flex items-center gap-2 relative z-10">
                <Mountain className="w-5 h-5 text-glacier-blue" /> Loading Topographic Trail Map...
              </div>
            </div>
            
            <h2 className="text-3xl font-display font-bold mb-8">Resort Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-3xl group hover:border-glacier-blue/50 transition-colors cursor-pointer">
                <Home className="w-8 h-8 text-glacier-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">Accommodation</h3>
                <p className="text-gray-400 text-sm mb-4">From ski-in/ski-out luxury cabins to family-friendly apartments.</p>
                <span className="text-sm font-bold text-glacier-blue group-hover:text-white transition-colors">Book a Stay &rarr;</span>
              </div>
              <div className="glass-panel p-8 rounded-3xl group hover:border-glacier-blue/50 transition-colors cursor-pointer">
                <Coffee className="w-8 h-8 text-glacier-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">Dining & Afterski</h3>
                <p className="text-gray-400 text-sm mb-4">12 restaurants on the mountain serving hot cocoa to gourmet dinners.</p>
                <span className="text-sm font-bold text-glacier-blue group-hover:text-white transition-colors">View Venues &rarr;</span>
              </div>
              <div className="glass-panel p-8 rounded-3xl group hover:border-glacier-blue/50 transition-colors cursor-pointer">
                <Activity className="w-8 h-8 text-glacier-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">Equipment Rental</h3>
                <p className="text-gray-400 text-sm mb-4">Premium skis, snowboards, and winter gear available daily.</p>
                <span className="text-sm font-bold text-glacier-blue group-hover:text-white transition-colors">Reserve Gear &rarr;</span>
              </div>
              <div className="glass-panel p-8 rounded-3xl group hover:border-glacier-blue/50 transition-colors cursor-pointer">
                <Snowflake className="w-8 h-8 text-glacier-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">Ski School</h3>
                <p className="text-gray-400 text-sm mb-4">Expert instructors for all ages and skill levels.</p>
                <span className="text-sm font-bold text-glacier-blue group-hover:text-white transition-colors">Book Lessons &rarr;</span>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <div className="glass-panel p-8 rounded-3xl border border-glacier-blue/30 bg-glacier-blue/5">
                <h3 className="text-2xl font-display font-bold mb-6">Book Lift Passes</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <div className="font-bold">Adult (16+ yr)</div>
                      <div className="text-xs text-gray-400">1 Day Pass</div>
                    </div>
                    <div className="text-xl font-bold text-glacier-blue">NOK 650</div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <div className="font-bold">Youth (7-15 yr)</div>
                      <div className="text-xs text-gray-400">1 Day Pass</div>
                    </div>
                    <div className="text-xl font-bold text-glacier-blue">NOK 520</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">Child (0-6 yr)</div>
                      <div className="text-xs text-gray-400">Helmet mandatory</div>
                    </div>
                    <div className="text-xl font-bold text-glacier-blue">Free</div>
                  </div>
                </div>

                <button className="w-full bg-glacier-blue text-midnight font-bold py-4 rounded-xl hover:bg-white transition-colors mb-4">
                  Add to Cart
                </button>
                <button className="w-full bg-white/10 text-white border border-white/20 font-bold py-4 rounded-xl hover:bg-white/20 transition-colors">
                  View Multi-Day Passes
                </button>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
