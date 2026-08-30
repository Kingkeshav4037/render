import React, { useEffect, useState } from 'react';
import { MapMarker } from '../../services/map/mapService';
import { useCart } from '../../store/useCartStore';
import { weatherService, WeatherData } from '../../services/live/weatherService';
import { auroraService, AuroraData } from '../../services/live/auroraService';
import { OptimizedImage } from '../shared/OptimizedImage';

import { toast } from 'sonner';
import { useRequireAuth } from '../../hooks/useRequireAuth';

interface LocationCardProps {
  marker: MapMarker;
  onClose: () => void;
  onRouteHere?: (marker: MapMarker) => void;
  isAuroraMode?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ marker, onClose, onRouteHere, isAuroraMode }) => {
  const { addItem } = useCart();
  const { requireAuth } = useRequireAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aurora, setAurora] = useState<AuroraData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      setLoadingWeather(true);
      const w = await weatherService.getWeather(marker.latitude, marker.longitude);
      
      let a = null;
      if (isAuroraMode) {
        a = await auroraService.getAuroraForecast(marker.latitude, marker.longitude);
      }

      if (mounted) {
        setWeather(w);
        setAurora(a);
        setLoadingWeather(false);
      }
    };
    fetchLive();
    return () => { mounted = false; };
  }, [marker.latitude, marker.longitude, isAuroraMode]);

  const handleAddToCart = () => {
    requireAuth(() => {
      addItem({
        item_type: 'ACTIVITY',
        item_id: marker.location_id,
        name: marker.name,
        unit_price: marker.base_price_nok || 0,
        quantity: 1,
      });
      toast.success(`${marker.name} added to cart!`);
    }, { message: 'Sign in to book locations and activities.' });
  };

  return (
    <div className="bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-80 relative flex flex-col font-sans">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 z-10"
      >
        ×
      </button>

      <div className="w-full h-40 relative overflow-hidden">
        <OptimizedImage 
          src={marker.image_url} 
          alt={marker.name} 
          category="landscape"
          className="w-full h-full object-cover opacity-90" 
          containerClassName="w-full h-full"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
             <span className="text-xs font-bold uppercase tracking-wider text-aurora-green mb-1 block">
               {marker.subcategory?.replace('_', ' ') || marker.category}
             </span>
             <h3 className="text-white font-bold text-lg leading-tight">{marker.name}</h3>
          </div>
          {marker.average_rating && (
            <div className="flex items-center text-yellow-400 text-sm font-medium shrink-0 ml-2 bg-yellow-400/10 px-2 py-1 rounded-lg">
              <span className="mr-1">★</span> {marker.average_rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Live Data Widgets */}
        <div className="my-3 space-y-2">
          {loadingWeather ? (
             <div className="animate-pulse bg-white/5 h-12 rounded-lg flex items-center px-4">
               <div className="w-4 h-4 rounded-full bg-white/20 mr-2"></div>
               <div className="h-3 bg-white/10 rounded w-1/2"></div>
             </div>
          ) : weather ? (
             <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <div className="text-white font-bold text-base flex items-center gap-1">
                    {weather.temperature}°C
                  </div>
                  <div className="text-gray-400 text-xs">
                    Feels {weather.feelsLike}°C
                  </div>
                </div>
                
                <div className="flex flex-col items-end text-xs text-gray-400">
                   <span className="text-sm font-bold text-gray-500">{marker.subcategory?.replace('_', ' ') || marker.category}</span>
                   {weather.precipitation > 0 ? (
                     <div className="text-blue-300">Rain: {weather.precipitation}mm</div>
                   ) : (
                     <div>Wind: {weather.windSpeed} m/s</div>
                   )}
                </div>
             </div>
          ) : null}

          {isAuroraMode && aurora && (
             <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-purple-300 font-bold text-sm flex items-center gap-1">🌌 Aurora Score</span>
                 <span className="text-white font-bold">{aurora.score}%</span>
               </div>
               <div className="text-xs text-gray-400 mt-1">{aurora.recommendation}</div>
             </div>
          )}
        </div>

        {/* Recommendation Engine (Basic) */}
        {!isAuroraMode && weather && marker.subcategory === 'ACTIVITY' && (
          <div className="text-xs bg-white/5 p-2 rounded-lg text-gray-300 mb-4 border-l-2 border-aurora-green">
            {weatherService.getSuitabilityScore(weather, 'HIKING') > 80 
              ? "✨ Great conditions for this activity today!" 
              : "⚠ Weather might not be ideal for outdoor activities."}
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {marker.base_price_nok ? (
              <div className="text-white font-medium">
                NOK {marker.base_price_nok}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Price unavailable</div>
            )}
          </div>

          <div className="flex space-x-2 w-full">
            {onRouteHere && (
              <button 
                onClick={() => onRouteHere(marker)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Route Here
              </button>
            )}
            {(marker.subcategory === 'HOTEL' || marker.subcategory === 'ACTIVITY' || marker.subcategory === 'CABIN' || marker.base_price_nok) && (
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
