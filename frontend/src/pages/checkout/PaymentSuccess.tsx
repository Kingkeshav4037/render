import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Download, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';

export const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'PROCESSING' | 'PAID' | 'FAILED'>('PROCESSING');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('order_id');
    
    if (id) {
      setOrderId(id);
      
      const checkStatus = async () => {
        const { data } = await supabase
          .from('orders')
          .select('status')
          .eq('id', id)
          .single();
          
        if (data && data.status === 'PAID') {
          setStatus('PAID');
          clearCart();
        }
      };

      // Initial check
      checkStatus();

      // Poll every 3 seconds
      const interval = setInterval(checkStatus, 3000);
      
      return () => clearInterval(interval);
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        {status === 'PROCESSING' ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
            <Loader2 size={48} className="mx-auto text-navy-900 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Processing Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your transaction securely...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-aurora-green p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
              <CheckCircle size={64} className="mx-auto text-white mb-4 relative z-10" />
              <h1 className="text-3xl font-extrabold text-white relative z-10">Booking Confirmed!</h1>
              <p className="text-green-50 mt-2 relative z-10">Your payment was successfully processed.</p>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                  <p className="text-lg font-bold text-navy-900">{orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    <Check size={12} /> Paid
                  </div>
                </div>
              </div>

            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider">Next Steps</h3>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-navy-900 shadow-sm"><Calendar size={20} /></div>
                  <div className="text-left">
                    <div className="font-bold text-navy-900 text-sm">Add to Dashboard</div>
                    <div className="text-xs text-gray-500 mt-0.5">View your itinerary and manage this trip</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-navy-900 shadow-sm"><Download size={20} /></div>
                  <div className="text-left">
                    <div className="font-bold text-navy-900 text-sm">Download Invoice & Receipt</div>
                    <div className="text-xs text-gray-500 mt-0.5">PDF format for your records</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button 
                onClick={() => window.location.href = '/user/bookings'}
                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors shadow-md"
              >
                Continue Exploring Norway
              </button>
            </div>
          </div>
          </div>
        )}
        
        {status === 'PAID' && (
          <p className="text-center text-sm text-gray-400 mt-6">
            A confirmation email has been sent to your address.
          </p>
        )}

      </div>
    </div>
  );
};
