import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../shared/OptimizedImage';

import { Button } from '../ui/Button';

export const CartDrawer = () => {
  const { items, getCartTotal, isOpen, setIsOpen, removeItem } = useCart();
  const { currency, formatPrice } = useCurrencyStore();
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
              {items.length}
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:outline-none"
          >
            <X size={20} />
          </button>
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
                Discover Norway's fjord hotels, guided alpine treks, and authentic arctic experiences.
              </p>
              <Button 
                variant="primary"
                onClick={() => { setIsOpen(false); navigate('/explore'); }}
                className="bg-navy-900 text-white hover:bg-aurora-green hover:text-navy-900 text-xs uppercase tracking-widest font-bold py-3 px-6 shadow-md transition-all"
              >
                Explore Destinations
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard 
                key={item.id} 
                item={item} 
                removeItem={removeItem} 
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
            <p className="text-[10px] text-gray-400">Taxes and fees calculated at checkout. Free cancellation up to 48 hours before.</p>
            
            <button 
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
              className="w-full bg-navy-900 text-white font-bold text-sm tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10 group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-900 focus-visible:outline-none"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck size={12} className="text-aurora-green" />
              <span>Official Norwegian Tourism Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Extracted to manage local image error state
const CartItemCard = ({ item, removeItem, formatPrice }: { item: any, removeItem: (id: string) => void, formatPrice: (price: number) => string }) => {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
        <OptimizedImage 
          src={item.image} 
          alt={item.name} 
          category="product"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          containerClassName="w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.item_type}</span>
            <h3 className="font-bold text-navy-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
          </div>
          <button 
            onClick={() => removeItem(item.id)} 
            aria-label={`Remove ${item.name} from cart`}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {item.start_time && item.end_time && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">
            <Calendar size={12} className="text-gray-400" />
            {new Date(item.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
            {item.item_type === 'ACCOMMODATION' && ` - ${new Date(item.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-end pt-2 border-t border-gray-50">
          <span className="text-xs font-bold text-gray-500">QTY: {item.quantity}</span>
          <span className="font-display font-black text-navy-900">{formatPrice(item.unit_price)}</span>
        </div>
      </div>
    </div>
  );
};
