import React from 'react';
import { SmartAlert } from '../../../types/dashboard';
import { AlertTriangle, Info, Navigation, CloudLightning } from 'lucide-react';

interface Props {
  alerts: SmartAlert[];
}

export const SmartAlertsWidget: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-orange-500" />
        Smart Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border ${getSeverityStyle(alert.severity)} flex gap-3 items-start`}>
            <div className="mt-0.5">
              {getIcon(alert.type)}
            </div>
            <div>
              <p className="text-sm font-semibold mb-1 uppercase tracking-wider opacity-80">{alert.type} ALERT</p>
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getSeverityStyle(severity: string) {
  switch (severity) {
    case 'high':
    case 'critical': return 'bg-red-50 border-red-100 text-red-900';
    case 'medium': return 'bg-orange-50 border-orange-100 text-orange-900';
    default: return 'bg-blue-50 border-blue-100 text-blue-900';
  }
}

function getIcon(type: string) {
  switch (type) {
    case 'Weather': return <CloudLightning size={18} />;
    case 'Ferry': return <Navigation size={18} />;
    case 'Road': return <AlertTriangle size={18} />;
    default: return <Info size={18} />;
  }
}
