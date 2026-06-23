import React from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Dokkal Khairu FC | Official Website</title>
        <meta name="description" content="Welcome to the official home of Dokkal Khairu FC. The Khairu Boys from Ilé-Ifẹ̀." />
      </Helmet>
      <div className="pt-[72px] space-y-0">
        <NewsMarquee articles={allNews} />
        <HeroSection 
          featuredNews={featuredNews} 
          upcomingMatch={upcomingMatch} 
          loading={loading}
        />
        <NextMatchCountdown upcomingMatch={upcomingMatch} loading={loading} />
        <LatestNewsGrid articles={allNews} />
        <SquadSection players={players} />
        <MediaGallery items={galleryItems} />
        <UpcomingMatches matches={allMatches} />
        <RecentResults matches={allMatches} />
        <ClubMotto />
      </div>
    </>
  );
}
