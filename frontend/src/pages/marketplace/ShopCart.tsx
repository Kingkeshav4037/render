import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Leaf,
  ShoppingBag,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export const ShopCart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getCartTotal } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { requireAuth } = useRequireAuth();

  const subtotal = getCartTotal();
  const freeShippingThreshold = 500;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;
  const estMva = subtotal * 0.25; // 25% MVA included in consumer retail price in Norway
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-deep-night text-snow font-sans pt-32 pb-24 flex items-center justify-center p-6 selection:bg-arctic-gold/30">
        <SEO title="Your Cart — Norway SmartLife" description="Your sustainable shopping cart is currently empty." />
        <div className="max-w-md w-full bg-midnight border border-white/10 p-10 text-center rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-white/5 text-arctic-gold border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-3xl font-display font-bold text-snow mb-3">Your Cart is Empty</h1>
          <p className="text-sm text-snow/60 mb-8 leading-relaxed">
            Discover innovative sustainable Norwegian gear, artisanal goods, and travel experiences.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/shop"
              className="w-full py-4 px-6 bg-arctic-gold text-deep-night font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-snow transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} /> Explore Shop & Gear
            </Link>
            <Link
              to="/food"
              className="w-full py-3.5 px-6 bg-white/5 text-snow font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              Browse Culinary & Dining
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pt-32 pb-24 selection:bg-arctic-gold/30">
      <SEO title="Shopping Cart — Norway SmartLife" description="Review your selected items and proceed to secure checkout." />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/60 mb-2">
              <Link to="/shop" className="hover:text-arctic-gold transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Shop
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-snow">
              Shopping Cart <span className="text-snow/50 text-2xl">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-midnight border border-white/10 p-6 rounded-2xl mb-8 shadow-md">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="flex items-center gap-2 text-snow">
              <Truck size={16} className="text-arctic-gold" />
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-400">🎉 You have unlocked Free Carbon-Neutral Eco-Delivery!</span>
              ) : (
                <span>Add {formatPrice(freeShippingThreshold - subtotal)} more for Free Eco-Delivery</span>
              )}
            </span>
            <span className="text-snow/60">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-arctic-gold to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Cart Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-midnight border border-white/10 hover:border-white/20 p-6 rounded-3xl transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-6 group"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
                    <OptimizedImage
                      src={item.image || '/images/smart_energy_monitor.jpg'}
                      alt={item.name}
                      category="product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-arctic-gold">
                        {item.item_type}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-snow truncate group-hover:text-arctic-gold transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-snow/60 line-clamp-1 mt-1 font-sans">
                        {item.description}
                      </p>
                    )}
                    <div className="text-sm font-display font-bold text-snow mt-2">
                      {formatPrice(item.unit_price)} <span className="text-[10px] text-snow/50 font-normal">per unit</span>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0">
                    <div className="flex items-center bg-deep-night border border-white/10 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease item quantity"
                        className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm px-3 text-snow">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase item quantity"
                        className="w-8 h-8 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-display font-bold text-lg text-snow">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-snow/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-snow transition-colors"
              >
                <ArrowLeft size={14} /> Continue Shopping in Norway Marketplace
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-midnight border border-white/10 p-8 rounded-3xl sticky top-32 shadow-2xl space-y-6">
              <h2 className="text-xl font-display font-bold uppercase tracking-widest text-snow border-b border-white/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-snow/70 font-medium">
                  <span>Subtotal</span>
                  <span className="text-snow font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-snow/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} className="text-arctic-gold" /> Eco-Delivery
                  </span>
                  <span className="text-snow font-bold">
                    {shipping === 0 ? <span className="text-emerald-400">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-snow/50 text-xs">
                  <span>Estimated MVA (25% included)</span>
                  <span>{formatPrice(estMva)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                <span className="font-bold uppercase tracking-widest text-xs text-snow/80">Total to Pay</span>
                <span className="font-display font-black text-3xl text-arctic-gold">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  requireAuth(() => {
                    navigate('/checkout');
                  }, { message: 'Sign in to continue to checkout.', returnTo: '/checkout' });
                }}
                className="w-full py-4 px-6 bg-arctic-gold hover:bg-snow text-deep-night rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-arctic-gold/20 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-white/5 space-y-2.5 text-[11px] text-snow/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>256-Bit Bank Level Secure Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf size={14} className="text-emerald-400 shrink-0" />
                  <span>100% Certified Carbon-Neutral Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-arctic-gold shrink-0" />
                  <span>30-Day Nordic Return Guarantee</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopCart;
