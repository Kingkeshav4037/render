import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, Users, ArrowRight, Star, Flame, Ticket, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { dealService, Deal } from '../../services/dealService';
import { useCart } from '../../store/useCartStore';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
export const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dealService.getPublishedDeals();
      setDeals(data || []);
    } catch (err: any) {
      console.error('Failed to load deals:', err);
      setError(err?.message || 'Unable to retrieve travel packages at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);


  const categories = ['All', 'Flash Sales', 'Packages', 'Seasonal', 'Early Bird'];

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#78350F] pb-24 font-sans selection:bg-[#F59E0B]/30">
      <SEO 
        title="Curated Travel Deals & Packages | Norway SmartLife"
        description="Discover limited-time seasonal packages and exclusive discounts on Norway's most breathtaking fjord and mountain experiences."
      />
      {/* Amber Theme Hero */}
      <CinematicBackground 
        imageUrl="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80"
        gradient="dark"
        overlayOpacity={0.6}
        className="h-[60vh] flex items-center"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32">
          <div className="max-w-4xl text-white">
            <span className="text-[#FBBF24] font-sans text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 drop-shadow-md">
              <Flame className="w-4 h-4" /> Exclusive Offers
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6 drop-shadow-lg">Curated Travel Deals</h1>
            <p className="text-lg md:text-xl font-sans text-white/90 max-w-2xl mb-12 leading-relaxed drop-shadow-md">
              Discover limited-time packages and exclusive discounts on Norway's most breathtaking experiences.
            </p>

            {/* Smart Filter Bar (Amber) */}
            <div className="bg-white/95 backdrop-blur-2xl border border-[#F59E0B]/30 p-2 flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl rounded-sm">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-[#FEF3C7] hover:bg-[#FDE68A] transition-colors cursor-text group text-[#78350F]">
                <Tag className="w-5 h-5 text-[#D97706] shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] uppercase tracking-widest text-[#92400E] font-bold">Promo Code</span>
                  <input type="text" placeholder="Enter code..." className="bg-transparent text-sm outline-none placeholder:text-[#B45309] w-full font-medium" />
                </div>
              </div>
              <button className="h-auto py-4 px-10 bg-[#D97706] text-white font-bold hover:bg-[#B45309] transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0 rounded-sm">
                Apply
              </button>
            </div>
          </div>
        </div>
      </CinematicBackground>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-4 border-b border-[#F59E0B]/20 mb-12 pb-6 bg-[#FFFBEB]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-sm border ${
                activeCategory === cat 
                  ? 'bg-[#D97706] border-[#D97706] text-white shadow-md' 
                  : 'bg-white border-[#FDE68A] text-[#92400E] hover:bg-[#FEF3C7] hover:text-[#78350F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-display font-semibold mb-2 text-[#78350F]">Current Offers</h2>
            <p className="font-sans text-[#92400E]">Don't miss out on these seasonal discounts.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-sm h-[400px] animate-pulse border border-[#FDE68A] shadow-sm"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-12 text-center max-w-xl mx-auto shadow-sm my-12">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#78350F] mb-2">Failed to Load Deals</h3>
            <p className="text-sm text-[#92400E] mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchDeals}
              className="px-6 py-2.5 bg-[#D97706] text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#B45309] transition-all shadow-md cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#FDE68A] p-12 text-center max-w-xl mx-auto shadow-sm my-12">
            <div className="w-14 h-14 bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#78350F] mb-2">No Active Deals Found</h3>
            <p className="text-sm text-[#92400E] mb-6 leading-relaxed">
              We currently don't have promotional offers matching "{activeCategory}". Check back soon for seasonal discounts!
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-6 py-2.5 bg-[#D97706] text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#B45309] transition-all shadow-md cursor-pointer"
            >
              Show All Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {deals.map((deal, idx) => (
              <motion.div 
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl border border-[#FDE68A] group flex flex-col h-full transition-shadow relative"
              >
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage 
                    src={deal.image_url} 
                    alt={deal.name} 
                    category="landscape"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#78350F]/80 to-transparent pointer-events-none"></div>
                  
                  {deal.discount_percentage && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-md flex items-center gap-1 rounded-sm z-10">
                      <Percent className="w-3 h-3" /> {deal.discount_percentage}% OFF
                    </div>
                  )}
                  {deal.featured && (
                    <div className="absolute top-4 right-4 bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-md flex items-center gap-1 rounded-sm z-10">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-2xl font-display font-bold text-white mb-1 line-clamp-1 group-hover:text-[#FBBF24] transition-colors">{deal.name}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col bg-white">
                  <p className="text-[#92400E] text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">{deal.description}</p>
                  
                  {deal.valid_until && (
                    <div className="flex items-center gap-1.5 text-xs text-[#B45309] font-medium mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid until {new Date(deal.valid_until).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-[#FEF3C7] flex items-end justify-between">
                    <div>
                      {deal.original_price > deal.price && (
                        <span className="text-xs text-[#B45309] line-through block font-bold mb-1">NOK {deal.original_price.toLocaleString()}</span>
                      )}
                      <span className="text-3xl font-display font-black text-[#78350F]">NOK {deal.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => {
                        addItem({
                          item_type: 'DEAL',
                          item_id: deal.id,
                          name: deal.name,
                          unit_price: deal.price,
                          quantity: 1,
                          image: deal.image_url
                        });
                        toast.success(`${deal.name} added to your selection!`);
                      }}
                      className="bg-[#D97706] text-white p-4 rounded-sm hover:bg-[#B45309] hover:shadow-lg transition-all hover:-translate-y-1 active:translate-y-0"
                      title="Add to Cart"
                    >
                      <Ticket size={24} />
                    </button>
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

export default Deals;
