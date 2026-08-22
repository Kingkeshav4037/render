import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';

export const FinalCTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-900 border-t border-white/10">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aurora-green/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/5 backdrop-blur-md text-aurora-green rounded-3xl mb-8 border border-white/10">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Your Norwegian journey begins here.
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers using Norway SmartLife to plan the perfect trip, book experiences, and discover the magic of the North.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-aurora-green hover:bg-emerald-400 text-navy-900 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] flex items-center justify-center gap-2"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/plan" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              Try AI Trip Planner
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
