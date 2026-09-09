import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Bell, UserCircle, Menu, X, Command, 
  LayoutDashboard, Users, Building2, Map, FileText, 
  ShoppingCart, ShoppingBag, Calendar, CreditCard, Star, Activity, 
  BarChart3, Megaphone, Image as ImageIcon, Shield, 
  Settings, Zap, AlertCircle, Check, CheckCircle2, ArrowRight,
  ExternalLink, Sparkles, Clock, Layers, HelpCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { BrandLogo } from '../../components/shared/BrandLogo';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../../hooks/useNotifications';
import { searchService, SearchItem } from '../../services/searchService';

// Admin Navigation Directory with search keywords
interface AdminNavItem {
  name: string;
  to: string;
  icon: any;
  category: 'Navigation' | 'CMS' | 'Operations' | 'System';
  keywords: string[];
}

const ADMIN_NAVIGATION: AdminNavItem[] = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, category: 'Navigation', keywords: ['overview', 'metrics', 'stats', 'home'] },
  { name: 'Live Operations', to: '/admin/operations', icon: Activity, category: 'Operations', keywords: ['realtime', 'health', 'system status', 'logs'] },
  { name: 'Orders & Fulfillment', to: '/admin/orders', icon: ShoppingCart, category: 'Operations', keywords: ['sales', 'checkout', 'purchases', 'revenue'] },
  { name: 'Marketplace Stock', to: '/admin/products', icon: ShoppingBag, category: 'Operations', keywords: ['inventory', 'shop', 'products', 'merchandise'] },
  { name: 'Users', to: '/admin/users', icon: Users, category: 'System', keywords: ['accounts', 'customers', 'profiles', 'roles', 'permissions'] },
  { name: 'Providers', to: '/admin/providers', icon: Building2, category: 'Operations', keywords: ['partners', 'vendors', 'hosts', 'verification'] },
  { name: 'Page Registry', to: '/admin/pages', icon: FileText, category: 'System', keywords: ['routes', 'seo', 'urls', 'page health'] },
  { name: 'Content CMS', to: '/admin/content', icon: Map, category: 'CMS', keywords: ['content', 'editorial', 'articles', 'database'] },
  { name: 'Destinations', to: '/admin/destinations', icon: Building2, category: 'CMS', keywords: ['places', 'cities', 'fjords', 'regions'] },
  { name: 'Wildlife', to: '/admin/content/wildlife', icon: ImageIcon, category: 'CMS', keywords: ['animals', 'fauna', 'species', 'nature'] },
  { name: 'Bookings', to: '/admin/bookings', icon: Calendar, category: 'Operations', keywords: ['reservations', 'stays', 'activities', 'calendar'] },
  { name: 'Payments', to: '/admin/payments', icon: CreditCard, category: 'Operations', keywords: ['transactions', 'razorpay', 'refunds', 'settlements'] },
  { name: 'Moderation', to: '/admin/moderation', icon: Star, category: 'Operations', keywords: ['reviews', 'flagged', 'approval', 'reports'] },
  { name: 'IoT Control', to: '/admin/iot', icon: Zap, category: 'Operations', keywords: ['sensors', 'devices', 'energy', 'smart city', 'telemetry'] },
  { name: 'Analytics', to: '/admin/analytics', icon: BarChart3, category: 'System', keywords: ['metrics', 'charts', 'conversion', 'traffic'] },
  { name: 'Media Library', to: '/admin/media', icon: ImageIcon, category: 'CMS', keywords: ['images', 'photos', 'uploads', 'assets'] },
  { name: 'System Settings', to: '/admin/settings', icon: Settings, category: 'System', keywords: ['config', 'environment', 'security', 'preferences'] },
];

const QUICK_ACTIONS = [
  { name: 'Orders & Fulfillment', to: '/admin/orders', icon: ShoppingCart, description: 'View real-time customer purchases and fulfillment' },
  { name: 'Review Bookings', to: '/admin/bookings', icon: Calendar, description: 'Inspect stay and activity reservations across Norway' },
  { name: 'Provider Applications', to: '/admin/providers', icon: Building2, description: 'Verify partner and provider submissions' },
  { name: 'Live Operations & Health', to: '/admin/operations', icon: Activity, description: 'Monitor system telemetry and backend services' },
  { name: 'Browse Public Website', to: '/home', icon: ExternalLink, description: 'Open Norway SmartLife client-facing portal' }
];

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Admin Command Palette & Global Search
// ─────────────────────────────────────────────────────────────────────────────
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remoteResults, setRemoteResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Focus input whenever palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setRemoteResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter Admin Navigation Items based on query
  const matchingNavItems = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return ADMIN_NAVIGATION.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [query]);

  // Filter Quick Actions based on query
  const matchingQuickActions = React.useMemo(() => {
    if (!query.trim()) return QUICK_ACTIONS;
    const q = query.toLowerCase().trim();
    return QUICK_ACTIONS.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q)
    );
  }, [query]);

  // Query searchService for catalog items (destinations, stays, activities, shop)
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setRemoteResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const items = await searchService.search(query, 'all');
        setRemoteResults(items.slice(0, 6));
      } catch (err) {
        console.warn('Admin search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Combine items for keyboard navigation
  const allSelectableItems = React.useMemo(() => {
    if (!query.trim()) {
      return matchingQuickActions.map(a => ({ name: a.name, to: a.to, type: 'action' }));
    }
    const list: { name: string; to: string; type: string }[] = [];
    matchingNavItems.forEach(n => list.push({ name: n.name, to: n.to, type: 'nav' }));
    remoteResults.forEach(r => list.push({ name: r.title, to: r.path, type: 'catalog' }));
    matchingQuickActions.forEach(a => list.push({ name: a.name, to: a.to, type: 'action' }));
    return list;
  }, [query, matchingNavItems, remoteResults, matchingQuickActions]);

  // Reset selected index if list length changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [allSelectableItems.length]);

  // Handle key navigation (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allSelectableItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (allSelectableItems.length || 1)) % (allSelectableItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allSelectableItems[selectedIndex];
      if (selected) {
        navigate(selected.to);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Admin command and search palette"
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/80 text-white animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-900/90">
          <Search size={20} className="text-cyan-400 shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search admin pages, users, bookings, destinations, IoT..."
            aria-label="Search admin system"
            className="w-full bg-transparent border-none focus:outline-none text-white text-base placeholder:text-slate-500 font-sans"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded text-xs font-mono font-bold shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* 1. Admin Navigation Matches */}
          {matchingNavItems.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Command size={12} className="text-cyan-400" /> Admin Navigation
              </div>
              <div className="space-y-1 mt-1">
                {matchingNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.to}
                      onClick={() => {
                        navigate(item.to);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-blue-600 hover:text-white transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-blue-700 group-hover:text-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-sm block">{item.name}</span>
                          <span className="text-xs text-slate-400 group-hover:text-blue-100 truncate block">
                            {item.category} • {item.to}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Live Platform Search Matches */}
          {remoteResults.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" /> Catalog & Platform Entities
              </div>
              <div className="space-y-1 mt-1">
                {remoteResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-blue-600 hover:text-white transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="p-2 rounded-lg bg-slate-800 text-amber-400 group-hover:bg-blue-700 group-hover:text-white shrink-0">
                          <Layers size={16} />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-semibold text-sm block truncate">{item.title}</span>
                        <span className="text-xs text-slate-400 group-hover:text-blue-100 truncate block">
                          {item.categoryLabel} • {item.path}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-blue-700 group-hover:text-white font-mono uppercase shrink-0">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Quick Actions (Shown when query is empty or matches) */}
          {matchingQuickActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap size={12} className="text-cyan-400" /> {query.trim() ? 'Actions' : 'Quick Actions'}
              </div>
              <div className="space-y-1 mt-1">
                {matchingQuickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.to}
                      onClick={() => {
                        navigate(action.to);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-blue-600 hover:text-white transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-blue-700 group-hover:text-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-sm block">{action.name}</span>
                          <span className="text-xs text-slate-400 group-hover:text-blue-100 truncate block">
                            {action.description}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results fallback */}
          {query.trim() && matchingNavItems.length === 0 && remoteResults.length === 0 && matchingQuickActions.length === 0 && !loading && (
            <div className="text-center py-10 text-slate-400">
              <Search size={32} className="mx-auto mb-3 text-slate-600" />
              <p className="font-medium text-sm text-slate-300">No matching pages or content found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;Orders&quot;, &quot;Users&quot;, &quot;Bookings&quot;, or &quot;Destinations&quot;.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">ESC</kbd> Close</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400">Norway SmartLife Central</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin Notifications Dropdown
// ─────────────────────────────────────────────────────────────────────────────
const AdminNotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      if (event.key === 'Escape') setIsOpen(false);
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
    setIsOpen(false);
    if (link) {
      if (link.startsWith('/')) {
        navigate(link);
      } else {
        window.location.href = link;
      }
    } else {
      navigate('/admin/operations');
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'BOOKING': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'PAYMENT': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'SAFETY': return 'bg-red-50 text-red-600 border-red-200';
      case 'SYSTEM': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full px-1 border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          role="menu"
          aria-label="Admin Notifications"
          className="absolute right-0 mt-2 w-88 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllAsRead.mutate()}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                <p className="font-semibold text-sm text-slate-800">All systems normal</p>
                <p className="text-xs text-slate-400 mt-1">No pending unread system alerts or messages.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link_url)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${getTypeStyle(n.type)}`}>
                    <Bell size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs truncate ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-sans">
                      <Clock size={10} /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs px-4">
            <button 
              onClick={() => {
                navigate('/admin/operations');
                setIsOpen(false);
              }}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
            >
              Live Operations Dashboard
            </button>
            <button 
              onClick={() => {
                navigate('/admin/orders');
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
            >
              Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin System Status Popover
// ─────────────────────────────────────────────────────────────────────────────
const AdminSystemStatusPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="System status alerts"
        aria-expanded={isOpen}
        className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
      >
        <AlertCircle size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Platform Health Status</span>
          </div>

          <div className="py-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">PostgreSQL Database</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold text-[11px]">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Realtime WebSockets</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold text-[11px]">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Payment Gateway</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold text-[11px]">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Content & Translations</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold text-[11px]">Synchronized</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                navigate('/admin/operations');
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors text-center cursor-pointer"
            >
              Operations
            </button>
            <button
              onClick={() => {
                navigate('/admin/pages');
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors text-center cursor-pointer"
            >
              Page Registry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin Layout Main Component
// ─────────────────────────────────────────────────────────────────────────────
export const AdminLayout = () => {
  const { profile } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Global Keyboard shortcut for command palette (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        aria-label="Admin Sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 md:relative md:z-20
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-64 md:w-20'} 
          bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shrink-0
        `}
      >
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800">
          <div className="overflow-hidden min-w-0">
            <BrandLogo size="sm" showText={sidebarOpen} linkTo="/admin" />
          </div>
          <button 
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none shrink-0 cursor-pointer"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} className="mx-auto" />}
          </button>
        </div>

        <nav aria-label="Admin Navigation" className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="space-y-1 px-2">
            {ADMIN_NAVIGATION.map((item) => {
              const isActive = location.pathname === item.to || 
                              (item.to !== '/admin' && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    title={!sidebarOpen ? item.name : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                      ${!sidebarOpen ? 'md:justify-center' : ''}
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    {(sidebarOpen || window.innerWidth < 768) && <span className="truncate">{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'md:justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 shrink-0">
              <UserCircle size={20} />
            </div>
            {(sidebarOpen || window.innerWidth < 768) && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{profile?.fullName || 'System Admin'}</div>
                <div className="text-xs text-slate-500 truncate">{profile?.role || 'SUPER_ADMIN'}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 z-10 shrink-0">
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setCmdPaletteOpen(true)}
              aria-label="Open command palette (Ctrl+K)"
              aria-haspopup="dialog"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm hover:bg-slate-100 hover:border-slate-300 transition-all md:w-96 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer group"
            >
              <Search size={16} className="text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              <span className="flex-1 text-left hidden sm:inline-block truncate">Search anywhere...</span>
              <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-600 font-mono">
                <Command size={12} /> K
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <AdminSystemStatusPopover />
            <AdminNotificationDropdown />
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Command Palette */}
      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
    </div>
  );
};
