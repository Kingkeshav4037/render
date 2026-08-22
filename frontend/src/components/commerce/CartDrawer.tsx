import React from 'react';
import { X, ShoppingBag, ArrowRight, Trash2, Calendar, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';

export const CartDrawer = () => {
  const { items, getCartTotal, isOpen, setIsOpen, removeItem } = useCart();
  const { currency, formatPrice } = useCurrencyStore();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-display font-black text-navy-900 tracking-wide uppercase">Your Itinerary</h2>
            <span className="bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
              {items.length} ITEMS
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-32">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy-900 mb-2">Your journey is empty</h3>
              <p className="text-sm font-sans mb-8">Start exploring Norway and add experiences to your itinerary.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-navy-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-aurora-green hover:text-navy-900 transition-colors"
              >
                Discover Norway
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow group relative">
                <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">No Img</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.item_type}</span>
                      <h3 className="font-bold text-navy-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
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
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-navy-900">Estimated Total</span>
                <span className="text-2xl font-display font-black text-navy-900">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 bg-gray-50 p-3 justify-center">
              <ShieldCheck size={14} className="text-aurora-green" /> Secure booking via Razorpay
            </div>

            <button onClick={() => { setIsOpen(false); window.location.href = '/checkout'; }} className="w-full bg-navy-900 text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-aurora-green hover:text-navy-900 transition-colors flex items-center justify-center gap-2 group">
              Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
