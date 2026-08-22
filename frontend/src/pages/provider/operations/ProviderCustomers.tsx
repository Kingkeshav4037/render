import React, { useState } from 'react';
import { Search, Mail, Phone, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_CUSTOMERS = [
  { id: 'C-001', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+44 7700 900077', totalBookings: 3, totalSpent: 12500, lastActive: 'Oct 15, 2026', status: 'ACTIVE' },
  { id: 'C-002', name: 'Marcus Voller', email: 'marcus.v@example.com', phone: '+49 151 23456789', totalBookings: 1, totalSpent: 3200, lastActive: 'Oct 14, 2026', status: 'ACTIVE' },
  { id: 'C-003', name: 'Emma Thompson', email: 'emma.t@example.com', phone: '+1 555 0123456', totalBookings: 5, totalSpent: 45000, lastActive: 'Oct 10, 2026', status: 'VIP' },
  { id: 'C-004', name: 'David Chen', email: 'david.c@example.com', phone: '+65 9123 4567', totalBookings: 1, totalSpent: 800, lastActive: 'Oct 01, 2026', status: 'ACTIVE' },
];

export const ProviderCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage customer relationships, history, and segments.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter size={16} /> Segments
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold text-center">Bookings</th>
                <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Last Active</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CUSTOMERS.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {customer.name}
                          {customer.status === 'VIP' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">VIP</span>}
                        </div>
                        <div className="text-xs text-slate-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <div className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {customer.email}</div>
                      <div className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-900">
                    {customer.totalBookings}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    NOK {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {customer.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                       View Profile <ExternalLink size={14} />
                    </button>
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
