import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRealtimeStore } from '../../../store/useRealtimeStore';

const createFerryIcon = (status: string) => {
  const color = status === 'IN_TRANSIT' ? 'bg-blue-500' :
                status === 'DOCKED' ? 'bg-green-500' :
                status === 'DELAYED' ? 'bg-orange-500' : 'bg-gray-500';
                
  return L.divIcon({
    className: 'custom-ferry-icon',
    html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg ${color}">🚢</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const FerryMapLayer = ({ bounds }: { bounds: L.LatLngBounds | null }) => {
  const ferriesMap = useRealtimeStore((state: any) => state.ferries);
  const ferries = Object.values(ferriesMap);

  // Filter ferries to only render what's in the current viewport bounds
  const visibleFerries = bounds
    ? ferries.filter((ferry: any) => bounds.contains([ferry.latitude, ferry.longitude]))
    : [];

  return (
    <>
      {visibleFerries.map((ferry: any) => (
        <Marker 
          key={ferry.device_id}
          position={[ferry.latitude, ferry.longitude]}
          icon={createFerryIcon(ferry.status)}
        >
          <Popup className="rounded-xl overflow-hidden">
            <div className="p-1 min-w-[200px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-navy-900">{ferry.name}</h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${ferry.status === 'DELAYED' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  {ferry.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{ferry.operator} • Route {ferry.route_id}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-400">Speed</div>
                  <div className="font-bold">{ferry.speed} knots</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-400">Battery</div>
                  <div className="font-bold">{Math.round((ferry.current_battery / ferry.battery_capacity) * 100)}%</div>
                </div>
              </div>
              
              {ferry.eta && (
                <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded mb-2 flex justify-between">
                  <span>ETA:</span>
                  <span className="font-bold">{new Date(ferry.eta).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
