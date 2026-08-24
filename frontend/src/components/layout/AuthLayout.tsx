import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  bgImage?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  bgImage = '/images/northern_lights.jpg'
}) => {
  return (
    <div className="min-h-screen flex bg-deep-night">
      {/* Left Panel: Nordic Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-900">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        {/* Subtle gradient overlay to ensure readability and add depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-night/90 via-navy-900/40 to-transparent" />
        
        <div className="relative z-10 w-full p-12 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Compass className="w-6 h-6 text-aurora-green shadow-aurora-green" />
            </div>
            <span className="text-xl font-bold tracking-wide text-snow">Norway SmartLife</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-lg"
          >
            <h1 className="text-4xl font-bold text-snow leading-tight mb-4 tracking-tight">
              Discover the true North.
            </h1>
            <p className="text-lg text-snow/80 leading-relaxed font-light">
              Experience sustainable travel, pristine fjords, and premium Scandinavian living, powered by real-time intelligence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <Compass className="w-7 h-7 text-aurora-green" />
            </div>
            <span className="text-2xl font-bold tracking-wide text-snow">Norway SmartLife</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-semibold text-snow tracking-tight mb-3"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-snow/60 text-sm font-medium"
            >
              {subtitle}
            </motion.p>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
};
