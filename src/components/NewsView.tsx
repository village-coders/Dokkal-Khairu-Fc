import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { NewsArticle, PaginatedNews } from "../types";
import { api } from "../lib/api";
import NewsCard from "./NewsCard";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

export default function NewsView() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Filtering & Pagination State
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const categories = [
    "All", "Club News", "Match Report", "Transfer", "Youth", "Community", "General"
  ];

  // Fetch News Trigger on category or page change
  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.getNews({
          page: currentPage,
          limit: 9,
          category: activeCategory === "All" ? undefined : activeCategory,
        });
        setArticles(response.articles);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error("Failed to load news", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1); // Reset page to first
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Render Skeleton Placeholders
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col justify-between h-[420px] animate-pulse">
        <div className="bg-gray-200 h-52 w-full" />
        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <title>Club News | Dokkal Khairu FC</title>
        <meta name="description" content="Read the latest updates, match reports, and announcements from Dokkal Khairu FC." />
      </Helmet>
      <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[72px] animate-fade-in text-left">
        <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Title Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-primary font-black uppercase leading-tight">
            NEWS & WORLD BULLETINS
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-light max-w-lg mx-auto">
            Stay up to date with match reports, transfer pacts, youth updates and official statements at Ilé-Ifẹ̀'s leading football setup.
          </p>
          <div className="w-16 h-1 bg-secondary mx-auto rounded" />
        </div>

        {/* Categories Bar (Scrollable on horizontal) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full font-display text-xs sm:text-sm uppercase tracking-wider font-semibold transition-all shrink-0 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-secondary border-secondary text-primary-dark shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-secondary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className="py-16 text-center border border-dashed border-danger/20 rounded-2xl bg-danger/5 text-danger">
            <p className="font-semibold text-lg">⚽ Oops! Failed to fetch news logs from the stadium servers.</p>
            <p className="text-sm font-light mt-1">Please try reloading or check back in a moment.</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <NewsCard key={article._id} article={article} onNavigate={(view) => navigate(view)} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-10 flex justify-center items-center space-x-4">
                {/* Prev Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-secondary transition-all cursor-pointer shadow-sm"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Page numbers display */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNo = idx + 1;
                    return (
                      <button
                        key={pageNo}
                        onClick={() => setCurrentPage(pageNo)}
                        className={`w-10 h-10 rounded-full font-display font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                          currentPage === pageNo
                            ? "bg-secondary text-primary-dark shadow-md border border-secondary"
                            : "bg-white border border-gray-200 text-primary hover:border-secondary"
                        }`}
                      >
                        {pageNo}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-secondary transition-all cursor-pointer shadow-sm"
                  title="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-white space-y-4 max-w-xl mx-auto">
            <Compass className="w-12 h-12 mx-auto text-gray-300 animate-pulse" />
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-primary uppercase font-bold">No news articles found</h3>
              <p className="text-gray-500 font-light text-sm max-w-xs mx-auto">
                No publications found under "{activeCategory}" at this present moment. Check again shortly!
              </p>
            </div>
            <button
              onClick={() => handleCategoryChange("All")}
              className="px-5 py-2 bg-primary text-secondary font-display text-xs tracking-wider uppercase rounded font-bold hover:brightness-110"
            >
              Reset Category
            </button>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
