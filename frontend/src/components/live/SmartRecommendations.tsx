import React from 'react';
import { useLiveIntelligence } from '../../services/live/intelligenceService';
import { Sparkles, CloudRain, Ship, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  className?: string;
  onAction?: (actionType: string, locationId?: string) => void;
}

export const SmartRecommendations: React.FC<Props> = ({ className = '', onAction }) => {
  const recommendations = useLiveIntelligence();
  const navigate = useNavigate();

  if (recommendations.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'AURORA': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'WEATHER': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'TRANSPORT': return <Ship className="w-5 h-5 text-cyan-400" />;
      case 'SAFETY': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getBgClass = (type: string, priority: string) => {
    if (priority === 'HIGH' && type === 'AURORA') return 'bg-purple-900/40 border-purple-500/30';
    if (priority === 'HIGH' && type === 'SAFETY') return 'bg-red-900/40 border-red-500/30';
    return 'bg-navy-800/80 border-white/10';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {recommendations.map((rec) => (
        <div key={rec.id} className={`p-4 rounded-xl border backdrop-blur-md shadow-lg flex gap-4 items-start ${getBgClass(rec.type, rec.priority)}`}>
          <div className="mt-1 bg-black/30 p-2 rounded-lg">
            {getIcon(rec.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm mb-1">{rec.title}</h4>
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">{rec.description}</p>
            {rec.actionText && (
              <button 
                onClick={() => {
                  if (onAction && rec.actionType) onAction(rec.actionType, rec.locationId);
                  else if (rec.type === 'AURORA') navigate('/map?filter=AURORA');
                }}
                className="text-xs font-bold bg-white text-navy-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {rec.actionText}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
