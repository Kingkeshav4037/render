import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Compass, MapPin, Sparkles, Mountain, 
  Home as HomeIcon, Utensils, Bird, Leaf, Zap, ShoppingBag, 
  ArrowRight, Clock, Trash2, CornerDownLeft 
} from 'lucide-react';
import { searchService, SearchItem, SearchCategory } from '../../services/searchService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS: { id: SearchCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
  { id: 'activities', label: 'Activities & Trails', icon: Mountain },
  { id: 'stays', label: 'Stays', icon: HomeIcon },
  { id: 'food', label: 'Culinary', icon: Utensils },
  { id: 'wildlife', label: 'Wildlife', icon: Bird },
  { id: 'flora', label: 'Flora', icon: Leaf },
  { id: 'smart_tech', label: 'Smart Tech', icon: Zap },
  { id: 'shop', label: 'Shop', icon: ShoppingBag }
];

const POPULAR_SEARCHES = [
  'Tromsø Northern Lights',
  'Fjord Cabins',
  'Preikestolen Hike',
  'EV Supercharger',
  'Brunost & Waffles',
  'Wild Reindeer Safari',
  'AI Trip Planner',
  'Geirangerfjord Cruise'
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(searchService.getRecentSearches());
      setQuery('');
      setCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape to close, Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live search effect with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const items = await searchService.search(query, category);
      setResults(items);
      setSelectedIndex(0);
      setLoading(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [query, category]);

  // Handle arrow key navigation and Enter selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelectItem(results[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    searchService.saveRecentSearch(query.trim() || item.title);
    onClose();
    navigate(item.path);
  };

  const handleSelectRecent = (searchTerm: string) => {
    setQuery(searchTerm);
    inputRef.current?.focus();
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 md:pt-20 px-3 sm:px-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div 
        className="w-full max-w-3xl bg-slate-900/98 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-slate-700/80 overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Search Input Header */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-800 relative gap-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search fjords, trails, wildlife, stays, food, smart tech..."
            className="w-full bg-transparent border-none focus:outline-none text-white text-base sm:text-lg placeholder:text-slate-500 font-sans"
            aria-label="Search inquiry input"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
              ESC
            </kbd>
            <button
              onClick={onClose}
              aria-label="Close search dialog"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 overflow-x-auto border-b border-slate-800/80 bg-slate-950/30 scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[60vh]">
          
          {/* 1. Results View (when query is entered) */}
          {query.trim().length > 0 ? (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                <span>Search Results ({results.length})</span>
                {loading && <span className="text-cyan-400 animate-pulse">Searching...</span>}
              </div>

              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer border group",
                          isSelected
                            ? "bg-slate-800/90 border-cyan-500/40 shadow-lg ring-1 ring-cyan-500/20"
                            : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700"
                        )}
                      >
                        {/* Thumbnail / Icon */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/80 relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cyan-400 bg-slate-900">
                              <Compass className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        </div>

                        {/* Enter Indicator / Arrow */}
                        <div className="shrink-0 flex items-center gap-1 text-slate-500 group-hover:text-cyan-400">
                          {isSelected && (
                            <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-cyan-400 mr-2 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                              Press <CornerDownLeft className="w-3 h-3" />
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : !loading ? (
                <div className="text-center py-12 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/80">
                  <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
                  <h4 className="text-base font-bold text-white mb-1">No matching results found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    We couldn’t find anything matching "{query}". Try checking your spelling or searching for another Norwegian destination, activity, or food.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/explore');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/25 transition-all cursor-pointer"
                  >
                    Browse All Destinations
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            /* 2. Default View (Recent & Trending Searches) */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="text-[11px] text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer group"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending in Norway */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Popular & Trending
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map(term => (
                    <button
                      key={term}
                      onClick={() => handleSelectRecent(term)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-cyan-500/15 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer group"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Discovery Portals */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Featured Ecosystem Hubs
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { title: 'Aurora Tracker & Forecast', path: '/aurora', desc: 'Live geomagnetic forecasts', icon: Sparkles },
                    { title: 'Interactive Fjord Map', path: '/map', desc: 'Satellite, trail & ferry layers', icon: MapPin },
                    { title: 'EV Charging Network', path: '/mobility/ev', desc: 'Nationwide fast-charger map', icon: Zap },
                    { title: 'Sustainable Eco Shop', path: '/shop', desc: 'Wool sweaters & Nordic gear', icon: ShoppingBag },
                  ].map(hub => {
                    const Icon = hub.icon;
                    return (
                      <div
                        key={hub.path}
                        onClick={() => {
                          onClose();
                          navigate(hub.path);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/70 hover:bg-slate-800/60 hover:border-slate-700 transition-all cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {hub.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {hub.desc}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700 text-[10px]">↓</kbd>
              to navigate
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700 text-[10px]">ENTER</kbd>
              to select
            </span>
          </div>
          <span className="text-slate-500 font-medium">
            Norway SmartLife Global Search
          </span>
        </div>

      </div>
    </div>
  );
};
