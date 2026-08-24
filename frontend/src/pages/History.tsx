import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocations } from '../hooks/useLocations';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { PageHeader } from '../components/ui/PageHeader';

const getPlaceholderImage = (name: string) => {
  const genericImages = [
    '/images/fjords_1786935800026.jpg', '/images/trolltunga_1786936111320.jpg', 
    '/images/ryten_1786936427556.jpg', '/images/besseggen_1786936349992.jpg',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % genericImages.length;
  return genericImages[index];
};

export const History = () => {
  // Fetch historical locations (museums and landmarks)
  const { data: fetchedDestinations, isLoading: loading, error } = useLocations({
    category: ['MUSEUM', 'LANDMARK']
  });
  
  const destinations = fetchedDestinations || [];

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      
      {/* Header */}
      <PageHeader
        title="Norwegian History & Heritage"
        description="Step back in time to the era of Vikings, explore medieval stave churches, and uncover the rich cultural tapestry of Norway."
        breadcrumb="History"
        backgroundImage="/images/besseggen_1786936349992.jpg"
      >
        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/70">
            <Clock className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">10,000 Years of Heritage</span>
          </div>
        </div>
      </PageHeader>

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
          {(data) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {destinations.map((dest: any, idx: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={dest.id} 
                className="bg-midnight border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col group cursor-pointer relative h-[500px]"
              >
                <Link to={`/explore/${dest.slug}`} className="absolute inset-0 z-10" />
                
                <div className="h-2/3 overflow-hidden relative bg-black">
                  <OptimizedImage
                    src={dest.hero_image_url || getPlaceholderImage(dest.name)}
                    alt={dest.name}
                    fallbackSrc="/images/fjords_1786935800026.jpg"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-6 left-6 bg-deep-night/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10">
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
                  <p className="font-sans text-sm text-snow/60 line-clamp-2 leading-relaxed flex-grow">{dest.description}</p>
                  
                  <div className="flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-arctic-gold group/btn mt-auto">
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
