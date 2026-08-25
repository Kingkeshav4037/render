import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  AlertOctagon, 
  RefreshCw, 
  ArrowLeft, 
  ShoppingBag, 
  HelpCircle, 
  ShieldAlert, 
  WifiOff, 
  Clock, 
  XCircle,
  Headphones,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components/shared/SEO';

export type FailureReason = 
  | 'DECLINED' 
  | 'PROVIDER_ERROR' 
  | 'VERIFICATION_FAILED' 
  | 'NETWORK_ERROR' 
  | 'EXPIRED' 
  | 'CANCELLED' 
  | 'UNKNOWN';

interface FailureConfig {
  title: string;
  badge: string;
  description: string;
  tips: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  colorScheme: 'red' | 'amber' | 'slate';
}

const FAILURE_CONFIGS: Record<FailureReason, FailureConfig> = {
  DECLINED: {
    title: 'Payment Declined by Bank',
    badge: 'Card Declined',
    description: 'Your bank or card issuer declined the transaction. No charges were made to your account.',
    tips: [
      'Check that your card has sufficient balance or credit limit.',
      'Verify that international and online transactions are enabled on your card.',
      'Check for any two-factor or 3D Secure verification prompts from your banking app.',
      'Try an alternative payment card or BankID method.',
    ],
    icon: AlertOctagon,
    colorScheme: 'red',
  },
  PROVIDER_ERROR: {
    title: 'Payment Gateway Error',
    badge: 'Provider Unavailable',
    description: 'The payment provider encountered an unexpected service interruption while processing the request.',
    tips: [
      'Wait a moment and retry your payment.',
      'Ensure your browser allows payment gateway popups or redirection.',
      'If the issue persists, our technical team is actively monitoring gateway health.',
    ],
    icon: ShieldAlert,
    colorScheme: 'amber',
  },
  VERIFICATION_FAILED: {
    title: 'Security Verification Mismatch',
    badge: 'Verification Failed',
    description: 'The cryptographic signature of your transaction could not be verified by our secure server.',
    tips: [
      'No funds have been captured from your account.',
      'Please retry checkout to establish a fresh, cryptographically signed payment session.',
      'Contact our support team if you notice any temporary pre-authorizations on your statement.',
    ],
    icon: ShieldAlert,
    colorScheme: 'red',
  },
  NETWORK_ERROR: {
    title: 'Connection Interrupted',
    badge: 'Network Timeout',
    description: 'A network timeout or connectivity interruption occurred during the payment handshake.',
    tips: [
      'Check your Wi-Fi or mobile data connection.',
      'Disable VPN or proxy connections that might interfere with secure banking protocols.',
      'Click Retry Payment below to resume your order.',
    ],
    icon: WifiOff,
    colorScheme: 'amber',
  },
  EXPIRED: {
    title: 'Payment Session Expired',
    badge: 'Session Timeout',
    description: 'The payment authorization window exceeded the allowed time limit of 15 minutes.',
    tips: [
      'Your cart items have been saved safely in your session.',
      'Restarting checkout will generate a fresh inventory lock and payment token.',
    ],
    icon: Clock,
    colorScheme: 'amber',
  },
  CANCELLED: {
    title: 'Payment Cancelled',
    badge: 'Cancelled by User',
    description: 'The payment window was dismissed or cancelled before completion. No charges were processed.',
    tips: [
      'All items in your cart remain safely saved.',
      'You can resume and complete your order whenever you are ready.',
    ],
    icon: XCircle,
    colorScheme: 'slate',
  },
  UNKNOWN: {
    title: 'Payment Could Not Be Completed',
    badge: 'Payment Error',
    description: 'An unexpected issue occurred while processing your transaction. Your cart remains intact.',
    tips: [
      'Check your payment details and billing address.',
      'Retry your payment or choose an alternative payment option.',
      'Contact support if you need assistance completing your order.',
    ],
    icon: AlertOctagon,
    colorScheme: 'red',
  },
};

export const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cartItems } = useCart();
  const { formatPrice } = useCurrencyStore();

  const rawReason = (searchParams.get('reason') || 'UNKNOWN').toUpperCase() as FailureReason;
  const reason: FailureReason = FAILURE_CONFIGS[rawReason] ? rawReason : 'UNKNOWN';
  const rawOrderId = searchParams.get('order_id') || searchParams.get('id') || '';
  const customErrorDesc = searchParams.get('description') || searchParams.get('error') || '';

  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    total_amount: number;
    currency?: string | null;
    status?: string | null;
    created_at?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);


  const config = FAILURE_CONFIGS[reason];
  const IconComponent = config.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!rawOrderId) return;

    let isMounted = true;
    const loadOrder = async () => {
      setLoading(true);
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('id, total_amount, currency, status, created_at')
          .eq('id', rawOrderId)
          .maybeSingle();

        if (isMounted && order) {
          setOrderDetails(order);
        }
      } catch (err) {
        console.warn('Could not fetch order context for failure page:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [rawOrderId]);

  const handleRetryPayment = () => {
    // Navigate back to checkout with existing order ID to prevent duplicate order creation
    if (rawOrderId) {
      navigate(`/checkout?order_id=${rawOrderId}&retry=true`);
    } else {
      navigate('/checkout');
    }
  };

  const handleReturnToCart = () => {
    navigate('/shop/cart');
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-arctic-gold/30">
      <SEO 
        title={`${config.title} | Norway SmartLife`}
        description={config.description}
      />

      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-midnight border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header Banner */}
          <div className={`p-8 sm:p-10 border-b border-white/10 ${
            config.colorScheme === 'red' 
              ? 'bg-gradient-to-b from-red-500/10 to-transparent' 
              : config.colorScheme === 'amber'
              ? 'bg-gradient-to-b from-amber-500/10 to-transparent'
              : 'bg-gradient-to-b from-white/5 to-transparent'
          }`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                config.colorScheme === 'red'
                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                  : config.colorScheme === 'amber'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-white/10 text-snow/70 border-white/20'
              }`}>
                <IconComponent size={32} />
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-2 border border-white/10 bg-white/5">
                  <span className={`w-2 h-2 rounded-full ${
                    config.colorScheme === 'red' ? 'bg-red-400 animate-pulse' : config.colorScheme === 'amber' ? 'bg-amber-400' : 'bg-snow/40'
                  }`} />
                  {config.badge}
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-snow tracking-tight mb-2">
                  {config.title}
                </h1>
                <p className="text-sm text-snow/70 leading-relaxed max-w-xl">
                  {customErrorDesc ? decodeURIComponent(customErrorDesc) : config.description}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 sm:p-10 space-y-8">
            
            {/* Reference & Attempt Context */}
            <div className="bg-deep-night/60 border border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-snow/40 font-mono block mb-1">
                  Order Reference
                </span>
                <span className="font-mono text-sm font-bold text-arctic-gold">
                  {rawOrderId ? `#ORD-${rawOrderId.substring(0, 8).toUpperCase()}` : 'Session Reference'}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-snow/40 font-mono block mb-1">
                  Attempted Amount
                </span>
                <span className="text-sm font-bold text-snow">
                  {orderDetails ? formatPrice(orderDetails.total_amount) : 'Calculated at Checkout'}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-snow/40 font-mono block mb-1">
                  Cart Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Preserved Safely
                </span>
              </div>
            </div>

            {/* Helpful Troubleshooting Tips */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-snow/50 flex items-center gap-2">
                <HelpCircle size={14} className="text-arctic-gold" />
                Recommended Next Steps
              </h2>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2.5">
                {config.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-snow/80 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-white/5 text-arctic-gold flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5 border border-white/10">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="btn-retry-payment"
                onClick={handleRetryPayment}
                className="flex-1 py-4 px-6 bg-arctic-gold text-deep-night rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-snow transition-all shadow-lg hover:shadow-arctic-gold/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Retry Payment
              </button>

              <button
                id="btn-return-checkout"
                onClick={handleReturnToCart}
                className="py-4 px-6 bg-white/5 border border-white/10 text-snow rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} className="text-arctic-gold" />
                View Saved Cart ({cartItems.length})
              </button>
            </div>

            {/* Support & Assistance Card */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-snow/60">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <Headphones size={18} className="text-arctic-gold shrink-0" />
                <div>
                  <span className="text-snow font-semibold block">Need assistance with your booking?</span>
                  <span>Our Nordic concierge support team is available 24/7.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <a
                  href={`mailto:support@norwaysmartlife.no?subject=${encodeURIComponent(`Payment Support: Order ${rawOrderId || 'Inquiry'}`)}`}
                  className="inline-flex items-center gap-1.5 text-arctic-gold hover:text-snow transition-colors font-medium underline"
                >
                  <Mail size={13} />
                  Email Support
                </a>
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-1 text-snow/80 hover:text-snow transition-colors"
                >
                  AI Assistant
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs text-snow/40 hover:text-snow transition-colors uppercase tracking-widest font-mono"
          >
            <ArrowLeft size={14} />
            Return to Explore Norway
          </Link>
        </div>
      </div>
    </div>
  );
};
