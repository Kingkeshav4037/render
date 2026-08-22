import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const NorthernLightsSection = () => {
  const { data: forecasts, isLoading, error } = useQuery({
    queryKey: ['home', 'aurora'],
    queryFn: homeContentService.getNorthernLights,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-24 bg-navy-900 relative overflow-hidden border-b border-white/5">
      {/* Decorative Aurora Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-aurora-green/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      
      <Container className="relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-aurora-green" /> Northern Lights
            </h2>
            <p className="text-gray-400">Live aurora forecasts and top viewing locations</p>
          </div>
          <Link 
            to="/aurora" 
            className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-400 transition-colors"
          >
            Live Map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl bg-white/5" />
            ))
          ) : forecasts && forecasts.length > 0 ? (
            forecasts.map((forecast, index) => (
              <motion.div
                key={forecast.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl hover:border-aurora-green/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-aurora-green to-emerald-500 mb-1">
                      {forecast.probability_pct}%
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Probability</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-sm font-bold text-white">Kp {forecast.kp_index}</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <MapPin className="w-4 h-4 text-aurora-green" />
                    <span className="font-bold">{forecast.locations?.name || 'Northern Norway'}</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-6">{forecast.locations?.region || 'Arctic Circle'}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-navy-800/50 backdrop-blur-md rounded-3xl p-8 text-center border border-white/10">
              <p className="text-gray-400">No active high-probability forecasts right now. Check the complete map.</p>
            </div>
          )}
        </div>
        
        <Link 
          to="/aurora" 
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          Live Map <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const NorthernLightsSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Northern Lights Forecast">
    <NorthernLightsSection />
  </SectionErrorBoundary>
);
