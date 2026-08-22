import React, { useState } from 'react';
import { Search, Filter, CalendarDays, Download, MoreVertical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_BOOKINGS = [
  { id: 'NSL-8201', customer: 'Sarah Jenkins', item: 'Lofoten Panoramic Cabin', date: 'Oct 15 - Oct 18', guests: 2, amount: 4500, status: 'CONFIRMED' },
  { id: 'NSL-8202', customer: 'Marcus Voller', item: 'Midnight Sun Kayaking', date: 'Oct 15, 14:00', guests: 4, amount: 3200, status: 'CHECKED_IN' },
  { id: 'NSL-8203', customer: 'Emma Thompson', item: 'Arctic View Suite', date: 'Oct 10 - Oct 15', guests: 2, amount: 8500, status: 'COMPLETED' },
  { id: 'NSL-8204', customer: 'David Chen', item: 'Fjord Sightseeing Ferry', date: 'Oct 16, 09:00', guests: 1, amount: 800, status: 'PENDING' },
  { id: 'NSL-8205', customer: 'Sofia Garcia', item: 'Lofoten Panoramic Cabin', date: 'Oct 20 - Oct 22', guests: 3, amount: 3500, status: 'CANCELLED' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">Confirmed</span>;
    case 'CHECKED_IN': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">Checked In</span>;
    case 'COMPLETED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">Completed</span>;
    case 'PENDING': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">Pending</span>;
    case 'CANCELLED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 uppercase tracking-wider">Cancelled</span>;
    default: return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">{status}</span>;
  }
};

export const ProviderBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your reservations and customer transactions.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200">
        <div className="flex gap-6">
          {['All Bookings', 'Upcoming', 'Completed', 'Cancelled'].map((tab, idx) => (
            <button key={tab} className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${idx === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Customer, or Listing..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <CalendarDays size={16} /> Date Range
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Listing</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_BOOKINGS.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500">{booking.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{booking.customer}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.item}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" /> {booking.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    NOK {booking.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/provider/bookings/${booking.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Eye size={14} /> Details
                    </Link>
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
