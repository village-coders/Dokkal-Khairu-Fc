import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NewsArticle } from '../types';
import NewsCard from './NewsCard';

interface LatestNewsGridProps {
  articles: NewsArticle[];
}

const LatestNewsGrid: React.FC<LatestNewsGridProps> = ({ articles }) => {
  const navigate = useNavigate();
  const displayNews = articles && articles.length > 0 ? articles.slice(0, 3) : [];
  const featuredArticle = displayNews[0];
  const secondaryArticles = displayNews.slice(1, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (displayNews.length === 0) return null;

  return (
    <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto space-y-10 relative">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-300 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl text-primary font-black uppercase tracking-wide">
              LATEST NEWS
            </h2>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
        </div>

        {/* Grid Container */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: 'var(--space-6)', 
            marginBottom: 'var(--space-8)'
          }}
          className="news-grid-responsive"
        >
          {/* Featured Article - Spans Left/Main */}
          {featuredArticle && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                backgroundColor: 'var(--color-pitch)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                borderBottom: '3px solid var(--color-gold)',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              className="featured-article-card"
              onClick={() => navigate(`/news/${featuredArticle.slug}`)}
            >
              {/* Image Section */}
              <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                <img 
                  referrerPolicy="no-referrer"
                  src={featuredArticle.coverImage?.url || '/placeholder.jpg'} 
                  alt={featuredArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Category Badge absolute overlay */}
                <div style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', zIndex: 2 }}>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-primary-dark font-display font-black text-xs uppercase tracking-wide shadow-md">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Text Info Section */}
              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  FEATURED STORY &bull; {formatDate(featuredArticle.createdAt)}
                </span>
                
                <h3 className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-white)', lineHeight: 1.1, marginBottom: 'var(--space-4)' }}>
                  <span 
                    style={{ color: 'inherit', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  >
                    {featuredArticle.title}
                  </span>
                </h3>

                <p 
                  style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--color-text-muted)', 
                    lineHeight: 'var(--leading-normal)', 
                    marginBottom: 'var(--space-6)' 
                  }}
                  className="line-clamp-3"
                >
                  {featuredArticle.summary}
                </p>

                <span 
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Read Full Story &rarr;
                </span>
              </div>
            </div>
          )}

          {/* Secondary Grid (Stacked on Right / Side-by-side below) */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 'var(--space-6)' 
            }}
          >
            {secondaryArticles.map((article) => (
              <NewsCard key={article._id} article={article} onNavigate={(view) => navigate(view)} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/news" className="btn-secondary inline-block">
            View All News &rarr;
          </Link>
        </div>

      </div>

      <style>{`
        @media (min-width: 992px) {
          .news-grid-responsive {
            grid-template-columns: 2fr 1fr !important;
            align-items: stretch;
          }
          .featured-article-card {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .featured-article-card img {
            height: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestNewsGrid;
