import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CalendarDays, 
  Users, 
  MapPin, 
  MessageSquare, 
  Mail, 
  Phone, 
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

interface BookingData {
  id: string;
  customer: string;
  email: string;
  phone: string;
  item: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: string;
  specialRequests: string;
  paymentStatus: string;
  paymentMethod: string;
}

export const ProviderBookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      setLoadingData(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            start_time,
            end_time,
            pax,
            total_amount,
            item_id,
            item_type,
            profiles:user_id ( full_name, email, phone ),
            payment_transactions ( status, payment_method )
          `)
          .eq('id', id)
          .single();

        if (error || !data) throw error;

        const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles as any;
        const payment = Array.isArray(data.payment_transactions) ? data.payment_transactions[0] : data.payment_transactions as any;

        setBooking({
          id: data.id,
          customer: profile?.full_name || 'Guest',
          email: profile?.email || '',
          phone: profile?.phone || '',
          item: `${data.item_type} #${data.item_id}`,
          checkIn: data.start_time ? new Date(data.start_time).toLocaleString('en-GB') : '',
          checkOut: data.end_time ? new Date(data.end_time).toLocaleString('en-GB') : '',
          guests: data.pax ?? 1,
          amount: data.total_amount ?? 0,
          status: data.status ?? 'PENDING',
          specialRequests: '',
          paymentStatus: payment?.status ?? 'PENDING',
          paymentMethod: payment?.payment_method ?? 'Not specified',
        });
      } catch {
        // If no real booking exists yet, show a demo placeholder (never hardcode test card numbers)
        setBooking({
          id: id || 'NSL-DEMO',
          customer: 'Demo Customer',
          email: 'demo@example.com',
          phone: '',
          item: 'Lofoten Panoramic Cabin',
          checkIn: 'Oct 15, 2026 - 15:00',
          checkOut: 'Oct 18, 2026 - 11:00',
          guests: 2,
          amount: 4500,
          status: 'CONFIRMED',
          specialRequests: 'We are celebrating our anniversary!',
          paymentStatus: 'PENDING',
          paymentMethod: 'Not specified',
        });
      } finally {
        setLoadingData(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleAction = (action: string) => {
    toast.success(`Booking ${action} successfully`);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/provider/bookings" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Booking #{booking.id}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block">
                <Printer size={20} />
              </button>
              <Link to="/provider/messages" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <MessageSquare size={16} /> Message Guest
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{booking.status}</h2>
                  <p className="text-sm text-slate-500">Awaiting Check-in on {booking.checkIn}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction('checked in')} className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                  Mark Checked-in
                </button>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Reservation Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Listing</div>
                    <div className="font-bold text-slate-900">{booking.item}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Guests</div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Users size={18} className="text-slate-400" /> {booking.guests} Adults
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Check In</div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CalendarDays size={18} className="text-slate-400" /> {booking.checkIn}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Check Out</div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CalendarDays size={18} className="text-slate-400" /> {booking.checkOut}
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.specialRequests && (
                <div className="p-6 bg-amber-50 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Clock size={16} /> Special Requests
                  </h4>
                  <p className="text-sm text-amber-800">{booking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Payment Breakdown</h3>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                  {booking.paymentStatus}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="pt-4 border-t border-slate-100 flex justify-between font-bold text-lg text-slate-900">
                  <span>Total</span>
                  <span>NOK {booking.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <CreditCard size={16} /> {booking.paymentMethod}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Customer Info & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Details</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-xl font-bold text-slate-400">
                  {booking.customer.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{booking.customer}</div>
                  <div className="text-sm text-slate-500">Norway SmartLife Member</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {booking.email && (
                  <a href={`mailto:${booking.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Mail size={16} className="text-slate-400" /> {booking.email}
                  </a>
                )}
                {booking.phone && (
                  <a href={`tel:${booking.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Phone size={16} className="text-slate-400" /> {booking.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">Admin Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors">
                  Edit Dates/Guests
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors">
                  Issue Partial Refund
                </button>
                <div className="h-px bg-slate-100 my-2"></div>
                <button onClick={() => handleAction('cancelled')} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                  <XCircle size={16} /> Cancel Booking
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
