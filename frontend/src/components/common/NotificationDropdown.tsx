import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNotificationClick = (id: string, link: string | null) => {
    markAsRead.mutate(id);
    if (link) {
      window.location.href = link; // Or use react-router navigate if preferred
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'BOOKING': return 'bg-blue-100 text-blue-600';
      case 'PAYMENT': return 'bg-green-100 text-green-600';
      case 'WEATHER': return 'bg-orange-100 text-orange-600';
      case 'AURORA': return 'bg-purple-100 text-purple-600';
      case 'SAFETY': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="p-2 text-gray-600 hover:text-navy-900 transition-colors relative focus-visible:ring-2 focus-visible:ring-aurora-green focus-visible:outline-none rounded"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          role="menu"
          aria-label="Notifications list"
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-navy-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllAsRead.mutate()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No notifications yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n.id, n.link_url)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${getIconColor(n.type)}`}>
                        <Bell size={14} />
                      </div>
                      <div>
                        <h4 className={`text-sm ${!n.is_read ? 'font-bold text-navy-900' : 'font-medium text-gray-700'}`}>
                          {n.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {!n.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
            <button className="text-sm text-navy-900 font-bold hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
