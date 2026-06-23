import React from "react";
import { NewsArticle } from "../types";
import NewsCard from "./NewsCard";

interface LatestNewsProps {
  articles: NewsArticle[];
  onNavigate: (view: string) => void;
}

export default function LatestNews({ articles, onNavigate }: LatestNewsProps) {
  const topArticles = articles.slice(0, 3);

  return (
    <section className="bg-cream py-6 sm:py-8 px-3 sm:px-6 lg:px-8 border-b border-black/5">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Title with Custom Gold Accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-secondary/20 pb-3 sm:pb-4">
          <div className="text-left space-y-1 sm:space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary font-black uppercase tracking-wide">
              LATEST NEWS & INSIGHTS
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-secondary rounded" />
          </div>
          <span className="hidden md:inline-block font-mono text-[10px] sm:text-xs text-gray-400 font-medium mt-2 md:mt-0">
            Stay updated with everything Dokkal Khairu Football Club
          </span>
        </div>

        {/* 3-Column Grid */}
        {topArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {topArticles.map((article) => (
              <NewsCard key={article._id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 font-light">
            <p>⚽ Loading soccer bulletins...</p>
          </div>
        )}

        {/* View All CTA Button */}
        <div className="pt-4 sm:pt-6 flex justify-center">
          <button
            onClick={() => onNavigate("news")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-primary-dark font-display font-bold text-xs sm:text-sm tracking-widest rounded shadow hover:brightness-105 hover:shadow-glow hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            VIEW ALL NEWS ➔
          </button>
        </div>
      </div>
    </section>
  );
}
