import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Utensils, MapPin, Calendar, Clock, Users, Search, Filter, ArrowRight, Award, Fish, Carrot, Flame, ChevronLeft, ChevronRight, ShoppingCart, Plus } from 'lucide-react';
import { foodService, getFoodImage, getFoodPrice } from '../services/foodService';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '../components/shared/SEO';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const CUISINES = [
  { id: 'all', label: 'All Experiences', icon: <Utensils className="w-4 h-4"/> },
  { id: 'new-nordic', label: 'New Nordic', icon: <Award className="w-4 h-4"/> },
  { id: 'seafood', label: 'Coastal Seafood', icon: <Fish className="w-4 h-4"/> },
  { id: 'traditional', label: 'Traditional', icon: <Flame className="w-4 h-4"/> },
  { id: 'vegetarian', label: 'Vegetarian', icon: <Carrot className="w-4 h-4"/> },
];

export const Food = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cuisineFilter = searchParams.get('cuisine') || 'all';
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddFood = (food: any) => {
    const price = getFoodPrice(food.name, food.price);
    addItem({
      item_type: 'PRODUCT',
      item_id: food.id,
      name: food.name,
      description: food.description || '',
      unit_price: price,
      quantity: 1,
      image: getFoodImage(food.name, food.image_url),
    });
    setAddedId(food.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Pagination State
  const [foodsPage, setFoodsPage] = useState(1);
  const [restaurantsPage, setRestaurantsPage] = useState(1);
  const FOODS_LIMIT = 8;
  const RESTAURANTS_LIMIT = 24;

  // Fetch Traditional Foods
  const { data: traditionalFoodsData, isLoading: isFoodsLoading, error: foodsError } = useQuery({
    queryKey: ['traditionalFoods', foodsPage],
    queryFn: () => foodService.getFoods({}, foodsPage, FOODS_LIMIT)
  });

  // Fetch Restaurants
  const { data: restaurantsData, isLoading, error } = useQuery({
    queryKey: ['restaurants', cuisineFilter, restaurantsPage],
    queryFn: () => foodService.getRestaurants({ cuisine: cuisineFilter !== 'all' ? cuisineFilter : undefined }, restaurantsPage, RESTAURANTS_LIMIT)
  });

  const renderPagination = (page: number, limit: number, totalCount: number, setPage: (page: number) => void) => {
    const totalPages = Math.ceil((totalCount || 0) / limit);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-4 mt-12 mb-8">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 border border-[#2C1810]/20 rounded-full hover:bg-[#FF7F50] hover:border-[#FF7F50] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-sans font-medium text-sm">
          Page {page} of {totalPages}
        </span>
        <button 
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 border border-[#2C1810]/20 rounded-full hover:bg-[#FF7F50] hover:border-[#FF7F50] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#2C1810] font-sans pb-24 selection:bg-[#FF7F50]/20">
      <SEO 
        title="Culinary & Dining"
        description="Reserve a table at world-class New Nordic restaurants, coastal seafood huts, and traditional dining rooms across Norway."
        ogImage="/images/food_salmon_1787013684123.jpg"
      />
      
      {/* Coral Theme Hero */}
      <CinematicBackground 
        imageUrl="/images/food_salmon_1787013684123.jpg"
        gradient="dark"
        overlayOpacity={0.4}
        className="h-[60vh] flex items-center"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32">
          <div className="max-w-4xl text-white">
            <span className="text-[#FF7F50] font-sans text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 drop-shadow-md">
              <Utensils className="w-4 h-4" /> Culinary Scene
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6 drop-shadow-lg">A Taste of Norway</h1>
            <p className="text-lg md:text-xl font-sans text-white/90 max-w-2xl mb-12 leading-relaxed drop-shadow-md">
              Reserve a table at world-class New Nordic restaurants, coastal seafood huts, and traditional dining rooms.
            </p>

            {/* Smart Booking Bar (Coral Tinted) */}
            <div className="bg-white/95 backdrop-blur-2xl border border-[#FF7F50]/20 p-2 flex flex-col md:flex-row gap-2 max-w-5xl shadow-2xl rounded-sm">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-[#2C1810]">
                <MapPin className="w-5 h-5 text-[#FF7F50] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">City</span>
                  <input type="text" placeholder="Bergen, Oslo..." className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-full font-medium" />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-[#2C1810]">
                <Calendar className="w-5 h-5 text-[#FF7F50] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Date</span>
                  <span className="text-sm font-medium">Select Date</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-[#2C1810]">
                <Clock className="w-5 h-5 text-[#FF7F50] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Time</span>
                  <span className="text-sm font-medium">19:00</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-[#2C1810]">
                <Users className="w-5 h-5 text-[#FF7F50] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Guests</span>
                  <span className="text-sm font-medium">2 Guests</span>
                </div>
              </div>
              <button className="h-auto py-4 px-10 bg-[#FF7F50] text-white font-bold hover:bg-[#E86A3E] transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0 rounded-sm">
                <Search className="w-4 h-4" /> Find Table
              </button>
            </div>
          </div>
        </div>
      </CinematicBackground>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* Navigation Categories */}
        <div className="flex flex-wrap items-center gap-4 border-b border-[#2C1810]/10 mb-12 pb-6 bg-[#FDF8F5]">
          {CUISINES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchParams({ cuisine: cat.id });
                setRestaurantsPage(1); // Reset page on filter
              }}
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-full border ${
                cuisineFilter === cat.id 
                  ? 'bg-[#FF7F50] border-[#FF7F50] text-white shadow-md' 
                  : 'bg-white border-[#2C1810]/10 text-gray-600 hover:bg-gray-50 hover:text-[#2C1810]'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
          <div className="ml-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#2C1810] transition-colors px-6 py-3 border border-[#2C1810]/10 rounded-full bg-white hover:bg-gray-50"
            >
              <Filter size={14} /> More Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-12 border border-[#FF7F50]/20 bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Price Range</h4>
                  <div className="space-y-2">
                    {['$ (Budget)', '$$ (Moderate)', '$$$ (Fine Dining)'].map(p => (
                      <label key={p} className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#FF7F50] transition-colors">
                        <input type="checkbox" className="accent-[#FF7F50]" /> {p}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Features</h4>
                  <div className="space-y-2">
                    {['Waterfront', 'Michelin Star', 'Family Friendly', 'Outdoor Seating'].map(f => (
                      <label key={f} className="flex items-center gap-3 text-sm cursor-pointer hover:text-[#FF7F50] transition-colors">
                        <input type="checkbox" className="accent-[#FF7F50]" /> {f}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Traditional Foods Grid */}
        <div className="mb-12 mt-16">
          <h2 className="text-3xl font-display font-semibold mb-8 text-[#2C1810]">Traditional Norwegian Dishes</h2>
          <AsyncStateWrapper
            isLoading={isFoodsLoading}
            error={foodsError as Error | null}
            data={traditionalFoodsData?.data || []}
            emptyMessage="No traditional dishes found."
            errorMessage="Unable to load traditional foods."
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-white animate-pulse border border-gray-100 rounded-sm"></div>)}
              </div>
            }
          >
            {(data) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {data.map((food, idx) => {
                    const foodImage = getFoodImage(food.name, food.image_url);
                    const foodPrice = getFoodPrice(food.name, (food as any).price);
                    const isAdded = addedId === food.id;
                    return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={food.id}
                      className="group relative flex flex-col bg-white border border-[#2C1810]/5 hover:border-[#FF7F50]/50 transition-all duration-500 shadow-sm hover:shadow-xl rounded-sm overflow-hidden"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <OptimizedImage 
                          src={foodImage} 
                          alt={food.name}
                          fallbackSrc="/images/food_salmon_1787013684123.jpg"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {food.featured && (
                          <div className="absolute top-4 left-4 z-20">
                            <span className="bg-[#FF7F50]/90 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm">
                              Featured
                            </span>
                          </div>
                        )}
                        {(food as any).category && (
                          <div className="absolute top-4 right-4 z-20">
                            <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white">
                              {(food as any).category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow relative z-20">
                        <h3 className="text-lg font-display font-semibold mb-1 text-[#2C1810] group-hover:text-[#FF7F50] transition-colors">{food.name}</h3>
                        {(food as any).prep_time && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                            <Clock className="w-3 h-3" /> {(food as any).prep_time}
                          </div>
                        )}
                        <p className="text-xs font-sans text-gray-600 line-clamp-2 mb-4">{food.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</span>
                            <div className="text-lg font-bold text-[#2C1810]">{formatPrice(foodPrice)}</div>
                          </div>
                          <button
                            onClick={() => handleAddFood(food)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm ${
                              isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-[#FF7F50] text-white hover:bg-[#E86A3E]'
                            }`}
                          >
                            {isAdded ? (
                              <><ShoppingCart className="w-3 h-3" /> Added!</>
                            ) : (
                              <><Plus className="w-3 h-3" /> Order</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>
                {renderPagination(foodsPage, FOODS_LIMIT, traditionalFoodsData?.count || 0, setFoodsPage)}
              </>
            )}
          </AsyncStateWrapper>
        </div>

        {/* Results Grid - Restaurants */}
        <div className="mt-16">
          <h2 className="text-3xl font-display font-semibold mb-8 text-[#2C1810]">Dining Experiences</h2>
          
          <AsyncStateWrapper
            isLoading={isLoading}
            error={error as Error | null}
            data={restaurantsData?.data || []}
            emptyMessage="No restaurants found matching your criteria."
            errorMessage="Unable to load restaurants."
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-white animate-pulse border border-gray-100 rounded-sm"></div>)}
              </div>
            }
          >
            {(data) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {data.map((restaurant, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={restaurant.id}
                      className="group relative flex flex-col bg-white border border-[#2C1810]/5 hover:border-[#FF7F50]/50 transition-all duration-500 aspect-[3/4] cursor-pointer shadow-sm hover:shadow-xl rounded-sm overflow-hidden"
                    >
                      <Link to={`/food/${restaurant.id}`} className="absolute inset-0 z-10" />
                      
                      <div className="h-2/3 overflow-hidden relative">
                        <OptimizedImage 
                          src={restaurant.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800'} 
                          alt={restaurant.name}
                          fallbackSrc="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex gap-2 flex-col z-20">
                          {restaurant.rating && restaurant.rating >= 4.8 && (
                            <span className="bg-red-600/90 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm w-fit">
                              Michelin Guide
                            </span>
                          )}
                          <span className="bg-[#FF7F50]/90 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm w-fit">
                            {(restaurant as any).type?.replace(/_/g, ' ') || 'Nordic'}
                          </span>
                        </div>
                        {restaurant.rating && (
                          <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[#2C1810]">
                            ★ {Number(restaurant.rating).toFixed(1)}
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-grow relative z-20">
                        <h3 className="text-xl font-display font-semibold mb-1 text-[#2C1810] group-hover:text-[#FF7F50] transition-colors">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-xs font-sans text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{(restaurant as any).location?.name || 'Norway'}</span>
                          <span>•</span>
                          <span className="font-bold text-[#2C1810]">{(restaurant as any).price_range || '$$'}</span>
                        </div>
                        {(restaurant as any).description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-auto">{(restaurant as any).description}</p>
                        )}
                        <div className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[#FF7F50] group-hover:translate-x-1 transition-transform mt-4">
                          Reserve Table <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {renderPagination(restaurantsPage, RESTAURANTS_LIMIT, restaurantsData?.count || 0, setRestaurantsPage)}
              </>
            )}
          </AsyncStateWrapper>
        </div>
      </div>
    </div>
  );
};

export default Food;
