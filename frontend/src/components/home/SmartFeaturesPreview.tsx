import { motion } from 'framer-motion';
import { Map, Zap, Bot, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container } from '../layout/Container';

export const SmartFeaturesPreview = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/planner');
    }
  };

  return (
    <section className="bg-navy-900 py-0 overflow-hidden relative border-y border-white/5">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* AI Planner Section */}
        <div className="p-12 lg:p-24 flex flex-col justify-center relative z-10 lg:border-r border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold border border-blue-500/20 mb-8 w-max">
              <Bot size={16} /> AI Trip Planner
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Let AI Plan Your Norway Adventure
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
              Tell us what you love, and our AI will instantly generate a complete, day-by-day Norwegian itinerary tailored just for you.
            </p>

            <form onSubmit={handleAiSubmit} className="relative w-full max-w-xl group">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A 5-day romantic fjord trip from Bergen..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-lg shadow-inner group-focus-within:ring-4 group-focus-within:ring-blue-500/20"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-bold transition-colors flex items-center gap-2 shadow-md">
                <Zap size={18} /> Generate
              </button>
            </form>
            
            <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
              <button onClick={() => setPrompt('7 days hunting Northern Lights in Tromsø')} className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-full whitespace-nowrap transition-colors border border-white/5">
                "7 days hunting Northern Lights in Tromsø"
              </button>
              <button onClick={() => setPrompt('Hiking and fjords near Stavanger for a family')} className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-full whitespace-nowrap transition-colors border border-white/5">
                "Hiking and fjords near Stavanger for a family"
              </button>
            </div>
          </motion.div>
        </div>

        {/* Smart Map Preview Section */}
        <div className="relative h-[400px] lg:h-auto bg-navy-950 overflow-hidden flex items-center justify-center">
          {/* Faux Map Background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent z-10"></div>
          </div>
          
          {/* Floating UI Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-sm w-full mx-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-aurora-green/20 p-3 rounded-xl text-aurora-green">
                  <Map size={28} />
                </div>
                <h3 className="text-2xl font-black text-white">Smart Map</h3>
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora-green"></span>
              </span>
            </div>
            
            <p className="text-gray-300 text-base mb-8 leading-relaxed">
              Explore Norway interactively. Discover places, hotels, live weather, Aurora forecasts, and EV charging all on one intelligent map layer.
            </p>
            
            <Link to="/map" className="w-full flex items-center justify-center gap-2 bg-white text-navy-900 font-black py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              <Navigation size={18} /> Open Interactive Map
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
