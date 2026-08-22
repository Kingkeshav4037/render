import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2,
  CalendarDays,
  Image as ImageIcon
} from 'lucide-react';

const MOCK_LISTINGS = [
  { id: 'L-1001', name: 'Lofoten Panoramic Cabin', type: 'HOTEL', status: 'PUBLISHED', views: 12500, bookings: 142, rating: 4.9, revenue: 125000, updated: '2 hours ago', image: 'https://images.unsplash.com/photo-1520681329596-f36bc9cdcbdf?auto=format&fit=crop&q=80&w=100' },
  { id: 'L-1002', name: 'Midnight Sun Kayaking', type: 'ACTIVITY', status: 'PUBLISHED', views: 8200, bookings: 310, rating: 4.8, revenue: 85000, updated: '1 day ago', image: 'https://images.unsplash.com/photo-1542188478-f027fbcd3032?auto=format&fit=crop&q=80&w=100' },
  { id: 'L-1003', name: 'Arctic View Suite', type: 'HOTEL', status: 'PENDING_REVIEW', views: 0, bookings: 0, rating: 0, revenue: 0, updated: '5 hours ago', image: null },
  { id: 'L-1004', name: 'Fjord Sightseeing Ferry', type: 'TRANSPORT', status: 'PAUSED', views: 15400, bookings: 890, rating: 4.5, revenue: 320000, updated: '1 week ago', image: 'https://images.unsplash.com/photo-1513511651877-0e6fb8f30c6a?auto=format&fit=crop&q=80&w=100' },
  { id: 'L-1005', name: 'Tromsø Aurora Camp', type: 'HOTEL', status: 'DRAFT', views: 0, bookings: 0, rating: 0, revenue: 0, updated: 'Just now', image: null },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">Published</span>;
    case 'PENDING_REVIEW': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">In Review</span>;
    case 'PAUSED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">Paused</span>;
    case 'DRAFT': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-400 border border-slate-200 uppercase tracking-wider">Draft</span>;
    case 'REJECTED': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 uppercase tracking-wider">Rejected</span>;
    default: return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">{status}</span>;
  }
};

export const ProviderListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Listings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your properties, activities, and services.</p>
        </div>
        <Link to="/provider/listings/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} /> New Listing
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 outline-none">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Pending</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Listing</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Performance</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Last Updated</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LISTINGS.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {listing.image ? (
                        <img src={listing.image} alt={listing.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{listing.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{listing.id} • {listing.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(listing.status)}
                  </td>
                  <td className="px-6 py-4">
                    {listing.status === 'PUBLISHED' || listing.status === 'PAUSED' ? (
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between w-32">
                          <span className="text-slate-500">Views</span>
                          <span className="font-medium text-slate-900">{listing.views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-32">
                          <span className="text-slate-500">Bookings</span>
                          <span className="font-medium text-slate-900">{listing.bookings}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">No data yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                    {listing.updated}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === listing.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                        <div className="absolute right-8 top-10 w-48 bg-white border border-slate-200 shadow-lg rounded-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95">
                          <Link to={`/provider/listings/${listing.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Edit2 size={16} className="text-slate-400" /> Edit Listing
                          </Link>
                          <Link to={`/provider/listings/${listing.id}/preview`} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Eye size={16} className="text-slate-400" /> Preview
                          </Link>
                          {listing.status === 'PUBLISHED' && (
                            <Link to="/provider/calendar" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              <CalendarDays size={16} className="text-slate-400" /> Manage Availability
                            </Link>
                          )}
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                            <Trash2 size={16} className="text-red-400" /> Delete
                          </button>
                        </div>
                      </>
                    )}
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
