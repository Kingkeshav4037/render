import React from 'react';
import { DashboardUser } from '../../../types/dashboard';
import { Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  user: DashboardUser;
  notificationsCount: number;
}

export const DashboardHeader: React.FC<Props> = ({ user, notificationsCount }) => {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const dateStr = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  }).format(new Date());

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-navy-900 flex items-center justify-center text-white border-2 border-white shadow-sm">
            <User size={32} />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
            {greeting}, {user.name.split(' ')[0]} <span className="wave">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">{dateStr} • Here's your Norway journey overview.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/user/notifications" className="relative p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-navy-900 hover:border-gray-300 transition-colors shadow-sm">
          <Bell size={20} />
          {notificationsCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </Link>
        <Link to="/user/settings" className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-navy-900 hover:border-gray-300 transition-colors shadow-sm">
          <Settings size={20} />
        </Link>
      </div>
      <style>{`
        .wave {
          display: inline-block;
          animation: wave-animation 2.5s infinite;
          transform-origin: 70% 70%;
        }
        @keyframes wave-animation {
          0% { transform: rotate( 0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate( 0.0deg) }
          100% { transform: rotate( 0.0deg) }
        }
      `}</style>
    </div>
  );
};
