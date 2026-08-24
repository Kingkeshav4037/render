import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { Check, CreditCard, User, Tag, Lock, ExternalLink, ShieldCheck, Leaf, ArrowRight, Info, ShoppingBag } from 'lucide-react';
import { checkoutService } from '../../services/checkoutService';
import { toast } from 'sonner';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, profile } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [processing, setProcessing] = useState(false);

  // Add-ons State
  const [addInsurance, setAddInsurance] = useState(true);
  const [addCarbonOffset, setAddCarbonOffset] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-deep-night flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-midnight border border-white/10 p-10 rounded-3xl shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-white/5 text-arctic-gold border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-snow mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-sm font-sans text-snow/70 leading-relaxed mb-8">
            You don't have any items or reservations in your cart to checkout yet. Explore our curated stays and experiences to get started!
          </p>

          <button
            onClick={() => navigate('/explore')}
            className="w-full py-4 px-6 bg-arctic-gold text-deep-night font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-snow transition-all shadow-lg cursor-pointer"
          >
            Explore Norway Experiences
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.25; // 25% VAT
  const serviceFee = 450;
  
  let addonsTotal = 0;
  if (addInsurance) addonsTotal += 350;
  if (addCarbonOffset) addonsTotal += 120;

  const total = subtotal + tax + serviceFee + addonsTotal;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayMock = async () => {
    if (!user || !profile) {
      toast.error("Please log in to checkout.");
      navigate('/login');
      return;
    }

    // ISSUE-011: Validate Razorpay key before doing anything
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error('Payment is not configured. Please contact support.');
      return;
    }

    // ISSUE-020: Load Razorpay SDK *before* creating the order
    // — prevents phantom orders if the SDK fails to load
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      toast.error('Payment gateway SDK failed to load. Please check your internet connection.');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create Pending Order (only after SDK is confirmed available)
      const orderId = await checkoutService.processCheckout(user.id, items, 'NOK');
      
      // 2. Create Payment Intent via Supabase Edge Function
      let gatewayOrderId = '';
      try {
        const paymentIntent = await checkoutService.createPaymentIntent(orderId, 'Razorpay');
        if (paymentIntent?.clientSecret || paymentIntent?.paymentOrder?.gateway_order_id) {
          gatewayOrderId = paymentIntent.clientSecret || paymentIntent.paymentOrder.gateway_order_id;
        }
      } catch (err) {
        // Edge function may not be deployed yet — continue with client-only flow
        console.warn('Edge Function create-payment notice:', err);
      }

      // 3. Open Razorpay Checkout UI
      const options: any = {
        key: razorpayKey,
        amount: Math.round(total * 100),
        currency: 'NOK',
        name: 'Norway SmartLife',
        description: 'Payment for your booking',
        handler: function (_response: any) {
          clearCart();
          navigate(`/payment-success?order_id=${orderId}`);
        },
        prefill: {
          name: profile?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#0F172A' // midnight navy
        }
      };

      if (gatewayOrderId) {
        options.order_id = gatewayOrderId;
      }

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        toast.error(response?.error?.description || 'Payment was cancelled or failed.');
      });
      paymentObject.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout could not be completed.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 flex items-center justify-center p-4 font-sans">
        <div className="bg-midnight p-12 text-center max-w-md w-full border border-white/10 shadow-xl">
          <h2 className="text-3xl font-display font-black text-snow mb-4">Cart is Empty</h2>
          <p className="text-snow/60 mb-8 font-medium">You need items in your itinerary to checkout.</p>
          <button onClick={() => navigate('/explore')} className="w-full py-4 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-sm hover:bg-snow transition-colors">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-arctic-gold/20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-black text-snow mb-2">Secure Checkout</h1>
        <p className="text-snow/60 font-bold uppercase tracking-widest text-xs mb-10 flex items-center gap-2">
          <ShieldCheck size={14} className="text-arctic-gold" /> 256-bit encrypted secure transaction
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Checkout Flow */}
          <div className="flex-1 space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className={`bg-midnight shadow-sm border transition-all duration-300 ${step === 1 ? 'border-arctic-gold ring-1 ring-arctic-gold/50 scale-[1.01] shadow-2xl' : 'border-white/10'}`}>
              <div className={`p-6 border-b border-white/5 flex items-center gap-4 ${step === 1 ? 'bg-white/5' : 'bg-transparent'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 1 ? 'bg-arctic-gold text-deep-night' : 'bg-white/10 text-snow/50'}`}>1</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 1 ? 'text-snow' : 'text-snow/50'}`}>Contact Details</h2>
                {step > 1 && <Check className="ml-auto text-arctic-gold" size={24} />}
              </div>
              
              {step === 1 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {user ? (
                    <div className="flex items-start gap-4 p-6 border border-blue-500/30 bg-blue-500/10 mb-8">
                      <User className="text-blue-400 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-snow text-lg">Checking out as {profile?.fullName || user.email}</h4>
                        <p className="text-sm text-blue-200/80 mt-1">Your details have been pre-filled from your profile.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 p-6 border border-amber-500/30 bg-amber-500/10">
                      <p className="text-sm text-amber-200 mb-4 font-bold">You are checking out as a guest.</p>
                      <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white/10 border border-amber-500/30 text-amber-200 font-bold hover:bg-white/20 text-sm transition-colors shadow-sm">
                        Log in to use saved details
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="checkout-first-name" className="block text-[10px] font-bold text-snow/50 uppercase tracking-widest mb-2">First Name</label>
                      <input id="checkout-first-name" type="text" defaultValue={profile?.fullName?.split(' ')[0]} className="w-full p-4 border border-white/10 bg-white/5 focus:bg-white/10 focus:border-arctic-gold outline-none transition-colors font-medium text-snow" />
                    </div>
                    <div>
                      <label htmlFor="checkout-last-name" className="block text-[10px] font-bold text-snow/50 uppercase tracking-widest mb-2">Last Name</label>
                      <input id="checkout-last-name" type="text" defaultValue={profile?.fullName?.split(' ')[1]} className="w-full p-4 border border-white/10 bg-white/5 focus:bg-white/10 focus:border-arctic-gold outline-none transition-colors font-medium text-snow" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="checkout-email" className="block text-[10px] font-bold text-snow/50 uppercase tracking-widest mb-2">Email Address (For booking confirmation)</label>
                      <input id="checkout-email" type="email" defaultValue={user?.email} className="w-full p-4 border border-white/10 bg-white/5 focus:bg-white/10 focus:border-arctic-gold outline-none transition-colors font-medium text-snow" />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      className="px-8 py-4 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs hover:bg-snow transition-colors flex items-center gap-2"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Guest & Itinerary Details */}
            <div className={`bg-midnight shadow-sm border transition-all duration-300 ${step === 2 ? 'border-arctic-gold ring-1 ring-arctic-gold/50 scale-[1.01] shadow-2xl' : 'border-white/10'} opacity-${step >= 2 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-white/5 flex items-center gap-4 ${step === 2 ? 'bg-white/5' : 'bg-transparent'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 2 ? 'bg-arctic-gold text-deep-night' : 'bg-white/10 text-snow/50'}`}>2</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 2 ? 'text-snow' : 'text-snow/50'}`}>Guest & Itinerary Details</h2>
                {step > 2 && <Check className="ml-auto text-arctic-gold" size={24} />}
              </div>
              
              {step === 2 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-snow/60 mb-8">Please provide names exactly as they appear on official IDs for tickets and reservations.</p>
                  
                  <div className="space-y-6">
                    {items.map((item, idx) => (
                      <div key={item.id} className="p-6 border border-white/10 bg-white/5">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="text-[10px] font-bold text-arctic-gold uppercase tracking-widest block mb-1">Item {idx + 1} • {item.item_type}</span>
                            <h4 className="font-bold text-snow text-lg leading-tight">{item.name}</h4>
                            {item.start_time && <p className="text-sm font-bold text-snow/50 mt-2">{new Date(item.start_time).toLocaleDateString()}</p>}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`lead-guest-${item.id}`} className="block text-[10px] font-bold text-snow/50 uppercase tracking-widest mb-2">Lead Guest Name</label>
                            <input id={`lead-guest-${item.id}`} type="text" placeholder="Same as contact" defaultValue={profile?.fullName || ''} className="w-full p-3 border border-white/10 bg-deep-night focus:border-arctic-gold outline-none text-sm font-medium text-snow placeholder:text-snow/30" />
                          </div>
                          <div>
                            <label htmlFor={`special-requests-${item.id}`} className="block text-[10px] font-bold text-snow/50 uppercase tracking-widest mb-2">Special Requests</label>
                            <input id={`special-requests-${item.id}`} type="text" placeholder="Dietary, accessibility, etc." className="w-full p-3 border border-white/10 bg-deep-night focus:border-arctic-gold outline-none text-sm font-medium text-snow placeholder:text-snow/30" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
                    <button onClick={() => setStep(1)} className="px-6 py-4 text-snow/50 font-bold uppercase tracking-widest text-xs hover:text-snow transition-colors">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="px-8 py-4 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs hover:bg-snow transition-colors flex items-center gap-2">
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Add-ons & Upgrades */}
            <div className={`bg-midnight shadow-sm border transition-all duration-300 ${step === 3 ? 'border-arctic-gold ring-1 ring-arctic-gold/50 scale-[1.01] shadow-2xl' : 'border-white/10'} opacity-${step >= 3 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-white/5 flex items-center gap-4 ${step === 3 ? 'bg-white/5' : 'bg-transparent'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 3 ? 'bg-arctic-gold text-deep-night' : 'bg-white/10 text-snow/50'}`}>3</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 3 ? 'text-snow' : 'text-snow/50'}`}>Add-ons & Upgrades</h2>
                {step > 3 && <Check className="ml-auto text-arctic-gold" size={24} />}
              </div>
              
              {step === 3 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  
                  {/* Travel Insurance */}
                  <label className={`flex items-start p-6 border cursor-pointer transition-colors ${addInsurance ? 'border-arctic-gold bg-arctic-gold/10 ring-1 ring-arctic-gold/50' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                    <div className="flex items-center h-6">
                      <input type="checkbox" checked={addInsurance} onChange={(e) => setAddInsurance(e.target.checked)} className="w-5 h-5 accent-arctic-gold" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-snow text-lg">Comprehensive Travel Insurance</span>
                        <span className="font-black text-snow">{formatPrice(350)}</span>
                      </div>
                      <p className="text-snow/60 text-sm mt-2 leading-relaxed">Protect your trip against unexpected cancellations, medical emergencies, and lost baggage. Highly recommended for international travelers.</p>
                    </div>
                  </label>

                  {/* Carbon Offset */}
                  <label className={`flex items-start p-6 border cursor-pointer transition-colors ${addCarbonOffset ? 'border-green-400 bg-green-500/10 ring-1 ring-green-400/50' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                    <div className="flex items-center h-6">
                      <input type="checkbox" checked={addCarbonOffset} onChange={(e) => setAddCarbonOffset(e.target.checked)} className="w-5 h-5 accent-green-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-green-400 text-lg flex items-center gap-2"><Leaf size={20}/> Offset your carbon footprint</span>
                        <span className="font-black text-green-400">{formatPrice(120)}</span>
                      </div>
                      <p className="text-green-300/80 text-sm mt-2 leading-relaxed">Contribute to local reforestation projects in Norway. Make your entire journey 100% carbon neutral.</p>
                    </div>
                  </label>

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
                    <button onClick={() => setStep(2)} className="px-6 py-4 text-snow/50 font-bold uppercase tracking-widest text-xs hover:text-snow transition-colors">
                      Back
                    </button>
                    <button onClick={() => setStep(4)} className="px-8 py-4 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs hover:bg-snow transition-colors flex items-center gap-2">
                      Review & Pay <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment */}
            <div className={`bg-midnight shadow-sm border transition-all duration-300 ${step === 4 ? 'border-arctic-gold ring-1 ring-arctic-gold/50 scale-[1.01] shadow-2xl' : 'border-white/10'} opacity-${step === 4 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-white/5 flex items-center gap-4 ${step === 4 ? 'bg-white/5' : 'bg-transparent'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step === 4 ? 'bg-arctic-gold text-deep-night' : 'bg-white/10 text-snow/50'}`}>4</div>
                <h2 className={`text-2xl font-display font-bold ${step === 4 ? 'text-snow' : 'text-snow/50'}`}>Payment</h2>
              </div>
              
              {step === 4 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-blue-400 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-snow mb-2">Ready to complete your booking?</h3>
                  <p className="text-snow/60 mb-8 max-w-md mx-auto">You will be redirected to Razorpay's secure checkout gateway to process your payment of <strong className="text-arctic-gold">{formatPrice(total)}</strong>.</p>
                  
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => setStep(3)} className="px-6 py-4 text-snow/50 font-bold uppercase tracking-widest text-xs hover:text-snow transition-colors border border-white/10 bg-transparent">
                      Back to Add-ons
                    </button>
                    <button 
                      onClick={handleRazorpayMock}
                      disabled={processing}
                      className="px-12 py-4 bg-[#3395FF] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#2275d4] transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        'Connecting...'
                      ) : (
                        <>
                          <CreditCard size={20} /> Pay securely
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-6 opacity-50 grayscale">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                     <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-96 w-full">
            <div className="bg-midnight text-snow shadow-2xl sticky top-28 border border-white/10">
              <div className="p-8 border-b border-white/10">
                <h3 className="text-xl font-display font-black mb-2 uppercase tracking-widest text-snow">Order Summary</h3>
                <p className="text-sm text-snow/50 font-bold">{items.length} {items.length === 1 ? 'item' : 'items'} in itinerary</p>
              </div>
              
              <div className="p-8 space-y-6 border-b border-white/10 max-h-[40vh] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-snow">{item.name}</h4>
                      <p className="text-[10px] text-snow/50 font-bold uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm shrink-0 text-snow">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-black/20 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-snow/50 font-bold">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-snow/50 font-bold">Taxes (VAT)</span>
                  <span className="font-bold">{formatPrice(tax)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between items-center text-sm text-arctic-gold">
                    <span className="font-bold">Add-ons</span>
                    <span className="font-bold">+{formatPrice(addonsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-snow/50 font-bold flex items-center gap-1">Service Fee <Info size={14}/></span>
                  <span className="font-bold">{formatPrice(serviceFee)}</span>
                </div>
              </div>

              <div className="p-8 bg-arctic-gold text-deep-night">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold uppercase tracking-widest text-xs">Total to pay</span>
                  <span className="font-display font-black text-3xl leading-none">{formatPrice(total)}</span>
                </div>
                <p className="text-right text-[10px] font-bold uppercase tracking-widest opacity-70">Includes all taxes and fees</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-xs font-bold text-snow/50 bg-white/5 p-4 border border-white/10">
              <Tag size={16} className="text-arctic-gold" /> Have a promo code? <a href="#" className="text-arctic-gold underline ml-auto">Apply</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
