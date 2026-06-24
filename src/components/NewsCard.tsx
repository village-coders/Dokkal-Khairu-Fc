import React from "react";
import { useNavigate } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDate } from "../lib/utils";
import { ArrowUpRight } from "lucide-react";
import newsImg1 from "../assets/images/image-1.jpg";

interface NewsCardProps {
  key?: string | number | null;
  article: NewsArticle;
  onNavigate?: (view: string) => void;
}

export default function NewsCard({ article, onNavigate }: NewsCardProps) {
  const navigate = useNavigate();

  return (
    <article 
      onClick={() => { if (onNavigate) { onNavigate(`/news/${article.slug}`); } else { navigate(`/news/${article.slug}`); } }}
      className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover hover:scale-[1.01] hover:shadow-glow border border-black/5 hover:border-secondary/50 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full text-left"
    >
      {/* Category photo container */}
      <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden shrink-0">
        <img 
          referrerPolicy="no-referrer"
          src={article.coverImage?.url || newsImg1} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
        />
        {/* Absolute category pill */}
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 rounded-full bg-secondary text-primary-dark font-display font-black text-[10px] sm:text-xs uppercase tracking-wide shadow-md">
          {article.category}
        </span>
      </div>

      {/* Body content */}
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-display text-lg sm:text-xl md:text-2xl text-primary leading-tight group-hover:text-secondary transition-colors duration-200 line-clamp-2 uppercase">
            {article.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        {/* Footer strip */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs font-mono">
          <span className="text-gray-400">
            {new Date(article.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </span>
          <span className="text-secondary font-display font-medium text-[10px] sm:text-xs tracking-wider uppercase inline-flex items-center space-x-1">
            <span>READ MORE</span>
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
          </span>
        </div>
      </div>
    </article>
  );
}
