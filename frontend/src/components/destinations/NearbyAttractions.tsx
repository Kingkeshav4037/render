import { useEffect, useState } from 'react';
import { mapService } from '../../services/map/mapService';
import { Home, Utensils, Activity, MapPin } from 'lucide-react';

interface NearbyAttractionsProps {
  locationId: string;
  lat: number;
  lng: number;
}

export const NearbyAttractions = ({ locationId, lat, lng }: NearbyAttractionsProps) => {
  const [stays, setStays] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const [staysData, restaurantsData, activitiesData] = await Promise.all([
          mapService.getNearbyStays(lat, lng),
          mapService.getNearbyRestaurants(lat, lng),
          mapService.getNearbyActivities(locationId)
        ]);
        setStays(staysData);
        setRestaurants(restaurantsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch nearby attractions", error);
      } finally {
        setLoading(false);
      }
    };
    if (lat && lng) fetchNearby();
  }, [locationId, lat, lng]);

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const renderCard = (item: any, type: 'stay' | 'restaurant' | 'activity') => {
    const icon = type === 'stay' ? <Home size={18} /> : type === 'restaurant' ? <Utensils size={18} /> : <Activity size={18} />;
    const color = type === 'stay' ? 'text-blue-500' : type === 'restaurant' ? 'text-orange-500' : 'text-green-500';
    const bg = type === 'stay' ? 'bg-blue-50' : type === 'restaurant' ? 'bg-orange-50' : 'bg-green-50';

    return (
      <div key={item.id} className="min-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h4 className="font-bold text-navy-900 mb-1">{item.name}</h4>
        <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> Nearby</p>
      </div>
    );
  };

  return (
    <div className="space-y-10 mt-12">
      {stays.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-navy-900 mb-6">Nearby Places to Stay</h3>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {stays.map(stay => renderCard(stay, 'stay'))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-navy-900 mb-6">Local Dining</h3>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {restaurants.map(restaurant => renderCard(restaurant, 'restaurant'))}
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-navy-900 mb-6">Activities & Tours</h3>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {activities.map(activity => renderCard(activity, 'activity'))}
          </div>
        </section>
      )}
    </div>
  );
};
