import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Utensils, MapPin, Calendar, Clock, Users, Search, Filter, ArrowRight, Award, Fish, Carrot, Flame, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Sparkles, Info, Check, RotateCcw, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { foodService, getFoodImage, getRestaurantImage, getFoodPrice, Food as FoodType } from '../services/foodService';
import { motion, AnimatePresence } from 'framer-motion';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '../components/shared/SEO';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { FoodItemModal } from '../components/food/FoodItemModal';
import { FavoriteButton } from '../components/common/FavoriteButton';

const CUISINES = [
  { id: 'all', label: 'All Experiences', icon: <Utensils className="w-4 h-4"/> },
  { id: 'new-nordic', label: 'New Nordic', icon: <Award className="w-4 h-4"/> },
  { id: 'seafood', label: 'Coastal Seafood', icon: <Fish className="w-4 h-4"/> },
  { id: 'traditional', label: 'Traditional', icon: <Flame className="w-4 h-4"/> },
  { id: 'vegetarian', label: 'Vegetarian', icon: <Carrot className="w-4 h-4"/> },
];

const DISH_CATEGORIES = [
  { id: 'all', label: 'All Dishes' },
  { id: 'stew', label: 'Stews & Roasts' },
  { id: 'seafood', label: 'Coastal Seafood' },
  { id: 'dairy', label: 'Dairy & Cheeses' },
  { id: 'dessert', label: 'Arctic Desserts & Bakery' },
];

// Helper to deduce dietary tags from dish names
const getDietaryTags = (name: string, category?: string) => {
  const lower = (name + ' ' + (category || '')).toLowerCase();
  const tags: string[] = [];
  if (lower.includes('fårikål') || lower.includes('pinnekjøtt') || lower.includes('rakfisk')) {
    tags.push('Gluten-Free');
  }
  if (lower.includes('brunost') || lower.includes('rømmegrøt') || lower.includes('lefse') || lower.includes('multekrem')) {
    tags.push('Vegetarian');
  }
  if (lower.includes('gravlaks') || lower.includes('salmon') || lower.includes('halibut') || lower.includes('fish')) {
    tags.push('Pescatarian', 'Omega-3');
  }
  if (lower.includes('multekrem') || lower.includes('cloudberry')) {
    tags.push('Wild Foraged');
  }
  if (tags.length === 0) tags.push('Traditional Heritage');
  return tags;
};

export const Food = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cuisineFilter = searchParams.get('cuisine') || 'all';
  const [dishCategory, setDishCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const { addItem, getItemCount, getCartTotal, setIsOpen } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { requireAuth } = useRequireAuth();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [dishQuantities, setDishQuantities] = useState<Record<string, number>>({});

  const cartItemCount = getItemCount();
  const cartTotal = getCartTotal();

  const updateDishQuantity = (foodId: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDishQuantities(prev => {
      const current = prev[foodId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [foodId]: next };
    });
  };

  const handleAddFood = (food: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    requireAuth(() => {
      const price = getFoodPrice(food.name, food.price);
      const qty = dishQuantities[food.id] || 1;
      addItem({
        item_type: 'PRODUCT',
        item_id: food.id,
        name: food.name,
        description: food.description || '',
        unit_price: price,
        quantity: qty,
        image: getFoodImage(food.name, food.image_url),
      });
      setAddedId(food.id);
      setTimeout(() => setAddedId(null), 1500);
    }, { message: 'Sign in to add food orders to your cart.' });
  };

  // Pagination State
  const [foodsPage, setFoodsPage] = useState(1);
  const [restaurantsPage, setRestaurantsPage] = useState(1);
  const FOODS_LIMIT = 8;
  const RESTAURANTS_LIMIT = 24;

  // Fetch Traditional Foods
  const { data: traditionalFoodsData, isLoading: isFoodsLoading, error: foodsError, refetch: refetchFoods } = useQuery({
    queryKey: ['traditionalFoods', foodsPage],
    queryFn: () => foodService.getFoods({}, foodsPage, FOODS_LIMIT)
  });

  // Fetch Restaurants
  const { data: restaurantsData, isLoading, error, refetch: refetchRestaurants } = useQuery({
    queryKey: ['restaurants', cuisineFilter, restaurantsPage],
    queryFn: () => foodService.getRestaurants({ cuisine: cuisineFilter !== 'all' ? cuisineFilter : undefined }, restaurantsPage, RESTAURANTS_LIMIT)
  });

  // Filter traditional dishes by search and category
  const filteredDishes = useMemo(() => {
    const list = traditionalFoodsData?.data || [];
    return list.filter(dish => {
      const name = dish.name.toLowerCase();
      const desc = (dish.description || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || name.includes(query) || desc.includes(query);

      let matchesCat = true;
      if (dishCategory === 'stew') {
        matchesCat = name.includes('fårikål') || name.includes('kjøtt') || name.includes('pinnekjøtt') || name.includes('ribbe') || name.includes('lapskaus');
      } else if (dishCategory === 'seafood') {
        matchesCat = name.includes('laks') || name.includes('salmon') || name.includes('gravlaks') || name.includes('rakfisk') || name.includes('lutefisk');
      } else if (dishCategory === 'dairy') {
        matchesCat = name.includes('brunost') || name.includes('rømme') || name.includes('ost');
      } else if (dishCategory === 'dessert') {
        matchesCat = name.includes('multekrem') || name.includes('cloudberry') || name.includes('lefse') || name.includes('krumkake') || name.includes('vaffel') || name.includes('svele');
      }
      return matchesSearch && matchesCat;
    });
  }, [traditionalFoodsData, searchQuery, dishCategory]);

  // Filter restaurants by search
  const filteredRestaurants = useMemo(() => {
    const list = restaurantsData?.data || [];
    if (!searchQuery) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(r => 
      r.name.toLowerCase().includes(query) || 
      (r.description || '').toLowerCase().includes(query) ||
      ((r as any).location?.name || '').toLowerCase().includes(query)
    );
  }, [restaurantsData, searchQuery]);

  const renderPagination = (page: number, limit: number, totalCount: number, setPage: (page: number) => void) => {
    const totalPages = Math.ceil((totalCount || 0) / limit);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-4 mt-12 mb-8">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 border border-white/20 rounded-full hover:bg-[#FF7F50] hover:border-[#FF7F50] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-snow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-sans font-medium text-sm text-snow/70">
          Page {page} of {totalPages}
        </span>
        <button 
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 border border-white/20 rounded-full hover:bg-[#FF7F50] hover:border-[#FF7F50] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-snow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-arctic-gold/30">
      <SEO 
        title="Culinary & Dining"
        description="Reserve a table at world-class New Nordic restaurants, coastal seafood huts, and traditional dining rooms across Norway."
        ogImage="/images/food_salmon_1787013684123.jpg"
      />
      
      {/* Header */}
      <PageHeader
        title="A Taste of Norway"
        description="Taste authentic heirloom dishes prepared daily by artisanal kitchens, or reserve a table at world-class New Nordic dining rooms."
        breadcrumb={
          <>
            <Utensils className="w-4 h-4" /> Culinary Scene
          </>
        }
        backgroundImage="/images/food_salmon_1787013684123.jpg"
      >
        {/* Live Search & Filter Bar */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 flex flex-col md:flex-row gap-2 max-w-5xl shadow-2xl rounded-2xl">
          <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-snow">
            <Search className="w-5 h-5 text-[#FF7F50] shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-widest text-snow/50 font-bold">Search Dishes & Dining</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Fårikål, Gravlaks, Bergen seafood, New Nordic..." 
                className="bg-transparent text-sm outline-none placeholder:text-snow/40 w-full font-medium text-snow" 
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-snow/40 hover:text-snow p-1"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="h-full py-4 px-6 bg-white/10 hover:bg-white/20 text-snow font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs rounded-xl"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            {cartItemCount > 0 && (
              <button
                onClick={() => setIsOpen(true)}
                className="h-full py-4 px-6 bg-[#FF7F50] hover:bg-[#E86A3E] text-white font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs rounded-xl shadow-lg cursor-pointer animate-pulse"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({cartItemCount})</span>
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-6 relative z-20">
        
        {/* Floating Cart Pill (Mobile/Sticky) */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 bg-[#FF7F50] hover:bg-[#E86A3E] text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/20 transition-transform hover:scale-105 cursor-pointer"
            >
              <ShoppingBag size={18} />
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider">Your Selection</div>
                <div className="text-xs font-black">{cartItemCount} items • {formatPrice(cartTotal)}</div>
              </div>
            </button>
          </div>
        )}

        {/* Navigation Categories */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 mb-12 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-snow/50 mr-2">Experiences:</span>
          {CUISINES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchParams({ cuisine: cat.id });
                setRestaurantsPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-full border ${
                cuisineFilter === cat.id 
                  ? 'bg-[#FF7F50] border-[#FF7F50] text-white shadow-md' 
                  : 'bg-white/5 border-white/10 text-snow/70 hover:bg-white/10 hover:text-snow'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Traditional Foods Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF7F50] mb-1">
                <Sparkles size={14} /> Nordic Culinary Heritage
              </div>
              <h2 className="text-3xl font-display font-semibold text-snow">Traditional Norwegian Dishes</h2>
            </div>
            
            {/* Dish Category Filters */}
            <div className="flex flex-wrap gap-2">
              {DISH_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setDishCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                    dishCategory === cat.id
                      ? 'bg-arctic-gold text-deep-night border-arctic-gold'
                      : 'bg-white/5 text-snow/60 border-white/10 hover:bg-white/10 hover:text-snow'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <AsyncStateWrapper
            isLoading={isFoodsLoading}
            error={foodsError as Error | null}
            data={filteredDishes}
            emptyMessage="No traditional dishes match your criteria."
            errorMessage="Unable to load traditional foods."
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/10 rounded-2xl" />
                ))}
              </div>
            }
          >
            {(data) => (
              <>
                {data.length === 0 ? (
                  <div className="bg-midnight border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto">
                    <Utensils className="w-12 h-12 text-snow/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-snow mb-2">No matching dishes found</h3>
                    <p className="text-sm text-snow/60 mb-6">Try clearing your search query or selecting a different category filter.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setDishCategory('all'); }}
                      className="px-6 py-2.5 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-snow transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.map((food, idx) => {
                      const foodImage = getFoodImage(food.name, food.image_url);
                      const foodPrice = getFoodPrice(food.name, (food as any).price);
                      const isAdded = addedId === food.id;
                      const qty = dishQuantities[food.id] || 1;
                      const dietaryTags = getDietaryTags(food.name, (food as any).category);

                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={food.id}
                          onClick={() => setSelectedFood(food)}
                          className="group relative flex flex-col bg-midnight border border-white/10 hover:border-[#FF7F50]/50 transition-all duration-500 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
                        >
                          <div className="aspect-[4/3] overflow-hidden relative bg-black">
                            <OptimizedImage 
                              src={foodImage} 
                              alt={food.name}
                              category="food"
                              fallbackSrc="/images/food_salmon_1787013684123.jpg"
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent pointer-events-none" />
                            
                            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5">
                              {food.featured && (
                                <span className="bg-[#FF7F50] px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-white rounded-md shadow-md">
                                  Featured
                                </span>
                              )}
                              <span className="bg-deep-night/80 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-snow rounded-md border border-white/10">
                                Fresh Daily
                              </span>
                            </div>

                            {(food as any).category && (
                              <div className="absolute top-4 right-4 z-20">
                                <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-snow/90 rounded-md border border-white/10">
                                  {(food as any).category}
                                </span>
                              </div>
                            )}

                            <div className="absolute bottom-4 right-4 z-20">
                              <FavoriteButton itemType="FOOD" itemId={food.id} />
                            </div>
                          </div>

                          <div className="p-6 flex flex-col flex-grow relative z-20 justify-between">
                            <div>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {dietaryTags.slice(0, 2).map((tag, tIdx) => (
                                  <span key={tIdx} className="bg-white/5 border border-white/10 text-arctic-gold text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <h3 className="text-xl font-display font-semibold mb-1 text-snow group-hover:text-[#FF7F50] transition-colors">{food.name}</h3>
                              
                              {(food as any).prep_time && (
                                <div className="flex items-center gap-1.5 text-xs text-snow/50 mb-2">
                                  <Clock className="w-3.5 h-3.5 text-[#FF7F50]" /> {(food as any).prep_time}
                                </div>
                              )}
                              
                              <p className="text-xs font-sans text-snow/60 line-clamp-2 mb-4 leading-relaxed">{food.description}</p>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="text-[10px] text-snow/40 uppercase font-bold tracking-wider block">Price</span>
                                  <div className="text-xl font-bold text-snow font-display">{formatPrice(foodPrice * qty)}</div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center bg-deep-night border border-white/10 rounded-lg p-0.5">
                                  <button
                                    onClick={(e) => updateDishQuantity(food.id, -1, e)}
                                    aria-label="Decrease quantity"
                                    className="w-6 h-6 flex items-center justify-center text-snow/60 hover:text-snow transition-colors"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-snow">{qty}</span>
                                  <button
                                    onClick={(e) => updateDishQuantity(food.id, 1, e)}
                                    aria-label="Increase quantity"
                                    className="w-6 h-6 flex items-center justify-center text-snow/60 hover:text-snow transition-colors"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={(e) => handleAddFood(food, e)}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#FF7F50] hover:bg-[#E86A3E] text-white shadow-md'
                                }`}
                              >
                                {isAdded ? (
                                  <><Check className="w-3.5 h-3.5" /> Added to Cart!</>
                                ) : (
                                  <><ShoppingCart className="w-3.5 h-3.5" /> Order Dish</>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                {renderPagination(foodsPage, FOODS_LIMIT, traditionalFoodsData?.count || 0, setFoodsPage)}
              </>
            )}
          </AsyncStateWrapper>
        </div>

        {/* Dining Experiences / Restaurants Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-arctic-gold mb-1">
                <Award size={14} /> Curated Gastronomy
              </div>
              <h2 className="text-3xl font-display font-semibold text-snow">Dining Experiences & Table Reservations</h2>
            </div>
          </div>
          
          <AsyncStateWrapper
            isLoading={isLoading}
            error={error as Error | null}
            data={filteredRestaurants}
            emptyMessage="No restaurants found matching your criteria."
            errorMessage="Unable to load dining establishments."
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse border border-white/10 rounded-2xl" />)}
              </div>
            }
          >
            {(data) => (
              <>
                {data.length === 0 ? (
                  <div className="bg-midnight border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto mb-24">
                    <Utensils className="w-12 h-12 text-snow/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-snow mb-2">No restaurants found</h3>
                    <p className="text-sm text-snow/60 mb-6">Try selecting a different cuisine or clearing your search filter.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSearchParams({ cuisine: 'all' }); }}
                      className="px-6 py-2.5 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-snow transition-colors"
                    >
                      Show All Restaurants
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.map((restaurant, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={restaurant.id}
                        className="group relative flex flex-col bg-midnight border border-white/10 hover:border-[#FF7F50]/50 transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl"
                      >
                        <Link to={`/food/${restaurant.id}`} className="absolute inset-0 z-10" />
                        
                        <div className="h-48 overflow-hidden relative bg-black">
                          <OptimizedImage 
                            src={restaurant.image_url || getRestaurantImage(restaurant.name)} 
                            alt={restaurant.name}
                            category="food"
                            fallbackSrc="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute top-4 left-4 flex gap-2 flex-col z-20">
                            {restaurant.rating && restaurant.rating >= 4.8 && (
                              <span className="bg-red-600/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-white shadow-md rounded-md w-fit">
                                Michelin Guide
                              </span>
                            )}
                            <span className="bg-[#FF7F50]/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-white shadow-md rounded-md w-fit">
                              {(restaurant as any).type?.replace(/_/g, ' ') || 'Nordic'}
                            </span>
                          </div>
                          {restaurant.rating && (
                            <div className="absolute bottom-4 right-4 z-20 bg-deep-night/90 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-0.5 text-xs font-bold text-arctic-gold">
                              ★ {Number(restaurant.rating).toFixed(1)}
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow relative z-20 justify-between">
                          <div>
                            <h3 className="text-xl font-display font-semibold mb-1 text-snow group-hover:text-[#FF7F50] transition-colors">{restaurant.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-sans text-snow/60 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-[#FF7F50]" />
                              <span>{(restaurant as any).location?.name || 'Norway'}</span>
                              <span>•</span>
                              <span className="font-bold text-snow">{(restaurant as any).price_range || '$$$'}</span>
                            </div>
                            {(restaurant as any).description && (
                              <p className="text-xs text-snow/60 line-clamp-2 mb-4 leading-relaxed">{(restaurant as any).description}</p>
                            )}
                          </div>

                          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Open for Reservations</span>
                            <div className="flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-[#FF7F50] group-hover:translate-x-1 transition-transform">
                              Reserve <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {renderPagination(restaurantsPage, RESTAURANTS_LIMIT, restaurantsData?.count || 0, setRestaurantsPage)}
              </>
            )}
          </AsyncStateWrapper>
        </div>
      </div>

      {/* Dish Details Modal */}
      <FoodItemModal 
        food={selectedFood} 
        onClose={() => setSelectedFood(null)} 
      />
    </div>
  );
};

export default Food;


