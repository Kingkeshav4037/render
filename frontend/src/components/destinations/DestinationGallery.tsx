import { useState } from 'react';
import { OptimizedImage } from '../shared/OptimizedImage';

interface DestinationGalleryProps {
  images: string[];
  locationName: string;
}

export const DestinationGallery = ({ images, locationName }: DestinationGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-12">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`rounded-2xl overflow-hidden cursor-pointer group ${idx === 0 ? 'col-span-4 md:col-span-2 row-span-2 h-[400px]' : 'col-span-2 md:col-span-1 h-[192px]'}`}
            onClick={() => setSelectedImage(img)}
          >
            <OptimizedImage 
              src={img} 
              alt={`${locationName} view ${idx + 1}`} 
              category="landscape"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <OptimizedImage 
            src={selectedImage} 
            alt={`${locationName} expanded view`} 
            category="landscape"
            className="max-w-full max-h-full rounded-lg object-contain"
            containerClassName="max-w-4xl max-h-[85vh] flex items-center justify-center"
          />
          <button 
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full z-50"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
