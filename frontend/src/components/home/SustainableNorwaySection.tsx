import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { OptimizedImage } from '../shared/OptimizedImage';

export const SustainableNorwaySection = () => {
  return (
    <section className="py-24 bg-emerald-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-40">
        <OptimizedImage 
          src="/images/infra_windfarm.jpg" 
          alt="Wind farm in Norway" 
          category="infra"
          className="w-full h-full object-cover mix-blend-overlay"
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/90 to-transparent pointer-events-none"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/80 rounded-full text-emerald-300 font-bold text-sm mb-8 backdrop-blur-md border border-emerald-500/30">
              <Leaf className="w-4 h-4" /> Green Future
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Experience the world's most sustainable destination.
            </h2>
            <p className="text-lg text-emerald-100 mb-8 leading-relaxed opacity-90">
              From electric ferries gliding silently through UNESCO fjords to eco-certified hotels and renewable energy powering entire cities. Discover how Norway is leading the green revolution.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="border-l-2 border-emerald-500 pl-4">
                <div className="text-3xl font-black text-white mb-1">98%</div>
                <div className="text-sm text-emerald-200">Renewable Energy</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4">
                <div className="text-3xl font-black text-white mb-1">#1</div>
                <div className="text-sm text-emerald-200">EV Adoption Globally</div>
              </div>
            </div>
            
            <Link 
              to="/impact" 
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              See Our Impact <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
