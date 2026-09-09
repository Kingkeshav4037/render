import React from 'react';
import { Link } from 'react-router-dom';

interface ImageCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  linkTo: string;
  badges?: React.ReactNode[];
  itemType?: string;
  itemId?: string;
}

import { FavoriteButton } from '../common/FavoriteButton';

import { OptimizedImage } from './OptimizedImage';

export const ImageCard = ({ imageUrl, title, subtitle, linkTo, badges, itemType, itemId }: ImageCardProps) => {
  // Determine fallback based on itemType
  let fallback = '/images/fjords_1786935800026.jpg';
  if (itemType === 'food' || itemType === 'restaurant') fallback = '/images/food_salmon_1787013684123.jpg';
  if (itemType === 'wildlife') fallback = '/images/wildlife_reindeer_1787013667019.jpg';
  if (itemType === 'accommodation') fallback = '/images/hotel_juvet_1787013813000.jpg';
  if (itemType === 'event') fallback = '/images/northern_lights_1786935879330.jpg';
  if (itemType === 'activity') fallback = '/images/besseggen.jpg';
  if (itemType === 'road_trip') fallback = '/images/aurlandsfjord_viewpoint.jpg';

  const validImage = (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') ? imageUrl : fallback;

  return (
    <Link to={linkTo} className="group relative block min-w-[280px] w-full aspect-[4/5] sm:aspect-square md:aspect-[4/3] overflow-hidden rounded-3xl snap-center shrink-0 shadow-lg bg-navy-800">
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
        <OptimizedImage 
          src={validImage}
          alt={title}
          fallbackSrc={fallback}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/40 to-transparent pointer-events-none" />
    
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-wrap gap-2">
            {badges?.map((badge, i) => (
              <div key={i}>{badge}</div>
            ))}
          </div>
          {itemType && itemId && (
            <FavoriteButton itemType={itemType} itemId={itemId} />
          )}
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-aurora-green transition-colors">{title}</h3>
          {subtitle && <p className="text-gray-300 line-clamp-2 text-sm">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
};
