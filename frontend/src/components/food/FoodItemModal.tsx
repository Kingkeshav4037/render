import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Plus, Minus, ShoppingCart, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Food, getFoodImage, getFoodPrice } from '../../services/foodService';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../shared/OptimizedImage';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../hooks/useRequireAuth';

interface FoodItemModalProps {
  food: Food | null;
  onClose: () => void;
}

// Cultural details and culinary metadata for Norwegian traditional foods
const DISH_METADATA: Record<string, { region: string; dietary: string[]; tags: string[]; story: string; ingredients: string[] }> = {
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

export const FoodItemModal: React.FC<FoodItemModalProps> = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);
  }, [food]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!food) return null;

  const foodName = food.name;
  const foodImage = getFoodImage(food.name, food.image_url);
  const foodPrice = getFoodPrice(food.name, (food as any).price);
  
  // Find matching metadata
  const metaKey = Object.keys(DISH_METADATA).find(
    k => foodName.toLowerCase().includes(k) || k.includes(foodName.toLowerCase())
  );
  const meta = metaKey ? DISH_METADATA[metaKey] : {
    region: 'Nordic Heritage Kitchen',
    dietary: ['Locally Sourced', 'Fresh Norwegian Produce'],
    tags: ['Traditional Recipe', 'Artisanal Prep'],
    story: food.description || 'A quintessential Norwegian culinary experience prepared according to age-old recipes.',
    ingredients: ['Locally Harvested Ingredients', 'Nordic Herbs & Spices', 'Pure Spring Water']
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addItem({
        item_type: 'PRODUCT',
        item_id: food.id,
        name: food.name,
        description: food.description || meta.region,
        unit_price: foodPrice,
        quantity: quantity,
        image: foodImage,
      });
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1200);
    }, { message: 'Sign in to add food orders to your cart.' });
  };

  const handleOrderNow = () => {
    requireAuth(() => {
      addItem({
        item_type: 'PRODUCT',
        item_id: food.id,
        name: food.name,
        description: food.description || meta.region,
        unit_price: foodPrice,
        quantity: quantity,
        image: foodImage,
      });
      onClose();
      navigate('/checkout');
    }, { message: 'Sign in to order and checkout.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300 my-8 text-[#2C1810]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dish details"
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#1A0F0A] overflow-hidden">
          <OptimizedImage
            src={foodImage}
            alt={food.name}
            category="food"
            fallbackSrc="/images/food_market_hall.jpg"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#FF7F50] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
              {(food as any).category || 'Traditional Dish'}
            </span>
            {food.featured && (
              <span className="bg-arctic-gold text-deep-night px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-snow/80 mb-1 font-medium">
              <MapPin size={13} className="text-[#FF7F50]" />
              <span>{meta.region}</span>
              {(food as any).prep_time && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {(food as any).prep_time}
                  </span>
                </>
              )}
            </div>
            <h2 id="dish-modal-title" className="text-2xl sm:text-3xl font-display font-bold leading-tight text-white drop-shadow-sm">
              {food.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-18rem)] overflow-y-auto custom-scrollbar">
          
          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-2">
            {meta.dietary.map((tag, idx) => (
              <span key={idx} className="bg-[#FF7F50]/10 text-[#FF7F50] border border-[#FF7F50]/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md">
                {tag}
              </span>
            ))}
            {meta.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Story & Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Heritage & Story</h3>
            <p className="text-gray-700 text-sm leading-relaxed font-sans">
              {meta.story}
            </p>
          </div>

          {/* Key Ingredients */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Artisanal Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {meta.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-amber-50 border border-amber-200/60 text-amber-900 text-xs px-3 py-1 rounded-full font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Prepared fresh daily with certified organic Norwegian farm & sea ingredients.</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quantity & Price */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Total Price</span>
              <span className="text-2xl font-display font-black text-[#2C1810]">
                {formatPrice(foodPrice * quantity)}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold text-sm text-[#2C1810]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Order Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                isAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white border border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={16} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleOrderNow}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-[#2C1810] hover:bg-[#FF7F50] text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Order Now</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
