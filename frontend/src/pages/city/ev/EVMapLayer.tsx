import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRealtimeStore } from '../../../store/useRealtimeStore';
import { EVStatusBadge } from './EVStatusBadge';

// Helper to create an icon based on status
const createEVIcon = (status: string) => {
  const color = status === 'AVAILABLE' ? 'bg-green-500' :
                status === 'CHARGING' || status === 'OCCUPIED' ? 'bg-blue-500' :
                status === 'MAINTENANCE' ? 'bg-orange-500' : 'bg-gray-500';
                
  return L.divIcon({
    className: 'custom-ev-icon',
    html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg ${color}">⚡</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const EVMapLayer = ({ bounds }: { bounds: L.LatLngBounds | null }) => {
  const evChargersMap = useRealtimeStore((state: any) => state.evChargers);
  const evChargers = Object.values(evChargersMap);

  // Filter markers to only render what's in the current viewport bounds
  const visibleChargers = bounds 
    ? evChargers.filter((charger: any) => bounds.contains([charger.latitude, charger.longitude]))
    : [];

  return (
    <>
      {visibleChargers.map((charger: any) => (
        <Marker 
          key={charger.device_id}
          position={[charger.latitude, charger.longitude]}
          icon={createEVIcon(charger.status)}
        >
          <Popup className="rounded-xl overflow-hidden">
            <div className="p-1">
              <h3 className="font-bold text-navy-900 mb-1">{charger.station_name}</h3>
              <p className="text-xs text-gray-500 mb-2">{charger.address}</p>
              
              <div className="flex justify-between items-center mb-3">
                <EVStatusBadge status={charger.status} />
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                  {charger.current_power_kw} / {charger.max_power_kw} kW
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-400">Price</div>
                  <div className="font-bold">{charger.price_per_kwh} NOK/kWh</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-400">Available</div>
                  <div className="font-bold">{charger.availability} ports</div>
                </div>
              </div>
              
              <button className="w-full bg-navy-900 text-white text-xs font-bold py-2 rounded hover:bg-navy-800 transition-colors">
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
