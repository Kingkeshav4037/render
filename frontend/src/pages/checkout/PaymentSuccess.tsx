import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  Download, 
  ChevronRight, 
  Check, 
  Loader2, 
  AlertCircle, 
  Package, 
  Utensils, 
  Home, 
  Compass, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { supabase } from '../../lib/supabase';
import { invoiceService } from '../../services/invoice/invoiceService';
import { SEO } from '../../components/shared/SEO';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  description?: string | null;
  item_type?: any;
  item_id?: string | null;
  quantity?: number | null;
  amount: number;
  currency?: string | null;
  booking_id?: string | null;
}

interface PaymentTx {
  id: string;
  gateway: string;
  gateway_order_id?: string | null;
  gateway_payment_id?: string | null;
  amount: number;
  currency?: string | null;
  status?: any;
  created_at?: string | null;
}


export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, items: cartItems } = useCart();
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyStore();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'PROCESSING' | 'PAID' | 'FAILED' | 'UNAUTHORIZED' | 'NOT_FOUND'>('PROCESSING');
  const [orderData, setOrderData] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentTx, setPaymentTx] = useState<PaymentTx | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const urlId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('order_id') || new URLSearchParams(window.location.search).get('id') : null;
  const id = searchParams.get('order_id') || searchParams.get('id') || urlId;


  useEffect(() => {
    if (!id) {
      setStatus('NOT_FOUND');
      return;
    }
    setOrderId(id);

    let isMounted = true;

    const fetchOrderDetails = async () => {
      try {
        // 1. Fetch Order from Database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (orderError || !order) {
          if (isMounted) setStatus('NOT_FOUND');
          return;
        }

        // 2. Authorization check if order is tied to a user
        if (order.user_id && user && order.user_id !== user.id) {
          if (isMounted) setStatus('UNAUTHORIZED');
          return;
        }

        if (isMounted) setOrderData(order);

        // 3. Fetch Order Items
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);

        if (isMounted && items) {
          setOrderItems(items);
        }

        // 4. Fetch Payment Transaction
        const { data: tx } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('order_id', id)
          .maybeSingle();


        if (isMounted && tx) {
          setPaymentTx(tx);
        }

        // 5. Evaluate order status
        const orderStatus = (order.status as string) || '';
        if (orderStatus === 'PAID' || orderStatus === 'CONFIRMED' || orderStatus === 'COMPLETED') {
          if (isMounted) {
            setStatus('PAID');
            // Safe cart clearing only on verified paid status
            if (cartItems.length > 0) {
              clearCart();
            }
          }
        } else if (orderStatus === 'FAILED' || orderStatus === 'CANCELLED') {
          if (isMounted) setStatus('FAILED');
        } else {
          // Still processing/pending payment
          if (isMounted) setStatus('PROCESSING');
        }

      } catch (err) {
        console.error('Error fetching order confirmation:', err);
      }
    };

    fetchOrderDetails();

    // Poll every 2.5s for up to 10 attempts while in PROCESSING
    const interval = setInterval(() => {
      setPollCount(prev => {
        if (prev < 10 && status === 'PROCESSING') {
          fetchOrderDetails();
          return prev + 1;
        }
        return prev;
      });
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, user, status, clearCart, cartItems.length]);

  const handleDownloadInvoice = async () => {
    if (!orderId) return;

    try {
      const { data: invoices, error } = await (supabase as any)
        .from('invoices')
        .select('*')
        .eq('order_id', orderId);

      if (error || !invoices || invoices.length === 0) {
        toast.info('Invoice is finalizing. Please access it from your dashboard shortly.');
        return;
      }

      const inv = invoices[0];
      const invoiceData = {
        invoiceNumber: inv.invoice_number || `INV-${orderId.substring(0, 8).toUpperCase()}`,
        invoiceDate: new Date(inv.invoice_date || inv.created_at || Date.now()).toLocaleDateString('en-GB'),
        dueDate: new Date(inv.due_date || inv.created_at || Date.now()).toLocaleDateString('en-GB'),
        customerName: inv.customer_name || user?.email || 'Customer',
        customerEmail: inv.customer_email || user?.email || '',
        customerCountry: inv.customer_country || 'Norway',
        currency: inv.currency || orderData?.currency || 'NOK',
        items: inv.items || orderItems.map(i => ({
          description: i.description || 'Norway SmartLife Service',
          quantity: i.quantity || 1,
          unit_price: i.amount / (i.quantity || 1),
          total: i.amount
        })),
        subtotal: Number(inv.subtotal_amount || (orderData?.total_amount ? orderData.total_amount * 0.8 : 0)),
        vatStandard: Number(inv.vat_standard_amount || (orderData?.total_amount ? orderData.total_amount * 0.2 : 0)),
        vatReduced: Number(inv.vat_reduced_amount || 0),
        totalAmount: Number(inv.total_amount || orderData?.total_amount || 0),
        paymentMethod: inv.payment_method || 'CARD',
        paymentGatewayRef: inv.payment_gateway_ref || paymentTx?.gateway_order_id || orderId,
        bookingRef: inv.booking_id ? `BKG-${inv.booking_id.substring(0, 8).toUpperCase()}` : undefined,
        status: (inv.status || 'PAID') as 'PAID' | 'REFUNDED' | 'PENDING',
      };

      invoiceService.openPrintableInvoice(invoiceData);
    } catch (err) {
      console.error('Error generating invoice:', err);
      toast.error('Failed to open invoice. Please download it from your Bookings dashboard.');
    }
  };

  const getItemTypeIcon = (type?: string | null) => {
    switch (type) {
      case 'PRODUCT': return <Package size={16} className="text-arctic-gold" />;
      case 'RESTAURANT': return <Utensils size={16} className="text-amber-400" />;
      case 'ACCOMMODATION': return <Home size={16} className="text-emerald-400" />;
      default: return <Compass size={16} className="text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-arctic-gold/30">
      <SEO 
        title="Order Confirmation | Norway SmartLife"
        description="Your order and payment have been confirmed. View order details, fulfillment status, and receipts."
      />

      <div className="max-w-3xl mx-auto">
        {status === 'NOT_FOUND' ? (
          <div className="bg-midnight border border-white/10 p-10 rounded-3xl text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-snow mb-2">Order Not Found</h2>
            <p className="text-sm text-snow/60 mb-6 max-w-md mx-auto">
              We could not find an order matching reference <span className="font-mono text-arctic-gold">{orderId || 'None'}</span>.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-arctic-gold text-deep-night rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-snow transition-colors"
            >
              <ShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        ) : status === 'UNAUTHORIZED' ? (
          <div className="bg-midnight border border-red-500/20 p-10 rounded-3xl text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-snow mb-2">Access Denied</h2>
            <p className="text-sm text-snow/60 mb-6 max-w-md mx-auto">
              You do not have permission to view this order confirmation. Please sign in with the account that placed this order.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-snow hover:bg-white/20 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : status === 'PROCESSING' ? (
          <div className="bg-midnight border border-white/10 p-12 rounded-3xl text-center shadow-2xl space-y-4">
            <Loader2 size={48} className="mx-auto text-arctic-gold animate-spin" />
            <h2 className="text-2xl font-display font-bold text-snow">Verifying Payment Confirmation</h2>
            <p className="text-sm text-snow/60 max-w-md mx-auto">
              Connecting with the secure payment network to verify your transaction signature...
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-snow/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Order Reference: {orderId}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-midnight border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-emerald-950 via-deep-night to-midnight border-b border-emerald-500/20 p-8 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-emerald-950">
                <CheckCircle size={36} />
              </div>
              <h1 className="text-3xl font-display font-bold text-snow relative z-10 mb-2">
                Order & Payment Confirmed!
              </h1>
              <p className="text-emerald-300/80 text-sm font-sans relative z-10 max-w-md mx-auto">
                Takk! Your transaction was verified and your order is securely recorded in the Nordic ledger.
              </p>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Order Meta Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div>
                  <span className="text-snow/50 uppercase tracking-wider block text-[10px] font-bold mb-1">Order Ref</span>
                  <span className="font-mono font-bold text-snow truncate block" title={orderId || ''}>
                    {orderId ? `#${orderId.substring(0, 8).toUpperCase()}` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-snow/50 uppercase tracking-wider block text-[10px] font-bold mb-1">Order Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 uppercase text-[11px]">
                    <Check size={12} /> {orderData?.status || 'PAID'}
                  </span>
                </div>
                <div>
                  <span className="text-snow/50 uppercase tracking-wider block text-[10px] font-bold mb-1">Payment</span>
                  <span className="font-bold text-arctic-gold uppercase text-[11px] flex items-center gap-1">
                    <ShieldCheck size={12} /> {paymentTx?.status || 'SUCCESS'}
                  </span>
                </div>
                <div>
                  <span className="text-snow/50 uppercase tracking-wider block text-[10px] font-bold mb-1">Date & Time</span>
                  <span className="text-snow/80 block text-[11px]">
                    {new Date(orderData?.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 mb-4 flex items-center gap-2">
                  <Package size={14} className="text-arctic-gold" /> Ordered Items & Fulfillment
                </h3>
                
                <div className="space-y-3">
                  {orderItems.length > 0 ? (
                    orderItems.map((item, idx) => (
                      <div 
                        key={item.id || idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-deep-night border border-white/10 flex items-center justify-center shrink-0">
                            {getItemTypeIcon(item.item_type)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm text-snow truncate">
                              {item.description || 'Nordic Item'}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-snow/50 mt-0.5">
                              <span className="uppercase text-[10px] tracking-wider font-bold text-arctic-gold">
                                {item.item_type || 'ITEM'}
                              </span>
                              {item.quantity && item.quantity > 1 && (
                                <span>Qty: {item.quantity}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-display font-bold text-snow">
                            {formatPrice(Number(item.amount || 0))}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-snow/60">
                      Standard Nordic Fulfillment Package
                    </div>
                  )}
                </div>

                {/* Total Paid Summary */}
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="font-bold text-snow/70">Authoritative Total Paid</span>
                  <span className="text-2xl font-display font-bold text-arctic-gold">
                    {formatPrice(Number(orderData?.total_amount || 0))}
                  </span>
                </div>
              </div>

              {/* Gateway & Security Audit */}
              <div className="p-4 rounded-2xl bg-deep-night border border-white/5 flex items-center justify-between text-xs text-snow/50">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-arctic-gold" />
                  <span>Gateway: <strong>{paymentTx?.gateway || 'Razorpay'}</strong></span>
                </div>
                {paymentTx?.gateway_order_id && (
                  <div className="font-mono text-[11px] truncate max-w-xs" title={paymentTx.gateway_order_id}>
                    Ref: {paymentTx.gateway_order_id}
                  </div>
                )}
              </div>

              {/* Next Steps & Action Buttons */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 mb-2">Next Actions</h3>

                <Link
                  to="/user/bookings"
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-arctic-gold/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-deep-night rounded-xl text-arctic-gold border border-white/10 shadow-sm">
                      <Calendar size={18} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-snow text-sm group-hover:text-arctic-gold transition-colors">
                        View in Bookings & Orders Dashboard
                      </div>
                      <div className="text-xs text-snow/50 mt-0.5">
                        Access your digital vouchers, trip itineraries, and order status
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-snow/40 group-hover:text-snow transition-colors" />
                </Link>

                <button 
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-deep-night rounded-xl text-emerald-400 border border-white/10 shadow-sm">
                      <Download size={18} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-snow text-sm group-hover:text-emerald-400 transition-colors">
                        Download MVA-Compliant Invoice & Tax Receipt
                      </div>
                      <div className="text-xs text-snow/50 mt-0.5">
                        Official Norwegian VAT breakdown in printable format
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-snow/40 group-hover:text-snow transition-colors" />
                </button>
              </div>

              {/* Navigation CTAs */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/shop"
                  className="flex-1 py-4 px-6 bg-arctic-gold hover:bg-snow text-deep-night font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={14} />
                </Link>
                <Link 
                  to="/explore"
                  className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-snow border border-white/10 font-bold uppercase tracking-wider text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <Compass size={14} />
                  <span>Explore Norway Stays</span>
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

