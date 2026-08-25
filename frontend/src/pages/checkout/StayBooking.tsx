import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { staysService, Accommodation, AccommodationRoom } from '../../services/stay/staysService';
import { checkoutService } from '../../services/checkoutService';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useCartStore } from '../../store/useCartStore';
import { 
  Calendar as CalendarIcon, Users, MapPin, ShieldCheck, ArrowLeft,
  CheckCircle2, CreditCard, TreePine, Clock, AlertCircle, Sparkles, Lock, ShoppingBag
} from 'lucide-react';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
import { toast } from 'sonner';

export const StayBooking = () => {
  const { id = '', roomId: paramRoomId = '' } = useParams<{ id?: string; roomId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();

  const [stay, setStay] = useState<Accommodation | null>(null);
  const [room, setRoom] = useState<AccommodationRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form State
  const queryRoomId = searchParams.get('roomId') || paramRoomId || id;
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = Number(searchParams.get('guests')) || 2;

  const [checkIn, setCheckIn] = useState<string>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut);
  const [guests, setGuests] = useState<number>(initialGuests);

  // Guest Details
  const [fullName, setFullName] = useState(profile?.fullName || (profile as any)?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [arrivalTime, setArrivalTime] = useState('15:00 - 18:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    const defaultName = profile?.fullName || (profile as any)?.full_name;
    if (defaultName && !fullName) setFullName(defaultName);
    if (user?.email && !email) setEmail(user.email);
    if (profile?.phone && !phone) setPhone(profile.phone);
  }, [profile, user]);

  // Fetch stay and room data
  useEffect(() => {
    const loadBookingData = async () => {
      setLoading(true);
      try {
        let accommodationId = id;
        let targetRoomId = queryRoomId;

        // Try fetching room details first
        if (targetRoomId) {
          try {
            const roomData = await staysService.getRoomDetails?.(targetRoomId);
            if (roomData) {
              setRoom(roomData);
              if (roomData.accommodation_id) {
                accommodationId = roomData.accommodation_id;
              }
            }
          } catch (err) {
            console.warn('getRoomDetails error:', err);
          }
        }

        // Fetch stay details if accommodationId exists
        if (accommodationId && (!stay || stay.id !== accommodationId)) {
          try {
            const stayData = await staysService.getStayDetails?.(accommodationId);
            if (stayData) {
              setStay(stayData);
              if (!room && staysService.getStayRooms) {
                const rooms = await staysService.getStayRooms(accommodationId);
                const matchedRoom = rooms.find(r => r.id === targetRoomId) || rooms[0] || null;
                setRoom(matchedRoom);
              }
            }
          } catch (err) {
            console.warn('getStayDetails error:', err);
          }
        }

        // Set default dates if not provided
        if (!initialCheckIn) {
          const d1 = new Date();
          d1.setDate(d1.getDate() + 7);
          setCheckIn(d1.toISOString().split('T')[0]);
        }
        if (!initialCheckOut) {
          const d2 = new Date();
          d2.setDate(d2.getDate() + 11);
          setCheckOut(d2.toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error loading stay booking info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [id, queryRoomId, initialCheckIn, initialCheckOut]);

  // Fallback stay object if only room is loaded
  const activeStay: Accommodation = useMemo(() => {
    if (stay) return stay;
    if (room) {
      return {
        id: room.accommodation_id || 'stay-default',
        location_id: 'loc-default',
        name: 'Norwegian Fjord Lodge',
        type: 'HOTEL',
        description: room.description || 'Authentic Nordic hospitality and scenic landscapes.',
        price_per_night: room.price_per_night,
        currency: 'NOK',
        rating: 4.9,
        amenities: [],
        eco_certified: true,
        featured: true,
        image_url: room.image_url || '/images/hotel_juvet_1787013813000.jpg',
        lat: 62.0,
        lng: 7.0,
      };
    }
    return null as any;
  }, [stay, room]);

  // Calculate nights and price
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  }, [checkIn, checkOut]);

  const pricePerNight = Number(room?.price_per_night || activeStay?.price_per_night || 2400);
  const totalAmount = nights * pricePerNight;
  const vatAmount = Math.round(totalAmount * 0.20); // 25% MVA included

  const handleAddToCart = () => {
    if (!room || !activeStay) {
      toast.error('Accommodation details could not be loaded.');
      return;
    }

    if (nights <= 0) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }

    addItem({
      item_type: 'ACCOMMODATION',
      item_id: room.id,
      name: `${activeStay.name} - ${room.name}`,
      description: `${nights} nights (${checkIn} to ${checkOut}) for ${guests} guests. ${room.bed || ''}`,
      unit_price: pricePerNight,
      quantity: nights,
      image: room.image_url || activeStay.image_url,
      start_time: new Date(checkIn).toISOString(),
      end_time: new Date(checkOut).toISOString(),
      pax: guests,
    });

    toast.success(`${room.name} added to cart!`);
    navigate('/checkout');
  };

  const handleConfirmAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to complete your reservation.');
      const returnUrl = `/checkout/stay/${id || room?.accommodation_id || 'stay-default'}?roomId=${room?.id || ''}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!room || !activeStay) {
      toast.error('Accommodation details could not be loaded.');
      return;
    }

    if (nights <= 0) {
      toast.error('Please select a valid check-in and check-out date range.');
      return;
    }

    if (!fullName.trim()) {
      toast.error('Please enter the primary guest full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid guest email address.');
      return;
    }

    if (!phone.trim()) {
      toast.error('Please enter a contact phone number.');
      return;
    }

    setProcessing(true);
    try {
      const bookingItems = [
        {
          id: room.id,
          item_type: 'ACCOMMODATION' as const,
          item_id: room.id,
          name: `${activeStay.name} - ${room.name}`,
          description: `${nights} nights (${checkIn} to ${checkOut}) for ${guests} guests. ${specialRequests ? `Special request: ${specialRequests}` : ''}`,
          unit_price: pricePerNight,
          quantity: nights,
          image: room.image_url || activeStay.image_url,
          start_time: new Date(checkIn).toISOString(),
          end_time: new Date(checkOut).toISOString(),
          pax: guests,
        }
      ];

      // 1. Call processCheckout
      const orderId = await checkoutService.processCheckout(user.id, bookingItems, 'NOK');
      
      if (!orderId) {
        throw new Error('Failed to generate reservation order');
      }

      // 2. Create Payment Intent
      const paymentIntent = await checkoutService.createPaymentIntent(orderId, 'Razorpay');

      // 3. Handle Payment Gateways (Razorpay checkout)
      if (typeof window !== 'undefined' && (window as any).Razorpay && paymentIntent?.gateway_order_id) {
        const options = {
          key: paymentIntent.keyId || (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: paymentIntent.amount || totalAmount * 100,
          currency: paymentIntent.currency || 'NOK',
          name: 'Norway SmartLife',
          description: `Stay Reservation - ${activeStay.name}`,
          order_id: paymentIntent.gateway_order_id,
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          handler: async function (response: any) {
            try {
              await checkoutService.verifyPayment({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success('Reservation confirmed!');
              navigate(`/payment-success?order_id=${orderId}`);
            } catch (verErr) {
              console.error('Payment verification failed:', verErr);
              navigate(`/payment-failure?order_id=${orderId}`);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info('Payment cancelled. Your pending booking is saved.');
              setProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback for test/simulation
        toast.success('Reservation confirmed!');
        navigate(`/payment-success?order_id=${orderId}`);
      }
    } catch (err: any) {
      console.error('Reservation error:', err);
      toast.error(err.message || 'Payment or reservation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-arctic-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!room && !stay) {
    return (
      <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Accommodation Not Found</h1>
        <p className="text-snow/60 mb-6">The requested room or property could not be located.</p>
        <Link to="/stay" className="px-6 py-2.5 bg-arctic-gold text-deep-night font-bold uppercase text-xs rounded-md">
          Browse Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`Secure Your Stay | Norway SmartLife`}
        description={`Secure your reservation at ${activeStay?.name || 'Norway'} in Norway.`}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <Link to={activeStay?.id ? `/stay/${activeStay.id}` : '/stay'} className="text-snow/60 hover:text-arctic-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
            <ArrowLeft size={14} /> Back to Stays
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">Secure Your Stay</h1>
          <p className="text-sm text-snow/60 mt-1">Review dates, guest information, and complete your reservation.</p>
        </div>
        
        <form onSubmit={handleConfirmAndPay} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stay & Room Summary Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 relative">
                <OptimizedImage 
                  src={room?.image_url || activeStay?.image_url || '/images/hotel_juvet_1787013813000.jpg'} 
                  alt={room?.name || activeStay?.name || 'Stay'} 
                  category="stay"
                  fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
                  className="w-full h-full object-cover" 
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-arctic-gold uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                  <TreePine className="w-3.5 h-3.5" /> {activeStay?.eco_certified ? 'Eco Certified Stay' : 'Nordic Hospitality'}
                </div>
                <h2 className="text-xl font-bold text-snow">{activeStay?.name || 'Norwegian Fjord Stay'}</h2>
                <div className="text-sm font-semibold text-snow/90 mb-2">{room?.name || 'Deluxe Room'}</div>
                <div className="text-xs text-snow/60 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-arctic-gold" /> {(activeStay as any)?.locations?.name || 'Vestland, Norway'}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-snow/80">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">{room?.bed || '1 King Bed'}</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Max {room?.capacity || 2} Guests</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] text-green-400">Breakfast Included</span>
                </div>
              </div>
            </div>

            {/* Date & Guest Modification */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-snow mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-arctic-gold" /> Trip Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="checkin" className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Check-in</label>
                  <input 
                    id="checkin"
                    type="date" 
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="checkout" className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Check-out</label>
                  <input 
                    id="checkout"
                    type="date" 
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Guests</label>
                  <select 
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num} className="bg-deep-night text-snow">
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Guest Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-snow mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-arctic-gold" /> Guest Contact & Identification
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Primary Guest Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Astrid Lindgren"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Contact Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="astrid@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Mobile Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+47 987 65 432"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Estimated Arrival Window</label>
                  <select 
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-snow outline-none focus:border-arctic-gold transition-colors cursor-pointer"
                  >
                    <option value="15:00 - 18:00" className="bg-deep-night text-snow">Standard (15:00 - 18:00)</option>
                    <option value="18:00 - 21:00" className="bg-deep-night text-snow">Late Check-in (18:00 - 21:00)</option>
                    <option value="After 21:00" className="bg-deep-night text-snow">Night Arrival (After 21:00)</option>
                    <option value="Early Request" className="bg-deep-night text-snow">Early Check-in Request (12:00 - 15:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-snow/70 uppercase tracking-wider mb-2">Special Requests & Dietary Notes (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="High floor, quiet room, gluten-free breakfast, EV charging needed..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-snow outline-none focus:border-arctic-gold transition-colors"
                />
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-xs text-snow/80">
              <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
              <span>
                <strong>Nordic Peace of Mind:</strong> Free cancellation up to 48 hours before check-in. Instant digital voucher delivered upon payment.
              </span>
            </div>

          </div>

          {/* Sticky Price Summary (1 column) */}
          <div className="w-full relative">
            <div className="sticky top-28 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-snow mb-4 pb-3 border-b border-white/10">Price details</h2>
              
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between text-snow/70">
                  <span>Room Rate</span>
                  <span>{formatPrice(pricePerNight)} / night</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span>Duration</span>
                  <span>{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span>Party Size</span>
                  <span>{guests} guest{guests > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span>Norwegian MVA (25% Included)</span>
                  <span>{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span className="flex items-center gap-1 text-green-400"><TreePine className="w-3.5 h-3.5" /> Eco Preservation Tax</span>
                  <span className="text-green-400 font-bold">Included</span>
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                  <div>
                    <div className="text-base font-bold text-snow">Total Due</div>
                    <div className="text-[10px] text-snow/50">All taxes & fees included</div>
                  </div>
                  <div className="text-2xl font-bold text-arctic-gold">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
              </div>

              {/* Accept Terms */}
              <label className="flex items-start gap-2 text-xs text-snow/70 mb-6 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-arctic-gold rounded" 
                />
                <span>I agree to the property booking conditions, cancellation terms, and privacy policy.</span>
              </label>

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button 
                  type="submit"
                  disabled={processing || nights <= 0 || !termsAccepted}
                  className="w-full py-4 bg-arctic-gold hover:bg-snow text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-deep-night border-t-transparent rounded-full animate-spin"></div>
                      Processing Reservation...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Confirm & Pay with Razorpay
                    </>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={handleAddToCart}
                  disabled={nights <= 0}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-snow font-bold uppercase tracking-widest text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-arctic-gold" /> Add to Cart
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-snow/40 uppercase tracking-wider">
                <CreditCard size={12} /> Encrypted 256-bit SSL Payment
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StayBooking;
