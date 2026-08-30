import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocations } from '../hooks/useLocations';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { PageHeader } from '../components/ui/PageHeader';
import { SEO } from '../components/shared/SEO';

const TIMELINE_ERAS = [
  {
    period: '8000 BCE – 500 CE',
    title: 'Prehistoric Rock Art & Hunters',
    description: 'Early maritime hunter-gatherers documented in UNESCO Alta Rock Carvings depicting reindeer and solar symbols.',
    locationSlug: 'alta'
  },
  {
    period: '793 – 1066 CE',
    title: 'The Viking Age',
    description: 'Seafaring Norsemen sailed longships across the Atlantic, establishing early trade hubs in Kaupang and Trondheim.',
    locationSlug: 'oslo'
  },
  {
    period: '1130 – 1350 CE',
    title: 'Medieval Stave Churches & Kings',
    description: 'Master timber architects constructed over 1,000 intricate stave churches like Urnes and Borgund, blending Christian and pagan dragon motifs.',
    locationSlug: 'sognefjord'
  },
  {
    period: '1360 – 1754 CE',
    title: 'Hanseatic Trade Era',
    description: 'Bergen’s iconic Bryggen wharf became the Nordic headquarters of the Hanseatic League, monopolizing dried stockfish exports.',
    locationSlug: 'bergen'
  },
  {
    period: '1888 – Present',
    title: 'Polar Exploration & Modern Era',
    description: 'Fridtjof Nansen and Roald Amundsen pioneered Arctic and Antarctic expeditions from Tromsø and Oslo.',
    locationSlug: 'tromso'
  }
];

const getHistoricalImage = (name: string, currentUrl?: string | null) => {
  const n = (name || '').toLowerCase();
  if (n.includes('viking') || n.includes('oseberg') || n.includes('gokstad') || n.includes('ship museum')) {
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=viking+longship+norway&w=1200';
  }
  if (n.includes('munch')) {
    return 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=edvard+munch+art+gallery&w=1200';
  }
  if (n.includes('fram') || n.includes('polar') || n.includes('amundsen') || n.includes('nansen')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=polar+exploration+ship+arctic&w=1200';
  }
  if (n.includes('stave') || n.includes('heddal') || n.includes('borgund') || n.includes('kirke')) {
    return 'https://images.unsplash.com/photo-1548625361-195feee1361c?q=stave+church+norway+heddal&w=1200';
  }
  if (n.includes('bryggen') || n.includes('hanseatic') || n.includes('bergen')) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=bryggen+bergen+norway&w=1200';
  }
  if (n.includes('nidaros') || n.includes('cathedral') || n.includes('trondheim')) {
    return 'https://images.unsplash.com/photo-1548625361-195feee1361c?q=nidaros+cathedral+trondheim+gothic&w=1200';
  }
  if (currentUrl && !currentUrl.includes('placeholder') && !currentUrl.includes('fjords_')) {
    return currentUrl;
  }
  return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=bryggen+bergen+norway&w=1200';
};

const getHistoricalDescription = (name: string, description?: string | null) => {
  const n = (name || '').toLowerCase();
  if (n.includes('viking ship')) {
    return 'Home to remarkably preserved 9th-century Viking longships (Oseberg, Gokstad, and Tune) unearthed from royal burial mounds, showcasing master woodcarvings and Nordic seafaring dominance.';
  }
  if (n.includes('munch')) {
    return 'Oslo’s landmark 13-story waterfront museum housing over 28,000 works by Edvard Munch, including legendary versions of The Scream, Madonna, and monumental Nordic expressionist paintings.';
  }
  if (n.includes('fram')) {
    return 'Celebrates Norway’s heroic polar exploration history, allowing visitors to step aboard the legendary wooden polar exploration ship Fram used by Fridtjof Nansen and Roald Amundsen.';
  }
  if (n.includes('stave') || n.includes('heddal')) {
    return 'Norway’s magnificent medieval wooden architectural treasure, built entirely from pine timber with triple-tiered roofs, intricate dragon carvings, and centuries-old runic inscriptions.';
  }
  if (n.includes('bryggen')) {
    return 'UNESCO World Heritage Hanseatic commercial wharf in Bergen, with iconic leaning colorful timber merchant houses dating back to the 14th century.';
  }
  if (description && !description.startsWith('Experience the unique beauty')) {
    return description;
  }
  return `Explore Norway’s deep cultural heritage, archaeology, and historical treasures at ${name}.`;
};

export const History = () => {
  const [selectedEra, setSelectedEra] = useState<number | null>(null);

  // Fetch historical locations (museums and landmarks)
  const { data: fetchedDestinations, isLoading: loading, error } = useLocations({
    category: ['MUSEUM', 'LANDMARK']
  });
  
  const destinations = fetchedDestinations || [];

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      <SEO 
        title="Norwegian History, Vikings & Heritage | Norway SmartLife"
        description="Step back in time to the era of Vikings, explore medieval stave churches, and uncover the rich cultural tapestry of Norway."
      />
      {/* Header */}
      <PageHeader
        title="Norwegian History & Heritage"
        description="Step back in time to the era of Vikings, explore medieval stave churches, and uncover the rich cultural tapestry of Norway."
        breadcrumb="History"
        backgroundImage="https://images.unsplash.com/photo-1548625361-195feee1361c?q=stave+church+norway+heddal&w=1600"
      >
        <div className="flex flex-wrap items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/70">
            <Clock className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">10,000 Years of Heritage</span>
          </div>
          <div className="flex items-center gap-2 text-snow/70">
            <Shield className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Viking Lore & Stave Churches</span>
          </div>
        </div>
      </PageHeader>

      {/* Structured Norway Through Time Timeline */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-2">Chronological Heritage</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-snow">Norway Through Time</h2>
          <p className="text-snow/60 text-sm max-w-2xl mt-2">
            Explore the formative eras that shaped Norwegian culture, naval architecture, and Arctic identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {TIMELINE_ERAS.map((era, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedEra(selectedEra === idx ? null : idx)}
              className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEra === idx 
                  ? 'bg-fjord-teal/20 border-arctic-gold shadow-lg' 
                  : 'bg-midnight border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <span className="text-xs font-mono font-bold text-arctic-gold block mb-2">{era.period}</span>
                <h3 className="font-display font-bold text-lg text-snow mb-2">{era.title}</h3>
                <p className="text-xs text-snow/70 leading-relaxed">{era.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-arctic-gold">
                <span>View Era</span>
                <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        
        <div className="mb-12 flex justify-between items-center border-b border-white/5 pb-6">
          <h2 className="text-xl font-display font-semibold text-snow">
            Historical Sites & Museums
          </h2>
          <span className="text-sm font-sans font-medium text-snow/60 uppercase tracking-widest">
            {loading ? 'Searching...' : `${destinations.length} Locations`}
          </span>
        </div>

        <AsyncStateWrapper
          isLoading={loading}
          error={error}
          data={destinations}
          emptyMessage="No historical sites found at this time."
          errorMessage="Unable to load historical sites. Please try again."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-midnight h-[500px] animate-pulse border border-white/5">
                  <div className="h-2/3 bg-white/5"></div>
                  <div className="p-8">
                    <div className="h-4 bg-white/10 w-1/4 mb-4"></div>
                    <div className="h-8 bg-white/10 w-3/4 mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          {() => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {destinations.map((dest: any, idx: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={dest.id} 
                className="bg-midnight border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col group cursor-pointer relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl"
              >
                <Link to={`/explore/${dest.slug}`} className="absolute inset-0 z-10" />
                
                <div className="h-2/3 overflow-hidden relative bg-black">
                  <OptimizedImage
                    src={getHistoricalImage(dest.name, dest.hero_image_url)}
                    alt={dest.name}
                    category="culture"
                    fallbackSrc="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-6 left-6 bg-deep-night/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10 rounded-md">
                    {dest.type?.replace(/_/g, ' ') || 'HISTORY'}
                  </div>
                  <FavoriteButton 
                    itemType="LOCATION" 
                    itemId={dest.id} 
                    className="absolute top-6 right-6 z-20 text-snow hover:text-nordic-red transition-colors" 
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow relative z-20">
                  <h4 className="font-display font-semibold text-2xl text-snow mb-3">{dest.name}</h4>
                  <p className="font-sans text-sm text-snow/70 line-clamp-3 leading-relaxed flex-grow">{getHistoricalDescription(dest.name, dest.description)}</p>
                  
                  <div className="flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-arctic-gold group/btn mt-auto pt-4 border-t border-white/5">
                    Explore History
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </AsyncStateWrapper>
      </div>
    </div>
  );
};

export default History;
