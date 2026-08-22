import React from 'react';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Activity, Cloud, Eye, Sun, MapPin, Map as MapIcon } from 'lucide-react';

export const AuroraTracker = () => {
  // Dummy forecast data for the timeline
  const forecast = [
    { time: '18:00', level: 'Low', value: 2 },
    { time: '20:00', level: 'Moderate', value: 4 },
    { time: '22:00', level: 'High', value: 6 },
    { time: '00:00', level: 'Very High', value: 8 },
    { time: '02:00', level: 'Moderate', value: 4 },
    { time: '04:00', level: 'Low', value: 2 },
  ];

  return (
    <div className="min-h-screen bg-midnight text-white pb-24">
      {/* Hero */}
      <div className="relative h-[80vh]">
        <CinematicBackground 
          imageUrl="/images/northern_lights_1786935879330.jpg"
          overlayOpacity={0.6}
          theme="auroraViolet"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <Container>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-6"
            >
              Where the sky <span className="italic text-aurora-violet">comes alive.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto"
            >
              Real-time monitoring, forecasts, and interactive maps to help you chase the Northern Lights across the Arctic Circle.
            </motion.p>
          </Container>
        </div>
      </div>

      <Container className="-mt-32 relative z-10">
        {/* Live Data Dashboard */}
        <div className="glass-panel p-8 rounded-3xl mb-16 shadow-2xl border border-aurora-violet/30 bg-midnight/80">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="flex flex-col items-center text-center">
              <Activity className="w-6 h-6 text-aurora-violet mb-3" />
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-1">KP Index</span>
              <span className="text-3xl font-display font-bold text-white">KP 5.3</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Cloud className="w-6 h-6 text-aurora-violet mb-3" />
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-1">Cloud Cover</span>
              <span className="text-3xl font-display font-bold text-white">23%</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Eye className="w-6 h-6 text-aurora-violet mb-3" />
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-1">Visibility</span>
              <span className="text-3xl font-display font-bold text-white">Excellent</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sun className="w-6 h-6 text-aurora-violet mb-3" />
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-1">Solar Activity</span>
              <span className="text-3xl font-display font-bold text-white">High</span>
            </div>
            <div className="flex flex-col items-center text-center col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-1 block">Best Viewing</span>
              <span className="text-2xl font-bold text-aurora-violet">22:40 – 01:15</span>
              <span className="text-xs text-green-400 mt-2 font-bold animate-pulse flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Active Now
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Aurora Forecast Timeline */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                <Activity className="w-6 h-6 text-aurora-violet" /> 12-Hour Forecast
              </h2>
              <div className="glass-panel p-8 rounded-3xl">
                <div className="flex justify-between items-end h-[200px] mb-8 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-10">
                    <div className="w-full border-t border-white" />
                    <div className="w-full border-t border-white" />
                    <div className="w-full border-t border-white" />
                    <div className="w-full border-t border-white" />
                  </div>

                  {forecast.map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 z-10 w-full relative group">
                      <div className="w-full flex justify-center h-full items-end pb-8">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${f.value * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                          className={`w-12 md:w-16 rounded-t-lg relative ${f.value >= 6 ? 'bg-gradient-to-t from-aurora-violet/20 to-aurora-violet' : 'bg-gradient-to-t from-white/10 to-white/30'} group-hover:opacity-80 transition-opacity`}
                        >
                          {/* Glowing tip for high values */}
                          {f.value >= 6 && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-aurora-violet blur-xl opacity-50" />
                          )}
                        </motion.div>
                      </div>
                      <div className="absolute bottom-0 text-center w-full">
                        <div className="text-sm font-bold font-mono">{f.time}</div>
                        <div className={`text-xs ${f.value >= 6 ? 'text-aurora-violet font-bold' : 'text-gray-400'}`}>{f.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Aurora Map */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-aurora-violet" /> Aurora Map
              </h2>
              <div className="glass-panel rounded-3xl overflow-hidden h-[500px] flex flex-col relative">
                {/* Fake Map Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
                <div className="absolute inset-0 bg-midnight/80 mix-blend-overlay" />
                
                {/* Fake Aurora Overlay */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[200px] bg-green-500/20 blur-[80px] rounded-[100%] animate-pulse mix-blend-screen" />
                <div className="absolute top-1/3 left-1/2 w-[300px] h-[150px] bg-aurora-violet/30 blur-[60px] rounded-[100%] animate-pulse mix-blend-screen" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-aurora-violet" /> Interactive Map Loading...
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Layers</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input type="checkbox" checked readOnly className="accent-aurora-violet" /> Aurora Oval
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input type="checkbox" checked readOnly className="accent-aurora-violet" /> Clouds
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input type="checkbox" readOnly className="accent-aurora-violet" /> Light Pollution
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <div className="glass-panel p-8 rounded-3xl border border-aurora-violet/30 bg-aurora-violet/5 mb-8">
                <h3 className="text-2xl font-display font-bold mb-6">Recommended Spots</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-aurora-violet/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">Tromsø</h4>
                      <span className="bg-aurora-violet text-white text-xs px-2 py-1 rounded-full font-bold">95%</span>
                    </div>
                    <p className="text-sm text-gray-400">Clear skies expected until 02:00. Head towards Kvaløya for best viewing.</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-aurora-violet/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">Lofoten</h4>
                      <span className="bg-aurora-violet text-white text-xs px-2 py-1 rounded-full font-bold">82%</span>
                    </div>
                    <p className="text-sm text-gray-400">Partial clouds. High solar activity should pierce through.</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-aurora-violet/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">Alta</h4>
                      <span className="bg-aurora-violet text-white text-xs px-2 py-1 rounded-full font-bold">78%</span>
                    </div>
                    <p className="text-sm text-gray-400">Crisp clear night, but solar activity peaks later at 03:00.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold mb-4">Aurora Alerts</h3>
                <p className="text-sm text-gray-400 mb-6">Get push notifications when KP index exceeds 5 in your current location.</p>
                <button className="w-full bg-white text-midnight font-bold py-3 rounded-xl hover:bg-aurora-violet hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Enable Alerts
                </button>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
