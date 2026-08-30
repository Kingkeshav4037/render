import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { ShoppingCart, Leaf, Star, ArrowRight, Plus, Minus, Loader2, AlertCircle, RefreshCw, RotateCcw, Check, ExternalLink, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { shopService, Product } from '../../services/shopService';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { ProductDetailModal } from '../../components/marketplace/ProductDetailModal';
import { SEO } from '../../components/shared/SEO';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: routeProductId } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { items: cart, addItem, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { requireAuth } = useRequireAuth();

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCheckoutClick = () => {
    requireAuth(() => {
      navigate('/checkout');
    }, { message: 'Sign in to continue to checkout.' });
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: serviceError } = await shopService.getProducts();
      if (serviceError) throw new Error(serviceError);
      setProducts(data || []);

      // Check for deep link via param or route ID
      const deepId = searchParams.get('product') || routeProductId;
      if (deepId && data) {
        const matched = data.find(p => p.id === deepId);
        if (matched) setSelectedProduct(matched);
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err?.message || 'Unable to retrieve marketplace products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [routeProductId]);


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
                {filteredProducts.map(product => {
                  const cartItem = cart.find(i => i.item_id === product.id);
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;

                  return (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-midnight border border-white/5 hover:border-arctic-gold/40 rounded-3xl overflow-hidden transition-all duration-500 group flex flex-col relative cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-arctic-gold/5"
                    >
                      {/* Image Banner */}
                      <div className="relative h-64 overflow-hidden bg-black">
                        <OptimizedImage 
                          src={product.img} 
                          alt={product.name} 
                          category="product"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
                          containerClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />
                        
                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-deep-night/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 z-10 text-[10px] font-bold text-snow">
                          <Star className="w-3 h-3 text-arctic-gold fill-arctic-gold" />
                          <span>{product.rating}</span>
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          {isOutOfStock ? (
                            <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-red-500/90 text-white shadow-md">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/90 text-deep-night shadow-md font-sans">
                              Low Stock ({product.stock} left)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/90 text-deep-night shadow-md font-sans">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex flex-col flex-grow relative z-20 justify-between">
                        <div>
                          <div className="text-[10px] font-sans font-bold text-arctic-gold uppercase tracking-widest mb-2">
                            {product.category}
                          </div>
                          <h3 className="text-lg font-display font-semibold text-snow mb-2 leading-snug group-hover:text-arctic-gold transition-colors">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 mb-4 text-xs font-sans text-emerald-400/90">
                            <Leaf className="w-3.5 h-3.5 shrink-0" />
                            <span>Offsets {Math.abs(product.co2)}kg CO₂</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-display font-bold text-snow">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          {cartItem ? (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center bg-deep-night border border-arctic-gold rounded-xl p-1"
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-bold text-xs px-2 text-arctic-gold">{cartItem.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              disabled={isOutOfStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                requireAuth(() => {
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
                                }, { message: 'Sign in to add items to your cart.' });
                              }}
                              className="bg-white/5 hover:bg-arctic-gold hover:text-deep-night border border-white/10 hover:border-arctic-gold px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              title={isOutOfStock ? "Out of stock" : "Add to cart"}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-[400px] bg-midnight border border-white/10 p-8 rounded-3xl h-fit sticky top-32 shrink-0 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-base font-display font-bold uppercase tracking-widest text-snow flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-arctic-gold" /> Your Cart
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-snow/70 bg-white/5 px-2.5 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/10 text-snow/30">
                    <ShoppingCart size={24} />
                  </div>
                  <p className="text-snow/50 font-sans text-sm">Your cart is currently empty.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <OptimizedImage 
                          src={item.image} 
                          alt={item.name} 
                          category="product"
                          className="w-full h-full object-cover rounded-xl" 
                          containerClassName="w-14 h-14 shrink-0 bg-black rounded-xl overflow-hidden"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-snow truncate mb-0.5">{item.name}</h4>
                          <p className="text-xs font-display font-bold text-arctic-gold mb-2">{formatPrice(item.unit_price)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 bg-deep-night border border-white/10 rounded-lg px-1.5 py-0.5">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-0.5 text-snow/50 hover:text-snow cursor-pointer"><Minus size={10}/></button>
                              <span className="text-[11px] font-bold w-3 text-center text-snow">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-0.5 text-snow/50 hover:text-snow cursor-pointer"><Plus size={10}/></button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/10 pt-4 space-y-2 mb-6 text-xs">
                    <div className="flex justify-between text-snow/70">
                      <span>Subtotal</span>
                      <span className="font-bold text-snow">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-snow/70">
                      <span>Eco-Delivery</span>
                      <span className="font-bold text-emerald-400">
                        {getCartTotal() >= 500 ? 'FREE' : formatPrice(49)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-display font-bold text-snow pt-2 border-t border-white/5">
                      <span>Total</span>
                      <span className="text-arctic-gold">
                        {formatPrice(getCartTotal() + (getCartTotal() >= 500 ? 0 : 49))}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={handleCheckoutClick}
                      className="w-full flex items-center justify-center gap-2 bg-arctic-gold text-deep-night py-3.5 rounded-xl font-sans font-bold uppercase tracking-widest text-xs hover:bg-snow transition-colors cursor-pointer shadow-lg"
                    >
                      Checkout Now <ArrowRight size={14} />
                    </button>
                    <Link
                      to="/shop/cart"
                      className="w-full flex items-center justify-center py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-snow/70 hover:text-snow hover:bg-white/5 transition-colors border border-white/5 text-center"
                    >
                      View Full Cart Page
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          )}


        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};

export default Products;


