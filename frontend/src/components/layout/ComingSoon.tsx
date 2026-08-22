import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full"
      >
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={40} />
        </div>
        <h1 className="text-3xl font-black text-navy-900 mb-4">{title}</h1>
        <p className="text-gray-500 mb-8">
          We are actively building the ultimate digital representation of Norway. 
          This section is coming in a future V5 phase.
        </p>
        <Link to="/" className="inline-flex items-center justify-center bg-navy-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-navy-800 transition-colors">
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
};
