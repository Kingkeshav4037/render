import React from 'react';
import { AuroraForecast } from '../../../types/dashboard';
import { Sparkles, MapPin, Cloud } from 'lucide-react';

interface Props {
  aurora: AuroraForecast | null;
}

export const AuroraWidget: React.FC<Props> = ({ aurora }) => {
  if (!aurora) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-navy-900 rounded-2xl p-6 shadow-sm h-full text-white relative overflow-hidden">
      {/* Decorative gradient orb for aurora effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse"></div>
      
      <div className="relative z-10">
        <p className="text-indigo-200 font-medium tracking-wide uppercase text-xs mb-1">AURORA FORECAST</p>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-aurora-green" /> Activity: {aurora.activityLevel}
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-indigo-100">Visibility Probability</span>
              <span className="font-bold text-aurora-green">{aurora.visibilityProbability}%</span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden">
              <div className="bg-aurora-green h-2 rounded-full" style={{ width: `${aurora.visibilityProbability}%` }}></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-indigo-100">
            <Cloud size={16} /> Cloud coverage: {aurora.cloudCoverage}%
          </div>
        </div>

        <div className="bg-indigo-950/50 rounded-xl p-4 mb-6 backdrop-blur-sm border border-indigo-800/50">
          <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-2">Best Viewing Time</p>
          <p className="text-lg font-bold">{aurora.bestViewingTime}</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-aurora-green text-navy-900 text-sm font-bold rounded-lg hover:bg-green-400 transition-colors">
            Forecast
          </button>
          <button className="flex-1 px-4 py-2 bg-indigo-800/50 border border-indigo-700 text-white text-sm font-bold rounded-lg hover:bg-indigo-800 transition-colors flex items-center justify-center gap-1">
            <MapPin size={16} /> Map
          </button>
        </div>
      </div>
    </div>
  );
};
