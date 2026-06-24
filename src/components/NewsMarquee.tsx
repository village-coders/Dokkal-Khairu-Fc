import React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";

interface NewsMarqueeProps {
  articles: NewsArticle[];
  loading?: boolean;
}

export default function NewsMarquee({ articles, loading = false }: NewsMarqueeProps) {
  // Use server articles or highly engaging fallback messages if offline/empty
  const items = articles.length > 0 
    ? articles.map((a) => ({ text: a.title, slug: a.slug, id: a._id }))
    : [
        { text: "DOKKAL KHAIRU FC TRIUMPH IN ILE-IFE LOCAL DERBY WITH 3-0 SWEEP", slug: "derby", id: "f1" },
        { text: "TALENT TRIALS RECRUITMENT TOUR START JULY 2026 AT IFE GRAND RESORT ARENA", slug: "trials", id: "f2" },
        { text: "HEAD COACH INTENSIFIES DRILLS AHEAD OF OSFA LEAGUE SEASON OPENER", slug: "preparations", id: "f3" },
        { text: "NEW FIVE-YEAR CLUB PARTNERSHIP PACT SIGNED WITH SPORTS DEVELOPMENT COUNCIL", slug: "partnership", id: "f4" }
      ];

  // Repeat items to fill space and guarantee a continuous loop
  const repeatedItems = [...items, ...items, ...items];

  if (loading) {
    return (
      <div className="bg-secondary text-primary-dark h-11 w-full flex items-center overflow-hidden border-b border-secondary/20 relative select-none">
        <div style={{ backgroundColor: "rgb(5,26,56)" }} className="bg-secondary backdrop-blur-sm px-4 h-full flex items-center shrink-0 border-r border-[#0d1f17]/10 z-10">
          <span className="font-display text-sm tracking-widest font-black flex items-center space-x-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C22D1D] animate-ping shrink-0" />
            <span className="text-[white]">LATEST</span>
          </span>
        </div>
        <div className="w-full h-full flex items-center overflow-hidden px-6 gap-6 animate-pulse">
          <div className="h-4 w-48 bg-white/20 rounded"></div>
          <div className="h-4 w-64 bg-white/20 rounded"></div>
          <div className="h-4 w-52 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary text-primary-dark h-11 w-full flex items-center overflow-hidden border-b border-secondary/20 relative select-none">
      {/* Fixed static header tag */}
      <div style={{ backgroundColor: "rgb(5,26,56)" }} className="bg-secondary backdrop-blur-sm px-4 h-full flex items-center shrink-0 border-r border-[#0d1f17]/10 z-10">
        <span className="font-display text-sm tracking-widest font-black flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C22D1D] animate-ping shrink-0" />
          <span className="text-[white]">LATEST</span>
        </span>
      </div>

      {/* Infinite scrolling viewport */}
      <div className="w-full h-full flex items-center overflow-hidden relative">
        <div className="animate-marquee-infinite py-2 flex items-center whitespace-nowrap">
          {repeatedItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={`/news/${item.slug}`}
              className="inline-flex items-center mx-6 font-body font-bold text-xs tracking-wide hover:underline cursor-pointer uppercase transition-all whitespace-nowrap text-white"
            >
              <span>{item.text}</span>
              <span className="ml-6 text-primary font-serif">⚽</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
