import React from 'react';
import { Heart } from 'lucide-react';
import { useIsFavorite, useToggleFavorite } from '../../hooks/useFavorites';
import { useAuthStore } from '../../store/useAuthStore';

interface Props {
  itemType: string;
  itemId: string;
  className?: string;
  size?: number;
}

export const FavoriteButton: React.FC<Props> = ({ itemType, itemId, className = '', size = 24 }) => {
  const { user } = useAuthStore();
  const { data: isFavorite, isLoading } = useIsFavorite(itemType, itemId);
  const toggleFavorite = useToggleFavorite();

  if (!user) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleFavorite.isPending) return;
    toggleFavorite.mutate({ itemType, itemId });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || toggleFavorite.isPending}
      className={`p-2 rounded-full transition-all hover:scale-110 ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500 backdrop-blur-sm'
      } ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={size} 
        fill={isFavorite ? 'currentColor' : 'none'} 
        className={`transition-all ${toggleFavorite.isPending ? 'opacity-50 scale-90' : ''}`}
      />
    </button>
  );
};
