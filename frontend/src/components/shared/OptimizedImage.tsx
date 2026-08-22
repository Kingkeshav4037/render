import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  webpSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  fallbackSrc = '/images/fjords.jpg', 
  webpSrc,
  className,
  containerClassName,
  ...props 
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Normalize current source
  const validSrc = (src && typeof src === 'string' && src.trim() !== '') ? src : fallbackSrc;
  const currentSrc = error ? fallbackSrc : validSrc;

  // Reset states when source URL changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName || ''}`}>
      <picture className="w-full h-full block" style={{ display: 'block', width: '100%', height: '100%' }}>
        {!error && webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover block transition-opacity duration-300 ${loaded || error ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          onLoad={(e) => {
            setLoaded(true);
            if (props.onLoad) props.onLoad(e);
          }}
          onError={(e) => {
            if (!error) {
              setError(true);
              setLoaded(true); // Display fallback with 100% opacity immediately
            }
            if (props.onError) props.onError(e);
          }}
          {...props}
        />
      </picture>
      
      {/* Background placeholder while initial image is loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
};
