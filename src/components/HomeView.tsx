import React from "react";
import SEO from "./SEO";
import NewsMarquee from "./NewsMarquee";
import HeroSection from "./HeroSection";
import NextMatchCountdown from "./NextMatchCountdown";
import LatestNewsGrid from "./LatestNewsGrid";
import SquadSection from "./SquadSection";
import MediaGallery from "./MediaGallery";
import UpcomingMatches from "./UpcomingMatches";
import RecentResults from "./RecentResults";
import ClubMotto from "./ClubMotto";
import { NewsArticle, Match, Player, GalleryItem } from "../types";

interface HomeViewProps {
  allNews: NewsArticle[];
  allMatches: Match[];
  players: Player[];
  galleryItems: GalleryItem[];
  featuredNews: NewsArticle | null;
  upcomingMatch: Match | null;
  loading: boolean;
}

export default function HomeView({
  allNews,
  allMatches,
  players,
  galleryItems,
  featuredNews,
  upcomingMatch,
  loading
}: HomeViewProps) {
  return (
    <>
      <SEO 
        title="Dokkal Khairu FC | Official Website" 
        description="Welcome to the official home of Dokkal Khairu FC. The Khairu Boys from Ilé-Ifẹ̀." 
      />
      <div className="pt-[72px] space-y-0">
        <NewsMarquee articles={allNews} loading={loading} />
        <HeroSection />
        <NextMatchCountdown upcomingMatch={upcomingMatch} loading={loading} />
        <MediaGallery items={galleryItems} loading={loading} />
        <SquadSection players={players} loading={loading} />
        <UpcomingMatches matches={allMatches} loading={loading} />
        <RecentResults matches={allMatches} loading={loading} />
      </div>
    </>
  );
}
