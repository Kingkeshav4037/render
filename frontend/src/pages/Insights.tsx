import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Sparkles, MapPin, Info } from 'lucide-react';
import { KpGauge } from '../components/aurora/KpGauge';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const Insights = () => {
  const tromsoPosition: [number, number] = [69.6406, 18.9882];
  
  // Mock spots
  const viewingSpots = [
    { id: 1, name: 'Tromsø Fjellheisen', lat: 69.6406, lng: 18.9882, lp: 4 },
    { id: 2, name: 'Lofoten Islands', lat: 68.2106, lng: 13.5008, lp: 1 },
    { id: 3, name: 'Senja', lat: 69.4975, lng: 17.3323, lp: 1 },
    { id: 4, name: 'Alta', lat: 69.9688, lng: 23.2716, lp: 2 }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 flex justify-center items-center gap-4">
          <Sparkles className="w-10 h-10 text-aurora-green" />
          Aurora Intelligence
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Track the Northern Lights in real-time, view Kp forecasts, and find the darkest spots in Norway.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forecasts */}
        <div className="space-y-8">
          <div className="bg-navy-900 rounded-xl p-8 shadow-xl text-center">
            <h2 className="text-white font-bold text-xl mb-6">Current Activity</h2>
            <KpGauge value={5.2} />
            <p className="text-gray-400 text-sm mt-6 leading-relaxed">
              High chance of visible aurora in Northern Norway. The Kp index is high enough to be seen in Trøndelag and possibly further south if skies are clear.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="font-bold text-navy-900 mb-4 border-b pb-2">3-Day Forecast</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tonight</span>
                <span className="text-aurora-green font-bold">Kp 5.2 (High)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tomorrow</span>
                <span className="text-yellow-500 font-bold">Kp 4.0 (Active)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Wednesday</span>
                <span className="text-gray-500 font-bold">Kp 2.3 (Low)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map & Spots */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 relative">
            <div className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-lg shadow-lg text-sm border border-gray-200">
              <h4 className="font-bold text-navy-900 mb-2">Map Legend</h4>
              <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-blue-500"/> Optimal Viewing Spot</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500/50 rounded-full"></div> Cloud Cover Mock</div>
            </div>

            <div className="h-[500px] w-full rounded-lg overflow-hidden z-0">
              <MapContainer center={tromsoPosition} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Cloud Cover Mock */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_only/{z}/{x}/{y}{r}.png"
                  opacity={0.3} // Simulating cloud density overlay
                />

                {viewingSpots.map(spot => (
                  <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong className="block text-navy-900">{spot.name}</strong>
                        <span className="text-xs text-gray-500 block">Light Pollution: Level {spot.lp}/10</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-blue-800">Pro Tip for Aurora Hunting</h3>
              <p className="text-blue-700 mt-1">Even with a high Kp index, you need clear skies to see the Northern Lights. Check the cloud cover simulator on the map to find gaps in the clouds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
