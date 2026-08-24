import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Leaf, Star, ArrowRight, Plus, Minus, Loader2, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items: cart, addItem, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [showCart, setShowCart] = useState(false);

  const [products, setProducts] = useState<Database['public']['Tables']['products']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*');
      
      if (dbError) throw dbError;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err?.message || 'Unable to retrieve marketplace products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  let filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Top Rated') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  
  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-deep-night min-h-screen text-snow font-sans">
      {/* Premium Header */}
      <CinematicBackground 
        imageUrl="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=1600"
        gradient="aurora"
        overlayOpacity={0.7}
        className="h-[60vh] flex items-end pb-12 mb-12"
        animate={false}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
                <Leaf className="w-4 h-4 text-arctic-gold" />
                <span className="text-xs font-bold tracking-widest uppercase text-snow/90">Eco-Marketplace</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-display font-semibold mb-4 text-snow">
                Smart Products for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-arctic-gold to-snow">Green Life</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-snow/70 max-w-2xl font-sans">
                Shop curated, sustainable Norwegian tech and gear. Every purchase offsets your carbon footprint.
              </motion.p>
            </div>
            
            <div className="w-full md:w-96 flex flex-col gap-4">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-snow/5 backdrop-blur-xl border border-snow/10 text-snow rounded-none py-5 px-6 outline-none focus:bg-snow/10 focus:border-arctic-gold/50 transition-all placeholder:text-snow/30 font-sans text-base"
              />
            </div>
          </div>
        </div>
      </CinematicBackground>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-10">
        
        {/* Navigation & Cart Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-midnight/80 backdrop-blur-md p-4 rounded-none border border-white/5 mb-12 gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 sm:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {['All', 'Smart Home', 'EV Accessories', 'Outdoor Gear', 'Lifestyle'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 text-sm font-sans font-bold uppercase tracking-widest transition-all border ${filter === cat ? 'bg-arctic-gold text-deep-night border-arctic-gold' : 'bg-transparent text-snow/70 border-white/10 hover:border-arctic-gold hover:text-snow'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-deep-night border border-white/10 text-snow text-sm uppercase tracking-widest px-4 py-2.5 outline-none font-sans font-bold hover:border-arctic-gold transition-colors cursor-pointer"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
            <button 
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 bg-arctic-gold text-deep-night px-6 py-2.5 font-sans font-bold uppercase tracking-widest hover:bg-snow hover:text-deep-night transition-colors shadow-sm w-full sm:w-auto justify-center relative"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-nordic-red text-white text-[10px] font-black h-5 w-5 flex items-center justify-center border border-deep-night">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 pb-24">
          
          {/* Product Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showCart ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-8 flex-grow transition-all duration-300`}>
            {loading ? (
              // Skeleton Loading Cards
              [1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="bg-midnight border border-white/5 overflow-hidden flex flex-col h-[420px] animate-pulse">
                  <div className="h-64 bg-white/5" />
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="h-3 bg-white/10 w-20 mb-3" />
                    <div className="h-6 bg-white/10 w-3/4 mb-3" />
                    <div className="h-4 bg-white/5 w-1/2 mb-6" />
                    <div className="mt-auto flex justify-between items-center">
                      <div className="h-6 bg-white/10 w-1/3" />
                      <div className="h-10 w-10 bg-white/10" />
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full py-16 px-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-center flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-xl font-bold text-snow mb-2">Unable to Load Products</h3>
                <p className="text-sm text-snow/70 mb-6 leading-relaxed">{error}</p>
                <Button variant="primary" onClick={fetchProducts} className="flex items-center gap-2">
                  <RefreshCw size={16} /> Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  title="No Eco-Products Found"
                  message={searchQuery 
                    ? `We couldn't find any products matching "${searchQuery}" in the ${filter} category.` 
                    : `There are currently no products available under the ${filter} category.`}
                  actionLabel="Clear Search & Filters"
                  onAction={() => {
                    setSearchQuery('');
                    setFilter('All');
                  }}
                />
              </div>
            ) : (
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-midnight border border-white/5 hover:border-white/20 overflow-hidden transition-all duration-500 group flex flex-col relative"
                  >
                  <div className="relative h-64 overflow-hidden bg-black">
                    <OptimizedImage 
                      src={product.img} 
                      alt={product.name} 
                      category="product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-85 group-hover:opacity-100" 
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 flex items-center gap-1 border border-white/10 z-10">
                      <Star className="w-3 h-3 text-arctic-gold fill-arctic-gold" />
                      <span className="text-[10px] font-bold text-snow">{product.rating}</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow relative z-20">
                    <div className="text-[10px] font-sans font-bold text-arctic-gold uppercase tracking-widest mb-3">{product.category}</div>
                    <h3 className="text-xl font-display font-semibold text-snow mb-3 leading-tight">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-8">
                      <Leaf className="w-4 h-4 text-snow/50" />
                      <span className="text-sm font-sans font-medium text-snow/50">Offsets {Math.abs(product.co2)}kg CO₂</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-display font-semibold text-snow">{product.price} <span className="text-xs font-sans font-bold uppercase text-snow/50">NOK</span></span>
                      <button 
                        onClick={() => {
                          addItem({
                            item_type: 'PRODUCT',
                            item_id: product.id,
                            name: product.name,
                            description: product.category,
                            unit_price: product.price,
                            quantity: 1,
                            image: product.img
                          });
                          setShowCart(true);
                        }}
                        className="bg-white/5 hover:bg-arctic-gold hover:text-deep-night border border-white/10 hover:border-arctic-gold p-3 transition-colors group/btn cursor-pointer"
                      >
                        <ShoppingCart className="w-5 h-5 text-snow group-hover/btn:text-deep-night" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-[400px] bg-midnight border border-white/10 p-8 h-fit sticky top-32 shrink-0 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <h2 className="text-lg font-sans font-bold uppercase tracking-widest text-snow flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-arctic-gold" /> Your Cart
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-snow/50 bg-white/5 px-2 py-1">{cart.length} ITEMS</span>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <ShoppingCart className="w-8 h-8 text-snow/30" />
                  </div>
                  <p className="text-snow/50 font-sans text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 border border-white/5 hover:border-white/10 transition-colors">
                        <OptimizedImage 
                          src={item.image} 
                          alt={item.name} 
                          category="product"
                          className="w-full h-full object-cover" 
                          containerClassName="w-16 h-16 shrink-0 bg-black"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-sans font-medium text-snow truncate mb-1">{item.name}</h4>
                          <p className="text-xs font-sans font-bold text-arctic-gold mb-3">{item.unit_price} NOK</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-deep-night border border-white/10 px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-snow/50 hover:text-snow"><Minus size={12}/></button>
                              <span className="text-xs font-bold w-4 text-center text-snow">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-snow/50 hover:text-snow"><Plus size={12}/></button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] font-bold uppercase tracking-widest text-nordic-red hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4 mb-8">
                    <div className="flex justify-between text-sm font-sans text-snow/70">
                      <span>Subtotal</span>
                      <span className="font-bold text-snow">{getCartTotal()} NOK</span>
                    </div>
                    <div className="flex justify-between text-sm font-sans text-snow/70">
                      <span>Shipping</span>
                      <span className="font-bold text-arctic-gold uppercase tracking-widest text-[10px]">Free (Eco-Delivery)</span>
                    </div>
                    <div className="flex justify-between text-xl font-display font-semibold text-snow pt-4 border-t border-white/10">
                      <span>Total</span>
                      <span>{getCartTotal()} NOK</span>
                    </div>
                  </div>

                  {user ? (
                    <button 
                      onClick={handleCheckoutClick}
                      className="w-full flex items-center justify-center gap-3 bg-arctic-gold text-deep-night py-4 font-sans font-bold uppercase tracking-widest hover:bg-snow hover:text-deep-night transition-colors"
                    >
                      Secure Checkout <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <p className="text-xs font-sans font-medium text-snow/70 mb-4">Please log in to checkout.</p>
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-snow text-deep-night py-3 font-sans font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors text-xs"
                      >
                        Log In
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

