import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { staysService } from '../services/stay/staysService';
import { 
  MapPin, Star, Share2, Heart, Wifi, Car, Coffee, Wind, TreePine, 
  ChevronRight, Calendar, Users, Info, ShieldCheck, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '../store/useCurrencyStore';

const MOCK_ROOMS = [
  {
    id: 'room-1',
    name: 'Fjord View Suite',
    description: 'Floor-to-ceiling windows offering panoramic views of the fjord.',
    size: '45m²',
    bed: '1 King Bed',
    occupancy: 2,
    amenities: ['Breakfast included', 'Free Wi-Fi', 'Minibar', 'Espresso machine'],
    cancellation: 'Free cancellation before Aug 10',
    price: 3200,
    image: '/images/hotel_juvet_1787013813000.jpg',
    remaining: 2
  },
  {
    id: 'room-2',
    name: 'Mountain Panorama Room',
    description: 'Cozy and luxurious, featuring rustic wood interiors and heated floors.',
    size: '32m²',
    bed: '1 Queen Bed',
    occupancy: 2,
    amenities: ['Breakfast included', 'Free Wi-Fi'],
    cancellation: 'Non-refundable',
    price: 2400,
    image: '/images/fjords_1786935800026.jpg',
    remaining: 5
  }
];

export const StayDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: stay, isLoading } = useQuery({
    queryKey: ['stay-detail', id],
    queryFn: async () => {
      if (!id) return null;
      return staysService.getStayDetails(id);
    },
    enabled: !!id
  });
  const { formatPrice } = useCurrencyStore();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || !stay) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C17F59] border-t-transparent"></div>
      </div>
    );
  }

  // Use Copper theme background for header (#1A1A1A or very dark brown/copper tint)
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans pb-24 relative selection:bg-[#C17F59]/20">
      
      {/* Immersive Gallery Hero */}
      <div className="h-[60vh] md:h-[70vh] w-full relative grid grid-cols-4 gap-2 pt-20 bg-black">
        <div className="col-span-4 md:col-span-2 h-full relative group cursor-pointer overflow-hidden">
          <img 
            src={stay.image_url || '/images/hotel_juvet_1787013813000.jpg'} 
            alt={stay.name} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/hotel_juvet_1787013813000.jpg'; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="hidden md:block col-span-1 h-full relative group cursor-pointer overflow-hidden">
          <img src="/images/northern_lights_1786935879330.jpg" alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="hidden md:flex col-span-1 h-full flex-col gap-2">
          <div className="h-1/2 relative group cursor-pointer overflow-hidden">
            <img src="/images/fjords_1786935800026.jpg" alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="h-1/2 relative group cursor-pointer overflow-hidden">
            <img src="/images/besseggen_1786936349992.jpg" alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold tracking-widest text-sm hover:bg-black/60 transition-colors">
              VIEW ALL 24 PHOTOS
            </div>
          </div>
        </div>
        
        {/* Navigation / Actions over Hero */}
        <div className="absolute top-24 left-6 md:left-12 text-white/70 text-sm font-bold tracking-widest flex items-center gap-2 drop-shadow-md z-10">
          <Link to="/stay" className="hover:text-white transition-colors">STAYS</Link> 
          <ChevronRight className="w-4 h-4" /> 
          <span className="text-white">{stay.name.toUpperCase()}</span>
        </div>
        <div className="absolute top-24 right-6 md:right-12 flex gap-4 z-10">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#1A1A1A] transition-colors border border-white/20">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors border border-white/20">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Left Content Column */}
        <div className="flex-1 w-full lg:w-2/3">
          
          {/* Header Info */}
          <div className="mb-12 border-b border-gray-200 pb-12">
            <div className="flex items-center gap-2 text-[#C17F59] font-bold text-xs uppercase tracking-widest mb-4">
              <TreePine className="w-4 h-4" /> Eco-Certified Property
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{stay.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Valldal, Norway</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#C17F59] font-bold"><Star className="w-4 h-4 fill-[#C17F59]"/> {stay.rating} (124 Reviews)</span>
              <span>•</span>
              <a href="#map" className="underline hover:text-[#1A1A1A]">Show on map</a>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              {stay.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-12 border-b border-gray-200 pb-12">
            <h2 className="text-2xl font-display font-bold mb-6">Property Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Wifi className="w-6 h-6"/>, label: 'Free High-Speed Wi-Fi' },
                { icon: <Car className="w-6 h-6"/>, label: 'Free Parking' },
                { icon: <Wind className="w-6 h-6"/>, label: 'Spa & Wellness' },
                { icon: <Coffee className="w-6 h-6"/>, label: 'Exceptional Breakfast' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-start gap-3">
                  <div className="text-[#C17F59] bg-[#C17F59]/10 p-3 rounded-xl">{item.icon}</div>
                  <span className="text-sm font-bold text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-12" id="rooms">
            <h2 className="text-2xl font-display font-bold mb-6">Available Rooms</h2>
            
            <div className="space-y-6">
              {MOCK_ROOMS.map(room => (
                <div key={room.id} className={`flex flex-col md:flex-row border transition-all duration-300 ${selectedRoom === room.id ? 'border-[#C17F59] shadow-lg ring-1 ring-[#C17F59]' : 'border-gray-200 hover:border-gray-300'} bg-white overflow-hidden`}>
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    {room.remaining <= 3 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                        Only {room.remaining} left
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#C17F59]">{formatPrice(room.price)}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-widest">Per night</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{room.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600 mb-4">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400"/> Max {room.occupancy}</span>
                        <span className="flex items-center gap-1"><Info className="w-4 h-4 text-gray-400"/> {room.size}</span>
                        <span className="flex items-center gap-1"><Info className="w-4 h-4 text-gray-400"/> {room.bed}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.amenities.map(a => (
                          <span key={a} className="bg-gray-100 px-2 py-1 text-[10px] uppercase font-bold tracking-widest text-gray-500 rounded-sm">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                      <div className="text-sm font-bold text-gray-500 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> {room.cancellation}
                      </div>
                      <button 
                        onClick={() => setSelectedRoom(room.id)}
                        className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                          selectedRoom === room.id 
                            ? 'bg-[#C17F59] text-white' 
                            : 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                        }`}
                      >
                        {selectedRoom === room.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Panel */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-28 bg-white border border-gray-200 p-8 shadow-xl">
            <div className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">
              <span className="text-[#C17F59]">{formatPrice(selectedRoom ? MOCK_ROOMS.find(r => r.id === selectedRoom)!.price : parseInt(String(stay.price_per_night).replace(/[^0-9]/g, ''), 10) || 2400)}</span> 
              <span className="text-sm text-gray-400 font-normal"> / night</span>
            </div>
            
            <div className="grid grid-cols-2 border border-gray-300 mb-4 text-sm cursor-pointer">
              <div className="p-3 border-r border-gray-300">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Check-in</div>
                <div className="font-bold">12 Aug 2026</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Check-out</div>
                <div className="font-bold">16 Aug 2026</div>
              </div>
              <div className="p-3 border-t border-gray-300 col-span-2 flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Guests</div>
                  <div className="font-bold">2 Guests, 1 Room</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {!selectedRoom ? (
              <a href="#rooms" className="block w-full bg-[#1A1A1A] text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#C17F59] transition-colors mb-4">
                Select a Room
              </a>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-600 underline">
                    {formatPrice(MOCK_ROOMS.find(r => r.id === selectedRoom)!.price)} x 4 nights
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {formatPrice(MOCK_ROOMS.find(r => r.id === selectedRoom)!.price * 4)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-600 underline">Taxes & Fees</span>
                  <span className="text-sm font-bold text-gray-800">{formatPrice(450)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-[#C17F59]">
                    {formatPrice((MOCK_ROOMS.find(r => r.id === selectedRoom)!.price * 4) + 450)}
                  </span>
                </div>
                <button className="w-full bg-[#C17F59] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors">
                  Reserve Now
                </button>
                <div className="text-center text-xs text-gray-500 mt-4">
                  You won't be charged yet
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 bg-gray-50 p-4 border border-gray-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-800 mb-1">Book with confidence</div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  Price match guarantee. 24/7 customer support. Secure transaction processing via Norway SmartLife.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center">
        <div>
          <div className="text-lg font-bold text-[#C17F59]">
            {formatPrice(selectedRoom ? MOCK_ROOMS.find(r => r.id === selectedRoom)!.price : parseInt(String(stay.price_per_night).replace(/[^0-9]/g, ''), 10) || 2400)}
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            12 Aug - 16 Aug
          </div>
        </div>
        <button 
          onClick={() => {
            if (!selectedRoom) {
              const el = document.getElementById('rooms');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-[#1A1A1A] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#C17F59] transition-colors"
        >
          {selectedRoom ? 'Reserve' : 'Select Room'}
        </button>
      </div>

    </div>
  );
};
