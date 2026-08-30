import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export type ImageCategory = 
  | 'landscape' 
  | 'wildlife' 
  | 'flora' 
  | 'food' 
  | 'stay' 
  | 'trail' 
  | 'winter' 
  | 'aurora' 
  | 'product' 
  | 'infra' 
  | 'activity'
  | 'culture'
  | 'history'
  | 'default';

const CATEGORY_FALLBACKS: Record<ImageCategory, string> = {
  landscape: '/images/fjords.jpg',
  wildlife: '/images/reindeer.jpg',
  flora: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=cloudberries+flora+norway&w=800',
  food: '/images/salmon.jpg',
  stay: '/images/juvet.jpg',
  trail: '/images/besseggen.jpg',
  winter: '/images/galdhopiggen.jpg',
  aurora: '/images/northern_lights.jpg',
  product: '/images/product_charger.jpg',
  infra: '/images/infra_windfarm.jpg',
  activity: '/images/preikestolen.jpg',
  culture: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800',
  history: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800',
  default: '/images/fjords.jpg'
};

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  category?: ImageCategory;
  fallbackSrc?: string;
  webpSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  category = 'default',
  fallbackSrc, 
  webpSrc,
  className,
  containerClassName,
  ...props 
}: OptimizedImageProps) => {
  const [errorCount, setErrorCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const resolvedFallback = fallbackSrc || CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;

  // Determine current source based on error count
  const validSrc = (src && typeof src === 'string' && src.trim() !== '') ? src : resolvedFallback;
  const currentSrc = errorCount === 0 ? validSrc : (errorCount === 1 ? resolvedFallback : null);

  // Reset states when source URL changes
  useEffect(() => {
    setErrorCount(0);
    setLoaded(false);
  }, [src, category]);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  // If both initial source and fallback failed, show a graceful placeholder card
  if (errorCount >= 2 || !currentSrc) {
    return (
      <div className={`relative overflow-hidden w-full h-full bg-slate/20 flex flex-col items-center justify-center p-4 text-center border border-white/5 ${containerClassName || ''}`}>
        <ImageIcon className="w-8 h-8 text-snow/30 mb-2" />
        <span className="text-[11px] text-snow/50 font-sans line-clamp-1 max-w-[80%]">{alt || 'Norway Scene'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName || ''}`}>
      <picture className="w-full h-full block" style={{ display: 'block', width: '100%', height: '100%' }}>
        {errorCount === 0 && webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover block transition-opacity duration-300 ${loaded || errorCount > 0 ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          onLoad={(e) => {
            setLoaded(true);
            if (props.onLoad) props.onLoad(e);
          }}
          onError={(e) => {
            setErrorCount((prev) => prev + 1);
            setLoaded(true);
            if (props.onError) props.onError(e);
          }}
          {...props}
        />
      </picture>
      
      {/* Background placeholder while initial image is loading */}
      {!loaded && errorCount === 0 && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
};

