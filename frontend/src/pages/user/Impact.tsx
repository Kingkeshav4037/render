import React from 'react';
import { Leaf, Award, TrendingDown, Zap, Train } from 'lucide-react';

export const Impact = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 bg-aurora-green/20 rounded-full flex items-center justify-center text-aurora-green">
            <Leaf size={24} />
          </div>
          Green <span className="font-bold">Impact</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Track your sustainable travel choices and carbon savings.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Stats & Points */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-green/10 rounded-full blur-xl group-hover:bg-aurora-green/20 transition-colors"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 relative z-10">Total CO₂ Saved</p>
              <div className="relative z-10">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-display font-black text-navy-900">142.5</span>
                  <span className="text-gray-500 font-bold mb-1">kg</span>
                </div>
                <p className="text-sm text-aurora-green font-bold flex items-center gap-1">
                  <TrendingDown size={14} /> 45% better than average
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-400/20 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Reward Points</p>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Sapling Tier</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-display font-black text-navy-900">850</span>
                  <span className="text-gray-500 font-bold mb-1">pts</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[28%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h2 className="text-xl font-display font-bold text-navy-900 mb-6 flex items-center gap-2">
              <Award className="text-amber-400" /> My Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { name: 'First Steps', icon: '🌱', active: true },
                { name: 'Zero Emission', icon: '⚡', active: true },
                { name: 'Fjord Protector', icon: '🌊', active: true },
                { name: 'Forest Guardian', icon: '🌲', active: false },
              ].map((badge, i) => (
                <div key={i} className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all ${badge.active ? 'border-aurora-green/20 bg-aurora-green/5' : 'border-gray-100 bg-gray-50 grayscale opacity-50'}`}>
                  <span className="text-4xl mb-3">{badge.icon}</span>
                  <span className={`text-xs font-bold ${badge.active ? 'text-navy-900' : 'text-gray-500'}`}>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm h-full">
            <h2 className="text-xl font-display font-bold text-navy-900 mb-6">Recent Eco-Actions</h2>
            
            <div className="space-y-6">
              {[
                { title: 'Took the R11 Train', saved: 12.5, pts: 50, time: 'Today', icon: <Train size={18} /> },
                { title: 'Charged EV at Vulkan', saved: 25.0, pts: 100, time: 'Yesterday', icon: <Zap size={18} /> }
              ].map((action, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm mb-1">{action.title}</h4>
                    <div className="flex gap-3 text-xs font-bold">
                      <span className="text-aurora-green bg-aurora-green/10 px-2 py-1 rounded-md">+{action.saved}kg CO₂</span>
                      <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md">+{action.pts} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
