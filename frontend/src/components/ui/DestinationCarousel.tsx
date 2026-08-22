import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  { id: 'tromso', name: 'Tromsø', region: 'Northern Norway', image: '/images/northern_lights.jpg', color: 'from-purple-900/80 to-navy-900/90' },
  { id: 'lofoten', name: 'Lofoten', region: 'Nordland', image: '/images/ryten.jpg', color: 'from-blue-900/80 to-navy-900/90' },
  { id: 'geiranger', name: 'Geirangerfjord', region: 'Møre og Romsdal', image: '/images/fjords.jpg', color: 'from-emerald-900/80 to-navy-900/90' },
  { id: 'oslo', name: 'Oslo', region: 'Eastern Norway', image: '/images/login_background.jpg', color: 'from-orange-900/80 to-navy-900/90' },
];

export const DestinationCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full py-10">
      <div className="flex items-end justify-between mb-8 px-4 md:px-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-navy-900 tracking-tight">Trending Destinations</h2>
          <p className="text-gray-500 mt-2 text-lg">Discover the most sought-after locations in Norway.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={scrollLeft} className="p-4 rounded-full border border-gray-200 bg-white text-navy-900 hover:bg-gray-50 hover:border-aurora-green transition-colors group shadow-sm hover:shadow-md">
            <ChevronLeft size={24} className="group-hover:text-aurora-green transition-colors" />
          </button>
          <button onClick={scrollRight} className="p-4 rounded-full border border-gray-200 bg-white text-navy-900 hover:bg-gray-50 hover:border-aurora-green transition-colors group shadow-sm hover:shadow-md">
            <ChevronRight size={24} className="group-hover:text-aurora-green transition-colors" />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 md:px-12 pb-10 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="snap-start shrink-0 w-[85vw] sm:w-[400px] md:w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden relative group cursor-pointer"
          >
            <Link to={`/explore?q=${dest.name}`} className="absolute inset-0 z-20"></Link>
            
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${dest.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 text-aurora-green mb-3 font-semibold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <MapPin size={16} />
                  {dest.region}
                </div>
                <h3 className="text-4xl font-black text-white mb-2">{dest.name}</h3>
                <div className="h-1 w-12 bg-aurora-green rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
