import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Leaf, Star, ArrowRight, Plus, Minus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

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

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };
    
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
    <div className="bg-gray-50 min-h-screen">
      {/* Premium Header */}
      <div className="bg-navy-900 text-white py-12 px-4 md:px-12 relative overflow-hidden mb-12 rounded-b-3xl">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/infra_windfarm.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
              <Leaf className="w-5 h-5 text-aurora-green" />
              <span className="text-sm font-semibold tracking-wider uppercase text-white/90">Eco-Marketplace</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black mb-4">
              Smart Products for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-green to-blue-400">Green Life</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-blue-100 max-w-2xl">
              Shop curated, sustainable Norwegian tech and gear. Every purchase offsets your carbon footprint.
            </motion.p>
          </div>
          
          <div className="w-full md:w-96 flex flex-col gap-4">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full py-4 px-6 outline-none focus:bg-white/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Navigation & Cart Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 sm:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {['All', 'Smart Home', 'EV Accessories', 'Outdoor Gear', 'Lifestyle'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filter === cat ? 'bg-navy-900 text-white border-navy-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-aurora-green'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none font-semibold hover:border-aurora-green transition-colors cursor-pointer"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
          <button 
            onClick={() => setShowCart(!showCart)}
            className="flex items-center gap-2 bg-aurora-green text-navy-900 px-6 py-2.5 rounded-xl font-bold hover:bg-green-400 transition-colors shadow-sm w-full sm:w-auto justify-center relative"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-20">
          
          {/* Product Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showCart ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6 flex-grow transition-all duration-300`}>
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-aurora-green" />
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
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-navy-900">{product.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-aurora-green uppercase tracking-wider mb-2">{product.category}</div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2 leading-tight">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-500">Offsets {Math.abs(product.co2)}kg CO₂</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-black text-navy-900">{product.price} <span className="text-sm font-medium text-gray-500">NOK</span></span>
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
                        className="bg-gray-100 hover:bg-navy-900 hover:text-white p-3 rounded-xl transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
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
              className="w-full lg:w-96 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 h-fit sticky top-24 shrink-0"
            >
              <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-aurora-green" /> Your Cart
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-navy-900 truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.unit_price} NOK</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-navy-900"><Minus size={14}/></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-navy-900"><Plus size={14}/></button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold">{getCartTotal()} NOK</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-bold text-green-600">Free (Eco-Delivery)</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-navy-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>{getCartTotal()} NOK</span>
                    </div>
                  </div>

                  {user ? (
                    <button 
                      onClick={handleCheckoutClick}
                      className="w-full flex items-center justify-center gap-2 bg-navy-900 text-white py-4 rounded-xl font-bold hover:bg-navy-800 transition-colors"
                    >
                      Secure Checkout <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-3">Please log in to checkout.</p>
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-gray-100 text-navy-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
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
