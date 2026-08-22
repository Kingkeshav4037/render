import React from 'react';

interface MapFiltersProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSearchThisArea: () => void;
  isSearching: boolean;
}

const CATEGORIES = [
  { id: null, label: 'All' },
  { id: 'HOTEL', label: 'Hotels' },
  { id: 'ACTIVITY', label: 'Activities' },
  { id: 'RESTAURANT', label: 'Food' },
  { id: 'WILDLIFE', label: 'Wildlife' },
  { id: 'EV_STATION', label: 'EV Charging' },
  { id: 'NATIONAL_PARK', label: 'Nature' },
  { id: 'AURORA', label: '🌌 Aurora Mode' }
];

const MapFilters: React.FC<MapFiltersProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  onSearchThisArea,
  isSearching
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-4">
      {/* Category Pills */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex space-x-1 overflow-x-auto max-w-[90vw]">
        {CATEGORIES.map(category => (
          <button
            key={category.id || 'all'}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === category.id
                ? (category.id === 'AURORA' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20')
                : (category.id === 'AURORA' ? 'text-purple-300 hover:text-white hover:bg-purple-900/50' : 'text-gray-300 hover:text-white hover:bg-white/10')
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search This Area Button */}
      <button
        onClick={onSearchThisArea}
        disabled={isSearching}
        className={`bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:bg-white/20 flex items-center space-x-2 ${
          isSearching ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span>{isSearching ? 'Searching...' : 'Search this area'}</span>
      </button>
    </div>
  );
};

export default MapFilters;
