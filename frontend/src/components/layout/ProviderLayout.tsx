import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  CalendarDays, 
  Users, 
  Star, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Megaphone, 
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const NAVIGATION = [
  { name: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'Listings', path: '/provider/listings', icon: Package },
  { name: 'Bookings', path: '/provider/bookings', icon: CalendarDays },
  { name: 'Calendar', path: '/provider/calendar', icon: CalendarDays }, // Using same icon or Calendar
  { name: 'Customers', path: '/provider/customers', icon: Users },
  { name: 'Messages', path: '/provider/messages', icon: MessageSquare },
  { name: 'Reviews', path: '/provider/reviews', icon: Star },
  { name: 'Finance', path: '/provider/finance', icon: CreditCard },
  { name: 'Analytics', path: '/provider/analytics', icon: BarChart3 },
  { name: 'Marketing', path: '/provider/marketing', icon: Megaphone },
];

export const ProviderLayout = () => {
  const { pathname } = useLocation();
  const { profile, signOut } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Deep Navy: #0f172a (slate-900)
  // Arctic White: #ffffff
  // Slate: #64748b (slate-500)
  // Nordic Blue: #3b82f6 (blue-500)

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link to="/provider/dashboard" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs">N</span>
              Provider
            </Link>
            <button className="ml-auto lg:hidden" onClick={() => setIsMobileOpen(false)}>
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} className={`mr-3 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800">
            <Link
              to="/provider/settings"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings size={18} className="mr-3 text-slate-400" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 relative">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Quick Actions / Breadcrumbs could go here */}
            <div className="hidden sm:flex items-center px-3 py-1.5 bg-slate-100 rounded-md text-sm font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Live Operations
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/provider/notifications" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {profile?.fullName?.charAt(0) || 'P'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{profile?.fullName || 'Provider Account'}</p>
                  <p className="text-xs text-slate-500 leading-tight">Admin</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">Lofoten Adventures</p>
                      <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                    </div>
                    <Link to="/provider/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setIsProfileMenuOpen(false)}>Account Settings</Link>
                    <Link to="/" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setIsProfileMenuOpen(false)}>Switch to Traveler</Link>
                    <button 
                      onClick={() => { signOut(); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
