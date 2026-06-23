import React, { useState } from 'react';
import { GalleryItem } from '../types';

interface MediaGalleryProps {
  items: GalleryItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items = [] }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories from items
  const categories = ['ALL', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = activeCategory === 'ALL'
    ? items
    : items.filter(item => item.category === activeCategory);

  const lightboxImage = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

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

        {/* Filters */}
        <div 
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            borderBottom: '1px solid var(--color-mid-grey)',
            paddingBottom: 'var(--space-4)'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontFamily: 'var(--font-condensed)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: activeCategory === cat ? 'var(--color-gold)' : 'var(--color-text-muted)',
                backgroundColor: activeCategory === cat ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                border: activeCategory === cat ? '1px solid var(--color-gold)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredItems.length > 0 ? filteredItems.map((item, index) => (
            <div 
              key={item._id} 
              className="gallery-item card-hover"
              onClick={() => setLightboxIndex(index)}
            >
              <img 
                referrerPolicy="no-referrer"
                src={item.imageUrl || '/placeholder.jpg'} 
                alt={item.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }}
              />
              
              {/* Overlay on Hover */}
              <div className="gallery-item__overlay">
                <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  {item.type === 'video' && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-red)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                    }}>
                      ▶
                    </div>
                  )}
                  <span 
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gold)',
                      fontWeight: 700,
                      letterSpacing: 'var(--tracking-widest)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.category}
                  </span>
                  <h4 
                    className="font-display"
                    style={{
                      fontSize: 'var(--text-lg)',
                      color: 'var(--color-white)',
                      marginTop: 'var(--space-1)',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '1.5rem', color: 'var(--color-gold)' }}>🔍</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-cream/50">
              No gallery items found.
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div 
            className="lightbox-backdrop"
            onClick={() => setLightboxIndex(null)}
          >
            <div 
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="lightbox-close"
                onClick={() => setLightboxIndex(null)}
              >
                ✕
              </button>

              <img 
                src={lightboxImage.imageUrl} 
                alt={lightboxImage.title}
                style={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />

              <div 
                style={{
                  padding: 'var(--space-5)',
                  backgroundColor: 'var(--color-pitch)',
                  borderTop: '1px solid var(--color-mid-grey)'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gold)',
                    fontWeight: 700,
                    letterSpacing: 'var(--tracking-widest)',
                    textTransform: 'uppercase',
                  }}
                >
                  {lightboxImage.category}
                </span>
                <h3 
                  className="font-display"
                  style={{
                    fontSize: 'var(--text-xl)',
                    color: 'var(--color-white)',
                    marginTop: '4px',
                    marginBottom: 'var(--space-2)'
                  }}
                >
                  {lightboxImage.title}
                </h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default MediaGallery;
