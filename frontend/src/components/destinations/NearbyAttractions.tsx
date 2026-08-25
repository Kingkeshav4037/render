import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mapService } from '../../services/map/mapService';
import { Home, Utensils, Activity, MapPin, ArrowRight } from 'lucide-react';
import { OptimizedImage } from '../shared/OptimizedImage';

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
    let isMounted = true;
    const fetchNearby = async () => {
      try {
        const [staysData, restaurantsData, activitiesData] = await Promise.all([
          mapService.getNearbyStays(lat, lng),
          mapService.getNearbyRestaurants(lat, lng),
          mapService.getNearbyActivities(locationId)
        ]);
        if (isMounted) {
          setStays(staysData || []);
          setRestaurants(restaurantsData || []);
          setActivities(activitiesData || []);
        }
      } catch (error) {
        console.error("Failed to fetch nearby attractions", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (lat && lng) fetchNearby();
    return () => { isMounted = false; };
  }, [locationId, lat, lng]);

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-arctic-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasAnyContent = stays.length > 0 || restaurants.length > 0 || activities.length > 0;
  if (!hasAnyContent) return null;

  const renderCard = (item: any, type: 'stay' | 'restaurant' | 'activity') => {
    const linkUrl = type === 'stay' 
      ? `/stay/${item.id}` 
      : type === 'restaurant' 
      ? `/food/${item.id}` 
      : `/activities/${item.id}`;

    const icon = type === 'stay' ? <Home size={16} /> : type === 'restaurant' ? <Utensils size={16} /> : <Activity size={16} />;
    const badgeColor = type === 'stay' ? 'bg-fjord-teal/20 text-fjord-teal' : type === 'restaurant' ? 'bg-arctic-gold/20 text-arctic-gold' : 'bg-aurora-green/20 text-aurora-green';
    const imageSrc = item.image_url || (item.images && item.images[0]) || '/images/hotel_juvet_1787013813000.jpg';

    return (
      <Link 
        key={item.id} 
        to={linkUrl}
        className="min-w-[280px] max-w-[320px] bg-midnight border border-white/10 hover:border-arctic-gold/50 rounded-xl overflow-hidden transition-all duration-300 group flex flex-col"
      >
        <div className="h-36 w-full relative overflow-hidden bg-black/40">
          <OptimizedImage
            src={imageSrc}
            alt={item.name}
            category={type === 'stay' ? 'stay' : 'activity'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            containerClassName="w-full h-full"
          />
          <div className={`absolute top-3 left-3 ${badgeColor} backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5`}>
            {icon}
            <span>{type}</span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-bold text-snow text-base mb-1 line-clamp-1 group-hover:text-arctic-gold transition-colors">{item.name}</h4>
          <p className="text-xs text-snow/60 flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-arctic-gold" /> 
            {item.city || item.region || 'Nearby Destination'}
          </p>
          <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-arctic-gold">
            <span>Explore</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-12 mt-12 pt-8 border-t border-white/10">
      {stays.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-display text-snow">Nearby Places to Stay</h3>
            <Link to="/stay" className="text-xs font-bold uppercase tracking-widest text-arctic-gold hover:underline">
              View All Stays
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin">
            {stays.map(stay => renderCard(stay, 'stay'))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-display text-snow">Local Dining & Cuisine</h3>
            <Link to="/food" className="text-xs font-bold uppercase tracking-widest text-arctic-gold hover:underline">
              View Food Hub
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin">
            {restaurants.map(restaurant => renderCard(restaurant, 'restaurant'))}
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-display text-snow">Experiences & Activities</h3>
            <Link to="/activities" className="text-xs font-bold uppercase tracking-widest text-arctic-gold hover:underline">
              View All Activities
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin">
            {activities.map(activity => renderCard(activity, 'activity'))}
          </div>
        </section>
      )}
    </div>
  );
};

