import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, MapPin, CheckCircle2, XCircle, Clock, Wallet, Ticket, Navigation, Coffee, Home, Bed, User, FileText, ChevronRight, Download, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { invoiceService } from '../../services/invoice/invoiceService';
import { useAuthStore } from '../../store/useAuthStore';

export const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED'>('UPCOMING');
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch all bookings for the user. In a real app, you'd join with polymorphic tables or a unified items view.
        // We'll fetch basic booking data and assume name is stored or we'll render generic placeholders for this prototype.
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 flex justify-center"><div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-navy-900 rounded-full animate-spin"></div></div>;
  }

  const now = new Date();

  const filteredBookings = bookings.filter(b => {
    const end = new Date(b.end_time || b.start_time);
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    if (activeTab === 'UPCOMING') return b.status !== 'CANCELLED' && end >= now;
    if (activeTab === 'PAST') return b.status !== 'CANCELLED' && end < now;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'ACCOMMODATION': return <Bed size={20} className="text-navy-900" />;
      case 'TRANSPORT': return <Navigation size={20} className="text-[#0284C7]" />;
      case 'ACTIVITY': return <Ticket size={20} className="text-[#059669]" />;
      case 'RESTAURANT': return <Coffee size={20} className="text-[#D97706]" />;
      case 'PRODUCT': return <ShoppingBag size={20} className="text-[#059669]" />;
      default: return <Wallet size={20} className="text-navy-900" />;
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] text-navy-900 font-sans pb-24">
      
      {/* Wallet Hero */}
      <div className="bg-navy-900 text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/10 to-transparent mix-blend-overlay"></div>
        <div className="relative max-w-[1440px] mx-auto z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-aurora-green font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
              <Wallet size={16} /> Travel Wallet
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-4">My Bookings</h1>
            <p className="text-lg text-white/80 max-w-xl font-medium">Manage your itinerary, view digital tickets, and access invoices.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-sm min-w-[120px]">
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Upcoming</div>
              <div className="text-3xl font-display font-black text-aurora-green">{bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.end_time || b.start_time) >= now).length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-sm min-w-[120px]">
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Past Trips</div>
              <div className="text-3xl font-display font-black text-white">{bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.end_time || b.start_time) < now).length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-12 bg-[#F8FAFC]">
          {(['UPCOMING', 'PAST', 'CANCELLED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${
                activeTab === tab ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-4">No {activeTab.toLowerCase()} bookings</h2>
            <p className="text-gray-500 mb-8 font-medium">When you book an experience, it will appear here.</p>
            <button 
              onClick={() => navigate('/explore')}
              className="bg-navy-900 text-white font-bold px-8 py-4 uppercase tracking-widest text-xs hover:bg-aurora-green hover:text-navy-900 transition-colors shadow-lg"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {filteredBookings.map((booking) => {
              const startDate = new Date(booking.start_time);
              const endDate = booking.end_time ? new Date(booking.end_time) : null;
              
              return (
                <Link to={`/user/bookings/${booking.id}`} key={booking.id} className="block group">
                  <div className="bg-white border border-gray-200 hover:border-navy-900/50 flex flex-col md:flex-row shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    
                    {/* Date Block (Left) */}
                    <div className="w-full md:w-32 bg-gray-50 border-r border-gray-100 flex md:flex-col items-center justify-center p-4 md:p-6 text-center group-hover:bg-navy-50 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{startDate.toLocaleString('en-US', { month: 'short' })}</div>
                      <div className="text-3xl font-display font-black text-navy-900">{startDate.getDate()}</div>
                      <div className="text-xs font-bold text-gray-400 mt-1">{startDate.getFullYear()}</div>
                    </div>

                    {/* Content (Middle) */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                          {getIcon(booking.item_type)} {booking.item_type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-display font-bold text-navy-900 mb-2 group-hover:text-aurora-green transition-colors">
                        Booking #{booking.id.split('-')[0]}
                      </h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-2"><User size={16} className="text-gray-400"/> {booking.pax} {booking.pax === 1 ? 'Guest' : 'Guests'}</div>
                        {endDate && (
                          <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400"/> Until {endDate.toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>

                    {/* Price & Action (Right) */}
                    <div className="w-full md:w-56 bg-white border-t md:border-t-0 md:border-l border-gray-100 p-6 flex md:flex-col justify-between items-center md:items-end md:justify-center gap-3">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</div>
                        <div className="text-xl font-display font-black text-navy-900">{formatPrice(booking.total_amount)}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-0 md:mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            invoiceService.downloadInvoiceForBooking(booking, profile);
                          }}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-aurora-green hover:text-navy-900 text-gray-600 border border-gray-200 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                          title="Download MVA Tax Invoice"
                        >
                          <Download size={13} /> Invoice
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
