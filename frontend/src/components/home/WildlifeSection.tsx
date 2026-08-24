import { motion } from 'framer-motion';
import { HomeAnimal } from '../../types/home';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../shared/OptimizedImage';

interface WildlifeSectionProps {
  wildlife: HomeAnimal[];
}

export const WildlifeSection = ({ wildlife }: WildlifeSectionProps) => {
  if (!wildlife || wildlife.length === 0) return null;

  return (
    <section className="py-24 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <Leaf size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Arctic Fauna</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Native Wildlife</h2>
            <p className="text-gray-400 text-lg">
              Encounter majestic creatures roaming freely across Norway's national parks, fjords, and arctic tundra.
            </p>
          </div>
          <Link to="/wildlife" className="mt-6 md:mt-0 text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2">
            Explore All Species &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {wildlife.map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex flex-col sm:flex-row hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-full sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                <OptimizedImage 
                  src={animal.image} 
                  alt={animal.name}
                  category="wildlife"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">{animal.category}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{animal.name}</h3>
                <p className="text-gray-400 italic text-sm mb-4">{animal.scientific_name}</p>
                <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                  {animal.short_description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Habitat</p>
                    <p className="text-sm font-bold truncate">{animal.habitat}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Best Season</p>
                    <p className="text-sm font-bold truncate">{animal.best_season}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
