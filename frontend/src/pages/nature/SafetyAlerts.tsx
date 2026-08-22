import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { ShieldAlert, AlertTriangle, Info, CloudRain, Mountain, Car, Waves, MapPin, Clock } from 'lucide-react';
export interface SafetyAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Advisory' | 'Information';
  category: 'Weather' | 'Mountain' | 'Road' | 'Sea';
  title: string;
  location: string;
  time: string;
  description: string;
  recommended_action: string;
}

export const MOCK_ALERTS: SafetyAlert[] = [
  {
    id: '1',
    severity: 'Critical',
    category: 'Mountain',
    title: 'High Avalanche Risk',
    location: 'Jotunheimen',
    time: '2 hours ago',
    description: 'Significant warming has destabilized the snowpack.',
    recommended_action: 'Avoid all backcountry skiing in steep terrain.'
  },
  {
    id: '2',
    severity: 'Warning',
    category: 'Road',
    title: 'Ice on E6',
    location: 'Dovrefjell',
    time: '5 hours ago',
    description: 'Black ice reported across the mountain pass.',
    recommended_action: 'Use winter tires, reduce speed.'
  }
];
const CATEGORIES = [
  { id: 'All', icon: <ShieldAlert className="w-5 h-5" /> },
  { id: 'Weather', icon: <CloudRain className="w-5 h-5" /> },
  { id: 'Mountain', icon: <Mountain className="w-5 h-5" /> },
  { id: 'Road', icon: <Car className="w-5 h-5" /> },
  { id: 'Sea', icon: <Waves className="w-5 h-5" /> }
];

export const SafetyAlerts = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAlerts = activeCategory === 'All' 
    ? MOCK_ALERTS 
    : MOCK_ALERTS.filter(a => a.category === activeCategory);

  const getSeverityStyles = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500', icon: <AlertTriangle className="w-6 h-6 text-red-500" /> };
      case 'Warning':
        return { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-500', icon: <AlertTriangle className="w-6 h-6 text-orange-500" /> };
      case 'Advisory':
        return { border: 'border-amber-400', bg: 'bg-amber-400/10', text: 'text-amber-400', icon: <Info className="w-6 h-6 text-amber-400" /> };
      case 'Information':
        return { border: 'border-blue-400', bg: 'bg-blue-400/10', text: 'text-blue-400', icon: <Info className="w-6 h-6 text-blue-400" /> };
      default:
        return { border: 'border-gray-500', bg: 'bg-gray-500/10', text: 'text-gray-500', icon: <Info className="w-6 h-6 text-gray-500" /> };
    }
  };

  return (
    <div className="min-h-screen bg-snow text-nordic-charcoal pb-24 pt-32">
      <Container>
        {/* Header - Prioritizing clarity over decoration */}
        <div className="max-w-4xl mb-16">
          <div className="w-16 h-1 bg-nordic-red mb-8" />
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-nordic-charcoal mb-6"
          >
            Know before you <span className="text-nordic-red italic">go.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate font-light max-w-2xl"
          >
            Official safety alerts and advisories for nature and adventure travel across Norway. Data is updated in real-time.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Categories / Filters */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-nordic-charcoal">Categories</h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      activeCategory === cat.id 
                        ? 'bg-nordic-red text-white font-bold shadow-md' 
                        : 'bg-gray-50 text-slate hover:bg-gray-100'
                    }`}
                  >
                    {cat.icon}
                    {cat.id}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4">Severity Levels</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-red-500" /> Critical</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-orange-500" /> Warning</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-amber-400" /> Advisory</li>
                  <li className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-blue-400" /> Information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="w-full lg:w-3/4">
            {filteredAlerts.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">No Active Alerts</h3>
                <p className="text-green-700">There are currently no active alerts for {activeCategory.toLowerCase()}. Enjoy your adventure safely!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredAlerts.map((alert, idx) => {
                  const styles = getSeverityStyles(alert.severity);
                  return (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white rounded-3xl overflow-hidden shadow-md border-l-8 ${styles.border} flex flex-col md:flex-row`}
                    >
                      <div className={`p-6 flex flex-col justify-center items-center md:border-r border-gray-100 min-w-[150px] ${styles.bg}`}>
                        {styles.icon}
                        <span className={`mt-2 font-bold uppercase tracking-wider text-sm ${styles.text}`}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <div className="p-8 flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <h3 className="text-2xl font-display font-bold text-nordic-charcoal">{alert.title}</h3>
                          <div className="flex flex-col items-end gap-1 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {alert.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {alert.time}</span>
                          </div>
                        </div>
                        
                        <p className="text-lg text-slate mb-6 leading-relaxed">
                          {alert.description}
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                          <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Recommended Action</span>
                            <span className="font-bold text-nordic-charcoal">{alert.recommended_action}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};
