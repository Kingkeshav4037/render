import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';

export const Guides = () => {
  const articles = [
    {
      id: 'g1',
      title: 'The Ultimate Guide to Chasing the Northern Lights',
      category: 'Aurora Borealis',
      author: 'Lars O.',
      readTime: '8 min read',
      image: '/images/northern_lights.jpg',
      route: '/aurora',
      excerpt: 'Everything you need to know about when, where, and how to spot the elusive Aurora Borealis in Northern Norway.'
    },
    {
      id: 'g2',
      title: 'Hiking Preikestolen: What to Know Before You Go',
      category: 'Hiking & Adventure',
      author: 'Ingrid M.',
      readTime: '6 min read',
      image: '/images/preikestolen_1786936002797.jpg',
      route: '/trails/tr-001',
      excerpt: 'Prepare for the iconic hike to Pulpit Rock with our comprehensive guide covering trails, gear, and safety tips.'
    },
    {
      id: 'g3',
      title: 'A Culinary Journey Through Bergen',
      category: 'Food & Culture',
      author: 'Henrik V.',
      readTime: '5 min read',
      image: '/images/food_salmon_1787013684123.jpg',
      route: '/food',
      excerpt: 'Discover the rich seafood traditions and modern Nordic cuisine hidden within the historic streets of Bergen.'
    },
    {
      id: 'g4',
      title: 'Navigating the Norwegian Fjords by Ferry',
      category: 'Transportation',
      author: 'Sofie H.',
      readTime: '7 min read',
      image: '/images/fjords.jpg',
      route: '/mobility/ferry',
      excerpt: 'Tips and tricks for booking and traveling on Norway’s extensive network of ferries and express boats.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <SEO 
        title="Travel Guides & Expert Tips | Norway SmartLife"
        description="Expert advice, local secrets, and comprehensive guides to help you plan the perfect Norwegian journey."
      />
      {/* Hero Section */}
      <div className="bg-navy-900 text-white pt-32 pb-24 px-4 md:px-12 relative overflow-hidden mb-12 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-[url('/images/kjeragbolten_1786936275605.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto z-10 text-center">
          <BookOpen className="mx-auto text-aurora-green mb-6" size={56} />
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Travel Guides</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Expert advice, local secrets, and comprehensive guides to help you plan the perfect Norwegian journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 group flex flex-col sm:flex-row transition-all relative"
            >
              <Link to={article.route} className="absolute inset-0 z-20" aria-label={article.title} />
              
              <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden shrink-0">
                <OptimizedImage 
                  src={article.image} 
                  alt={article.title} 
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  containerClassName="w-full h-full"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-navy-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-md">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col justify-center flex-1">
                <h3 className="text-2xl font-bold text-navy-900 mb-3 leading-tight group-hover:text-aurora-green transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><User size={14} /> {article.author}</span>
                    <span className="flex items-center gap-1"><Compass size={14} /> {article.readTime}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-navy-900 group-hover:bg-aurora-green group-hover:text-navy-900 transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
