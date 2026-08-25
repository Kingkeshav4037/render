import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, ArrowRight, User, Search, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';

export const Guides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const articles = [
    {
      id: 'g1',
      title: 'The Ultimate Guide to Chasing the Northern Lights',
      category: 'Aurora Borealis',
      author: 'Lars O.',
      readTime: '8 min read',
      image: '/images/northern_lights_1786935879330.jpg',
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
      title: 'A Culinary Journey Through Bergen & Western Fjords',
      category: 'Food & Culture',
      author: 'Henrik V.',
      readTime: '5 min read',
      image: '/images/food_salmon_1787013684123.jpg',
      route: '/food',
      excerpt: 'Discover the rich seafood traditions and modern Nordic cuisine hidden within the historic streets of Bergen.'
    },
    {
      id: 'g4',
      title: 'Navigating the Norwegian Fjords by Silent Ferry',
      category: 'Transportation',
      author: 'Sofie H.',
      readTime: '7 min read',
      image: '/images/fjords_1786935800026.jpg',
      route: '/mobility/ferry',
      excerpt: 'Tips and tricks for booking and traveling on Norway’s extensive network of zero-emission electric ferries.'
    },
    {
      id: 'g5',
      title: 'Lofoten Islands Scenic Road Trip & Rorbu Stays',
      category: 'Hiking & Adventure',
      author: 'Eirik K.',
      readTime: '9 min read',
      image: '/images/lofoten_1787013505867.jpg',
      route: '/explore/lofoten',
      excerpt: 'Drive the dramatic E10 highway across archipelagic bridges, white sand beaches, and historic cod-drying racks.'
    },
    {
      id: 'g6',
      title: 'Responsible Arctic Exploration & Leave No Trace',
      category: 'Food & Culture',
      author: 'Astrid N.',
      readTime: '6 min read',
      image: '/images/besseggen_1786936349992.jpg',
      route: '/wildlife',
      excerpt: 'How to practice ethical wildlife observation and tread lightly across sensitive high-latitude tundra.'
    }
  ];

  const categories = ['All', 'Aurora Borealis', 'Hiking & Adventure', 'Food & Culture', 'Transportation'];

  const filteredArticles = articles.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = !searchTerm.trim() || 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

          {/* Search Bar */}
          <div className="w-full max-w-md mx-auto relative shadow-2xl">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. Aurora, Preikestolen, Ferry)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md text-navy-900 placeholder-gray-400 font-medium text-sm border-0 focus:ring-4 focus:ring-aurora-green/50 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
              className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider ml-2"
            >
              Clear
            </button>
          )}
        </div>
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm max-w-xl mx-auto my-8">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">No guides match your search</h3>
            <p className="text-gray-500 text-sm mb-6">Try searching for keywords like "Aurora", "Preikestolen", or "Ferry".</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="px-6 py-3 bg-navy-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-aurora-green hover:text-navy-900 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article, idx) => (
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
        )}
      </div>
    </div>
  );
};

export default Guides;
