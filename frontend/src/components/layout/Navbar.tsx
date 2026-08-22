import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Map, Bell, Compass, ShoppingBag, Menu, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore, Currency } from '../../store/useCurrencyStore';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { items, setIsOpen } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();
  const { t, i18n } = useTranslation();
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive display name: profile name → user_metadata name → email prefix
  const displayName = profile?.fullName 
    || user?.user_metadata?.full_name 
    || user?.user_metadata?.name
    || user?.email?.split('@')[0] 
    || 'Account';
  const firstName = displayName.split(' ')[0];

  const currentLang = (i18n.language || 'en').toUpperCase().slice(0, 2);
  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang.toLowerCase());
    localStorage.setItem('norway_preferred_lang', lang.toLowerCase());
  };
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowMobileMenu(false);
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {/* 1. Discover */}
      <div className="relative group px-3 py-2">
        <span className="font-sans font-medium text-sm text-snow hover:text-arctic-gold cursor-pointer transition-colors flex items-center gap-1">
          Discover ▾
        </span>
        <div className="absolute top-full left-0 mt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
          <div className="bg-snow rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col p-2 text-nordic-charcoal">
            <Link to="/explore" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Explore Places</Link>
            <Link to="/wildlife" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Wildlife</Link>
            <Link to="/aurora" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Aurora Tracker</Link>
            <Link to="/weather" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Live Weather</Link>
            <Link to="/safety" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Safety Alerts</Link>
            <Link to="/sustainability" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Sustainability</Link>
          </div>
        </div>
      </div>

      {/* 2. Experiences */}
      <div className="relative group px-3 py-2">
        <span className="font-sans font-medium text-sm text-snow hover:text-arctic-gold cursor-pointer transition-colors flex items-center gap-1">
          Experiences ▾
        </span>
        <div className="absolute top-full left-0 mt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
          <div className="bg-snow rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col p-2 text-nordic-charcoal">
            <Link to="/activities" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Activities</Link>
            <Link to="/trails" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Hiking Trails</Link>
            <Link to="/winter" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Winter Sports</Link>
            <Link to="/road-trips" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Road Trips</Link>
            <Link to="/events" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Events</Link>
            <Link to="/guides" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Guides</Link>
          </div>
        </div>
      </div>

      {/* 3. Plan */}
      <div className="relative group px-3 py-2">
        <span className="font-sans font-medium text-sm text-snow hover:text-arctic-gold cursor-pointer transition-colors flex items-center gap-1">
          Plan ▾
        </span>
        <div className="absolute top-full left-0 mt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
          <div className="bg-snow rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col p-2 text-nordic-charcoal">
            <Link to="/stay" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Stays & Lodges</Link>
            <Link to="/food" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Food & Dining</Link>
            <Link to="/travel" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Transport</Link>
            <Link to="/planner" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Trip Planner</Link>
            <Link to="/recommendations" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Recommendations</Link>
            <Link to="/deals" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Travel Deals</Link>
          </div>
        </div>
      </div>

      {/* 4. Shop / Marketplace */}
      <Link 
        to="/shop" 
        className="px-3 py-2 font-sans font-medium text-sm text-snow hover:text-arctic-gold transition-colors flex items-center gap-1.5"
        onClick={() => setShowMobileMenu(false)}
      >
        <ShoppingBag className="w-4 h-4 text-arctic-gold" />
        <span>Shop</span>
      </Link>

      {/* 5. Smart City & Tech */}
      <div className="relative group px-3 py-2">
        <span className="font-sans font-medium text-sm text-snow hover:text-arctic-gold cursor-pointer transition-colors flex items-center gap-1">
          Smart City ▾
        </span>
        <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
          <div className="bg-snow rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col p-2 text-nordic-charcoal">
            <Link to="/smart-city" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Smart Norway Hub</Link>
            <Link to="/map" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Interactive Map</Link>
            <Link to="/infrastructure" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Clean Infrastructure</Link>
            <Link to="/infrastructure/energy" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Energy Dashboard</Link>
            <Link to="/infrastructure/iot" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>IoT Sensor Network</Link>
            <Link to="/mobility/ev" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>EV Charging</Link>
            <Link to="/mobility/ferry" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Smart Ferries</Link>
            <Link to="/live" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Live Dashboard</Link>
            <Link to="/insights" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Telemetry & Insights</Link>
            <Link to="/impact" className="px-4 py-2 hover:bg-arctic-mist rounded-lg text-sm font-medium transition-colors" onClick={() => setShowMobileMenu(false)}>Personal Impact</Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b border-transparent",
      scrolled 
        ? "bg-deep-night/90 backdrop-blur-xl shadow-lg border-white/5 py-2" 
        : "bg-transparent py-6"
    )}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to={user ? "/home" : "/"} className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-snow text-deep-night shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-display font-semibold tracking-wide text-snow hidden sm:inline-block">
              NORDIC LIVING
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          <NavLinks />
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Language Selector */}
          <div className="relative group cursor-pointer text-snow/80 hover:text-snow font-sans text-sm font-bold flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-arctic-gold" />
            <span>{currentLang}</span> ▾
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="bg-snow rounded-lg shadow-xl border border-gray-100 overflow-hidden flex flex-col p-1 text-nordic-charcoal">
                {[
                  { code: 'en', label: 'English (EN)' },
                  { code: 'no', label: 'Norsk (NO)' },
                  { code: 'de', label: 'Deutsch (DE)' },
                  { code: 'hi', label: 'हिन्दी (HI)' }
                ].map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => handleLangChange(l.code)} 
                    className={`px-3 py-1.5 hover:bg-arctic-mist rounded text-xs text-left transition-colors flex items-center justify-between ${i18n.language?.startsWith(l.code) ? 'font-bold text-deep-night bg-arctic-mist/50' : 'text-slate-600'}`}
                  >
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="relative group cursor-pointer text-snow/80 hover:text-snow font-sans text-sm font-bold flex items-center gap-1">
            {currency} ▾
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="bg-snow rounded-lg shadow-xl border border-gray-100 overflow-hidden flex flex-col p-1 text-nordic-charcoal">
                {(['NOK', 'EUR', 'USD', 'GBP', 'INR'] as Currency[]).map(c => (
                  <button key={c} onClick={() => setCurrency(c)} className={`px-4 py-1.5 hover:bg-arctic-mist rounded text-sm text-center ${currency === c ? 'font-bold' : ''}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="text-snow/80 hover:text-snow transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {user ? (
            <>
              {/* Cart Toggle */}
              <button 
                onClick={() => setIsOpen(true)}
                className="text-snow/80 hover:text-snow transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-arctic-gold text-[10px] font-bold text-deep-night">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <NotificationDropdown />

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-snow hover:text-arctic-gold transition-colors font-sans font-medium text-sm focus:outline-none">
                  <User className="w-5 h-5" /> {firstName}
                </button>
                
                <div className="absolute top-full right-0 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                  <div className="bg-snow rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col p-2 text-nordic-charcoal">
                    <Link to="/dashboard" className="px-4 py-2.5 hover:bg-arctic-mist rounded-lg font-sans font-medium text-sm transition-colors">
                      My Norway
                    </Link>
                    <Link to="/user/bookings" className="px-4 py-2.5 hover:bg-arctic-mist rounded-lg font-sans font-medium text-sm transition-colors">
                      My Bookings
                    </Link>
                    <Link to="/profile" className="px-4 py-2.5 hover:bg-arctic-mist rounded-lg font-sans font-medium text-sm transition-colors">
                      Profile
                    </Link>
                    <Link to="/settings/notifications" className="px-4 py-2.5 hover:bg-arctic-mist rounded-lg font-sans font-medium text-sm transition-colors flex items-center justify-between">
                      Notifications <Bell className="w-4 h-4 text-slate" />
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 rounded-lg text-nordic-red font-sans font-medium text-sm transition-colors text-left w-full">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="font-sans font-medium text-sm text-snow hover:text-arctic-gold transition-colors">Log in</Link>
              <Link to="/register">
                <Button variant="outline" className="text-snow border-snow hover:bg-snow hover:text-deep-night rounded-none">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="text-snow/80 hover:text-snow transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-arctic-gold text-[10px] font-bold text-deep-night">
                {cartItemCount}
              </span>
            )}
          </button>
          <button className="text-snow focus:outline-none" onClick={() => setShowMobileMenu(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        title="Explore Norway"
        side="right"
      >
        <div className="flex flex-col space-y-6 p-2 max-h-[85vh] overflow-y-auto">
          {/* Quick Language & Currency on Mobile */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-arctic-gold" />
              <select 
                value={i18n.language?.slice(0, 2) || 'en'} 
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="en">English (EN)</option>
                <option value="no">Norsk (NO)</option>
                <option value="de">Deutsch (DE)</option>
                <option value="hi">हिन्दी (HI)</option>
              </select>
            </div>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            >
              {(['NOK', 'EUR', 'USD', 'GBP', 'INR'] as Currency[]).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Mobile Categorized Navigation Links */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Discover</div>
              <div className="flex flex-col space-y-1">
                <Link to="/explore" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Explore Places</Link>
                <Link to="/wildlife" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Wildlife</Link>
                <Link to="/aurora" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Aurora Tracker</Link>
                <Link to="/weather" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Live Weather</Link>
                <Link to="/safety" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Safety Alerts</Link>
                <Link to="/sustainability" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Sustainability</Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Experiences</div>
              <div className="flex flex-col space-y-1">
                <Link to="/activities" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Activities</Link>
                <Link to="/trails" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Hiking Trails</Link>
                <Link to="/winter" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Winter Sports</Link>
                <Link to="/road-trips" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Road Trips</Link>
                <Link to="/events" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Events</Link>
                <Link to="/guides" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Guides</Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Plan & Shop</div>
              <div className="flex flex-col space-y-1">
                <Link to="/stay" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Stays & Lodges</Link>
                <Link to="/food" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Food & Dining</Link>
                <Link to="/travel" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Transport & Routes</Link>
                <Link to="/planner" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>AI Trip Planner</Link>
                <Link to="/recommendations" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Recommendations</Link>
                <Link to="/deals" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Travel Deals</Link>
                <Link to="/shop" className="px-3 py-1.5 font-bold text-sm text-amber-700 bg-amber-50/70 hover:bg-amber-100 rounded-lg flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>Shop (Norwegian Gear & Tech)</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Smart City & Tech</div>
              <div className="flex flex-col space-y-1">
                <Link to="/smart-city" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Smart Norway Hub</Link>
                <Link to="/map" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Interactive Map</Link>
                <Link to="/infrastructure" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Clean Infrastructure</Link>
                <Link to="/infrastructure/energy" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Energy Dashboard</Link>
                <Link to="/infrastructure/iot" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>IoT Sensor Network</Link>
                <Link to="/mobility/ev" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>EV Charging</Link>
                <Link to="/mobility/ferry" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Smart Ferries</Link>
                <Link to="/live" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Live Dashboard</Link>
                <Link to="/insights" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Telemetry Insights</Link>
                <Link to="/impact" className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setShowMobileMenu(false)}>Personal Impact</Link>
              </div>
            </div>
          </div>
          
          {user ? (
            <div className="flex flex-col space-y-2 border-t border-slate-200 pt-4">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Hi, {firstName}</div>
              <Link to="/dashboard" className="px-3 py-2 font-semibold text-sm text-nordic-charcoal hover:bg-gray-50 rounded-lg" onClick={() => setShowMobileMenu(false)}>My Norway Dashboard</Link>
              <Link to="/user/bookings" className="px-3 py-2 font-semibold text-sm text-nordic-charcoal hover:bg-gray-50 rounded-lg" onClick={() => setShowMobileMenu(false)}>My Bookings</Link>
              <Link to="/profile" className="px-3 py-2 font-semibold text-sm text-nordic-charcoal hover:bg-gray-50 rounded-lg" onClick={() => setShowMobileMenu(false)}>Profile Settings</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 font-semibold text-sm text-nordic-red hover:bg-red-50 rounded-lg text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
              <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                <Button variant="outline" fullWidth>Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setShowMobileMenu(false)}>
                <Button variant="primary" fullWidth>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </nav>
  );
};
