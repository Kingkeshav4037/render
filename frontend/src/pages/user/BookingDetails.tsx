import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Calendar, MapPin, CheckCircle2, XCircle, Download, AlertTriangle, ArrowLeft, Ticket } from 'lucide-react';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { invoiceService } from '../../services/invoice/invoiceService';
import { useAuthStore } from '../../store/useAuthStore';

import { bookingService } from '../../services/bookingService';

export const BookingDetails = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { formatPrice } = useCurrencyStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        let rawBooking: any = data;
        if (error || !rawBooking) {
          // Check local restaurant reservations
          try {
            const cached = JSON.parse(localStorage.getItem('norway_restaurant_reservations') || '{}');
            const foundLocal = Object.values(cached).find((r: any) => r.bookingId === id) as any;
            if (foundLocal) {
              rawBooking = {
                id: foundLocal.bookingId,
                item_type: 'RESTAURANT',
                status: 'CONFIRMED',
                start_time: `${foundLocal.date}T${foundLocal.time}:00`,
                end_time: new Date(new Date(`${foundLocal.date}T${foundLocal.time}:00`).getTime() + 2 * 3600000).toISOString(),
                pax: foundLocal.guests || 2,
                total_amount: 0,
                currency: 'NOK',
                restaurant_name: foundLocal.restaurantName,
                created_at: foundLocal.created_at || new Date().toISOString(),
              };
            }
          } catch {
            // ignore
          }
        }

        if (rawBooking) {
          const enriched = await bookingService.enrichBooking(rawBooking);
          setBooking(enriched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    
    setCancelling(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('id', id);
      
      if (error) throw error;
      setBooking({ ...booking, status: 'CANCELLED' });
      alert("Booking has been successfully cancelled. A refund has been initiated.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  const generateInvoice = () => {
    if (!booking) return;
    invoiceService.downloadInvoiceForBooking(booking, profile);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 flex justify-center"><div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-navy-900 rounded-full animate-spin"></div></div>;
  }

  if (!booking) {
    return <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 text-center font-bold text-navy-900">Booking not found.</div>;
  }

  const startDate = new Date(booking.start_time);
  const endDate = booking.end_time ? new Date(booking.end_time) : null;
  const isPast = new Date() > (endDate || startDate);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-navy-900 font-sans pb-24">
      
      {/* Header */}
      <div className="bg-navy-900 text-white pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto relative z-10">
          <button onClick={() => navigate('/user/bookings')} className="text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-bold flex items-center gap-2 mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Wallet
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block ${
                booking.status === 'CONFIRMED' ? 'bg-aurora-green text-navy-900' : 
                booking.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-amber-400 text-navy-900'
              }`}>
                {booking.status}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
                {booking.restaurant_name 
                  ? `Table at ${booking.restaurant_name}` 
                  : booking.stay_name 
                    ? `Stay at ${booking.stay_name}` 
                    : booking.activity_name 
                      ? booking.activity_name 
                      : `Booking #${booking.id?.split('-')[0] || booking.id}`}
              </h1>
              <p className="text-white/60 font-medium">Placed on {new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={generateInvoice} className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Download size={16} /> Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Ticket Info */}
            <div className="bg-white border border-gray-200 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-navy-900"></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-navy-900 mb-1">
                      {booking.restaurant_name 
                        ? `Table at ${booking.restaurant_name}` 
                        : booking.stay_name 
                          ? `Stay at ${booking.stay_name}` 
                          : booking.activity_name 
                            ? booking.activity_name 
                            : booking.item_type}
                    </h3>
                    <p className="text-gray-500 font-medium">Digital Ticket ID: {booking.id}</p>
                  </div>
                  <Ticket size={40} className="text-gray-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Start Date</span>
                    <span className="font-bold text-lg">{startDate.toLocaleDateString()}</span>
                  </div>
                  {endDate && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">End Date</span>
                      <span className="font-bold text-lg">{endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Guests / Pax</span>
                    <span className="font-bold text-lg">{booking.pax}</span>
                  </div>
                  {booking.item_type === 'ACCOMMODATION' && booking.nights ? (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Duration</span>
                      <span className="font-bold text-lg">{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</span>
                      <span className="font-bold text-lg">{booking.status}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {booking.status === 'CONFIRMED' && !isPast && (
                <div className="bg-gray-50 p-6 border-t border-gray-200 border-dashed text-center">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Show this code at entry</p>
                  <div className="bg-white border border-gray-300 p-4 inline-block font-mono text-2xl font-black tracking-[0.25em]">
                    {(booking.id.split('-')[1] || booking.id.slice(0, 6)).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            {booking.status === 'CONFIRMED' && !isPast && (
              <div className="bg-white border border-gray-200 shadow-sm p-8">
                <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" /> Cancellation Policy
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  You may cancel this booking up to 24 hours before the start time for a full refund. Cancellations made within 24 hours are subject to a 50% fee.
                </p>
                <button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-6 py-3 border border-red-200 text-red-600 font-bold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Processing...' : 'Cancel Booking'}
                </button>
              </div>
            )}
            
            {booking.status === 'CANCELLED' && (
              <div className="bg-red-50 border border-red-200 p-8 flex gap-4">
                <XCircle className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Booking Cancelled</h3>
                  <p className="text-sm text-red-800 leading-relaxed">This booking was successfully cancelled. If a refund is applicable, it will be processed to your original payment method within 5-7 business days.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm p-6 sticky top-28">
              <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Payment Summary</h3>
              
              {booking.item_type === 'RESTAURANT' && (!booking.total_amount || Number(booking.total_amount) === 0) ? (
                <div className="space-y-4">
                  <div className="space-y-4 pb-6 border-b border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Table Reservation Fee</span>
                      <span className="font-semibold text-emerald-700">Free / Complimentary</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Upfront Deposit</span>
                      <span className="font-medium">kr 0</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Dining Billing</span>
                      <span className="text-xs text-gray-500 font-medium">Pay at venue</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mb-4 pt-2">
                    <span className="font-bold text-navy-900">Total Deposit</span>
                    <span className="font-display font-black text-2xl text-emerald-700">kr 0</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={14} className="text-aurora-green" /> Guaranteed table hold confirmed
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Base Price {booking.nights ? `(${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'})` : ''}
                      </span>
                      <span className="font-medium">{formatPrice((booking.total_amount || 0) * 0.75)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Taxes & MVA (25%)</span>
                      <span className="font-medium">{formatPrice((booking.total_amount || 0) * 0.25)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-navy-900">Total Paid</span>
                    <span className="font-display font-black text-2xl text-navy-900">{formatPrice(booking.total_amount || 0)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={14} className="text-aurora-green" /> Payment completed & verified
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
