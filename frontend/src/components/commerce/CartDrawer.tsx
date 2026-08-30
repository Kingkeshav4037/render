import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2, Calendar, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../shared/OptimizedImage';
import { Button } from '../ui/Button';

export const CartDrawer = () => {
  const { items, getCartTotal, getItemCount, isOpen, setIsOpen, removeItem, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrencyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const totalCount = getItemCount();

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 text-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 font-sans"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <h2 className="font-display font-bold text-lg text-white">Your Selection</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Clear all items from cart"
              >
                Clear
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close cart"
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-slate-900 text-amber-400 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                <ShoppingBag size={36} className="stroke-1.5" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Your Cart is Empty</h3>
              <p className="font-sans text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                Discover Norway's culinary dishes, eco products, fjord stays, and authentic arctic experiences.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button 
                  variant="primary"
                  onClick={() => { setIsOpen(false); navigate('/food'); }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs uppercase tracking-widest font-bold py-3 px-6 shadow-md transition-all w-full rounded-xl"
                >
                  Taste Norway Cuisine
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => { setIsOpen(false); navigate('/shop'); }}
                  className="border-slate-700 text-white hover:bg-slate-800 text-xs uppercase tracking-widest font-bold py-3 px-6 transition-all w-full rounded-xl"
                >
                  Browse Eco Shop
                </Button>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard 
                key={item.id} 
                item={item} 
                removeItem={removeItem}
                updateQuantity={updateQuantity}
                formatPrice={formatPrice} 
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/95 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-slate-400 font-medium">Subtotal</span>
              <span className="font-display font-black text-2xl text-white">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Eco-Delivery</span>
              <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Included Free
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Taxes and MVA VAT calculated at checkout. Free cancellation up to 48 hours before experiences.</p>
            
            <button 
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:outline-none cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Official Norwegian Commerce & Tourism Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Extracted to manage quantity adjustment and image rendering
const CartItemCard = ({ 
  item, 
  removeItem, 
  updateQuantity, 
  formatPrice 
}: { 
  item: CartItem, 
  removeItem: (id: string) => void, 
  updateQuantity: (id: string, qty: number) => void,
  formatPrice: (price: number) => string 
}) => {
  const getItemBadge = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return { label: 'Eco Product', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'RESTAURANT':
        return { label: 'Culinary Dining', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'ACCOMMODATION':
        return { label: 'Fjord Stay', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'ACTIVITY':
        return { label: 'Arctic Activity', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'DEAL':
        return { label: 'Special Deal', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'EVENT':
        return { label: 'Nordic Event', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      default:
        return { label: type, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getItemBadge(item.item_type);

  return (
    <div className="flex gap-4 p-4 border border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-sm transition-all group relative rounded-2xl">
      <div className="w-20 h-20 bg-slate-950 overflow-hidden flex-shrink-0 rounded-xl border border-slate-800">
        <OptimizedImage 
          src={item.image} 
          alt={item.name} 
          category="product"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          containerClassName="w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mb-1 ${badge.color}`}>
              {badge.label}
            </span>
            <h3 className="font-bold text-white text-sm leading-snug truncate">{item.name}</h3>
          </div>
          <button 
            onClick={() => removeItem(item.id)} 
            aria-label={`Remove ${item.name} from cart`}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none shrink-0 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {item.start_time && item.end_time && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            <Calendar size={12} className="text-slate-500" />
            {new Date(item.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
            {item.item_type === 'ACCOMMODATION' && ` - ${new Date(item.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-800/80">
          {/* Quantity selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-bold w-5 text-center text-white">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="font-display font-bold text-amber-400 text-sm">
            {formatPrice(item.unit_price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};
