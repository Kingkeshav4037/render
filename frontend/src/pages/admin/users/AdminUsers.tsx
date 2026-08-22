import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, ShieldCheck, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_USERS = [
  { id: 'usr-101', name: 'Andreas Solberg', email: 'andreas@example.com', role: 'USER', status: 'ACTIVE', joined: 'Oct 12, 2026', bookings: 4 },
  { id: 'usr-102', name: 'Kari Nordmann', email: 'kari.n@example.com', role: 'USER', status: 'ACTIVE', joined: 'Sep 28, 2026', bookings: 12 },
  { id: 'usr-103', name: 'James Wilson', email: 'james.w@example.com', role: 'USER', status: 'SUSPENDED', joined: 'Aug 14, 2026', bookings: 0 },
  { id: 'usr-104', name: 'Lofoten Admin', email: 'admin@lofoten.no', role: 'PROVIDER', status: 'ACTIVE', joined: 'Jan 05, 2026', bookings: 0 },
];

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Governance</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform users, roles, and access.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-center">Bookings</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/admin/users/${user.id}`} className="font-bold text-blue-600 hover:underline">{user.name}</Link>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider
                      ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}
                    `}>
                      {user.status === 'ACTIVE' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.joined}</td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{user.bookings}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                      <MoreVertical size={16} />
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
