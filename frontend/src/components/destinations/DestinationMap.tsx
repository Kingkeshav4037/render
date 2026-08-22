import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DestinationMapProps {
  lat: number;
  lng: number;
  name: string;
}

export const DestinationMap = ({ lat, lng, name }: DestinationMapProps) => {
  if (!lat || !lng) return null;

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
      <MapContainer 
        center={[lat, lng]} 
        zoom={10} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <span className="font-bold">{name}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
