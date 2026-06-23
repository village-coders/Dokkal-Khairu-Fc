import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { NewsArticle } from "../types";
import { api } from "../lib/api";
import { calculateReadTime, formatDate } from "../lib/utils";
import { Copy, Facebook, Share2, Twitter, MessageCircle, Eye, ChevronLeft, ArrowLeft } from "lucide-react";
import NewsCard from "./NewsCard";
import newsImg2 from "../assets/images/image-2.jpg";

export default function SingleNewsView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(false);
      try {
        if (!slug) return;
        const data = await api.getNewsBySlug(slug);
        setArticle(data);
        
        // Load related/latest news (excluding current)
        const recent = await api.getNews({ limit: 4 });
        const filtered = recent.articles.filter((a) => a._id !== data._id).slice(0, 3);
        setRelatedArticles(filtered);
      } catch (err) {
        console.error("Failed to load article by slug:", slug, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen py-16 px-4 mt-[72px] flex items-center justify-center">
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-t-secondary border-primary/20 animate-spin mx-auto" />
          <p className="font-display text-lg uppercase tracking-wider text-primary">Fetching report from stadium database...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-cream min-h-screen py-16 px-4 mt-[72px] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-5xl">⚽</span>
        <h2 className="font-display text-3xl uppercase text-primary font-black">Publication not found</h2>
        <p className="text-gray-500 font-light max-w-sm">This story might have been relocated, deleted, or you may be looking at a bad identifier.</p>
        <Link
          to="/news"
          className="px-6 py-2 bg-primary text-secondary font-display text-xs tracking-widest uppercase rounded font-bold hover:brightness-105 cursor-pointer inline-block"
        >
          GO BACK TO NEWS
        </Link>
      </div>
    );
  }

  const readTime = calculateReadTime(article.content);

  // Social handles
  const shareText = encodeURIComponent(`Check out: ${article.title} - Dokkal Khairu FC`);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <>
      <Helmet>
        <title>{article.title} | Dokkal Khairu FC</title>
        <meta name="description" content={article.summary} />
      </Helmet>
      <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[72px] animate-fade-in text-left">
        <div className="max-w-4xl mx-auto space-y-8 relative">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-gray-500">
          <Link to="/" className="hover:text-secondary cursor-pointer">HOME</Link>
          <span>/</span>
          <Link to="/news" className="hover:text-secondary cursor-pointer">NEWS</Link>
          <span>/</span>
          <span className="text-primary truncate max-w-xs">{article.category.toUpperCase()}</span>
        </nav>

        {/* Back Link Button */}
        <Link 
          to="/news" 
          className="inline-flex items-center space-x-2 text-primary hover:text-secondary duration-150 font-display text-sm tracking-wider cursor-pointer font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO GALLERIES</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded bg-secondary text-primary-dark font-display font-bold text-xs uppercase tracking-wide">
            {article.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary leading-tight font-black uppercase">
            {article.title}
          </h1>
          
          {/* Metadata Meta-bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-gray-500 border-y border-gray-100 py-3">
            <span>{formatDate(article.createdAt, false)}</span>
            <span>•</span>
            <span>{readTime}</span>
            <span>•</span>
            <span className="flex items-center font-bold text-secondary">
              <Eye className="w-4 h-4 mr-1 text-secondary" />
              {article.views || 0} READS
            </span>
          </div>
        </div>

        {/* Layout Grid: Left Sticky Share, Center Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          
          {/* Desktop Left Sticky Share (2 Span) */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-28 flex flex-col items-center space-y-4 pt-4 shrink-0">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 rotate-270 uppercase my-4 select-none">SHARE</span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer"
                title="Share on Twitter"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center text-primary-dark shadow-sm transition-all cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer"
                title="Share on Facebook"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-primary-dark shadow-sm transition-all cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#25D366] hover:text-white flex items-center justify-center text-primary-dark shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button 
                onClick={handleCopyLink}
                title="Copy Link to Clipboard"
                className={`w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm transition-all cursor-pointer ${copied ? 'bg-secondary border-secondary text-primary-dark' : 'hover:border-secondary hover:text-secondary text-primary-dark'}`}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Post Body (11 Span) */}
          <div className="md:col-span-11 space-y-6">
            
            {/* Cover image banner */}
            <div className="rounded-xl overflow-hidden shadow-card max-h-[480px]">
              <img 
                referrerPolicy="no-referrer"
                src={article.coverImage?.url || newsImg2} 
                alt={article.title} 
                className="w-full h-full object-cover select-none animate-fade-in"
              />
            </div>

            {/* Render plain text content with whitespace preserved */}
            <div 
              className="max-w-none text-gray-800 font-light leading-relaxed whitespace-pre-wrap break-words"
              id="article_body"
            >
              {article.content}
            </div>

            {/* Tag Badges row */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-2 text-xs font-mono">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium">
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile Share buttons Row */}
            <div className="md:hidden pt-8 border-t border-gray-100 flex items-center justify-center space-x-4">
              <span className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">SHARE FEED</span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-primary-dark shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-primary-dark shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <button 
                onClick={handleCopyLink}
                className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm ${copied ? 'bg-secondary text-primary-dark' : ''}`}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* RELATED / MORE NEWS FOOTER */}
        {relatedArticles.length > 0 && (
          <div className="pt-16 space-y-8">
            <div className="border-b border-secondary/20 pb-4">
              <h3 className="font-display text-3xl text-primary font-black uppercase tracking-wide">
                MORE PUBLISHED STORIES
              </h3>
              <div className="w-12 h-1 bg-secondary rounded mt-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {relatedArticles.map((rel) => (
                <NewsCard key={rel._id} article={rel} onNavigate={(view) => navigate(view)} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
