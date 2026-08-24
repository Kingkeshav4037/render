import React from 'react';
import { FavoriteItem } from '../../../types/dashboard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../../components/shared/OptimizedImage';

interface Props {
  favorites: FavoriteItem[];
}

export const FavoritesWidget: React.FC<Props> = ({ favorites }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Heart size={20} className="text-red-500 fill-current" />
          Saved Places
        </h3>
        <Link to="/user/favorites" className="text-sm text-blue-500 font-semibold hover:text-blue-600 transition-colors">View All</Link>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Heart size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm mb-4">No favorites yet. Start exploring Norway to save your favorite spots.</p>
          <Link to="/explore" className="text-sm font-bold text-navy-900 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map(fav => (
            <Link key={fav.id} to={fav.url} className="flex gap-4 items-center p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors group">
              <OptimizedImage 
                src={fav.image} 
                alt={fav.name} 
                category="landscape"
                className="w-full h-full rounded-lg object-cover" 
                containerClassName="w-16 h-16 rounded-lg flex-shrink-0"
              />
              <div className="flex-grow">
                <div className="text-xs font-bold text-aurora-green uppercase tracking-wider mb-0.5">{fav.itemType}</div>
                <h4 className="font-bold text-navy-900 group-hover:text-blue-600 transition-colors line-clamp-1">{fav.name}</h4>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors flex-shrink-0 mr-2" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
