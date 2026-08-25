import React, { useState, useEffect, useMemo } from 'react';
import { Bell, ShieldAlert, CreditCard, CloudLightning, MapPin, Tag, Settings, CheckCheck, Trash2, ArrowRight, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../../store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationItem {
  id: string;
  type: 'critical' | 'important' | 'payment' | 'normal' | 'marketing';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { 
    id: 'note-1', 
    type: 'critical', 
    title: 'Severe Mountain Weather Advisory', 
    message: 'Gale force winds and heavy snowfall reported on Reinebringen trail. Backcountry ascents advised only with alpine guide.', 
    time: '10 mins ago', 
    read: false,
    actionUrl: '/weather?city=Lofoten',
    actionText: 'View Weather'
  },
  { 
    id: 'note-2', 
    type: 'important', 
    title: 'Upcoming Scenic Route Departure', 
    message: 'Flåm Railway departure FL-402 scheduled for tomorrow at 08:35 from Myrdal Station.', 
    time: '2 hours ago', 
    read: false,
    actionUrl: '/trips',
    actionText: 'View Itinerary'
  },
  { 
    id: 'note-3', 
    type: 'payment', 
    title: 'Booking Payment Confirmed', 
    message: 'Your stay at Juvet Landscape Hotel (NOK 4,500) has been paid in full with universal tax receipt issued.', 
    time: '1 day ago', 
    read: true,
    actionUrl: '/user/invoices',
    actionText: 'View Invoice'
  },
  { 
    id: 'note-4', 
    type: 'normal', 
    title: 'High Aurora Activity Forecast', 
    message: 'Geomagnetic Kp index 5.4 expected tonight across Tromsø and Senja with clear skies.', 
    time: '1 day ago', 
    read: true,
    actionUrl: '/aurora',
    actionText: 'Track Aurora'
  },
  { 
    id: 'note-5', 
    type: 'marketing', 
    title: 'Electric Fjord Cruise Seasonal Discount', 
    message: 'Enjoy 20% off all zero-emission catamaran journeys across Geirangerfjord this weekend.', 
    time: '3 days ago', 
    read: true,
    actionUrl: '/deals',
    actionText: 'Explore Deals'
  },
];

export const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nsl_user_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem('nsl_user_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch (e) {
      console.warn('Notifications load error:', e);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem('nsl_user_notifications', JSON.stringify(items));
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
    toast.info('Notification marked as read.');
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
    toast.success('All notifications marked as read.');
  };

  const handleDismiss = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
    toast.info('Notification dismissed.');
  };

  const handleClearAll = () => {
    saveNotifications([]);
    toast.info('All notifications cleared.');
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'critical') return notifications.filter(n => ['critical', 'important'].includes(n.type));
    if (filter === 'payment') return notifications.filter(n => n.type === 'payment');
    if (filter === 'marketing') return notifications.filter(n => n.type === 'marketing');
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical': return <ShieldAlert size={18} />;
      case 'important': return <MapPin size={18} />;
      case 'payment': return <CreditCard size={18} />;
      case 'normal': return <CloudLightning size={18} />;
      case 'marketing': return <Tag size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-aurora-green/20 text-navy-900 rounded-xl">
              <Bell size={24} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Activity & Alerts</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 tracking-tight flex items-center gap-4">
            Notification Center
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Real-time travel advisories, booking updates, weather notices, and aurora telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <CheckCheck size={14} /> Mark All Read ({unreadCount})
            </button>
          )}
          <button 
            onClick={() => navigate('/settings/notifications')}
            className="flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Settings size={14} /> Preferences
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Filters */}
        <div className="lg:col-span-3">
          <div className="sticky top-32 space-y-2 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Filter Alerts</p>
            {[
              { id: 'all', label: 'All Notifications', count: notifications.length },
              { id: 'unread', label: 'Unread Only', count: unreadCount },
              { id: 'critical', label: 'Safety & Advisories' },
              { id: 'payment', label: 'Bookings & Receipts' },
              { id: 'marketing', label: 'Deals & Offers' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex justify-between items-center cursor-pointer ${
                  filter === f.id
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                <span>{f.label}</span>
                {f.count !== undefined && f.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    filter === f.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}

            {notifications.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={handleClearAll}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={13} /> Clear All Alerts
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="lg:col-span-9 space-y-4">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-3xl bg-white">
              <Bell size={36} className="mx-auto mb-3 text-gray-300 opacity-60" />
              <h3 className="text-lg font-bold text-navy-900 mb-1">No Notifications Found</h3>
              <p className="text-sm text-gray-500">You're completely caught up with your Norwegian travel alerts.</p>
            </div>
          ) : (
            filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 bg-white border rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all ${
                  !note.read ? 'border-l-4 border-l-aurora-green bg-emerald-50/20' : 'border-gray-100 opacity-90'
                } ${
                  note.type === 'critical' ? 'border-l-4 border-l-red-500 bg-red-50/10' :
                  note.type === 'important' ? 'border-l-4 border-l-amber-500' :
                  note.type === 'payment' ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  note.type === 'critical' ? 'bg-red-50 text-red-500' :
                  note.type === 'important' ? 'bg-amber-50 text-amber-600' :
                  note.type === 'payment' ? 'bg-blue-50 text-blue-600' :
                  note.type === 'marketing' ? 'bg-purple-50 text-purple-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {getIcon(note.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-base ${
                        note.type === 'critical' ? 'text-red-600' : 'text-navy-900'
                      }`}>
                        {note.title}
                      </h4>
                      {!note.read && (
                        <span className="w-2 h-2 rounded-full bg-aurora-green shrink-0" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-400">{note.time}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{note.message}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    {note.actionUrl && (
                      <Link
                        to={note.actionUrl}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        {note.actionText || 'View Details'} <ArrowRight size={12} />
                      </Link>
                    )}

                    {!note.read && (
                      <button
                        onClick={() => handleMarkAsRead(note.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check size={12} /> Mark Read
                      </button>
                    )}

                    <button
                      onClick={() => handleDismiss(note.id)}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 ml-auto cursor-pointer"
                      aria-label="Dismiss notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
