import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Phone, Globe, Star, Users, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Heart, Share2, Info, ShoppingCart, Plus, Minus, Check, ArrowRight, ShieldCheck, Sparkles, Utensils } from 'lucide-react';
import { foodService, Restaurant, Food, getFoodImage, getRestaurantImage, getFoodPrice } from '../services/foodService';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { SEO } from '../components/shared/SEO';

// Cultural details and culinary metadata for Norwegian traditional foods
const DISH_STORIES: Record<string, { region: string; dietary: string[]; tags: string[]; story: string; ingredients: string[] }> = {
  'fårikål': {
    region: 'Western Norway & Telemark',
    dietary: ['Gluten-Free', 'Traditional Heritage', 'High Protein'],
    tags: ['National Dish', 'Autumn Feast', 'Slow-Cooked'],
    story: 'Voted Norway’s national dish, fårikål is a comforting autumn stew prepared by layering tender bone-in mutton with sweet autumn cabbage and whole black peppercorns, gently simmered for hours until meltingly tender.',
    ingredients: ['Norwegian Mountain Lamb', 'Head Cabbage', 'Whole Peppercorns', 'Sea Salt', 'Spring Water']
  },
  'brunost': {
    region: 'Gudbrandsdalen',
    dietary: ['Vegetarian', 'Nutrient Rich', 'Nordic Classic'],
    tags: ['Caramelized Whey', 'Sweet & Savory', 'Iconic Cheese'],
    story: 'Created by boiling goat and cow milk whey down until milk sugars caramelize, giving Brunost its golden-brown hue and distinctive dulce-de-leche sweetness. Served thinly sliced on warm rustic sourdough or crisp waffles.',
    ingredients: ['Caramelized Goat & Cow Milk Whey', 'Cream', 'Lactic Cultures']
  },
  'kjøttkaker': {
    region: 'National Norway',
    dietary: ['Hearty', 'Comfort Food', 'Classic Nordic'],
    tags: ['Grandmother’s Recipe', 'Brown Sauce', 'Lingonberry'],
    story: 'Norway’s celebrated meatballs, crafted with seasoned minced beef and pork, pan-seared to golden perfection, and smothered in a rich roux-based brown sauce alongside mashed peas and tart lingonberry jam.',
    ingredients: ['Ground Beef & Pork', 'Nutmeg & Ginger', 'Rich Beef Velouté Sauce', 'Ringerike Potatoes', 'Wild Lingonberries']
  },
  'pinnekjøtt': {
    region: 'Fjord Norway (Vestlandet)',
    dietary: ['Gluten-Free', 'Festive Delicacy', 'Smoked / Cured'],
    tags: ['Christmas Special', 'Birch Steamed', 'Heritage Cured'],
    story: 'Salted, cured, and air-dried racks of mutton or lamb steamed over aromatic birch wood sticks for hours. A treasured festive tradition served with creamy swede purée (kålrabistappe).',
    ingredients: ['Dry-Cured Lamb Ribs', 'Aromatic Birch Sticks', 'Rutabaga Mash', 'Spiced Cooking Juices']
  },
  'gravlaks': {
    region: 'Trøndelag & Lofoten',
    dietary: ['Dairy-Free', 'Omega-3 Rich', 'Pescatarian'],
    tags: ['Cured Wild Salmon', 'Dill Mustard Sauce', 'Artisanal Curing'],
    story: 'Fresh Norwegian salmon cured with sea salt, sugar, cracked pepper, and abundant fresh garden dill. Served wafer-thin with sweet Hovmestersaus (dill mustard dressing).',
    ingredients: ['Arctic Salmon', 'Dill Sprigs', 'Juniper & Sea Salt', 'Cracked Peppercorns', 'Sweet Mustard Gravy']
  },
  'rakfisk': {
    region: 'Valdres',
    dietary: ['Gluten-Free', 'Fermented Specialty', 'Artisanal'],
    tags: ['Protected Designation', 'Aged Trout', 'Gourmet Delicacy'],
    story: 'A prized Valdres specialty: freshwater trout salted and fermented in oak casks under low temperature for several months, delivering an extraordinarily complex, savory umami flavor.',
    ingredients: ['Fermented Mountain Trout', 'Røros Sour Cream', 'Red Onion', 'Potato Flatbread (Lefse)']
  },
  'multekrem': {
    region: 'Northern Norway & Arctic Tundra',
    dietary: ['Vegetarian', 'Wild Foraged', 'Vitamin C Rich'],
    tags: ['Arctic Gold', 'Holiday Dessert', 'Cloudberries'],
    story: 'Known as the "Arctic Gold", wild hand-foraged cloudberries folded gently into lightly sweetened, pillowy whipped cream and served with traditional delicate krumkake wafer rolls.',
    ingredients: ['Wild Arctic Cloudberries', 'Fresh Norwegian Heavy Cream', 'Organic Sugar', 'Crisp Krumkake']
  },
  'rømmegrøt': {
    region: 'Setesdal & Gudbrandsdal',
    dietary: ['Vegetarian', 'Festive Tradition', 'Farmhouse Recipe'],
    tags: ['Sour Cream Porridge', 'Cinnamon & Sugar', 'Spekemat Pairing'],
    story: 'A velvety, rich sour cream porridge simmered slowly until the golden butterfat naturally surfaces. Sprinkled with cinnamon sugar and served alongside cured meats on festive occasions.',
    ingredients: ['Cultured Farmhouse Sour Cream', 'Wheat Flour', 'Whole Milk', 'Brown Butter', 'Ceylon Cinnamon']
  },
  'lefse': {
    region: 'Telemark & Hardanger',
    dietary: ['Vegetarian', 'Handcrafted', 'Farmstead Bakery'],
    tags: ['Potato Flatbread', 'Butter & Sugar', 'Cinnamon Roll'],
    story: 'Soft, tender traditional potato flatbread rolled paper-thin on griddle plates, spread with cultured butter, sugar, and cinnamon, and folded into melt-in-the-mouth sweet triangles.',
    ingredients: ['Norwegian Potatoes', 'Farmstead Butter', 'Cinnamon Sugar', 'Organic Flour']
  }
};

export const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItem, setFoodItem] = useState<Food | null>(null);
  const [relatedFoods, setRelatedFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // 5-Step Reservation State
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [tablePref, setTablePref] = useState('Standard');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      setLoading(true);
      foodService.getRestaurantById(id).then(async (restData) => {
        if (restData) {
          setRestaurant(restData);
          setFoodItem(null);
          setLoading(false);
        } else {
          // If not restaurant, check if it's a food dish
          const dishData = await foodService.getFoodById(id);
          if (dishData) {
            setFoodItem(dishData);
            setRestaurant(null);
            const { data: allDishes } = await foodService.getFoods({}, 1, 8);
            setRelatedFoods(allDishes.filter(d => d.id !== dishData.id).slice(0, 4));
          }
          setLoading(false);
        }
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-night pt-32 pb-24 flex flex-col items-center justify-center text-snow">
        <div className="w-10 h-10 border-4 border-[#FF7F50] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-snow/60">Loading Culinary Experience...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEDICATED FOOD DISH DETAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (foodItem) {
    const foodName = foodItem.name;
    const foodImage = getFoodImage(foodItem.name, foodItem.image_url);
    const foodPrice = getFoodPrice(foodItem.name, (foodItem as any).price);
    
    // Find matching story metadata
    const metaKey = Object.keys(DISH_STORIES).find(
      k => foodName.toLowerCase().includes(k) || k.includes(foodName.toLowerCase())
    );
    const meta = metaKey ? DISH_STORIES[metaKey] : {
      region: 'Nordic Heritage Kitchen',
      dietary: ['Locally Sourced', 'Fresh Norwegian Produce'],
      tags: ['Traditional Recipe', 'Artisanal Prep'],
      story: foodItem.description || 'A quintessential Norwegian culinary experience prepared according to age-old recipes.',
      ingredients: ['Locally Harvested Ingredients', 'Nordic Herbs & Spices', 'Pure Spring Water']
    };

    const handleAddDishToCart = () => {
      addItem({
        item_type: 'PRODUCT',
        item_id: foodItem.id,
        name: foodItem.name,
        description: foodItem.description || meta.region,
        unit_price: foodPrice,
        quantity: quantity,
        image: foodImage,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    };

    const handleOrderDishNow = () => {
      addItem({
        item_type: 'PRODUCT',
        item_id: foodItem.id,
        name: foodItem.name,
        description: foodItem.description || meta.region,
        unit_price: foodPrice,
        quantity: quantity,
        image: foodImage,
      });
      navigate('/checkout');
    };

    return (
      <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-arctic-gold/30">
        <SEO 
          title={`${foodItem.name} — Authentic Norwegian Cuisine`}
          description={foodItem.description || meta.story}
          ogImage={foodImage}
        />

        {/* Hero Section */}
        <div className="relative h-[55vh] min-h-[420px] w-full bg-black overflow-hidden">
          <OptimizedImage
            src={foodImage}
            alt={foodItem.name}
            category="food"
            fallbackSrc="/images/food_salmon_1787013684123.jpg"
            className="w-full h-full object-cover opacity-85"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-night via-deep-night/40 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/70">
            <Link to="/food" className="hover:text-[#FF7F50] transition-colors flex items-center gap-1">
              <Utensils size={14} /> Culinary
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#FF7F50]">{foodItem.name}</span>
          </div>

          <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-12 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1440px] mx-auto">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-[#FF7F50] text-white px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest rounded-md shadow-md">
                  {(foodItem as any).category || 'Traditional Norwegian Dish'}
                </span>
                {foodItem.featured && (
                  <span className="bg-arctic-gold text-deep-night px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest rounded-md shadow-md">
                    Featured
                  </span>
                )}
                <span className="bg-white/10 backdrop-blur-md text-snow px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest rounded-md border border-white/10">
                  Fresh Daily
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-snow drop-shadow-md leading-tight">
                {foodItem.name}
              </h1>
              
              <div className="flex items-center gap-3 text-xs text-snow/70 mt-2 font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-[#FF7F50]" /> {meta.region}</span>
                {(foodItem as any).prep_time && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {(foodItem as any).prep_time} prep</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-midnight/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl min-w-[280px] shadow-2xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-snow/50 block mb-1">Portion Price</span>
              <div className="text-3xl font-display font-black text-snow mb-4">
                {formatPrice(foodPrice * quantity)}
              </div>

              {/* Quantity Controls */}
              {!(foodItem.status === 'ARCHIVED' || foodItem.status === 'DRAFT' || (foodItem as any).is_available === false || (foodItem as any).available === false) && (
                <div className="flex items-center justify-between bg-deep-night border border-white/10 rounded-xl p-1 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm text-snow">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              {(foodItem.status === 'ARCHIVED' || foodItem.status === 'DRAFT' || (foodItem as any).is_available === false || (foodItem as any).available === false) ? (
                <div className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-red-500/20 text-red-300 border border-red-500/30">
                  Temporarily Unavailable
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleAddDishToCart}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF7F50] hover:bg-[#E86A3E] text-white'
                    }`}
                  >
                    {isAdded ? <><Check size={14} /> Added</> : <><ShoppingCart size={14} /> Add to Cart</>}
                  </button>
                  <button
                    onClick={handleOrderDishNow}
                    className="flex-1 py-3 px-4 bg-arctic-gold hover:bg-snow text-deep-night rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Order Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dish Content Body */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left 2 Cols: Details & Story */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Dietary Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-3">Dietary Attributes</h3>
                <div className="flex flex-wrap gap-2">
                  {meta.dietary.map((tag, idx) => (
                    <span key={idx} className="bg-[#FF7F50]/15 text-[#FF7F50] border border-[#FF7F50]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">
                      {tag}
                    </span>
                  ))}
                  {meta.tags.map((tag, idx) => (
                    <span key={idx} className="bg-white/5 text-snow/70 border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div className="bg-midnight border border-white/10 p-8 rounded-3xl space-y-4">
                <h2 className="text-xl font-display font-bold text-snow flex items-center gap-2">
                  <Sparkles size={18} className="text-arctic-gold" />
                  Heritage & Cultural Story
                </h2>
                <p className="text-snow/80 text-base leading-relaxed font-sans">
                  {meta.story}
                </p>
              </div>

              {/* Artisanal Ingredients */}
              <div className="bg-midnight border border-white/10 p-8 rounded-3xl space-y-4">
                <h2 className="text-xl font-display font-bold text-snow">Artisanal Norwegian Ingredients</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {meta.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-snow/80">
                      <span className="w-2 h-2 rounded-full bg-[#FF7F50]" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Guarantee */}
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-xs text-emerald-300">
                <ShieldCheck size={28} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-emerald-200">Norwegian Culinary Guarantee</div>
                  <div>Prepared fresh daily with certified organic farm and coastal ingredients according to protected heritage recipes.</div>
                </div>
              </div>

            </div>

            {/* Right Column: Related Dishes */}
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold text-snow">Related Nordic Dishes</h3>
              <div className="space-y-4">
                {relatedFoods.map((relDish) => {
                  const relImg = getFoodImage(relDish.name, relDish.image_url);
                  const relPrice = getFoodPrice(relDish.name, (relDish as any).price);
                  return (
                    <Link
                      key={relDish.id}
                      to={`/food/${relDish.id}`}
                      className="flex gap-4 p-3 bg-midnight border border-white/10 hover:border-[#FF7F50]/50 rounded-2xl transition-all group overflow-hidden"
                    >
                      <div className="w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0">
                        <OptimizedImage
                          src={relImg}
                          alt={relDish.name}
                          category="food"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#FF7F50] block truncate">
                            {(relDish as any).category || 'Traditional'}
                          </span>
                          <h4 className="font-bold text-snow text-sm truncate group-hover:text-[#FF7F50] transition-colors">
                            {relDish.name}
                          </h4>
                        </div>
                        <span className="font-display font-bold text-snow text-xs">
                          {formatPrice(relPrice)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/food"
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-snow text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-colors block text-center"
              >
                Browse All Dishes
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RESTAURANT DINING EXPERIENCE VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 flex items-center justify-center p-4">
        <div className="bg-midnight p-12 text-center max-w-md w-full border border-white/10 rounded-2xl shadow-xl">
          <Utensils className="w-12 h-12 text-snow/30 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-snow mb-2">Establishment Not Found</h2>
          <p className="text-sm text-snow/60 mb-6">The culinary listing you requested could not be located.</p>
          <Link 
            to="/food" 
            className="inline-block w-full py-3.5 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-snow transition-colors"
          >
            Explore Dining & Food
          </Link>
        </div>
      </div>
    );
  }

  const contact = (restaurant.contact_info || {}) as any;
  const hours = (restaurant.opening_hours || {}) as any;
  const menu = (restaurant.menu || []) as any[];
  const restaurantMainImage = restaurant.image_url || getRestaurantImage(restaurant.name);
  const photos = (restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos : [restaurantMainImage]) as string[];

  const parsePrice = (priceStr: any): number => {
    if (typeof priceStr === 'number') return priceStr;
    const num = String(priceStr || '').replace(/[^0-9.]/g, '');
    return num ? Number(num) : 250;
  };

  const handleAddMenuItem = (item: any, categoryName?: string) => {
    const unitPrice = parsePrice(item.price);
    addItem({
      item_type: 'RESTAURANT',
      item_id: restaurant.id,
      name: `${restaurant.name}: ${item.name}`,
      description: `${categoryName ? categoryName + ' • ' : ''}${item.description || ''}`,
      unit_price: unitPrice,
      quantity: 1,
      image: photos[0] || restaurantMainImage,
    });
    setAddedItemName(item.name);
    setTimeout(() => setAddedItemName(null), 1500);
  };

  const handleNextStep = () => {
    if (step === 1 && (!date || !time)) return;
    if (step === 3 && (!guestName || !guestEmail)) return;
    setStep(step + 1);
  };


  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#2C1810] font-sans pb-24 selection:bg-[#FF7F50]/20">
      
      {/* Hero Gallery */}
      <div className="h-[50vh] min-h-[400px] w-full relative grid grid-cols-4 gap-2 bg-[#1A0F0A]">
        <div className="col-span-4 md:col-span-2 relative h-full group overflow-hidden cursor-pointer">
          <OptimizedImage 
            src={photos[0]} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt={restaurant.name} 
            category="food"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/80 to-transparent pointer-events-none"></div>
          
          <div className="absolute top-24 left-6 md:left-12 text-white/70 text-sm font-bold tracking-widest flex items-center gap-2 z-10">
            <Link to="/food" className="hover:text-white transition-colors">DINING</Link> 
            <ChevronRight className="w-4 h-4" /> 
            <span className="text-white">{restaurant.name.toUpperCase()}</span>
          </div>
        </div>
        <div className="hidden md:grid col-span-2 grid-rows-2 gap-2 h-full">
           <div className="relative group overflow-hidden cursor-pointer">
             <OptimizedImage 
               src={photos[1] || photos[0]} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               alt={`${restaurant.name} interior`} 
               category="stay"
               containerClassName="w-full h-full"
             />
           </div>
           <div className="grid grid-cols-2 gap-2">
             <div className="relative group overflow-hidden cursor-pointer">
               <OptimizedImage 
                 src={photos[2] || photos[0]} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 alt={`${restaurant.name} dish`} 
                 category="food"
                 containerClassName="w-full h-full"
               />
             </div>
             <div className="bg-[#2C1810] flex items-center justify-center text-[#FF7F50] text-sm font-bold tracking-widest hover:bg-[#1A0F0A] cursor-pointer transition-colors uppercase">
               View Gallery
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 w-full lg:w-2/3 space-y-12">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisine?.map((c, i) => (
                  <span key={i} className="bg-[#FF7F50]/10 text-[#FF7F50] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{c}</span>
                ))}
                <span className="bg-[#2C1810]/5 text-[#2C1810]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {restaurant.type?.replace('_', ' ') || 'Nordic Dining'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-bold mb-6">
                <span className="flex items-center gap-1 text-[#FF7F50]"><Star size={16} className="fill-[#FF7F50]" /> {restaurant.rating} (342 Reviews)</span>
                <span>•</span>
                <span>{restaurant.price_range}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> {restaurant.location?.name || 'Norway'}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Menu Section */}
            {menu.length > 0 && (
              <div className="border-t border-[#2C1810]/10 pt-12">
                <h3 className="text-2xl font-display font-bold mb-8">Sample Menu & Pre-Order</h3>
                <div className="space-y-12">
                  {menu.map((category, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF7F50] mb-6">{category.category}</h4>
                      <div className="space-y-6">
                        {category.items.map((item: any, j: number) => {
                          const isItemAdded = addedItemName === item.name;
                          return (
                            <div key={j} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#2C1810]/5 last:border-0 last:pb-0 group">
                              <div className="flex-1">
                                <div className="font-bold text-lg text-[#2C1810] group-hover:text-[#FF7F50] transition-colors">{item.name}</div>
                                {item.description && (
                                  <div className="text-sm text-gray-500 mt-1 max-w-md leading-relaxed">{item.description}</div>
                                )}
                              </div>
                              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="font-bold text-base text-[#2C1810] shrink-0 font-display">{item.price}</div>
                                <button
                                  onClick={() => handleAddMenuItem(item, category.category)}
                                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                                    isItemAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#FF7F50] text-white hover:bg-[#E86A3E]'
                                  }`}
                                >
                                  {isItemAdded ? (
                                    <>
                                      <Check size={13} /> Added
                                    </>
                                  ) : (
                                    <>
                                      <Plus size={13} /> Add to Order
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar / Reservation Widget */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-white border border-[#2C1810]/10 p-8 shadow-xl sticky top-28">
              
              {/* Progress Indicator */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? 'bg-[#FF7F50] text-white ring-4 ring-white' : 
                    step > s ? 'bg-[#2C1810] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-4 h-4"/> : s}
                  </div>
                ))}
              </div>

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Date & Time</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Guests</label>
                    <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium">
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Available Times</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['17:00','18:30','19:00','20:30','21:00'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTime(t)}
                          className={`p-2 text-sm font-bold transition-colors border ${time === t ? 'bg-[#FF7F50] text-white border-[#FF7F50]' : 'bg-gray-50 border-gray-200 hover:border-[#FF7F50]'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleNextStep} disabled={!date || !time} className="w-full mt-4 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors disabled:opacity-50">
                    Next Step
                  </button>
                </div>
              )}


              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Table Preference</h3>
                  <div className="space-y-3">
                    {['Standard', 'Window Seat', 'Outdoor Patio', 'Chef\'s Counter'].map(pref => (
                      <label key={pref} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${tablePref === pref ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-gray-200 hover:border-[#FF7F50]/50'}`}>
                        <span className="font-bold text-sm">{pref}</span>
                        <input type="radio" name="tablePref" checked={tablePref === pref} onChange={() => setTablePref(pref)} className="accent-[#FF7F50]" />
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleNextStep} className="flex-1 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors">Next</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-display font-bold mb-4">Guest Details</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone (Optional)</label>
                    <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#FF7F50] transition-colors font-medium" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleNextStep} disabled={!guestName || !guestEmail} className="flex-1 bg-[#2C1810] text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-[#FF7F50] transition-colors disabled:opacity-50">Confirm</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center py-4">
                  <div className="w-16 h-16 bg-[#FF7F50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#FF7F50]"/>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Table Confirmed</h3>
                  <p className="text-gray-600 text-sm mb-6">Your reservation at {restaurant.name} is confirmed for {guests} guests on {date} at {time}.</p>
                  
                  <div className="bg-gray-50 p-4 text-left border border-gray-100 rounded-sm mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-bold">{guestName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Preference</span>
                      <span className="font-bold">{tablePref}</span>
                    </div>
                  </div>

                  <button onClick={() => setStep(1)} className="text-sm font-bold uppercase tracking-widest text-[#FF7F50] hover:text-[#2C1810] transition-colors">Make another booking</button>
                </div>
              )}

            </div>

            <div className="bg-[#1A0F0A] text-white p-6 shadow-xl">
              <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-[#FF7F50]">Contact & Hours</h3>
              <div className="space-y-4 text-sm mb-6">
                {contact.phone && <div className="flex items-center gap-3"><Phone size={16}/> {contact.phone}</div>}
                {contact.website && <div className="flex items-center gap-3"><Globe size={16}/> <a href={`https://${contact.website}`} target="_blank" rel="noreferrer" className="hover:text-[#FF7F50] transition-colors">{contact.website}</a></div>}
                {contact.address && <div className="flex items-center gap-3"><MapPin size={16}/> {contact.address}</div>}
              </div>
              <div className="pt-6 border-t border-white/10 space-y-2 text-sm">
                {Object.entries(hours).map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize text-white/50">{day}</span>
                    <span className="font-medium">{String(time)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
