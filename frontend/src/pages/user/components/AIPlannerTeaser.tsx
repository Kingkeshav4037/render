import React from 'react';
import { Sparkles, Map, Compass, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIPlannerTeaser: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-900 to-indigo-900 rounded-2xl p-8 shadow-sm text-white overflow-hidden relative group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-aurora-green font-bold text-sm uppercase tracking-widest mb-3">
            <Sparkles size={16} /> Phase 10 Preview
          </div>
          <h2 className="text-3xl font-bold mb-4">What should I do next in Norway?</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Experience the future of travel. Let our AI analyze your preferences, season, and budget to generate the perfect personalized itinerary in seconds.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/planner" className="px-6 py-3 bg-white text-navy-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
              <Sparkles size={18} /> Plan a Trip with AI
            </Link>
            <button className="px-6 py-3 bg-indigo-800/50 border border-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors flex items-center gap-2 backdrop-blur-sm">
              <TrendingUp size={18} /> Optimize My Budget
            </button>
            <button className="px-6 py-3 bg-indigo-800/50 border border-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors flex items-center gap-2 backdrop-blur-sm">
              <Map size={18} /> Find Nearby Places
            </button>
          </div>
        </div>
        
        <div className="hidden lg:flex w-48 h-48 bg-white/10 rounded-full items-center justify-center border-4 border-white/20 backdrop-blur-sm relative">
          <Compass size={64} className="text-white animate-pulse" />
          {/* Orbital decoration */}
          <div className="absolute inset-0 border border-dashed border-white/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
