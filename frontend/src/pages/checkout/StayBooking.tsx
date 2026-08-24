import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staysService, AccommodationRoom } from '../../services/stay/staysService';
import { useCartStore } from '../../store/useCartStore';
import { Calendar as CalendarIcon, Users, ShoppingBag } from 'lucide-react';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

export const StayBooking = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [room, setRoom] = useState<AccommodationRoom | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        const data = await staysService.getRoomDetails(roomId);
        setRoom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!room) {
    return <div className="min-h-screen pt-32 pb-24 text-center">Room not found</div>;
  }

  // Calculate days
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = (start && end && start < end) ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) : 0;
  const totalAmount = nights > 0 ? nights * room.price_per_night : 0;

  const handleAddToCart = () => {
    if (!checkIn || !checkOut || nights <= 0) {
      alert("Please select valid dates");
      return;
    }
    
    addItem({
      item_type: 'ACCOMMODATION',
      item_id: room.id,
      name: room.name,
      description: room.description || '',
      unit_price: room.price_per_night,
      quantity: nights,
      image: room.image_url,
      start_time: new Date(checkIn).toISOString(),
      end_time: new Date(checkOut).toISOString(),
      pax: guests
    });
    
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-navy-900 mb-8">Secure Your Stay</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Trip Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="checkin" className="block text-sm font-bold text-gray-700 mb-2">Check-in</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <CalendarIcon size={18} className="text-gray-400 mr-2" />
                    <input 
                      id="checkin"
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent w-full focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="checkout" className="block text-sm font-bold text-gray-700 mb-2">Check-out</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <CalendarIcon size={18} className="text-gray-400 mr-2" />
                    <input 
                      id="checkout"
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent w-full focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Guests</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <Users size={18} className="text-gray-400 mr-2" />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="bg-transparent w-full focus:outline-none"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={nights <= 0}
                className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-navy-800 transition-colors disabled:opacity-50"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24">
              <div className="aspect-video bg-gray-100 rounded-xl mb-6 overflow-hidden">
                <OptimizedImage 
                  src={room.image_url} 
                  alt={room.name} 
                  category="stay"
                  className="w-full h-full object-cover" 
                  containerClassName="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">{room.name}</h3>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">{room.description}</p>
              
              <h4 className="font-bold text-navy-900 mb-4">Price details</h4>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>{room.price_per_night} NOK x {nights} nights</span>
                  <span>{totalAmount} NOK</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>0 NOK</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-lg text-navy-900">
                <span>Total</span>
                <span>{totalAmount} NOK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
