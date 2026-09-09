import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom nature marker icons
const createNatureIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MARKERS = [
  { id: '1', lat: 60.133, lng: 6.74, type: 'Hiking', title: 'Trolltunga', color: '#65743A' }, // Moss
  { id: '2', lat: 61.272, lng: 8.817, type: 'Skiing', title: 'Jotunheimen', color: '#7DD3FC' }, // Glacier Blue
  { id: '3', lat: 68.234, lng: 14.56, type: 'Wildlife', title: 'Lofoten Safari', color: '#84A98C' }, // Nordic Sage
  { id: '4', lat: 59.983, lng: 6.643, type: 'Camping', title: 'Hardangervidda', color: '#B87333' }, // Copper
];

export const AdventureMap = () => {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
      <MapContainer 
        center={[62.0, 10.0]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#0B1120' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
          opacity={0.8}
        />
        {/* Dark overlay to match theme */}
        <div className="absolute inset-0 bg-pine-forest/20 pointer-events-none z-[400]" />
        
        {MARKERS.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={createNatureIcon(marker.color)}
          >
            <Popup className="nature-popup">
              <div className="p-1">
                <h3 className="font-bold text-lg font-display text-nordic-charcoal">{marker.title}</h3>
                <p className="text-sm text-gray-600">{marker.type}</p>
                <button className="mt-2 text-xs bg-pine-forest text-white px-3 py-1 rounded-full w-full">View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[400] bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col gap-3">
        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Map Layers</h4>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="w-3 h-3 rounded-full bg-moss" /> Hiking Trails
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="w-3 h-3 rounded-full bg-glacier-blue" /> Ski Resorts
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="w-3 h-3 rounded-full bg-nordic-sage" /> Wildlife
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="w-3 h-3 rounded-full bg-copper" /> Campsites
        </div>
      </div>
    </div>
  );
};
