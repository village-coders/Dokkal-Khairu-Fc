import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewsMarquee from "./components/NewsMarquee";

// Core View modules
import HomeView from "./components/HomeView";
import NewsView from "./components/NewsView";
import SingleNewsView from "./components/SingleNewsView";
import MatchesView from "./components/MatchesView";
import AboutView from "./components/AboutView";
import AdminLoginView from "./components/AdminLoginView";
import AdminHub from "./components/AdminHub";
import PlayersView from "./components/PlayersView";

import { NewsArticle, Match, Player, GalleryItem } from "./types";
import { api } from "./lib/api";

function AppLayout() {
  const location = useLocation();
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHomeMetrics = async () => {
    try {
      const [newsRes, matchesRes, playersRes, galleryRes] = await Promise.all([
        api.getNews({ limit: 12 }),
        api.getMatches(),
        api.getPlayers().catch(() => []),
        api.getGalleryItems().catch(() => [])
      ]);

      setAllNews(newsRes.articles);
      setAllMatches(matchesRes);
      setPlayers(playersRes);
      setGalleryItems(galleryRes);
      console.log(galleryRes)

      const featured = newsRes.articles.find((a) => a.isFeatured) || newsRes.articles[0] || null;
      setFeaturedNews(featured);

      const upcomingSorted = matchesRes
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
      
      const nextMatch = upcomingSorted[0] || matchesRes.find((m) => m.status === "live") || matchesRes[0] || null;
      setUpcomingMatch(nextMatch);
    } catch (e) {
      console.warn("Failed to load initial metrics feeds.", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeMetrics();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isFullScreenAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {!isFullScreenAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView 
            allNews={allNews} 
            allMatches={allMatches} 
            players={players} 
            galleryItems={galleryItems} 
            featuredNews={featuredNews} 
            upcomingMatch={upcomingMatch} 
            loading={loading} 
          />} />
          <Route path="/news" element={<NewsView />} />
          <Route path="/news/:slug" element={<SingleNewsView />} />
          <Route path="/matches" element={<MatchesView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/players" element={<PlayersView />} />
          <Route path="/admin" element={<AdminLoginView />} />
          <Route path="/admin/dashboard" element={<AdminHub />} />
          <Route path="*" element={
            <div className="pt-24 pb-12 px-4 text-center">
              <h2 className="font-display text-4xl text-primary font-black uppercase">PAGE NOT FOUND</h2>
            </div>
          } />
        </Routes>
      </main>

      {!isFullScreenAdmin && <Footer recentNews={allNews} />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
