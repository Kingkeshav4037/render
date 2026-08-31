import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, ShoppingBag, Menu, Search, Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore, Currency, CURRENCIES } from '../../store/useCurrencyStore';
import { LANGUAGES, LanguageOption } from '../../i18n';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { BrandLogo } from '../shared/BrandLogo';
import { GlobalSearchModal } from '../shared/GlobalSearchModal';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const { user, signOut, profile } = useAuthStore();
  const { items, setIsOpen } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Derive display name: profile name → user_metadata name → email prefix
  const displayName = profile?.fullName 
    || user?.user_metadata?.full_name 
    || user?.user_metadata?.name
    || user?.email?.split('@')[0] 
    || 'Account';
  const firstName = displayName.split(' ')[0];

  const currentLangCode = (i18n.language || 'en').slice(0, 2).toLowerCase();
  const currentLangObj = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];
  const currentCurrencyObj = CURRENCIES[currency] || CURRENCIES.NOK;

  const handleLangChange = (langCode: string) => {
    i18n.changeLanguage(langCode.toLowerCase());
    if (typeof window !== 'undefined') {
      localStorage.setItem('norway_preferred_lang', langCode.toLowerCase());
      document.documentElement.lang = langCode.toLowerCase();
    }
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';
      
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowMobileMenu(false);
    navigate('/login');
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 font-sans",
        scrolled 
          ? "bg-[#020617]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 border-b border-white/[0.12] py-3" 
          : "bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.08] py-4 lg:py-4.5"
      )}
    >
      <div className="max-w-[1560px] mx-auto px-6 md:px-8 lg:px-12 flex justify-between items-center">
        
        {/* Official Brand Logo */}
        <div className="flex-shrink-0 flex items-center">
          <BrandLogo size="sm" linkTo={user ? "/home" : "/"} />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          <NavLinks t={t} setShowMobileMenu={setShowMobileMenu} />
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
          
          {/* Language Selector Dropdown */}
          <LanguageDropdown 
            currentLang={currentLangObj} 
            onSelectLang={handleLangChange} 
          />

          {/* Currency Selector Dropdown */}
          <CurrencyDropdown 
            currentCurrency={currentCurrencyObj} 
            onSelectCurrency={setCurrency} 
          />

          {/* Search Trigger Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Norway SmartLife (Cmd+K)"
            className="group/search flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover/search:text-cyan-300 group-hover/search:scale-110 transition-transform duration-200" />
            <span className="hidden xl:inline text-xs font-medium text-slate-400 group-hover/search:text-slate-200 transition-colors">Search...</span>
            <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 group-hover/search:text-slate-200 text-[10px] font-mono border border-white/10">
              ⌘K
            </kbd>
          </button>
          
          {user ? (
            <>
              {/* Cart Toggle */}
              <button 
                onClick={() => setIsOpen(true)}
                aria-label={`Shopping Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
                className="text-slate-300 hover:text-white transition-colors relative focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none p-2 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-arctic-gold text-[10px] font-bold text-deep-night shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <NotificationDropdown />

              {/* Profile Dropdown */}
              <div className="relative group">
                <button 
                  aria-label="User profile menu"
                  aria-haspopup="menu"
                  className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-sans font-medium text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none px-3 py-2 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" /> 
                  <span className="max-w-[100px] truncate">{firstName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                
                <div className="absolute top-full right-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-1 z-50">
                  <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5" role="menu">
                    <Link to="/dashboard" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      {t('nav.my_norway', 'My Norway')}
                    </Link>
                    <Link to="/trips" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      {t('nav.itinerary', 'Planned Trips')}
                    </Link>
                    <Link to="/favorites" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      Saved Favorites
                    </Link>
                    <Link to="/user/bookings" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      {t('nav.my_bookings', 'My Bookings')}
                    </Link>
                    <Link to="/user/invoices" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      {t('nav.invoices', 'Invoices & Receipts')}
                    </Link>
                    <Link to="/profile" role="menuitem" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg font-medium text-xs text-slate-300 transition-colors">
                      {t('nav.profile', 'Profile & Settings')}
                    </Link>
                    <div className="h-px bg-white/[0.08] my-1"></div>
                    <button onClick={handleLogout} role="menuitem" className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/15 rounded-lg text-red-400 font-medium text-xs transition-colors text-left w-full cursor-pointer">
                      <LogOut className="w-3.5 h-3.5" /> {t('nav.sign_out', 'Sign Out')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link 
                to={location.pathname !== '/login' && location.pathname !== '/register' ? `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}` : '/login'} 
                className="font-sans font-medium text-xs text-slate-200 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none px-3 py-2 rounded-lg hover:bg-white/[0.06]"
              >
                {t('nav.login', 'Log in')}
              </Link>
              <Link 
                to={location.pathname !== '/login' && location.pathname !== '/register' ? `/register?returnTo=${encodeURIComponent(location.pathname + location.search)}` : '/register'}
              >
                <button 
                  type="button"
                  className="font-sans font-bold text-xs uppercase tracking-wider text-[#020617] bg-gradient-to-r from-[#D4AF37] via-[#E6C65B] to-[#D4AF37] hover:from-[#E6C65B] hover:to-[#F8D878] px-4 py-2 rounded-lg shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic-gold"
                >
                  {t('nav.signup', 'Sign Up')}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Norway SmartLife"
            className="text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none p-2 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] cursor-pointer"
          >
            <Search className="w-4.5 h-4.5 text-cyan-400" />
          </button>

          <button 
            onClick={() => setIsOpen(true)}
            aria-label={`Shopping Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
            className="text-slate-300 hover:text-white transition-colors relative focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none p-2 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-arctic-gold text-[10px] font-bold text-deep-night shadow-md">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <button 
            className="text-slate-200 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none p-2 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] cursor-pointer" 
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open mobile navigation menu"
            aria-expanded={showMobileMenu}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        title="Norway SmartLife"
        side="right"
      >
        <div className="flex flex-col space-y-5 p-3 max-h-[85vh] overflow-y-auto font-sans">
          {/* Brand Logo in Mobile Drawer */}
          <div className="pb-3 border-b border-white/[0.08] flex justify-center">
            <BrandLogo size="md" showTagline linkTo="/" />
          </div>

          {/* Quick Search Button on Mobile */}
          <button
            onClick={() => {
              setShowMobileMenu(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2 text-xs">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search Norway...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-slate-400 border border-white/10">⌘K</kbd>
          </button>

          {/* Quick Language & Currency on Mobile */}
          <div className="flex flex-col gap-2 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Language
              </span>
              <select 
                value={currentLangCode} 
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-[#0B1120] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>{currentCurrencyObj.flag}</span> Currency
              </span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-[#0B1120] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
              >
                {Object.values(CURRENCIES).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol.trim()}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                {t('nav.explore', 'Explore')}
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/explore" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.destinations', 'Destinations')}</Link>
                <Link to="/nature" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.nature', 'Nature & Parks')}</Link>
                <Link to="/wildlife" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.wildlife', 'Wildlife')}</Link>
                <Link to="/flora" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.flora', 'Plants & Trees')}</Link>
                <Link to="/history" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.history', 'History & Heritage')}</Link>
                <Link to="/infrastructure" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.infrastructure', 'Infrastructure')}</Link>
                <Link to="/aurora" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.aurora', 'Aurora Tracker')}</Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                {t('nav.experiences', 'Experiences')}
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/activities" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.activities', 'Activities')}</Link>
                <Link to="/trails" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.trails', 'Hiking Trails')}</Link>
                <Link to="/winter" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.winter', 'Winter Sports')}</Link>
                <Link to="/road-trips" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.road_trips', 'Road Trips')}</Link>
                <Link to="/events" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.events', 'Cultural Events')}</Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                {t('nav.plan', 'Plan & Sustainability')}
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/stay" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.stays', 'Fjord Stays')}</Link>
                <Link to="/food" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.food', 'Food & Dining')}</Link>
                <Link to="/travel" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.transit', 'Transport & Routes')}</Link>
                <Link to="/planner" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.itinerary', 'AI Trip Planner')}</Link>
                <Link to="/recommendations" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.recommendations', 'Recommendations')}</Link>
                <Link to="/deals" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.deals', 'Travel Deals')}</Link>
                <Link to="/shop" className="px-3 py-2 font-semibold text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Eco Shop</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                {t('nav.smart_city', 'Smart City & Tech')}
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/smart-city" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.smart_norway', 'Smart Norway Hub')}</Link>
                <Link to="/map" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>Interactive Map</Link>
                <Link to="/infrastructure/energy" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>Energy Dashboard</Link>
                <Link to="/infrastructure/iot" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.iot', 'IoT Sensor Network')}</Link>
                <Link to="/mobility/ev" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.ev_charging', 'EV Charging')}</Link>
                <Link to="/live" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>Live Dashboard</Link>
                <Link to="/impact" className="px-3 py-2 font-medium text-sm text-slate-200 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.impact', 'Eco Calculator')}</Link>
              </div>
            </div>
          </div>
          
          {user ? (
            <div className="flex flex-col space-y-2 border-t border-white/[0.08] pt-4">
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">Hi, {firstName}</div>
              <Link to="/dashboard" className="px-3 py-2 font-semibold text-sm text-white hover:bg-white/[0.06] rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.my_norway', 'My Norway')}</Link>
              <Link to="/user/bookings" className="px-3 py-2 font-semibold text-sm text-white hover:bg-white/[0.06] rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.my_bookings', 'My Bookings')}</Link>
              <Link to="/user/invoices" className="px-3 py-2 font-semibold text-sm text-white hover:bg-white/[0.06] rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.invoices', 'Invoices & Receipts')}</Link>
              <Link to="/profile" className="px-3 py-2 font-semibold text-sm text-white hover:bg-white/[0.06] rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.profile', 'Profile Settings')}</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 font-semibold text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left cursor-pointer">
                <LogOut className="w-4 h-4" /> {t('nav.sign_out', 'Sign Out')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.08]">
              <Link 
                to={location.pathname !== '/login' && location.pathname !== '/register' ? `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}` : '/login'} 
                onClick={() => setShowMobileMenu(false)}
              >
                <Button variant="outline" fullWidth className="rounded-lg border-white/[0.15] text-white hover:bg-white/[0.06]">{t('nav.login', 'Log In')}</Button>
              </Link>
              <Link 
                to={location.pathname !== '/login' && location.pathname !== '/register' ? `/register?returnTo=${encodeURIComponent(location.pathname + location.search)}` : '/register'} 
                onClick={() => setShowMobileMenu(false)}
              >
                <button 
                  type="button" 
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-deep-night bg-gradient-to-r from-arctic-gold via-[#E6C65B] to-arctic-gold hover:from-[#E6C65B] hover:to-[#F8D878] shadow-md transition-all"
                >
                  {t('nav.signup', 'Sign Up')}
                </button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Language Dropdown Component
// ─────────────────────────────────────────────────────────────────────────────
interface LanguageDropdownProps {
  currentLang: LanguageOption;
  onSelectLang: (code: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ currentLang, onSelectLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select language, currently ${currentLang.name}`}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all font-sans text-xs font-semibold cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="text-xs">{currentLang.flag}</span>
        <span className="uppercase tracking-wider text-[11px] font-semibold">{currentLang.code}</span>
        <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden p-1.5 text-white ring-1 ring-white/5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1">
              Select Language
            </div>
            {LANGUAGES.map(l => {
              const isSelected = currentLang.code === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    onSelectLang(l.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-2.5 py-2 rounded-lg text-xs text-left transition-all flex items-center justify-between cursor-pointer",
                    isSelected 
                      ? "bg-amber-400/15 text-amber-300 font-bold border border-amber-400/20" 
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{l.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs leading-tight">{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{l.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Currency Dropdown Component
// ─────────────────────────────────────────────────────────────────────────────
interface CurrencyDropdownProps {
  currentCurrency: typeof CURRENCIES[Currency];
  onSelectCurrency: (code: Currency) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ currentCurrency, onSelectCurrency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select currency, currently ${currentCurrency.code}`}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all font-sans text-xs font-semibold cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <span className="text-xs">{currentCurrency.flag}</span>
        <span className="uppercase tracking-wider text-[11px] font-semibold">{currentCurrency.code}</span>
        <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-52 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden p-1.5 text-white max-h-[360px] overflow-y-auto ring-1 ring-white/5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1">
              Select Currency
            </div>
            {Object.values(CURRENCIES).map(c => {
              const isSelected = currentCurrency.code === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    onSelectCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-2.5 py-2 rounded-lg text-xs text-left transition-all flex items-center justify-between cursor-pointer",
                    isSelected 
                      ? "bg-amber-400/15 text-amber-300 font-bold border border-amber-400/20" 
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">{c.flag}</span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs">{c.code}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({c.symbol.trim()})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{c.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Nav Links Component
// ─────────────────────────────────────────────────────────────────────────────
interface NavLinksProps {
  t: any;
  setShowMobileMenu: (show: boolean) => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ t, setShowMobileMenu }) => (
  <>
    {/* 1. Explore */}
    <div className="relative group px-1 py-1">
      <button className="font-sans font-medium text-[13px] tracking-wide text-slate-200 hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        {t('nav.explore', 'Explore')} <ChevronDown size={12} strokeWidth={2.2} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
        <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5">
          <Link to="/explore" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.destinations', 'Destinations')}</Link>
          <Link to="/nature" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.nature', 'Nature & Parks')}</Link>
          <Link to="/wildlife" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.wildlife', 'Wildlife')}</Link>
          <Link to="/flora" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.flora', 'Plants & Trees')}</Link>
          <Link to="/history" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.history', 'History & Heritage')}</Link>
          <Link to="/infrastructure" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.infrastructure', 'Infrastructure')}</Link>
          <Link to="/aurora" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.aurora', 'Aurora Tracker')}</Link>
        </div>
      </div>
    </div>

    {/* 2. Experiences */}
    <div className="relative group px-1 py-1">
      <button className="font-sans font-medium text-[13px] tracking-wide text-slate-200 hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        {t('nav.experiences', 'Experiences')} <ChevronDown size={12} strokeWidth={2.2} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
        <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5">
          <Link to="/activities" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.activities', 'Activities')}</Link>
          <Link to="/trails" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.trails', 'Hiking Trails')}</Link>
          <Link to="/winter" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.winter', 'Winter Sports')}</Link>
          <Link to="/road-trips" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.road_trips', 'Road Trips')}</Link>
          <Link to="/events" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.events', 'Cultural Events')}</Link>
        </div>
      </div>
    </div>

    {/* 3. Plan & Sustainability */}
    <div className="relative group px-1 py-1">
      <button className="font-sans font-medium text-[13px] tracking-wide text-slate-200 hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        {t('nav.plan', 'Plan & Sustainability')} <ChevronDown size={12} strokeWidth={2.2} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
        <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5">
          <Link to="/stay" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.stays', 'Fjord Stays')}</Link>
          <Link to="/food" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.food', 'Food & Dining')}</Link>
          <Link to="/travel" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.transit', 'Transport & Routes')}</Link>
          <Link to="/planner" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.itinerary', 'AI Trip Planner')}</Link>
          <Link to="/recommendations" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.recommendations', 'Recommendations')}</Link>
          <Link to="/deals" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.deals', 'Travel Deals')}</Link>
          <Link to="/shop" className="px-3 py-2 hover:bg-white/[0.07] rounded-lg text-xs font-semibold transition-colors text-amber-300 flex items-center justify-between" onClick={() => setShowMobileMenu(false)}>
            <span>Eco Shop</span>
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>

    {/* 4. Smart City & Tech */}
    <div className="relative group px-1 py-1">
      <button className="font-sans font-medium text-[13px] tracking-wide text-slate-200 hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        {t('nav.smart_city', 'Smart City & Tech')} <ChevronDown size={12} strokeWidth={2.2} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
        <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5">
          <Link to="/smart-city" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.smart_norway', 'Smart Norway Hub')}</Link>
          <Link to="/map" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>Interactive Map</Link>
          <Link to="/infrastructure/energy" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>Energy Dashboard</Link>
          <Link to="/infrastructure/iot" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.iot', 'IoT Sensor Network')}</Link>
        </div>
      </div>
    </div>

    {/* 5. Smart Mobility */}
    <div className="relative group px-1 py-1">
      <button className="font-sans font-medium text-[13px] tracking-wide text-slate-200 hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        {t('nav.smart_mobility', 'Smart Mobility')} <ChevronDown size={12} strokeWidth={2.2} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left group-hover:translate-y-0 translate-y-1 z-50">
        <div className="bg-[#0B1120]/95 backdrop-blur-2xl rounded-xl shadow-2xl shadow-black/70 border border-white/[0.12] overflow-hidden flex flex-col p-1.5 text-white ring-1 ring-white/5">
          <Link to="/mobility/ev" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.ev_charging', 'EV Charging')}</Link>
          <Link to="/mobility/ferry" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>Smart Ferries</Link>
          <Link to="/live" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>Live Dashboard</Link>
          <Link to="/impact" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>{t('nav.impact', 'Eco Calculator')}</Link>
          <Link to="/sustainability" className="px-3 py-2 hover:bg-white/[0.07] hover:text-white rounded-lg text-xs font-medium text-slate-300 transition-colors" onClick={() => setShowMobileMenu(false)}>Sustainability</Link>
        </div>
      </div>
    </div>
  </>
);
