import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { ShieldCheck, Activity, Server, Zap, ChevronRight, BarChart2, Radio, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Infrastructure = () => {
  const [activeTab, setActiveTab] = useState<'iot' | 'energy'>('energy');

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-polar-indigo/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-white/10 pb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-polar-indigo mb-6"
            >
              <Network className="w-6 h-6 animate-pulse" />
              <span className="font-bold tracking-widest uppercase text-sm">Command Center</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold mb-4"
            >
              National <span className="text-polar-indigo italic">Infrastructure.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 font-light max-w-2xl"
            >
              Real-time monitoring of energy grids, IoT networks, and critical systems.
            </motion.p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('energy')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'energy' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Energy Grid
            </button>
            <button
              onClick={() => setActiveTab('iot')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'iot' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              IoT Network
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'energy' ? (
            <motion.div
              key="energy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Energy Grid Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Total Output</div>
                  <div className="text-4xl font-display font-bold mb-4">12.4 GW</div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 w-3/4 h-full" />
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Renewable Share</div>
                  <div className="text-4xl font-display font-bold mb-4 text-green-400">98.2%</div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-400 w-[98%] h-full" />
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Grid Stability</div>
                  <div className="text-4xl font-display font-bold mb-4 text-polar-indigo">99.99%</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4 text-polar-indigo animate-pulse" /> Nominal operations
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-8">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" /> Power Generation Sites
                  </h2>
                  <Link to="/infrastructure/energy" className="text-sm font-bold text-polar-indigo hover:text-white transition-colors flex items-center gap-1">
                    View Detailed Analytics <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Kvilldal Hydropower', type: 'Hydro', output: '1,240 MW', status: 'Optimal' },
                    { name: 'Tonstad Hydropower', type: 'Hydro', output: '960 MW', status: 'Optimal' },
                    { name: 'Fosen Vind', type: 'Wind', output: '840 MW', status: 'High Yield' },
                    { name: 'Svalbard Solar Array', type: 'Solar', output: '12 MW', status: 'Low Yield' },
                  ].map(site => (
                    <div key={site.name} className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5">
                      <div>
                        <h3 className="font-bold text-lg">{site.name}</h3>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{site.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">{site.output}</div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${site.status === 'Optimal' || site.status === 'High Yield' ? 'text-green-400' : 'text-amber-400'}`}>{site.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="iot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* IoT Network Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Active Sensors</div>
                  <div className="text-4xl font-display font-bold mb-4 text-northern-cyan">2.4M</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Radio className="w-4 h-4 text-northern-cyan animate-pulse" /> Transmitting normally
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Network Latency</div>
                  <div className="text-4xl font-display font-bold mb-4">12ms</div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-400 w-1/4 h-full" />
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Data Processed (24h)</div>
                  <div className="text-4xl font-display font-bold mb-4">18.4 TB</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Server className="w-4 h-4 text-gray-500" /> 14 nodes active
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-8">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                    <Server className="w-6 h-6 text-polar-indigo" /> Sensor Networks
                  </h2>
                  <Link to="/infrastructure/iot" className="text-sm font-bold text-polar-indigo hover:text-white transition-colors flex items-center gap-1">
                    View Device Topology <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { region: 'Oslo Metropolitan', devices: '840,230', status: 'Online', alerts: 0 },
                    { region: 'Bergen Coastal', devices: '420,115', status: 'Online', alerts: 2 },
                    { region: 'Tromsø Arctic', devices: '124,050', status: 'Degraded', alerts: 14 },
                    { region: 'Trondheim Research', devices: '315,800', status: 'Online', alerts: 0 },
                  ].map(net => (
                    <div key={net.region} className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5">
                      <div>
                        <h3 className="font-bold text-lg">{net.region}</h3>
                        <div className="text-sm text-gray-400">
                          {net.devices} devices connected
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg flex items-center justify-end gap-2 ${net.status === 'Online' ? 'text-green-400' : 'text-amber-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${net.status === 'Online' ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
                          {net.status}
                        </div>
                        {net.alerts > 0 && (
                          <div className="text-xs font-bold text-red-500 mt-1">{net.alerts} Active Alerts</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Getting Around Norway: Smart Travel & Clean Mobility */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="mb-8">
            <span className="text-polar-indigo text-xs font-bold uppercase tracking-widest block mb-1">Smart Mobility Systems</span>
            <h2 className="text-3xl font-display font-bold">Getting Around Norway — Clean Transit & Networks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "EV Fast-Charging Network",
                description: "Over 24,000 public EV fast-chargers covering Arctic corridors and mountain passes.",
                link: "/mobility/ev",
                badge: "Mobility"
              },
              {
                title: "Smart Ferry Navigation",
                description: "Live schedule telemetry, capacity tracking, and zero-emission battery ferry routes.",
                link: "/mobility/ferry",
                badge: "Maritime"
              },
              {
                title: "Scenic Rail & Transit",
                description: "The Flåm, Bergen, and Dovre scenic railway lines connected with nationwide bus systems.",
                link: "/travel",
                badge: "Transit"
              },
              {
                title: "Smart City IoT Networks",
                description: "Real-time municipal traffic flow, urban air quality, and autonomous micro-mobility.",
                link: "/smart-norway",
                badge: "IoT Tech"
              }
            ].map(item => (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white/5 border border-white/10 hover:border-polar-indigo/50 rounded-2xl p-6 flex flex-col justify-between transition-all group backdrop-blur-xl"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-polar-indigo bg-polar-indigo/10 border border-polar-indigo/20 px-2 py-0.5 rounded w-fit block mb-3">
                    {item.badge}
                  </span>
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-polar-indigo transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-polar-indigo pt-3 border-t border-white/5">
                  <span>Explore Network</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
};
