import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useIsFavorite, useToggleFavorite } from '../../hooks/useFavorites';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { cn } from '../../lib/utils';

interface Props {
  itemType: string;
  itemId: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
  label?: string;
}

export const FavoriteButton: React.FC<Props> = ({ 
  itemType, 
  itemId, 
  className = '', 
  size = 20,
  showLabel = false,
  label
}) => {
  const { user, requireAuth } = useRequireAuth();
  const { data: isFavorite, isLoading } = useIsFavorite(itemType, itemId);
  const toggleFavorite = useToggleFavorite();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      if (toggleFavorite.isPending) return;
      toggleFavorite.mutate({ itemType, itemId });
    }, { message: 'Sign in to save items to your personal favorites.' });
  };

  const isPending = toggleFavorite.isPending;
  const isSaved = !!user && !!isFavorite;

  const defaultAriaLabel = isSaved ? 'Remove from favorites' : 'Add to favorites';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading || isPending}
      className={cn(
        'group/fav relative inline-flex items-center justify-center gap-1.5 p-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0 select-none',
        isSaved 
          ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/30' 
          : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/15 backdrop-blur-md',
        className
      )}
      aria-label={label || defaultAriaLabel}
      title={label || (isSaved ? 'Saved in your Favorites' : 'Save to Favorites')}
    >
      {isPending ? (
        <Loader2 size={size} className="animate-spin text-red-400" />
      ) : (
        <Heart 
          size={size} 
          fill={isSaved ? 'currentColor' : 'none'} 
          className={`transition-transform duration-300 group-hover/fav:scale-110 ${
            isSaved ? 'text-red-500' : 'text-current'
          }`}
        />
      )}
      {showLabel && (
        <span className="text-xs font-bold uppercase tracking-wider">
          {label || (isSaved ? 'Saved' : 'Save')}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
