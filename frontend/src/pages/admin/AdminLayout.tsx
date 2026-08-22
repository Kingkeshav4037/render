import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Bell, UserCircle, Menu, X, Command, 
  LayoutDashboard, Users, Building2, Map, FileText, 
  ShoppingCart, Calendar, CreditCard, Star, Activity, 
  BarChart3, Megaphone, Image as ImageIcon, Shield, 
  Settings, Zap, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Command Palette Mock Component
const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-4 border-b border-slate-800">
          <Search size={20} className="text-slate-400 mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search users, destinations, IoT devices..."
            className="w-full bg-transparent border-none focus:outline-none text-white text-lg placeholder:text-slate-500"
          />
          <div className="flex gap-1 ml-4">
            <kbd className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-mono font-bold">ESC</kbd>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</div>
          <button className="w-full text-left px-4 py-3 text-slate-300 hover:bg-blue-600 hover:text-white rounded-lg flex items-center gap-3 transition-colors">
            <Shield size={16} /> Suspend a Provider
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-300 hover:bg-blue-600 hover:text-white rounded-lg flex items-center gap-3 transition-colors">
            <Zap size={16} /> Restart Payment Gateway
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(open => !open);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigation = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'Live Operations', to: '/admin/operations', icon: Activity },
    { name: 'Users', to: '/admin/users', icon: Users },
    { name: 'Providers', to: '/admin/providers', icon: Building2 },
    { name: 'Page Registry', to: '/admin/pages', icon: FileText },
    { name: 'Content CMS', to: '/admin/content', icon: Map },
    { name: 'Destinations', to: '/admin/destinations', icon: Building2 },
    { name: 'Wildlife', to: '/admin/content/wildlife', icon: ImageIcon },
    { name: 'Bookings', to: '/admin/bookings', icon: Calendar },
    { name: 'Payments', to: '/admin/payments', icon: CreditCard },
    { name: 'Moderation', to: '/admin/moderation', icon: Star },
    { name: 'IoT Control', to: '/admin/iot', icon: Zap },
    { name: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
    { name: 'Media Library', to: '/admin/media', icon: ImageIcon },
    { name: 'System Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shrink-0 z-20 relative
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen ? (
            <div className="font-bold text-white tracking-tight truncate">
              Norway <span className="text-blue-500">Admin</span>
            </div>
          ) : (
            <div className="font-bold text-white w-full text-center">NA</div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.to || 
                              (item.to !== '/admin' && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    title={!sidebarOpen ? item.name : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                      ${!sidebarOpen ? 'justify-center' : ''}
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 shrink-0">
              <UserCircle size={20} />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{profile?.fullName || 'System Admin'}</div>
                <div className="text-xs text-slate-500 truncate">{profile?.role || 'SUPER_ADMIN'}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          
          <button 
            onClick={() => setCmdPaletteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm hover:bg-slate-100 transition-colors md:w-96"
          >
            <Search size={16} className="text-slate-400" />
            <span className="flex-1 text-left hidden sm:inline-block">Search anywhere...</span>
            <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Command size={12} /> K
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <AlertCircle size={20} />
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
    </div>
  );
};
