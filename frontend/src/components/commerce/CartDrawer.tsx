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
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-navy-900" size={20} />
            <h2 className="font-display font-bold text-lg text-navy-900">Your Selection</h2>
            <span className="bg-aurora-green/20 text-navy-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors"
                title="Clear all items from cart"
              >
                Clear
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close cart"
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:outline-none"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-gray-50 text-navy-900/40 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                <ShoppingBag size={36} className="stroke-1.5" />
              </div>
              <h3 className="font-display font-bold text-lg text-navy-900 mb-2">Your Cart is Empty</h3>
              <p className="font-sans text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                Discover Norway's culinary dishes, eco products, fjord stays, and authentic arctic experiences.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button 
                  variant="primary"
                  onClick={() => { setIsOpen(false); navigate('/food'); }}
                  className="bg-[#FF7F50] text-white hover:bg-[#E86A3E] text-xs uppercase tracking-widest font-bold py-3 px-6 shadow-md transition-all w-full"
                >
                  Taste Norway Cuisine
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => { setIsOpen(false); navigate('/shop'); }}
                  className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white text-xs uppercase tracking-widest font-bold py-3 px-6 transition-all w-full"
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
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-gray-500 font-medium">Subtotal</span>
              <span className="font-display font-bold text-xl text-navy-900">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Eco-Delivery</span>
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                Included Free
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Taxes and MVA VAT calculated at checkout. Free cancellation up to 48 hours before experiences.</p>
            
            <button 
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
              className="w-full bg-navy-900 text-white font-bold text-sm tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10 group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-900 focus-visible:outline-none cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck size={12} className="text-aurora-green" />
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
        return { label: 'Eco Product', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'RESTAURANT':
        return { label: 'Culinary Dining', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'ACCOMMODATION':
        return { label: 'Fjord Stay', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ACTIVITY':
        return { label: 'Arctic Activity', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: type, color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const badge = getItemBadge(item.item_type);

  return (
    <div className="flex gap-4 p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow group relative rounded-xl">
      <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0 rounded-lg">
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
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-1 ${badge.color}`}>
              {badge.label}
            </span>
            <h3 className="font-bold text-navy-900 text-sm leading-snug truncate">{item.name}</h3>
          </div>
          <button 
            onClick={() => removeItem(item.id)} 
            aria-label={`Remove ${item.name} from cart`}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {item.start_time && item.end_time && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            <Calendar size={12} className="text-gray-400" />
            {new Date(item.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
            {item.item_type === 'ACCOMMODATION' && ` - ${new Date(item.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          {/* Quantity selector */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="p-1 text-gray-500 hover:text-navy-900 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-bold w-5 text-center text-navy-900">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="p-1 text-gray-500 hover:text-navy-900 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="font-display font-bold text-navy-900 text-sm">
            {formatPrice(item.unit_price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

