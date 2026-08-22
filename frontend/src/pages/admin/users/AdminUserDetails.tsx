import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Mail, Calendar, CreditCard, Clock, CheckCircle2, ShieldOff, AlertTriangle } from 'lucide-react';

export const AdminUserDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('ACTIVE');
  const [suspendReason, setSuspendReason] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <Link to="/admin/users" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Andreas Solberg
            {status === 'ACTIVE' 
              ? <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded uppercase tracking-wider">Active</span>
              : <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded uppercase tracking-wider">Suspended</span>
            }
          </h1>
          <p className="text-slate-500 text-sm font-mono mt-1">{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">andreas@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">Joined Oct 12, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-400" />
                <span className="text-sm text-slate-700">Last login: Today, 09:41 AM</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Administrative Actions</h3>
              {status === 'ACTIVE' ? (
                <div className="space-y-3">
                  <textarea 
                    placeholder="Reason for suspension (required)"
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 resize-none h-20"
                  />
                  <button 
                    disabled={!suspendReason}
                    onClick={() => setStatus('SUSPENDED')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <ShieldAlert size={16} /> Suspend User
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setStatus('ACTIVE'); setSuspendReason(''); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ShieldOff size={16} /> Restore Access
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Recent Bookings</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: 'NSL-8201', dest: 'Lofoten Panoramic Cabin', date: 'Dec 22-26, 2026', price: 'NOK 4,500', status: 'CONFIRMED' },
                { id: 'NSL-8190', dest: 'Midnight Sun Kayaking', date: 'Nov 15, 2026', price: 'NOK 1,200', status: 'COMPLETED' },
              ].map(booking => (
                <div key={booking.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{booking.dest}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{booking.date} • <span className="font-mono">{booking.id}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{booking.price}</div>
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-1">
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Security Events</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Login Successful</div>
                  <div className="text-xs text-slate-500 mt-0.5">Today, 09:41 AM • 192.168.1.1</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Failed Login Attempt</div>
                  <div className="text-xs text-slate-500 mt-0.5">Yesterday, 14:22 PM • 45.33.22.11 (Unknown Device)</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
