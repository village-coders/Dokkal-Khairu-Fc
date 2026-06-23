import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewsArticle, Match } from "../types";
import { api } from "../lib/api";
import { formatDate } from "../lib/utils";
import clubLogo from "../assets/images/club_logo_crest_1782203456122.jpg";
import { 
  Trophy, FileText, Calendar, Plus, Edit2, Trash2, LogOut, LayoutDashboard, Shield, 
  MapPin, Settings, Check, AlertTriangle, ArrowLeft, Upload, Users, Eye, HelpCircle, Flame
} from "lucide-react";
import AdminPlayers from "./AdminPlayers";
import AdminGallery from "./AdminGallery";
import { useAuth } from "../context/AuthContext";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface AdminHubProps {}

type AdminTab = "dashboard" | "news_list" | "news_form" | "match_list" | "match_form" | "score_form" | "players" | "gallery";

export default function AdminHub({}: AdminHubProps) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  
  // Navigation & active forms
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Form State: News
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState<NewsArticle["category"]>("Club News");
  const [newsTags, setNewsTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [newsFeatured, setNewsFeatured] = useState(false);
  const [newsImageUrl, setNewsImageUrl] = useState("");
  const [newsUploadLoading, setNewsUploadLoading] = useState(false);
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null);

  // Form State: Matches
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [homeTeamName, setHomeTeamName] = useState("");
  const [homeTeamLogoUrl, setHomeTeamLogoUrl] = useState("");
  const [awayTeamName, setAwayTeamName] = useState("");
  const [awayTeamLogoUrl, setAwayTeamLogoUrl] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [venue, setVenue] = useState("");
  const [competition, setCompetition] = useState("");
  const [matchStatus, setMatchStatus] = useState<'upcoming' | 'live' | 'completed'>("upcoming");
  const [matchweek, setMatchweek] = useState("");
  const [highlights, setHighlights] = useState("");
  
  // Form State: Score updates
  const [scoreMatchId, setScoreMatchId] = useState<string | null>(null);
  const [scoreHome, setScoreHome] = useState<number | "">("");
  const [scoreAway, setScoreAway] = useState<number | "">("");
  const [scoreStatus, setScoreStatus] = useState<'upcoming' | 'live' | 'completed'>("completed");
  const [scoreHighlights, setScoreHighlights] = useState("");

  const categories: NewsArticle["category"][] = [
    "Club News", "Match Report", "Transfer", "Youth", "Community", "General"
  ];

  // Load backend registers
  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const newsRes = await api.getNews({ limit: 100 });
      const matchesRes = await api.getMatches();
      setNews(newsRes.articles);
      setMatches(matchesRes);
    } catch (err) {
      console.error(err);
      triggerToast("Error linking database registers.", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    loadWorkspaceData();
  }, [admin]);

  const triggerToast = (text: string, error = false) => {
    setStatusMsg({ text, error });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Local Image file uploader function mapping through /api/upload uploader
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: "home" | "away" | "news") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show immediate preview for news image
    if (side === "news") {
      const previewUrl = URL.createObjectURL(file);
      setNewsImagePreview(previewUrl);
      setNewsUploadLoading(true);
    }
    
    // Read local file as Base64 format
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      try {
        const uploadRes = await api.uploadImage(base64Str, file.name);
        if (side === "home") setHomeTeamLogoUrl(uploadRes.url);
        else if (side === "away") setAwayTeamLogoUrl(uploadRes.url);
        else if (side === "news") {
          setNewsImageUrl(uploadRes.url);
          setNewsImagePreview(null);
        }
        
        triggerToast("Image uploaded successfully.");
      } catch (err: any) {
        console.error(err);
        triggerToast("Failed to upload image.", true);
        if (side === "news") setNewsImagePreview(null);
      } finally {
        if (side === "news") setNewsUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Tag Manager helpers
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase();
      if (!newsTags.includes(clean)) {
        setNewsTags([...newsTags, clean]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setNewsTags(newsTags.filter((t) => t !== tag));
  };

  // CRUD Trigger: NEWS
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsContent) {
      triggerToast("Please fill in all obligated publication fields.", true);
      return;
    }

    try {
      if (editingNewsId) {
        await api.updateNews(editingNewsId, {
          title: newsTitle,
          summary: newsSummary,
          content: newsContent,
          coverImageUrl: newsImageUrl,
          category: newsCategory,
          tags: newsTags,
          isFeatured: newsFeatured
        });
        triggerToast("News article updated successfully.");
      } else {
        await api.createNews({
          title: newsTitle,
          summary: newsSummary,
          content: newsContent,
          coverImageUrl: newsImageUrl,
          category: newsCategory,
          tags: newsTags,
          isFeatured: newsFeatured
        });
        triggerToast("News article published successfully.");
      }
      
      // Clean forms
      resetNewsForm();
      await loadWorkspaceData();
      setActiveTab("news_list");
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to catalog publication.", true);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this press bulletin?")) return;
    try {
      await api.deleteNews(id);
      triggerToast("News publication deleted.");
      await loadWorkspaceData();
    } catch (err) {
      triggerToast("Failed to delete publication.", true);
    }
  };

  const initEditNews = (art: NewsArticle) => {
    setEditingNewsId(art._id);
    setNewsTitle(art.title);
    setNewsSummary(art.summary);
    setNewsContent(art.content);
    setNewsCategory(art.category);
    setNewsTags(art.tags || []);
    setNewsFeatured(art.isFeatured);
    setNewsImageUrl(art.coverImage?.url || "");
    setActiveTab("news_form");
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsTitle("");
    setNewsSummary("");
    setNewsContent("");
    setNewsCategory("Club News");
    setNewsTags([]);
    setNewsFeatured(false);
    setNewsImageUrl("");
    setNewsImagePreview(null);
    setTagInput("");
  };

  // CRUD Trigger: MATCHES
  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeamName || !awayTeamName || !matchDate || !venue || !competition) {
      triggerToast("Please fill in all obligated matchup fields.", true);
      return;
    }

    try {
      if (editingMatchId) {
        await api.updateMatch(editingMatchId, {
          homeTeamName,
          homeTeamLogoUrl,
          awayTeamName,
          awayTeamLogoUrl,
          matchDate,
          venue,
          competition,
          status: matchStatus,
          matchweek: matchweek ? parseInt(matchweek) : undefined,
          highlights
        });
        triggerToast("Fixture details updated successfully.");
      } else {
        await api.createMatch({
          homeTeamName,
          homeTeamLogoUrl,
          awayTeamName,
          awayTeamLogoUrl,
          matchDate,
          venue,
          competition,
          status: matchStatus,
          matchweek: matchweek ? parseInt(matchweek) : undefined,
          highlights
        });
        triggerToast("Fixture registered successfully.");
      }

      resetMatchForm();
      await loadWorkspaceData();
      setActiveTab("match_list");
    } catch (err: any) {
      triggerToast(err.message || "Failed to register matchup.", true);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled match?")) return;
    try {
      await api.deleteMatch(id);
      triggerToast("Scheduled matchup catalog cleared.");
      await loadWorkspaceData();
    } catch (err) {
      triggerToast("Failed to remove fixture.", true);
    }
  };

  const initEditMatch = (m: Match) => {
    setEditingMatchId(m._id);
    setHomeTeamName(m.homeTeam.name);
    setHomeTeamLogoUrl(m.homeTeam.logo?.url || "");
    setAwayTeamName(m.awayTeam.name);
    setAwayTeamLogoUrl(m.awayTeam.logo?.url || "");
    setVenue(m.venue);
    
    // Format to local date values for datetime-local picker
    const formattedDate = m.matchDate ? new Date(m.matchDate).toISOString().slice(0, 16) : "";
    setMatchDate(formattedDate);
    setCompetition(m.competition);
    setMatchStatus(m.status);
    setMatchweek(m.matchweek ? m.matchweek.toString() : "");
    setHighlights(m.highlights || "");
    setActiveTab("match_form");
  };

  const resetMatchForm = () => {
    setEditingMatchId(null);
    setHomeTeamName("");
    setHomeTeamLogoUrl("");
    setAwayTeamName("");
    setAwayTeamLogoUrl("");
    setVenue("");
    setMatchDate("");
    setCompetition("");
    setMatchStatus("upcoming");
    setMatchweek("");
    setHighlights("");
  };

  // Score Updates Trigger
  const initScoreUpdate = (m: Match) => {
    setScoreMatchId(m._id);
    setScoreHome(m.homeScore !== null ? m.homeScore : "");
    setScoreAway(m.awayScore !== null ? m.awayScore : "");
    setScoreStatus(m.status);
    setScoreHighlights(m.highlights || "");
    setActiveTab("score_form");
  };

  const handleSaveScores = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreMatchId) return;

    try {
      await api.updateMatch(scoreMatchId, {
        homeScore: scoreHome !== "" ? Number(scoreHome) : null,
        awayScore: scoreAway !== "" ? Number(scoreAway) : null,
        status: scoreStatus,
        highlights: scoreHighlights
      });
      triggerToast("Match scoreboard and state updated.");
      setScoreMatchId(null);
      await loadWorkspaceData();
      setActiveTab("match_list");
    } catch (err: any) {
      triggerToast("Failed to publish scoreboard.", true);
    }
  };

  // Dashboard calculations
  const upcomingCount = matches.filter((m) => m.status === "upcoming").length;
  const liveCount = matches.filter((m) => m.status === "live").length;
  const recentNewsTitle = news.length > 0 ? news[0].title : "No articles cataloged";

  return (
    <div className="bg-cream min-h-screen flex text-left font-body relative" id="admin_hub">
      {/* Toast Alert bar */}
      {statusMsg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3.5 rounded-lg shadow-lg flex items-center space-x-3 text-sm font-semibold uppercase tracking-wider animate-slide-up ${
          statusMsg.error ? "bg-red-600 text-white" : "bg-primary text-secondary border border-secondary"
        }`}>
          {statusMsg.error ? <AlertTriangle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 240px Lateral Navigation Sidebar */}
      <aside className="w-60 bg-primary-dark border-r border-secondary/10 shrink-0 flex flex-col justify-between p-6 h-screen sticky top-0 text-cream">
        <div className="space-y-8">
          {/* Logo Brand Mark */}
          <div className="flex items-center space-x-2">
            <img 
              src={clubLogo} 
              alt="Dokkal Khairu Football Club Logo" 
              className="w-10 h-10 shrink-0 drop-shadow-md object-contain rounded-full bg-white p-0.5 border border-secondary/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-display text-lg text-secondary leading-none tracking-widest block font-bold">ADMIN PANEL</span>
              <span className="text-[9px] uppercase font-mono text-cream/40 tracking-widest block">The Khairu Boys</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
              { id: "news_list", label: "News articles", Icon: FileText },
              { id: "match_list", label: "Match scheduler", Icon: Trophy },
              { id: "players", label: "Squad Roster", Icon: Users },
              { id: "gallery", label: "Club Gallery", Icon: Eye },
            ].map((item) => {
              const active = activeTab === item.id || 
                (item.id === "news_list" && activeTab === "news_form") ||
                (item.id === "match_list" && (activeTab === "match_form" || activeTab === "score_form"));
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "news_list") resetNewsForm();
                    if (item.id === "match_list") resetMatchForm();
                    setActiveTab(item.id as AdminTab);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-display text-sm uppercase tracking-wider font-semibold border-l-2 transition-all cursor-pointer ${
                    active 
                      ? "bg-secondary/10 border-secondary text-secondary" 
                      : "border-transparent text-cream/60 hover:bg-cream/5 hover:text-cream"
                  }`}
                >
                  <item.Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel */}
        <div className="pt-6 border-t border-cream/5 text-xs space-y-3">
          <div className="flex items-center space-x-2 text-cream/50">
            <Shield className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="truncate">User: {admin?.username} (Admin)</span>
          </div>
          <button
            onClick={() => {
              logout();
          navigate('/');
            }}
            className="w-full flex items-center space-x-2 py-2 px-3 rounded bg-red-600/15 border border-red-500/20 text-red-400 hover:bg-red-600/25 transition-all text-xs font-semibold cursor-pointer uppercase"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>DISCONNECT HUB</span>
          </button>
        </div>
      </aside>

      {/* Main interactive viewport container */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <div className="space-y-2 text-center">
              <div className="w-10 h-10 border-4 border-t-secondary border-primary/25 rounded-full animate-spin mx-auto" />
              <p className="font-mono text-xs uppercase text-gray-500 font-bold tracking-wider">Linking dashboard indexes...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 1. TAB: OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-10 animate-fade-in">
                
                {/* Header overview banner */}
                <div>
                  <h1 className="font-display text-4xl text-primary font-black uppercase">WORK CENTER OVERVIEW</h1>
                  <p className="text-sm font-light text-gray-500">Welcome back, Administrator. Real-time metrics overview for Dokkal Khairu Football Club.</p>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat 1 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase block">NEWS WRITTEN</span>
                      <span className="text-3xl font-display font-black text-primary block">{news.length}</span>
                    </div>
                    <div className="bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  {/* Stat 2 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase block">TOTAL MATCHES</span>
                      <span className="text-3xl font-display font-black text-primary block">{matches.length}</span>
                    </div>
                    <div className="bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                  </div>
                  {/* Stat 3 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase block">NEXT FIXTURES</span>
                      <span className="text-3xl font-display font-black text-secondary block">{upcomingCount}</span>
                    </div>
                    <div className="bg-[#12241b] w-12 h-12 rounded-xl flex items-center justify-center text-secondary shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                  {/* Stat 4 */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm col-span-1 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase block">LATEST DISPATCH</span>
                    <p className="text-xs text-primary font-bold line-clamp-2 mt-2 leading-tight uppercase font-display truncate">
                      {recentNewsTitle}
                    </p>
                  </div>
                </div>

                {/* Quick actions box */}
                <div className="bg-primary-dark text-cream rounded-2xl p-6 border border-secondary/15 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-display text-xl text-secondary uppercase font-bold tracking-wider">CREATIVE LAUNCHPAD</p>
                    <p className="text-xs text-cream/70 font-light max-w-sm">Publish news bulletins, announce transfers, or schedule OSFA League fixture brackets.</p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button
                      onClick={() => { resetNewsForm(); setActiveTab("news_form"); }}
                      className="px-4 py-2 rounded bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase hover:brightness-110 duration-150 cursor-pointer"
                    >
                      + ADD NEWS
                    </button>
                    <button
                      onClick={() => { resetMatchForm(); setActiveTab("match_form"); }}
                      className="px-4 py-2 rounded border border-secondary text-secondary font-display text-xs tracking-widest uppercase hover:bg-secondary/10 duration-150 cursor-pointer"
                    >
                      + ADD MATCH
                    </button>
                  </div>
                </div>

                {/* Recent Items Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Latest created articles */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display text-lg text-primary tracking-wider uppercase font-semibold border-b border-gray-100 pb-2">LATEST ARTICLES</h3>
                    {news.length > 0 ? (
                      <div className="space-y-3">
                        {news.slice(0, 4).map((art) => (
                          <div key={art._id} className="flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-0">
                            <span className="truncate max-w-[280px] font-medium text-primary uppercase font-display text-sm">{art.title}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono scale-95 shrink-0">{art.category}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 font-light">No articles scheduled yet.</p>
                    )}
                  </div>
                  {/* Latest scheduled matches */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display text-lg text-primary tracking-wider uppercase font-semibold border-b border-gray-100 pb-2">SCHEDULED MATCHES</h3>
                    {matches.length > 0 ? (
                      <div className="space-y-3">
                        {matches.slice(0, 4).map((m) => (
                          <div key={m._id} className="flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-0 font-mono">
                            <span className="font-bold text-primary max-w-[240px] truncate">{m.homeTeam.name} vs {m.awayTeam.name}</span>
                            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded ml-2 uppercase font-black shrink-0">{m.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 font-light">No matches loaded yet.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. TAB: NEWS LIST */}
            {activeTab === "news_list" && (
              <div className="space-y-6 animate-fade-in-slow">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="font-display text-4xl text-primary font-black uppercase">NEWS BULLETINS DIRECTORY</h1>
                    <p className="text-sm font-light text-gray-500">Edit, remove, or feature publications on the homepage index.</p>
                  </div>
                  <button
                    onClick={() => { resetNewsForm(); setActiveTab("news_form"); }}
                    className="px-4 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow-sm hover:brightness-105 cursor-pointer"
                  >
                    + NEW ARTICLE
                  </button>
                </div>

                {/* News Grid Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary text-secondary font-display text-xs tracking-widest uppercase border-b border-secondary/15">
                          <th className="p-4 md:px-6">TITLE</th>
                          <th className="p-4 md:px-6">CATEGORY</th>
                          <th className="p-4 md:px-6">DATE</th>
                          <th className="p-4 md:px-6">FEATURED</th>
                          <th className="p-4 md:px-6 text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-primary">
                        {news.length > 0 ? (
                          news.map((art) => (
                            <tr key={art._id} className="hover:bg-gray-50/50">
                              <td className="p-4 md:px-6 font-display uppercase tracking-wider text-sm font-bold max-w-xs truncate">{art.title}</td>
                              <td className="p-4 md:px-6 font-mono text-xs max-w-[120px] truncate">
                                <span className="bg-primary-dark/5 px-2 py-1 rounded text-primary-dark font-semibold">
                                  {art.category}
                                </span>
                              </td>
                              <td className="p-4 md:px-6 font-mono text-xs">{formatDate(art.createdAt, false)}</td>
                              <td className="p-4 md:px-6 font-mono text-xs">
                                {art.isFeatured ? (
                                  <span className="text-[#5cb85c] font-bold">★ YES</span>
                                ) : (
                                  <span className="text-gray-400">NO</span>
                                )}
                              </td>
                              <td className="p-4 md:px-6 text-center">
                                <div className="flex items-center justify-center space-x-3 shrink-0">
                                  <button
                                    onClick={() => initEditNews(art)}
                                    className="p-1.5 rounded hover:bg-secondary/10 text-secondary/90 hover:text-secondary duration-150 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNews(art._id)}
                                    className="p-1.5 rounded hover:bg-danger/10 text-danger/80 hover:text-danger duration-150 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500 font-light">No news bulletins cataloged. Publish one!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB: NEWS CREATE/EDIT FORM */}
            {activeTab === "news_form" && (
              <div className="space-y-6 animate-fade-in max-w-3xl">
                <button
                  onClick={() => setActiveTab("news_list")}
                  className="inline-flex items-center space-x-2 text-primary hover:text-secondary duration-150 font-display text-sm tracking-widest font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO ARTICLES DIRECTORY</span>
                </button>

                <div>
                  <h1 className="font-display text-4xl text-primary font-black uppercase">
                    {editingNewsId ? "MODIFY RECENT ARTICLE" : "PUBLISH NEW ARTICLE"}
                  </h1>
                  <p className="text-sm font-light text-gray-500">Provide header titles, metadata tags, and the html body writeup.</p>
                </div>

                <form onSubmit={handleSaveNews} className="space-y-6 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm text-sm text-primary">
                  {/* Title & category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">ARTICLE TITLE</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DOKKAL KHAIRU FC CAPTURES CHAMPIONS TITLE"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary font-semibold"
                      />
                      {newsTitle && (
                        <p className="text-[10px] font-mono text-secondary mt-1">
                          ↳ Slug preview: <span className="font-bold">{slugify(newsTitle)}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">CATEGORY</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value as NewsArticle["category"])}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 @apply cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary (Max 300 chars) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase">
                      <label>SUMMARY PREVIEW (MAX 300 CHARS)</label>
                      <span className={newsSummary.length > 300 ? "text-danger" : ""}>{newsSummary.length}/300</span>
                    </div>
                    <textarea
                      required
                      placeholder="Give a brief description (excerpt) representing the article..."
                      maxLength={300}
                      rows={2}
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary text-xs leading-relaxed font-light"
                    />
                  </div>

                  {/* Content (Plain text format) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">
                      ARTICLE CONTENT (PLAIN TEXT)
                    </label>
                    <textarea
                      required
                      placeholder="Write your article content here. Press Enter for new paragraphs..."
                      rows={8}
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Tags Manager */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">TAGS (TYPE AND PRESS ENTER)</label>
                    <input
                      type="text"
                      placeholder="e.g. league, victory, youth"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                    />
                    {newsTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {newsTags.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded bg-secondary/15 text-secondary font-mono font-bold text-[10px] flex items-center shrink-0">
                            <span>#{t.toUpperCase()}</span>
                            <button type="button" onClick={() => removeTag(t)} className="ml-1.5 text-danger font-bold hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cover Image Upload (drag/drop) & Featured Check */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Cover image uploader */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">COVER IMAGE</label>
                      <div className="flex items-center space-x-4">
                        {(newsImageUrl || newsImagePreview) && (
                          <img src={newsImagePreview || newsImageUrl} className="w-16 h-12 object-cover rounded shadow" alt="cover preview" />
                        )}
                        <label className="flex-1 border-2 border-dashed border-secondary/35 rounded-xl py-4 px-3 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/5 transition-all text-center">
                          <Upload className="w-5 h-5 text-secondary mb-1 shrink-0" />
                          <span className="text-xs font-semibold uppercase text-secondary tracking-wider">
                            {newsUploadLoading ? "Uploading..." : "SELECT FILE"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, "news")}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter image URL path manually"
                        value={newsImageUrl}
                        onChange={(e) => setNewsImageUrl(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 rounded bg-cream/35 border border-gray-200 text-xs text-primary focus:outline-none"
                      />
                    </div>

                    {/* Featured Checkbox toggle */}
                    <div className="space-y-4 pt-4 flex flex-col justify-center">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newsFeatured}
                          onChange={(e) => setNewsFeatured(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                        />
                        <span className="font-display tracking-widest text-sm uppercase text-primary font-bold">STAR FEATURED PRESS</span>
                      </label>
                      <p className="text-[10px] text-gray-500 font-light leading-snug">
                        ★ Featured posts are promoted to the first slide card on the homepage banner with full image coverage.
                      </p>
                    </div>

                  </div>

                  {/* Save submissions */}
                  <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => { resetNewsForm(); setActiveTab("news_list"); }}
                      className="px-5 py-2.5 rounded border border-gray-200 text-primary hover:bg-gray-100 font-display text-xs tracking-wider uppercase font-semibold"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={newsUploadLoading}
                      className="px-5 py-2.5 rounded bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase hover:brightness-105 shadow cursor-pointer disabled:opacity-40"
                    >
                      {editingNewsId ? "UPDATE PRESS ARTICLE" : "PUBLISH NEWS POST"}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 4. TAB: MATCH LIST */}
            {activeTab === "match_list" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="font-display text-4xl text-primary font-black uppercase">MATCHES & FIXTURES MANAGER</h1>
                    <p className="text-sm font-light text-gray-500">Plan OSFA League match calendars, update final scores, and upload video links.</p>
                  </div>
                  <button
                    onClick={() => { resetMatchForm(); setActiveTab("match_form"); }}
                    className="px-4 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow-sm hover:brightness-105 cursor-pointer"
                  >
                    + ADD MATCH
                  </button>
                </div>

                {/* Match Grid Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary text-secondary font-display text-xs tracking-widest uppercase border-b border-secondary/15">
                          <th className="p-4 md:px-6">CONTEST</th>
                          <th className="p-4 md:px-6">COMPETITION</th>
                          <th className="p-4 md:px-6">DATE</th>
                          <th className="p-4 md:px-6">STATUS</th>
                          <th className="p-4 md:px-6">SCORE</th>
                          <th className="p-4 md:px-6 text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-primary">
                        {matches.length > 0 ? (
                          matches.map((match) => (
                            <tr key={match._id} className="hover:bg-gray-50/50">
                              <td className="p-4 md:px-6 font-display uppercase tracking-widest text-sm font-bold">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </td>
                              <td className="p-4 md:px-6 font-mono text-xs">{match.competition}</td>
                              <td className="p-4 md:px-6 font-mono text-xs">{formatDate(match.matchDate, false)}</td>
                              <td className="p-4 md:px-6 font-mono text-xs">
                                <span className={`px-2 py-1 rounded font-semibold scale-90 inline-block text-[10px] uppercase tracking-wider ${
                                  match.status === "live" ? "bg-red-100 text-red-600 animate-pulse font-bold" :
                                  match.status === "completed" ? "bg-secondary/15 text-secondary font-bold" : "bg-gray-100 text-gray-500"
                                }`}>
                                  {match.status}
                                </span>
                              </td>
                              <td className="p-4 md:px-6 font-display font-medium text-center text-sm md:text-base">
                                {match.status === "upcoming" ? (
                                  <span className="text-gray-300 font-mono text-[10px] uppercase font-light">Fixture</span>
                                ) : (
                                  <span className="font-bold text-primary font-mono select-none">
                                    {match.homeScore ?? 0} — {match.awayScore ?? 0}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 md:px-6 text-center">
                                <div className="flex items-center justify-center space-x-2 shrink-0">
                                  <button
                                    onClick={() => initScoreUpdate(match)}
                                    className="px-2.5 py-1 text-[10px] uppercase bg-primary text-secondary tracking-widest font-bold font-display rounded hover:bg-primary-dark duration-150 cursor-pointer"
                                    title="Score Board"
                                  >
                                    Scores
                                  </button>
                                  <button
                                    onClick={() => initEditMatch(match)}
                                    className="p-1.5 rounded hover:bg-secondary/10 text-secondary/90 hover:text-secondary duration-150 cursor-pointer animate-fade-in"
                                    title="Edit Details"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMatch(match._id)}
                                    className="p-1.5 rounded hover:bg-danger/10 text-danger/80 hover:text-danger duration-150 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-light">No matches filed.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TAB: MATCH CREATE/EDIT FORM */}
            {activeTab === "match_form" && (
              <div className="space-y-6 animate-fade-in max-w-3xl">
                <button
                  onClick={() => setActiveTab("match_list")}
                  className="inline-flex items-center space-x-2 text-primary hover:text-secondary duration-150 font-display text-sm tracking-widest font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO FIXTURES GUIDE</span>
                </button>

                <div>
                  <h1 className="font-display text-4xl text-primary font-black uppercase">
                    {editingMatchId ? "MODIFY MATCH FIXTURE" : "SCHEDULE NEW MATCH FIXTURE"}
                  </h1>
                  <p className="text-sm font-light text-gray-500">Program rival team names, kickoff dates, arenas, and status codes.</p>
                </div>

                <form onSubmit={handleSaveMatch} className="space-y-6 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm text-sm text-primary">
                  {/* Home Team & Logo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-orange-50/5 text-primary border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">HOME TEAM NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dokkal Khairu FC"
                        value={homeTeamName}
                        onChange={(e) => setHomeTeamName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">HOME LOGO UPLOAD</label>
                      <div className="flex items-center space-x-3">
                        {homeTeamLogoUrl && (
                          <img src={homeTeamLogoUrl} className="w-10 h-10 object-contain rounded" alt="home logo" />
                        )}
                        <label className="flex-1 border-2 border-dashed border-secondary/20 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-secondary/5 text-xs text-secondary font-bold font-display tracking-widest select-none">
                          <Upload className="w-4 h-4 mr-1shrink-0" />
                          <span>CHOOSE FILE</span>
                          <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, "home")} className="hidden" />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter logo URL path"
                        value={homeTeamLogoUrl}
                        onChange={(e) => setHomeTeamLogoUrl(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded bg-cream/35 border border-gray-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Away Team & Logo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-orange-50/5 border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">AWAY OPPONENT NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Osun United"
                        value={awayTeamName}
                        onChange={(e) => setAwayTeamName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">AWAY LOGO UPLOAD</label>
                      <div className="flex items-center space-x-3">
                        {awayTeamLogoUrl && (
                          <img src={awayTeamLogoUrl} className="w-10 h-10 object-contain rounded" alt="away logo" />
                        )}
                        <label className="flex-1 border-2 border-dashed border-secondary/20 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-secondary/5 text-xs text-secondary font-bold font-display tracking-widest select-none">
                          <Upload className="w-4 h-4 mr-1 shrink-0" />
                          <span>CHOOSE FILE</span>
                          <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, "away")} className="hidden" />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter logo URL path"
                        value={awayTeamLogoUrl}
                        onChange={(e) => setAwayTeamLogoUrl(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded bg-cream/35 border border-gray-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date, Venue and Competition */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">KICKOFF DATE & TIME</label>
                      <input
                        type="datetime-local"
                        required
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">VENUE ARENA</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ife Grand Resort Pitch, Ilé-Ifẹ̀"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">COMPETITION / LEAGUE</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. OSFA League, Friendly"
                        value={competition}
                        onChange={(e) => setCompetition(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  {/* Status, Matchweek, Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">MATCH STATUS</label>
                      <select
                        value={matchStatus}
                        onChange={(e) => setMatchStatus(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 select-none cursor-pointer"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">🔴 Live</option>
                        <option value="completed">Completed (FT)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">MATCHWEEK</label>
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        value={matchweek}
                        onChange={(e) => setMatchweek(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">HIGHLIGHTS YOUTUBE LINK</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  {/* Submissions */}
                  <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => { resetMatchForm(); setActiveTab("match_list"); }}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-primary hover:bg-gray-100 font-display text-xs tracking-widest uppercase font-semibold rounded"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow hover:brightness-105 duration-150 cursor-pointer"
                    >
                      {editingMatchId ? "SAVE FIXTURE METRICS" : "SCHEDULE FIXTURE"}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 6. TAB: UPDATE SCORES SCOREBOARD */}
            {activeTab === "score_form" && scoreMatchId && (
              <div className="space-y-6 animate-fade-in max-w-2xl">
                <button
                  onClick={() => setActiveTab("match_list")}
                  className="inline-flex items-center space-x-2 text-primary hover:text-secondary duration-150 font-display text-sm tracking-widest font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO FIXTURES GUIDE</span>
                </button>

                <div>
                  <h1 className="font-display text-4xl text-primary font-black uppercase">PUBLISH CONTEST OUTCOME</h1>
                  <p className="text-sm font-light text-gray-500">Insert live score metrics and finalize game events status.</p>
                </div>

                <form onSubmit={handleSaveScores} className="space-y-6 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm text-sm text-primary">
                  
                  {/* Scores Inputs row */}
                  <div className="p-6 bg-primary-dark rounded-xl text-center space-y-4">
                    <span className="text-[10px] font-mono text-secondary font-black tracking-widest uppercase block">SCORE METRIC BOARD</span>
                    
                    <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                      {/* Home Score */}
                      <div className="space-y-2">
                        <span className="text-xs text-cream/70 font-display uppercase tracking-widest block font-bold">HOME TEAM GOALS</span>
                        <input
                          type="number"
                          min={0}
                          value={scoreHome}
                          onChange={(e) => setScoreHome(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-20 text-center font-display text-4xl h-16 bg-cream border border-secondary text-primary-dark rounded-xl select-none"
                        />
                      </div>

                      {/* separator */}
                      <span className="text-secondary font-bold text-3xl mt-6 font-display select-none">—</span>

                      {/* Away Score */}
                      <div className="space-y-2">
                        <span className="text-xs text-cream/70 font-display uppercase tracking-widest block font-bold">AWAY TEAM GOALS</span>
                        <input
                          type="number"
                          min={0}
                          value={scoreAway}
                          onChange={(e) => setScoreAway(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-20 text-center font-display text-4xl h-16 bg-cream border border-secondary text-primary-dark rounded-xl select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status & Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">SET GAME STATE</label>
                      <select
                        value={scoreStatus}
                        onChange={(e) => setScoreStatus(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 select-none cursor-pointer"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">🔴 Live Now</option>
                        <option value="completed">Completed (FT)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-widest text-[#111111]/60 uppercase block">HIGHLIGHTS YOUTUBE LINK</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={scoreHighlights}
                        onChange={(e) => setScoreHighlights(e.target.value)}
                        className="w-full px-4 py-2.5 rounded bg-cream/35 border border-gray-200 focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  {/* Submissions */}
                  <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => { setScoreMatchId(null); setActiveTab("match_list"); }}
                      className="px-5 py-2.5 rounded bg-white border border-gray-200 text-primary hover:bg-gray-100 font-display text-xs tracking-widest uppercase font-semibold"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow hover:brightness-105 duration-150 cursor-pointer text-center"
                    >
                      PUBLISH OUTCOME ➔
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 7. TAB: SQUAD ROSTER */}
            {activeTab === "players" && (
              <AdminPlayers triggerToast={triggerToast} />
            )}

            {/* 8. TAB: CLUB GALLERY */}
            {activeTab === "gallery" && (
              <AdminGallery triggerToast={triggerToast} />
            )}

          </>
        )}

      </main>
    </div>
  );
}
