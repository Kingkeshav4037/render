import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { staysService, AccommodationRoom } from '../services/stay/staysService';
import { 
  MapPin, Star, Share2, Heart, Wifi, Car, Coffee, Wind, TreePine, 
  ChevronRight, Calendar, Users, Info, ShieldCheck, Check, ArrowRight,
  Sparkles, CheckCircle2, AlertCircle, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { SEO } from '../components/shared/SEO';
import { toast } from 'sonner';

export const StayDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();

  // Initialize dates
  const defaultCheckIn = useMemo(() => {
    if (searchParams.get('checkIn')) return searchParams.get('checkIn')!;
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, [searchParams]);

  const defaultCheckOut = useMemo(() => {
    if (searchParams.get('checkOut')) return searchParams.get('checkOut')!;
    const d = new Date();
    d.setDate(d.getDate() + 11);
    return d.toISOString().split('T')[0];
  }, [searchParams]);

  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [guests, setGuests] = useState<number>(Number(searchParams.get('guests')) || 2);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Fetch stay details
  const { data: stay, isLoading: stayLoading } = useQuery({
    queryKey: ['stay-detail', id],
    queryFn: async () => {
      if (!id) return null;
      return staysService.getStayDetails(id);
    },
    enabled: !!id
  });

  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['stay-rooms', id],
    queryFn: async () => {
      if (!id) return [];
      return staysService.getStayRooms(id);
    },
    enabled: !!id
  });

  // Default selected room when rooms are loaded
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  // Check availability when dates or rooms change
  useEffect(() => {
    let isMounted = true;
    const checkAllRooms = async () => {
      if (!rooms || rooms.length === 0 || !checkIn || !checkOut) return;
      setCheckingAvailability(true);
      const newMap: Record<string, boolean> = {};
      
      for (const room of rooms) {
        const isAvail = await staysService.checkRoomAvailability(room.id, checkIn, checkOut);
        newMap[room.id] = isAvail;
      }

      if (isMounted) {
        setAvailabilityMap(newMap);
        setCheckingAvailability(false);
      }
    };

    checkAllRooms();
    return () => { isMounted = false; };
  }, [rooms, checkIn, checkOut]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  }, [checkIn, checkOut]);

  const activeRoom = useMemo(() => {
    return rooms.find(r => r.id === selectedRoomId) || rooms[0] || null;
  }, [rooms, selectedRoomId]);

  const activePricePerNight = Number(activeRoom?.price_per_night || stay?.price_per_night || 2400);
  const totalBasePrice = nights * activePricePerNight;
  const vatIncluded = Math.round(totalBasePrice * 0.20); // 25% MVA included in gross

  const isRoomAvailable = activeRoom ? (availabilityMap[activeRoom.id] ?? true) : true;

  // Handlers
  const handleReserveNow = () => {
    if (!id || !activeRoom) return;
    if (nights <= 0) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }
    if (!isRoomAvailable) {
      toast.error('This room is not available for the selected dates. Please select alternative dates or rooms.');
      return;
    }

    navigate(`/checkout/stay/${id}?roomId=${activeRoom.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const handleAddToCart = () => {
    if (!stay || !activeRoom) return;
    if (nights <= 0) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }

    addItem({
      item_type: 'ACCOMMODATION',
      item_id: activeRoom.id,
      name: `${stay.name} - ${activeRoom.name}`,
      description: `${nights} nights (${checkIn} to ${checkOut}) for ${guests} guests. ${activeRoom.bed}`,
      unit_price: activePricePerNight,
      quantity: nights,
      image: activeRoom.image_url || stay.image_url,
      start_time: new Date(checkIn).toISOString(),
      end_time: new Date(checkOut).toISOString(),
      pax: guests,
    });

    toast.success(`${activeRoom.name} added to cart!`);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (stayLoading || !stay) {
    return (
      <div className="min-h-screen bg-deep-night text-snow flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-arctic-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 relative selection:bg-arctic-gold/30">
      <SEO 
        title={`${stay.name} | Norway SmartLife`}
        description={stay.description?.slice(0, 160) || `Stay at ${stay.name} in Norway.`}
      />

      {/* Hero Gallery */}
      <div className="h-[55vh] md:h-[65vh] w-full relative grid grid-cols-4 gap-2 pt-20 bg-black">
        <div className="col-span-4 md:col-span-2 h-full relative group overflow-hidden">
          <OptimizedImage 
            src={stay.image_url} 
            alt={stay.name} 
            category="stay"
            fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-night/80 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="hidden md:block col-span-1 h-full relative group overflow-hidden">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=luxury+nordic+hotel+interior+room&w=800" 
            alt="Room & Interior" 
            category="stay"
            fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            containerClassName="w-full h-full"
          />
        </div>
        <div className="hidden md:flex col-span-1 h-full flex-col gap-2">
          <div className="h-1/2 relative group overflow-hidden">
            <OptimizedImage 
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=scandinavian+resort+room+view&w=800" 
              alt="Panoramic View" 
              category="stay"
              fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              containerClassName="w-full h-full"
            />
          </div>
          <div className="h-1/2 relative group overflow-hidden">
            <OptimizedImage 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=nordic+sauna+wellness+resort&w=800" 
              alt="Sauna & Spa" 
              category="stay"
              fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              containerClassName="w-full h-full"
            />
          </div>
        </div>
        
        {/* Navigation Breadcrumb */}
        <div className="absolute top-24 left-6 md:left-12 text-snow/70 text-xs font-bold tracking-widest flex items-center gap-2 drop-shadow-md z-10">
          <Link to="/stay" className="hover:text-arctic-gold transition-colors">STAYS</Link> 
          <ChevronRight className="w-3.5 h-3.5" /> 
          <span className="text-snow">{stay.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-8 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Left Main Content */}
        <div className="flex-1 w-full lg:w-2/3">
          
          {/* Header Info */}
          <div className="mb-10 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest mb-3">
              <TreePine className="w-4 h-4" /> {stay.eco_certified ? 'Eco-Certified Nordic Property' : 'Certified Hospitality Partner'}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{stay.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-snow/70 mb-4">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-arctic-gold"/> {(stay as any).locations?.name || 'Vestland, Norway'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-arctic-gold font-bold"><Star className="w-4 h-4 fill-arctic-gold"/> {stay.rating || 4.9} (128 Verified Reviews)</span>
              <span>•</span>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-white/10 rounded">{stay.type?.replace(/_/g, ' ')}</span>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-snow/80">
              {stay.description}
            </p>
          </div>

          {/* Property Amenities */}
          <div className="mb-10 border-b border-white/10 pb-8">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-arctic-gold" /> Included Highlights & Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Wifi className="w-5 h-5"/>, label: 'High-Speed Fiber Wi-Fi' },
                { icon: <Car className="w-5 h-5"/>, label: 'Free Parking & EV Station' },
                { icon: <Wind className="w-5 h-5"/>, label: 'Sauna & Nordic Bath' },
                { icon: <Coffee className="w-5 h-5"/>, label: 'Local Organic Breakfast' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-start gap-2 bg-white/5 border border-white/5 p-4 rounded-xl">
                  <div className="text-arctic-gold">{item.icon}</div>
                  <span className="text-xs font-bold text-snow/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-12" id="rooms">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Select Accommodation Option</h2>
              {checkingAvailability && (
                <span className="text-xs text-arctic-gold animate-pulse flex items-center gap-1">
                  Checking real availability...
                </span>
              )}
            </div>
            
            <div className="space-y-6">
              {rooms.map(room => {
                const isSelected = selectedRoomId === room.id;
                const isAvail = availabilityMap[room.id] ?? true;
                const roomPrice = Number(room.price_per_night) || activePricePerNight;

                return (
                  <div 
                    key={room.id} 
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`flex flex-col md:flex-row border transition-all duration-300 rounded-xl overflow-hidden cursor-pointer ${
                      isSelected 
                        ? 'border-arctic-gold bg-white/10 shadow-xl ring-1 ring-arctic-gold' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="w-full md:w-1/3 h-52 md:h-auto relative">
                      <OptimizedImage 
                        src={room.image_url || stay.image_url} 
                        alt={room.name} 
                        category="stay"
                        fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
                        className="w-full h-full object-cover" 
                        containerClassName="w-full h-full"
                      />
                      {room.remaining && room.remaining <= 3 && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-deep-night text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow">
                          Only {room.remaining} left
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-snow">{room.name}</h3>
                          <div className="text-right">
                            <div className="text-xl font-bold text-arctic-gold">{formatPrice(roomPrice)}</div>
                            <div className="text-[10px] text-snow/40 uppercase tracking-widest">per night</div>
                          </div>
                        </div>
                        <p className="text-sm text-snow/70 mb-4">{room.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-snow/80 mb-4">
                          <span className="flex items-center gap-1"><Users className="w-4 h-4 text-arctic-gold"/> Max {room.capacity || 2} Guests</span>
                          <span className="flex items-center gap-1"><Info className="w-4 h-4 text-arctic-gold"/> {room.size || '36m²'}</span>
                          <span className="flex items-center gap-1"><Info className="w-4 h-4 text-arctic-gold"/> {room.bed || '1 King Bed'}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {(room.amenities || ['Breakfast included', 'Wi-Fi', 'Fjord View']).map((a, i) => (
                            <span key={i} className="bg-white/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-snow/80 rounded">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center border-t border-white/10 pt-4 gap-4">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {isAvail ? (
                            <span className="text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Available for {nights} night{nights > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> Unavailable for these dates
                            </span>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomId(room.id);
                          }}
                          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                            isSelected 
                              ? 'bg-arctic-gold text-deep-night' 
                              : 'border border-white/20 text-snow hover:border-arctic-gold'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Panel */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-28 bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-baseline mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-2xl font-display font-bold text-arctic-gold">{formatPrice(activePricePerNight)}</span>
                <span className="text-xs text-snow/50 font-normal"> / night</span>
              </div>
              <div className="text-xs text-snow/60 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-arctic-gold text-arctic-gold" /> {stay.rating || 4.9}
              </div>
            </div>

            {/* Date Pickers */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-snow/50 mb-1">Check-in</label>
                  <input 
                    type="date" 
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent text-xs text-snow outline-none w-full cursor-pointer"
                  />
                </div>
                <div className="border-l border-white/10 pl-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-snow/50 mb-1">Check-out</label>
                  <input 
                    type="date" 
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-xs text-snow outline-none w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-arctic-gold" />
                  <span className="text-xs font-bold text-snow/80">Guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-snow hover:bg-white/20"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{guests}</span>
                  <button 
                    type="button"
                    onClick={() => setGuests(Math.min(6, guests + 1))}
                    className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-snow hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            {nights > 0 && (
              <div className="space-y-3 mb-6 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-snow/70">
                  <span>{formatPrice(activePricePerNight)} × {nights} nights</span>
                  <span>{formatPrice(totalBasePrice)}</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span>Norwegian MVA (25% VAT Included)</span>
                  <span>{formatPrice(vatIncluded)}</span>
                </div>
                <div className="flex justify-between text-snow/70">
                  <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5 text-green-400" /> Eco Preservation Tax</span>
                  <span className="text-green-400">Included</span>
                </div>
                <div className="flex justify-between text-base font-bold text-snow border-t border-white/10 pt-3">
                  <span>Total Amount</span>
                  <span className="text-arctic-gold">{formatPrice(totalBasePrice)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                type="button"
                onClick={handleReserveNow}
                disabled={!isRoomAvailable || nights <= 0}
                className="w-full py-3.5 bg-arctic-gold hover:bg-snow text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRoomAvailable ? 'Reserve Accommodation' : 'Room Unavailable'} <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={handleAddToCart}
                disabled={!isRoomAvailable || nights <= 0}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-snow font-bold uppercase tracking-widest text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-arctic-gold" /> Add Stay to Cart
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] text-snow/50 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Free cancellation up to 48 hours before check-in
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StayDetails;
