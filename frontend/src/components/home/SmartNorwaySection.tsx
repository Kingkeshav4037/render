import { motion } from 'framer-motion';
import { Wifi, Thermometer, Car, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';

export const SmartNorwaySection = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-navy-800/30 overflow-hidden relative border-t border-gray-100 dark:border-white/5">
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold mb-6 border border-blue-100 dark:border-blue-500/20">
                <Wifi className="w-4 h-4" /> Live IoT Network
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-navy-900 dark:text-white mb-6 tracking-tight leading-tight">
                A connected country at your fingertips.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Norway SmartLife integrates with the national IoT infrastructure to bring you live updates on EV charging stations, cabin temperatures, road conditions, and public transport.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white">EV Charging</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Live availability of 10,000+ chargers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-white">Smart Cabins</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Control heating before you arrive</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/map" 
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Open Smart Map <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative w-full h-[500px]">
            {/* Visual representation of smart devices */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-emerald-50 dark:from-navy-800 dark:to-navy-900 rounded-[3rem] shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern-grid.svg')]"></div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-48 bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Supercharger</div>
                    <div className="text-sm font-black text-navy-900 dark:text-white">Geilo Station</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 4 Available
                  </span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 left-10 w-56 bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full text-orange-600 dark:text-orange-400">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Mountain Lodge</div>
                    <div className="text-sm font-black text-navy-900 dark:text-white">Living Room</div>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-navy-900 dark:text-white leading-none">22°C</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Target reached
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};
