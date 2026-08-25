import React, { useState, useEffect } from 'react';
import { X, Leaf, Star, ShoppingCart, ArrowRight, Check, ShieldCheck, Truck, RefreshCw, Plus, Minus, Zap } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../shared/OptimizedImage';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../../services/shopService';

type ProductRow = Database['public']['Tables']['products']['Row'];

interface ProductDetailModalProps {
  product: Product | ProductRow | any | null;
  onClose: () => void;
}


// Rich product specifications and sustainability benefits
const PRODUCT_EXTENSIONS: Record<string, { specs: Record<string, string>; features: string[]; materials: string }> = {
  'Smart Eco Thermostat': {
    specs: { 'Connectivity': 'Zigbee 3.0 / Matter', 'Power': 'Battery & 24V C-Wire', 'Compatibility': 'All Norwegian Heating Systems', 'Warranty': '3-Year Nordic Guarantee' },
    features: ['AI Heating Schedule Optimizer', 'Real-time Nord Pool spot price tracking', 'Humidity & Air Quality Monitor', 'Window Open Detection'],
    materials: '98% Recycled Aerospace-Grade Aluminium & Biopolymer'
  },
  'EV Smart Cable 22kW': {
    specs: { 'Output': '3-Phase 32A / 22 kW', 'Length': '7.5 Meters High-Flex', 'Weather Rating': 'IP67 (-35°C to +50°C)', 'Locking': 'Integrated Smart Lock' },
    features: ['Ultra-flexible Nordic sub-zero rubber', 'Integrated Type 2 LED charge indicator', 'Silver-plated copper conductors', 'Heavy-duty impact casing'],
    materials: 'Halogen-Free Thermoplastic Polyurethane'
  },
  'Nordic Wool Thermal Layer': {
    specs: { 'Micron': '18.5 Ultra-Fine Merino', 'Weight': '260 g/m² Heavyweight', 'Origin': '100% Norwegian Grazed Wool', 'Care': 'Machine Washable Wool Cycle' },
    features: ['Natural thermal temperature regulation', 'Odor-resistant antimicrobial fibers', 'Flatlock non-chafing seams', 'Breathable moisture-wicking weave'],
    materials: 'Certified Animal-Welfare Norwegian Virgin Wool'
  },
  'Solar Adventure Pack 45L': {
    specs: { 'Solar Output': '24W SunPower ETFE Cells', 'Output Ports': 'Dual USB-C PD 30W + USB-A', 'Volume': '45 Liters Expandable', 'Weight': '1.35 kg' },
    features: ['High-efficiency flexible solar panel', 'Waterproof roll-top alpine compartment', 'Ergonomic air-mesh back ventilation', 'Integrated emergency whistle & rain cover'],
    materials: '100% Ocean-Bound Recycled Ripstop Nylon'
  }
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const navigate = useNavigate();

  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const productName = product.name;
  const productPrice = Number(product.price);
  const extKey = Object.keys(PRODUCT_EXTENSIONS).find(k => productName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(productName.toLowerCase()));
  const ext = extKey ? PRODUCT_EXTENSIONS[extKey] : {
    specs: { 'Eco Rating': 'A+++ Nordic Swan Certified', 'Origin': 'Crafted in Norway', 'Warranty': '2-Year Standard Warranty', 'Standard': 'CE & RoHS Compliant' },
    features: ['Engineered for harsh Nordic climates', 'Zero single-use plastic in packaging', 'Carbon-offset verified lifecycle', 'High energy efficiency'],
    materials: 'Eco-certified sustainable & recyclable composites'
  };

  const handleAddToCart = () => {
    addItem({
      item_type: 'PRODUCT',
      item_id: product.id,
      name: product.name,
      description: product.category,
      unit_price: productPrice,
      quantity: quantity,
      image: product.img,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    addItem({
      item_type: 'PRODUCT',
      item_id: product.id,
      name: product.name,
      description: product.category,
      unit_price: productPrice,
      quantity: quantity,
      image: product.img,
    });
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-deep-night/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative bg-midnight border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300 my-8 text-snow"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-20 bg-deep-night/80 hover:bg-white/20 text-snow p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-arctic-gold"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image & Badges */}
          <div className="relative bg-black h-72 md:h-full min-h-[320px] overflow-hidden flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10">
            <OptimizedImage
              src={product.img}
              alt={product.name}
              category="product"
              className="w-full h-full object-cover rounded-2xl"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              <span className="bg-arctic-gold text-deep-night px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest rounded-full shadow-lg">
                {product.category}
              </span>
              <div className="bg-deep-night/90 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Star size={13} className="text-arctic-gold fill-arctic-gold" />
                <span className="text-xs font-bold text-snow">{product.rating}</span>
                <span className="text-[10px] text-snow/50">(128 reviews)</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Leaf size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Verified Climate Impact</div>
                  <div className="text-[11px] text-emerald-200/80">Offsets {Math.abs(product.co2)} kg CO₂ per item</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto custom-scrollbar">
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-arctic-gold mb-1 block">
                  Sustainable Nordic Hardware
                </span>
                <h2 id="product-modal-title" className="text-2xl sm:text-3xl font-display font-semibold text-snow leading-tight mb-2">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-snow">
                    {formatPrice(productPrice)}
                  </span>
                  <span className="text-xs font-bold uppercase text-snow/50 tracking-wider">NOK incl. MVA</span>
                </div>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">In Stock & Ready for Eco-Delivery</span>
                <span className="text-snow/40">• {product.stock || 45} units remaining</span>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {ext.features.map((f, i) => (
                    <li key={i} className="text-xs text-snow/80 flex items-start gap-2">
                      <Zap size={14} className="text-arctic-gold shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 mb-3">Specifications</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-2">
                  {Object.entries(ext.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-snow/50">{key}</span>
                      <span className="font-bold text-snow">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainable Materials */}
              <div className="flex items-center gap-2.5 text-xs text-snow/70 bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldCheck size={16} className="text-arctic-gold shrink-0" />
                <span>Materials: <strong>{ext.materials}</strong></span>
              </div>
            </div>

            {/* Quantity & CTA Footer */}
            <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-snow/50 block">Quantity</span>
                  <div className="text-sm font-bold text-snow">Subtotal: {formatPrice(productPrice * quantity)}</div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-deep-night border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-snow">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isAdded 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-snow border border-white/20'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-4 bg-arctic-gold hover:bg-snow text-deep-night rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-arctic-gold/20 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-snow/50 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1"><Truck size={12} className="text-arctic-gold" /> Free Nordic Delivery</span>
                <Link 
                  to={`/shop/${product.id}`}
                  onClick={onClose}
                  className="text-arctic-gold hover:underline font-bold"
                >
                  View Full Product Page & Specs →
                </Link>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
};
