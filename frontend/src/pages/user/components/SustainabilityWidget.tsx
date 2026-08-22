import React from 'react';
import { SustainabilityImpact } from '../../../types/dashboard';
import { Leaf, Train, Home, Bus } from 'lucide-react';

interface Props {
  impact: SustainabilityImpact;
}

export const SustainabilityWidget: React.FC<Props> = ({ impact }) => {
  return (
    <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 shadow-sm h-full text-white relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-aurora-green rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Leaf size={20} className="text-aurora-green" />
          Green Impact
        </h3>
        
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-aurora-green">{impact.co2SavedKg}</span>
            <span className="text-emerald-100 pb-1 font-medium">kg CO₂ Saved</span>
          </div>
          <p className="text-sm text-emerald-200 mb-6">
            You saved an estimated {impact.co2SavedKg} kg CO₂ by choosing eco-friendly travel options in Norway.
          </p>
          
          <div className="space-y-3">
            <ImpactRow icon={<Train size={16} />} label="Train Journeys" value={impact.trainJourneys} />
            <ImpactRow icon={<Home size={16} />} label="Eco-Bookings" value={impact.ecoBookings} />
            <ImpactRow icon={<Bus size={16} />} label="Public Transport" value={impact.publicTransportUsage} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ImpactRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="flex items-center justify-between bg-emerald-950/50 p-3 rounded-lg border border-emerald-800/50">
    <div className="flex items-center gap-3 text-sm text-emerald-100">
      <span className="text-aurora-green">{icon}</span>
      {label}
    </div>
    <span className="font-bold text-white">{value}</span>
  </div>
);
