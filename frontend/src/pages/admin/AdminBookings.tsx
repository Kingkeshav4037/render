import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { format, parseISO } from 'date-fns';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.fetchAllBookings();
        // Fallback to mock data if empty (since DB might be empty in this prototype)
        if (!data || data.length === 0) {
          setBookings([
            { id: 'NSL-8201', user_id: 'usr-101', total_amount: 4500, status: 'CONFIRMED', created_at: new Date().toISOString() },
            { id: 'NSL-8202', user_id: 'usr-205', total_amount: 1200, status: 'PENDING_PAYMENT', created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 'NSL-8203', user_id: 'usr-412', total_amount: 8900, status: 'CANCELLED', created_at: new Date(Date.now() - 172800000).toISOString() },
          ]);
        } else {
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to load bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING_PAYMENT': return 'bg-amber-100 text-amber-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarDays className="text-purple-600" /> Bookings & Reservations
        </h1>
        <p className="text-slate-500 text-sm mt-1">Monitor system-wide reservations across all providers.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Bookings (YTD)', val: '18,492', trend: '+12%', icon: ArrowUpRight, color: 'text-emerald-600' },
          { label: 'Pending Action', val: '42', trend: '-5%', icon: ArrowDownRight, color: 'text-amber-600' },
          { label: 'Cancellation Rate', val: '3.1%', trend: '-0.2%', icon: ArrowDownRight, color: 'text-emerald-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
                <div className={`flex items-center text-xs font-bold ${stat.color}`}>
                  <Icon size={14} /> {stat.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search booking ID or user..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Customer ID</th>
                <th className="px-6 py-4 font-semibold">Date Created</th>
                <th className="px-6 py-4 font-semibold text-right">Amount (NOK)</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              )}
              {!loading && bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{booking.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {booking.user?.id?.substring(0, 8) || booking.user_id?.substring(0, 8) || 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.created_at ? format(parseISO(booking.created_at), 'yyyy-MM-dd') : 'N/A'}</td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">{booking.total_amount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
