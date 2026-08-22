import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { ArrowLeft, Zap, Battery, Clock, MapPin, Check, QrCode } from 'lucide-react';

export const EVStationDetails = () => {
  const { id } = useParams();
  const [charging, setCharging] = useState(false);
  const [progress, setProgress] = useState(0);

  const startCharge = () => {
    setCharging(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 1;
      setProgress(curr);
      if (curr >= 100) clearInterval(interval);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glacier-mint/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-5xl">
        <Link to="/mobility/ev" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Network
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
            <div>
              <div className="bg-glacier-mint/20 text-glacier-mint px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex mb-4">
                Ultra-Fast Charger
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">IONITY Oslo</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> E18, 0250 Oslo</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-glacier-mint"/> 350 kW Max</span>
              </div>
            </div>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/5 text-center min-w-[200px]">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Availability</div>
              <div className="text-4xl font-display font-bold text-green-400 mb-1">4 / 6</div>
              <div className="text-sm text-gray-500">Ports Open</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Charger Status */}
            <div>
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Terminal Status</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map(terminal => (
                  <div key={terminal} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold font-mono">
                        0{terminal}
                      </div>
                      <div>
                        <div className="font-bold">CCS2</div>
                        <div className="text-xs text-gray-400">Up to 350 kW</div>
                      </div>
                    </div>
                    {terminal <= 4 ? (
                      <span className="text-green-400 font-bold text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" /> Available
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" /> In Use (84%)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Charge Interface */}
            <div>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!charging ? (
                    <motion.div 
                      key="auth"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <div className="w-32 h-32 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                        <QrCode className="w-16 h-16 text-glacier-mint" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Ready to Charge</h3>
                      <p className="text-gray-400 mb-8">Scan QR code at Terminal 01 to begin authentication</p>
                      
                      <button 
                        onClick={startCharge}
                        className="w-full bg-glacier-mint text-deep-night font-bold py-4 rounded-xl hover:bg-white transition-colors"
                      >
                        Simulate App Start
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="charging"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <div className="mb-8 relative w-48 h-48 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" className="stroke-white/10 stroke-[8px] fill-none" />
                          <circle 
                            cx="50" cy="50" r="45" 
                            className="stroke-glacier-mint stroke-[8px] fill-none transition-all duration-300"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progress) / 100}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-display font-bold">{progress}%</span>
                          <span className="text-xs text-glacier-mint uppercase font-bold tracking-wider">Charging</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-4 rounded-xl">
                          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Power</div>
                          <div className="text-xl font-bold">142 kW</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time Rem.</div>
                          <div className="text-xl font-bold">24 min</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setCharging(false); setProgress(0); }}
                        className="w-full bg-red-500/20 text-red-400 border border-red-500/50 font-bold py-4 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Stop Charging
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};
