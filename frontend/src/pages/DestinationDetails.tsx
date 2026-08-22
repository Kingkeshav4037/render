import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Leaf, Navigation, Activity, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { mapService } from '../services/map/mapService';
import type { Location, DestinationScore } from '../services/map/mapService';
import { DestinationMap } from '../components/destinations/DestinationMap';
import { DestinationWeather } from '../components/destinations/DestinationWeather';
import { DestinationGallery } from '../components/destinations/DestinationGallery';
import { NearbyAttractions } from '../components/destinations/NearbyAttractions';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ReviewSection } from '../components/common/ReviewSection';
import { openStreetMap } from '../lib/openStreetMap';

// Map database slugs/names to local images
const getPlaceholderImage = (name: string) => {
  const genericImages = [
    '/images/fjords.jpg', '/images/northern_lights.jpg', '/images/login_background.jpg',
    '/images/trolltunga.jpg', '/images/ryten.jpg', '/images/besseggen.jpg',
    '/images/kjeragbolten.jpg', '/images/preikestolen.jpg', '/images/juvet.jpg', '/images/lofoten.jpg'
  ];
  
  const map: Record<string, string> = {
    'Geirangerfjord': '/images/fjords.jpg',
    'TromsÃ¸': '/images/northern_lights.jpg',
    'Oslo': '/images/login_background.jpg',
    'Bergen': '/images/trolltunga.jpg',
    'Lofoten': '/images/lofoten.jpg',
    'Svalbard': '/images/besseggen.jpg',
    'TrÃ¸ndelag': '/images/kjeragbolten.jpg',
    'Southern Norway': '/images/preikestolen.jpg',
    'Fjord Norway': '/images/fjords.jpg',
    'Northern Norway': '/images/northern_lights.jpg',
    'Eastern Norway': '/images/login_background.jpg',
  };
  
  for (const key of Object.keys(map)) {
    if (name.includes(key)) return map[key];
  }
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % genericImages.length;
  return genericImages[index];
};

const fallbackDescriptions: Record<string, string> = {
  'Geirangerfjord': 'The Geirangerfjord is one of Norway\'s most spectacular natural wonders, famous for its deep blue waters, steep dramatic cliffs, and cascading waterfalls like the Seven Sisters. It is a UNESCO World Heritage Site and a pioneer in sustainable zero-emission ferry travel.',
  'TromsÃ¸': 'Known as the "Capital of the Arctic," TromsÃ¸ is globally renowned as the ultimate destination for experiencing the Northern Lights. It offers a vibrant cultural scene, arctic dining, and thrilling winter expeditions like dog sledding and whale watching.',
  'Oslo': 'Norway\'s capital seamlessly blends world-class modern architecture with deep historical roots. Situated between the Oslofjord and dense forests, Oslo is a global leader in green urban planning, boasting an entirely electric public transit system.',
  'Bergen': 'Surrounded by seven mountains and majestic fjords, Bergen is a picturesque coastal city. The iconic, colorful wooden houses of Bryggen wharf tell the story of its rich Hanseatic trading history.',
  'Lofoten': 'The Lofoten archipelago is famous for its dramatic scenery, featuring towering granite peaks rising directly from the ocean, sheltered bays, and traditional red fishing cabins (rorbuer).',
  'Svalbard': 'Located midway between continental Norway and the North Pole, Svalbard is an untamed Arctic wilderness. It is home to vast glaciers, polar bears, the Midnight Sun, and the Global Seed Vault.',
  'TrÃ¸ndelag': 'The historical heart of Norway, TrÃ¸ndelag is celebrated as the European Region of Gastronomy. It features incredible local farm-to-table cuisine, ancient pilgrimage routes, and the magnificent Nidaros Cathedral.',
  'Southern Norway': 'Affectionately known as the "Norwegian Riviera," this region is a summer paradise featuring a stunning coastline, charming white wooden towns, and beautiful archipelagos perfect for sailing and island hopping.'
};

export const DestinationDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [scores, setScores] = useState<DestinationScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const result = await mapService.getDestinationDetails(slug as string);
        if (result) {
          setLocation(result.location);
          setScores(result.scores);
        }
      } catch (error) {
        console.error("Failed to load details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Destination not found.</h1>
        <Link to="/explore" className="text-blue-600 mt-4 inline-block hover:underline">&larr; Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getPlaceholderImage(location.name)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link to="/explore" className="flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <FavoriteButton itemType="LOCATION" itemId={location.id} className="bg-black/20 text-white hover:bg-black/40 shadow-xl backdrop-blur-md" size={28} />
        </div>

        <div className="absolute bottom-12 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-aurora-green mb-3">
              <MapPin size={20} />
              <span className="font-bold tracking-widest uppercase">{location.type.replace('_', ' ')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{location.name}</h1>
            <div className="flex flex-wrap gap-4 items-center text-white/80">
              <span className="flex items-center gap-1.5"><Navigation size={16}/> {location.latitude?.toFixed(2) ?? 'N/A'}°N, {location.longitude?.toFixed(2) ?? 'N/A'}°E</span>
              <a
                href={openStreetMap.getDirectionsUrl({
                  destination: location.latitude && location.longitude 
                    ? { lat: location.latitude, lng: location.longitude } 
                    : location.name
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-md text-xs font-bold uppercase tracking-wider transition-all border border-white/20 shadow-sm"
              >
                <ExternalLink size={13} /> Open in OpenStreetMap
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <DestinationGallery 
          locationName={location.name}
          images={[
            getPlaceholderImage(location.name),
            getPlaceholderImage(location.name + '1'),
            getPlaceholderImage(location.name + '2'),
            getPlaceholderImage(location.name + '3')
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-navy-900 mb-6">About {location.name}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {location.description || fallbackDescriptions[location.name] || 'Experience the breathtaking beauty and rich culture of this incredible Norwegian destination. Explore dramatic landscapes, sustainable initiatives, and unforgettable local adventures.'}
              </p>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-navy-900">Location Map</h2>
                <a
                  href={openStreetMap.getDirectionsUrl({
                    destination: location.latitude && location.longitude 
                      ? { lat: location.latitude, lng: location.longitude } 
                      : location.name
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink size={13} /> Get Directions (OpenStreetMap)
                </a>
              </div>
              {location.latitude && location.longitude && (
                <DestinationMap lat={location.latitude} lng={location.longitude} name={location.name} />
              )}
            </section>

            {location.latitude && location.longitude && (
              <NearbyAttractions locationId={location.id} lat={location.latitude} lng={location.longitude} />
            )}
          </div>

          {/* AI Intelligence Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            {location.latitude && (
              <DestinationWeather name={location.name} lat={location.latitude} />
            )}

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-navy-900">AI Destination Score</h3>
                  <p className="text-sm text-gray-500">Live intelligence analysis</p>
                </div>
              </div>

              {scores ? (
                <div className="space-y-6">
                  {/* Composite Score */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-gray-600 font-medium">Composite Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-navy-900">{scores.composite_ai_score?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-400">/ 10</span>
                    </div>
                  </div>

                  {/* Individual Metrics */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Leaf size={16} /> Sustainability
                      </div>
                      <span className="font-bold text-navy-900">{scores.sustainability_score}/10</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star size={16} /> Aurora Probability
                      </div>
                      <span className="font-bold text-navy-900">{scores.aurora_score}/10</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Navigation size={16} /> Accessibility
                      </div>
                      <span className="font-bold text-navy-900">{scores.accessibility_score}/10</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/plan-trip')}
                    className="w-full mt-8 bg-navy-900 text-white font-bold py-4 rounded-xl hover:bg-arctic-700 transition-colors"
                  >
                    Add to Trip Planner
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">AI Intelligence scores are currently unavailable for this destination.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Review Section */}
        <div className="mt-12">
            <ReviewSection productType="LOCATION" productId={location.id} />
        </div>
      </div>
    </div>
  );
};
