import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Zap, Ship, Bus, Wind, Droplets, Server, Activity, Leaf, ShieldCheck, ChevronRight } from 'lucide-react';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/shared/SEO';

export const SmartCity = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white font-sans relative overflow-hidden">
      <SEO 
        title="Smart Norway & Sustainable City Telemetry | SmartLife"
        description="Monitor national telemetry, smart mobility, renewable grids, and environmental metrics across Norway."
      />
      
      <CinematicBackground 
        imageUrl="/images/smart_home_energy_system.jpg"
        gradient="aurora"
        overlayOpacity={0.7}
        className="h-[60vh] flex items-center pt-24 mb-16"
        animate={true}
      >
        <Container className="relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-northern-cyan mb-6"
          >
            <Activity className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">System Overview</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold mb-6"
          >
            A smarter <span className="text-northern-cyan italic">Norway.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 font-light max-w-2xl"
          >
            Monitor the vital signs of the nation's infrastructure, mobility, and environmental impact in real-time.
          </motion.p>
        </Container>
      </CinematicBackground>

      <Container className="relative z-10 pb-24">
        {/* Live Metrics Hero */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          {[
            { label: 'EV Chargers', value: '1,248', icon: <Zap className="w-5 h-5 text-northern-cyan" />, link: '/mobility/ev' },
            { label: 'Active Ferries', value: '86', icon: <Ship className="w-5 h-5 text-northern-cyan" />, link: '/mobility/ferry' },
            { label: 'Smart Devices', value: '12,450', icon: <Server className="w-5 h-5 text-northern-cyan" />, link: '/infrastructure/iot' },
            { label: 'Renewable Energy', value: '98%', icon: <Wind className="w-5 h-5 text-northern-cyan" />, link: '/infrastructure/energy' },
            { label: 'CO₂ Saved (Today)', value: '24.8K t', icon: <Leaf className="w-5 h-5 text-northern-cyan" />, link: '/impact' },
          ].map((metric, idx) => (
            <Link key={metric.label} to={metric.link}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="bg-northern-cyan/5 border border-northern-cyan/20 p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-northern-cyan/10 transition-colors h-full"
              >
                <div className="mb-4 bg-northern-cyan/10 p-3 rounded-full border border-northern-cyan/30">
                  {metric.icon}
                </div>
                <div className="text-3xl font-display font-bold text-white mb-2">{metric.value}</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{metric.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mobility */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Bus className="w-6 h-6 text-northern-cyan" /> Mobility
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <Link to="/mobility/ev" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">EV Infrastructure</h3>
                  <p className="text-sm text-gray-400">Live charging network telemetry and station status</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/mobility/ferry" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Smart Ferries</h3>
                  <p className="text-sm text-gray-400">Vessel tracking, timetable schedules, and capacity management</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/travel" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Public Transport</h3>
                  <p className="text-sm text-gray-400">Bus, express boat, and scenic rail punctuality metrics</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Energy */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-northern-cyan" /> Energy
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <Link to="/infrastructure/energy" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Hydropower Grid</h3>
                  <p className="text-sm text-gray-400">Reservoir levels, peak demand, and generation output</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/infrastructure/energy" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Wind Farms</h3>
                  <p className="text-sm text-gray-400">Turbine efficiency, yield metrics, and generation forecasts</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Environment */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Droplets className="w-6 h-6 text-northern-cyan" /> Environment
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <Link to="/weather" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Air Quality & Weather</h3>
                  <p className="text-sm text-gray-400">Atmospheric monitoring, wind velocity, and precipitation</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/impact" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">Water & Ecological Systems</h3>
                  <p className="text-sm text-gray-400">Fjord salinity, glacier retreat metrics, and temperature sensors</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-northern-cyan" /> Infrastructure
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <Link to="/infrastructure/iot" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">IoT Sensor Network</h3>
                  <p className="text-sm text-gray-400">Device health, gateway nodes, and signal strength</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/infrastructure" className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-northern-cyan transition-colors">National Command Center</h3>
                  <p className="text-sm text-gray-400">Critical systems overview, grid topology, and energy telemetry</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default SmartCity;
