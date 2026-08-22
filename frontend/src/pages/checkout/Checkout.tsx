import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { Check, CreditCard, User, Tag, Lock, ExternalLink, ShieldCheck, Leaf, ArrowRight, Info } from 'lucide-react';
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
  }, [step]);

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
      <div className="min-h-screen bg-[#FDF8F5] pt-32 pb-24 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-12 text-center max-w-md w-full border border-gray-200 shadow-xl">
          <h2 className="text-3xl font-display font-black text-navy-900 mb-4">Cart is Empty</h2>
          <p className="text-gray-500 mb-8 font-medium">You need items in your itinerary to checkout.</p>
          <button onClick={() => navigate('/explore')} className="w-full py-4 bg-navy-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-aurora-green hover:text-navy-900 transition-colors">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5] pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-navy-900/20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-black text-navy-900 mb-2">Secure Checkout</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10 flex items-center gap-2">
          <ShieldCheck size={14} className="text-aurora-green" /> 256-bit encrypted secure transaction
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Checkout Flow */}
          <div className="flex-1 space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className={`bg-white shadow-sm border transition-all duration-300 ${step === 1 ? 'border-navy-900 ring-1 ring-navy-900/50 scale-[1.01] shadow-xl' : 'border-gray-200'}`}>
              <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${step === 1 ? 'bg-navy-50/30' : 'bg-gray-50/50'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 1 ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 1 ? 'text-navy-900' : 'text-gray-500'}`}>Contact Details</h2>
                {step > 1 && <Check className="ml-auto text-aurora-green" size={24} />}
              </div>
              
              {step === 1 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {user ? (
                    <div className="flex items-start gap-4 p-6 border border-blue-100 bg-blue-50/50 mb-8">
                      <User className="text-blue-600 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-navy-900 text-lg">Checking out as {profile?.fullName || user.email}</h4>
                        <p className="text-sm text-blue-800/80 mt-1">Your details have been pre-filled from your profile.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 p-6 border border-amber-100 bg-amber-50">
                      <p className="text-sm text-amber-900 mb-4 font-bold">You are checking out as a guest.</p>
                      <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white border border-amber-200 text-amber-900 font-bold hover:bg-amber-100 text-sm transition-colors shadow-sm">
                        Log in to use saved details
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                      <input type="text" defaultValue={profile?.fullName?.split(' ')[0]} className="w-full p-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-navy-900 outline-none transition-colors font-medium text-navy-900" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                      <input type="text" defaultValue={profile?.fullName?.split(' ')[1]} className="w-full p-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-navy-900 outline-none transition-colors font-medium text-navy-900" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address (For booking confirmation)</label>
                      <input type="email" defaultValue={user?.email} className="w-full p-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-navy-900 outline-none transition-colors font-medium text-navy-900" />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      className="px-8 py-4 bg-navy-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-aurora-green hover:text-navy-900 transition-colors flex items-center gap-2"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Guest & Itinerary Details */}
            <div className={`bg-white shadow-sm border transition-all duration-300 ${step === 2 ? 'border-navy-900 ring-1 ring-navy-900/50 scale-[1.01] shadow-xl' : 'border-gray-200'} opacity-${step >= 2 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${step === 2 ? 'bg-navy-50/30' : 'bg-gray-50/50'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 2 ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 2 ? 'text-navy-900' : 'text-gray-500'}`}>Guest & Itinerary Details</h2>
                {step > 2 && <Check className="ml-auto text-aurora-green" size={24} />}
              </div>
              
              {step === 2 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-gray-500 mb-8">Please provide names exactly as they appear on official IDs for tickets and reservations.</p>
                  
                  <div className="space-y-6">
                    {items.map((item, idx) => (
                      <div key={item.id} className="p-6 border border-gray-200 bg-gray-50/30">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Item {idx + 1} • {item.item_type}</span>
                            <h4 className="font-bold text-navy-900 text-lg leading-tight">{item.name}</h4>
                            {item.start_time && <p className="text-sm font-bold text-gray-500 mt-2">{new Date(item.start_time).toLocaleDateString()}</p>}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Lead Guest Name</label>
                            <input type="text" placeholder="Same as contact" defaultValue={profile?.fullName || ''} className="w-full p-3 border border-gray-300 bg-white focus:border-navy-900 outline-none text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Special Requests</label>
                            <input type="text" placeholder="Dietary, accessibility, etc." className="w-full p-3 border border-gray-300 bg-white focus:border-navy-900 outline-none text-sm font-medium" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                    <button onClick={() => setStep(1)} className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-navy-900 transition-colors">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="px-8 py-4 bg-navy-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-aurora-green hover:text-navy-900 transition-colors flex items-center gap-2">
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Add-ons & Upgrades */}
            <div className={`bg-white shadow-sm border transition-all duration-300 ${step === 3 ? 'border-navy-900 ring-1 ring-navy-900/50 scale-[1.01] shadow-xl' : 'border-gray-200'} opacity-${step >= 3 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${step === 3 ? 'bg-navy-50/30' : 'bg-gray-50/50'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step >= 3 ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <h2 className={`text-2xl font-display font-bold ${step >= 3 ? 'text-navy-900' : 'text-gray-500'}`}>Add-ons & Upgrades</h2>
                {step > 3 && <Check className="ml-auto text-aurora-green" size={24} />}
              </div>
              
              {step === 3 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  
                  {/* Travel Insurance */}
                  <label className={`flex items-start p-6 border cursor-pointer transition-colors ${addInsurance ? 'border-navy-900 bg-navy-50/30 ring-1 ring-navy-900/20' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <div className="flex items-center h-6">
                      <input type="checkbox" checked={addInsurance} onChange={(e) => setAddInsurance(e.target.checked)} className="w-5 h-5 text-navy-900 bg-gray-100 border-gray-300 focus:ring-navy-900 accent-navy-900" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-navy-900 text-lg">Comprehensive Travel Insurance</span>
                        <span className="font-black text-navy-900">{formatPrice(350)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">Protect your trip against unexpected cancellations, medical emergencies, and lost baggage. Highly recommended for international travelers.</p>
                    </div>
                  </label>

                  {/* Carbon Offset */}
                  <label className={`flex items-start p-6 border cursor-pointer transition-colors ${addCarbonOffset ? 'border-aurora-green bg-green-50/50 ring-1 ring-aurora-green/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <div className="flex items-center h-6">
                      <input type="checkbox" checked={addCarbonOffset} onChange={(e) => setAddCarbonOffset(e.target.checked)} className="w-5 h-5 text-aurora-green bg-gray-100 border-gray-300 focus:ring-aurora-green accent-aurora-green" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-green-900 text-lg flex items-center gap-2"><Leaf size={20}/> Offset your carbon footprint</span>
                        <span className="font-black text-green-900">{formatPrice(120)}</span>
                      </div>
                      <p className="text-green-800/80 text-sm mt-2 leading-relaxed">Contribute to local reforestation projects in Norway. Make your entire journey 100% carbon neutral.</p>
                    </div>
                  </label>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                    <button onClick={() => setStep(2)} className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-navy-900 transition-colors">
                      Back
                    </button>
                    <button onClick={() => setStep(4)} className="px-8 py-4 bg-navy-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-aurora-green hover:text-navy-900 transition-colors flex items-center gap-2">
                      Review & Pay <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment */}
            <div className={`bg-white shadow-sm border transition-all duration-300 ${step === 4 ? 'border-navy-900 ring-1 ring-navy-900/50 scale-[1.01] shadow-xl' : 'border-gray-200'} opacity-${step === 4 ? '100' : '60'}`}>
              <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${step === 4 ? 'bg-navy-50/30' : 'bg-gray-50/50'}`}>
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${step === 4 ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
                <h2 className={`text-2xl font-display font-bold ${step === 4 ? 'text-navy-900' : 'text-gray-500'}`}>Payment</h2>
              </div>
              
              {step === 4 && (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">Ready to complete your booking?</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">You will be redirected to Razorpay's secure checkout gateway to process your payment of <strong className="text-navy-900">{formatPrice(total)}</strong>.</p>
                  
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => setStep(3)} className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-navy-900 transition-colors border border-gray-200 bg-white">
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
            <div className="bg-navy-900 text-white shadow-2xl sticky top-28 border border-navy-800">
              <div className="p-8 border-b border-white/10">
                <h3 className="text-xl font-display font-black mb-2 uppercase tracking-widest">Order Summary</h3>
                <p className="text-sm text-gray-400 font-bold">{items.length} {items.length === 1 ? 'item' : 'items'} in itinerary</p>
              </div>
              
              <div className="p-8 space-y-6 border-b border-white/10 max-h-[40vh] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-gray-100">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm shrink-0">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-black/20 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold">Taxes (VAT)</span>
                  <span className="font-bold">{formatPrice(tax)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between items-center text-sm text-aurora-green">
                    <span className="font-bold">Add-ons</span>
                    <span className="font-bold">+{formatPrice(addonsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold flex items-center gap-1">Service Fee <Info size={14}/></span>
                  <span className="font-bold">{formatPrice(serviceFee)}</span>
                </div>
              </div>

              <div className="p-8 bg-aurora-green text-navy-900">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold uppercase tracking-widest text-xs">Total to pay</span>
                  <span className="font-display font-black text-3xl leading-none">{formatPrice(total)}</span>
                </div>
                <p className="text-right text-[10px] font-bold uppercase tracking-widest opacity-70">Includes all taxes and fees</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-xs font-bold text-gray-500 bg-white p-4 border border-gray-200">
              <Tag size={16} className="text-navy-900" /> Have a promo code? <a href="#" className="text-navy-900 underline ml-auto">Apply</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
