import React, { useState, useRef, useEffect } from 'react';
import { GalleryItem } from '../types';

interface MediaGalleryProps {
  items: GalleryItem[];
  loading?: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items = [], loading = false }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(items.length / itemsPerView));
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const goToNext = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const lightboxImage = lightboxIndex !== null ? items[lightboxIndex] : null;

  const getVisibleItems = () => {
    const start = currentSlide * itemsPerView;
    return items.slice(start, start + itemsPerView);
  };

  return (
    <section className="bg-primary-dark py-16 px-4 sm:px-6 lg:px-8 border-b border-secondary/10 relative">
      <div className="max-w-7xl mx-auto space-y-10 relative">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-secondary/20 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl text-white font-black uppercase tracking-wide">
              CLUB GALLERY
            </h2>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
        </div>

        {/* Gallery Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-cream/10 rounded-lg"></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="relative">
            {/* Carousel Container */}
            <div className="relative overflow-hidden" ref={sliderRef}>
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                }}
              >
                {items.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="gallery-item card-hover flex-shrink-0 px-2"
                    style={{ width: `${100 / itemsPerView}%` }}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group">
                      <img 
                        referrerPolicy="no-referrer"
                        src={item.imageUrl || '/placeholder.jpg'} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          {item.type === 'video' && (
                            <div className="w-10 h-10 rounded-full bg-[#C22D1D] text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                              ▶
                            </div>
                          )}
                          <span 
                            className="inline-block text-xs font-bold tracking-widest uppercase text-[#D4A017] mb-1"
                          >
                            {item.category}
                          </span>
                          <h4 
                            className="font-display text-lg text-white mb-2"
                          >
                            {item.title}
                          </h4>
                          <span className="text-2xl text-[#D4A017]">🔍</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  disabled={!canGoPrev}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-secondary/90 hover:bg-secondary text-primary-dark flex items-center justify-center transition-all ${
                    !canGoPrev ? 'opacity-30 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                  }`}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  onClick={goToNext}
                  disabled={!canGoNext}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-secondary/90 hover:bg-secondary text-primary-dark flex items-center justify-center transition-all ${
                    !canGoNext ? 'opacity-30 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                  }`}
                  aria-label="Next slide"
                >
                  ›
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentSlide 
                        ? 'bg-secondary w-8' 
                        : 'bg-cream/30 hover:bg-cream/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-full text-center py-12 text-cream/50">
            No gallery items found.
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <div 
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="absolute -top-12 right-0 text-white hover:text-secondary text-3xl font-light transition-colors"
                onClick={() => setLightboxIndex(null)}
              >
                ✕
              </button>

              <img 
                src={lightboxImage.imageUrl} 
                alt={lightboxImage.title}
                className="w-full max-h-[70vh] object-contain"
              />

              <div className="mt-4 text-center">
                <span 
                  className="inline-block text-xs font-bold tracking-widest uppercase text-[#D4A017] mb-2"
                >
                  {lightboxImage.category}
                </span>
                <h3 
                  className="font-display text-xl text-white"
                >
                  {lightboxImage.title}
                </h3>
              </div>

              {/* Lightbox Navigation */}
              {items.length > 1 && lightboxIndex !== null && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)}
                    className="px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-white rounded transition-colors"
                  >
                    ‹ Previous
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                    className="px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-white rounded transition-colors"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default MediaGallery;