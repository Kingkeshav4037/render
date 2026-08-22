import React, { useState } from 'react';
import { Bell, ShieldAlert, CreditCard, CloudLightning, MapPin, Tag, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Severe Weather Warning', message: 'High winds expected in Lofoten tomorrow. Your kayaking trip may be rescheduled.', time: '10 mins ago', icon: <ShieldAlert size={18} /> },
  { id: 2, type: 'important', title: 'Check-in Open', message: 'You can now check in for your flight SK4082 to Svolvær.', time: '2 hours ago', icon: <MapPin size={18} /> },
  { id: 3, type: 'payment', title: 'Payment Successful', message: 'Your booking at Aurora Lodge (NOK 4,500) is confirmed.', time: '1 day ago', icon: <CreditCard size={18} /> },
  { id: 4, type: 'normal', title: 'Aurora Forecast', message: 'High chance of Northern Lights tonight near your location.', time: '1 day ago', icon: <CloudLightning size={18} /> },
  { id: 5, type: 'marketing', title: 'Weekend Offer', message: 'Get 20% off Fjord cruises this weekend. Book now.', time: '3 days ago', icon: <Tag size={18} /> },
];

export const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' 
    ? NOTIFICATIONS 
    : NOTIFICATIONS.filter(n => filter === 'critical' ? ['critical', 'important'].includes(n.type) : n.type === filter);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight flex items-center gap-4">
            <Bell size={40} className="text-gray-300" />
            Notification <span className="font-bold">Center</span>.
          </h1>
          <p className="mt-4 text-lg text-gray-500">Your latest alerts and travel updates.</p>
        </div>
        <button 
          onClick={() => navigate('/settings/notifications')}
          className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <Settings size={16} /> Preferences
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Filters */}
        <div className="lg:col-span-3">
          <div className="sticky top-32 space-y-2">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'critical', label: 'Critical & Important' },
              { id: 'payment', label: 'Bookings & Payments' },
              { id: 'marketing', label: 'Deals & Offers' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 ${
                  filter === f.id
                    ? 'bg-navy-900 text-white shadow-lg'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-9 space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-3xl">
              No notifications found for this filter.
            </div>
          ) : (
            filtered.map((note) => (
              <div key={note.id} className={`p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex gap-6 items-start transition-all cursor-pointer hover:shadow-md ${
                note.type === 'critical' ? 'border-l-4 border-l-red-500' :
                note.type === 'important' ? 'border-l-4 border-l-amber-500' :
                note.type === 'payment' ? 'border-l-4 border-l-blue-500' : ''
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  note.type === 'critical' ? 'bg-red-50 text-red-500' :
                  note.type === 'important' ? 'bg-amber-50 text-amber-500' :
                  note.type === 'payment' ? 'bg-blue-50 text-blue-500' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {note.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-lg ${
                      note.type === 'critical' ? 'text-red-600' : 'text-navy-900'
                    }`}>{note.title}</h4>
                    <span className="text-xs font-bold text-gray-400">{note.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{note.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
