import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Match } from "../types";
import { api } from "../lib/api";
import { formatDate } from "../lib/utils";
import { Shield, Play, MapPin, Calendar, Trophy, Zap, AlertCircle } from "lucide-react";

export default function MatchesView() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "all">("upcoming");

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      setError(false);
      try {
        const data = await api.getMatches();
        setMatches(data);
      } catch (err) {
        console.error("Failed to load matches list", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const getFilteredMatches = () => {
    if (activeTab === "all") return matches;
    return matches.filter((m) => m.status === activeTab);
  };

  const displayedMatches = getFilteredMatches();

  // If match status is upcoming, we want to sort ascending (closest to now first).
  // If match is completed, we want to sort descending (newest completed first).
  const sortedMatches = [...displayedMatches].sort((a, b) => {
    const timeA = new Date(a.matchDate).getTime();
    const timeB = new Date(b.matchDate).getTime();
    if (activeTab === "upcoming") {
      return timeA - timeB; // Ascending
    } else {
      return timeB - timeA; // Descending
    }
  });

  const renderTeamLogo = (logoUrl: string, name: string) => {
    if (logoUrl) {
      return (
        <img 
          referrerPolicy="no-referrer"
          src={logoUrl} 
          alt={name} 
          className="w-16 h-16 object-contain justify-center shrink-0 drop-shadow" 
        />
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-primary-dark/80 flex items-center justify-center border border-secondary/20 text-secondary shrink-0 shadow-sm">
        <Shield className="w-8 h-8" />
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Fixtures & Results | Dokkal Khairu FC</title>
        <meta name="description" content="View upcoming fixtures and recent match results for the Khairu Boys." />
      </Helmet>
    <div className="bg-cream min-h-screen py-8 sm:py-12 px-3 sm:px-6 lg:px-8 mt-16 animate-fade-in text-left">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        
        {/* Page Title Block */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-2">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-black uppercase leading-tight">
            MATCH FIXTURES & RESULTS
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-md mx-auto px-2">
            Stay in sync with league standings, match weeks, and results representing Dokkal Khairu Football Club in the OSFA campaigns.
          </p>
          <div className="w-12 sm:w-16 h-1 bg-secondary mx-auto rounded" />
        </div>

        {/* Segment Tabs Controller */}
        <div className="flex border-b border-secondary/15 pb-px w-full max-w-md mx-auto px-2">
          {(["upcoming", "completed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 sm:py-3 text-center font-display text-[10px] sm:text-xs md:text-sm tracking-widest font-bold border-b-2 transition-all cursor-pointer uppercase ${
                activeTab === tab
                  ? "border-secondary text-secondary font-black"
                  : "border-transparent text-gray-500 hover:text-primary hover:border-gray-300"
              }`}
            >
              {tab === "upcoming" ? "Fixtures" : tab === "completed" ? "Results" : "All matches"}
            </button>
          ))}
        </div>

        {/* Content Arena */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-card w-full rounded-2xl h-[230px] animate-pulse border border-secondary/10" />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center border border-dashed border-danger/25 rounded-2xl bg-danger/5 text-danger">
            <p className="font-semibold text-lg">⚽ Oops! Failed to fetch match registries from the stadium core database.</p>
            <p className="text-sm font-light mt-1">Please try reloading or check back in a moment.</p>
          </div>
        ) : sortedMatches.length > 0 ? (
          <div className="space-y-6">
            {sortedMatches.map((match) => {
              const hs = match.homeScore;
              const as = match.awayScore;
              const isLive = match.status === "live";
              const isFinished = match.status === "completed";
              
              const isHomeWinner = isFinished && hs !== null && as !== null && hs > as;
              const isAwayWinner = isFinished && hs !== null && as !== null && as > hs;

              return (
                <div
                  key={match._id}
                  className={`bg-card rounded-2xl p-6 md:p-8 flex flex-col justify-between border relative overflow-hidden transition-all duration-300 shadow-card hover:shadow-hover text-cream ${
                    isLive 
                      ? "border-secondary shadow-glow animate-pulse-slow ring-1 ring-secondary/50" 
                      : "border-secondary/10 hover:border-secondary/30"
                  }`}
                >
                  {/* Subtle top indicator for live fixtures */}
                  {isLive && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600 animate-pulse overflow-hidden" />
                  )}

                  {/* Top card strip: competition and status badge */}
                  <div className="flex items-center justify-between border-b border-cream/5 pb-4 text-xs font-mono">
                    <span className="text-secondary font-bold flex items-center tracking-wider">
                      <Trophy className="w-4 h-4 mr-1.5 text-secondary" />
                      {match.competition.toUpperCase()}
                      {match.matchweek && (
                        <span className="text-cream/50 ml-2 font-light">| WEEK {match.matchweek}</span>
                      )}
                    </span>
                    
                    {/* Status Badge */}
                    {isLive ? (
                      <span className="flex items-center space-x-1.5 bg-red-600/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>LIVE NOW</span>
                      </span>
                    ) : isFinished ? (
                      <span className="bg-secondary/15 text-secondary border border-secondary/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        FULL TIME (FT)
                      </span>
                    ) : (
                      <span className="bg-[#172f22] text-[#5cb85c] border border-success/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        UPCOMING LIST
                      </span>
                    )}
                  </div>

                  {/* Core Matchup Section */}
                  <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center py-4 sm:py-6">
                    
                    {/* Home Team Side */}
                    <div className="col-span-12 md:col-span-5 flex md:flex-row flex-col items-center gap-3 sm:gap-4 text-center md:text-right md:justify-end">
                      <div className="order-2 md:order-1 space-y-1">
                        <span className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide uppercase font-semibold leading-tight block text-primary">
                          {match.homeTeam.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-primary font-mono tracking-widest block uppercase">HOME SIDE</span>
                      </div>
                      <div className="shrink-0 order-1 md:order-2">
                        {renderTeamLogo(match.homeTeam.logo?.url, match.homeTeam.name)}
                      </div>
                    </div>

                    {/* SCORE BOARD OR VS INDICATOR (Center) */}
                    <div className="col-span-12 md:col-span-2 py-3 sm:py-4 md:py-0 text-center flex flex-col justify-center items-center">
                       {isFinished || isLive ? (
                         <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight flex items-center justify-center space-x-3 sm:space-x-4 select-none">
                           <span className={isHomeWinner ? "text-secondary" : "text-primary"}>
                             {match.homeScore ?? 0}
                           </span>
                           <span className="text-secondary font-light text-xl sm:text-2xl md:text-3xl">—</span>
                           <span className={isAwayWinner ? "text-secondary" : "text-primary"}>
                             {match.awayScore ?? 0}
                           </span>
                         </div>
                       ) : (
                        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-primary-dark/80 text-secondary border border-secondary/15 shadow font-display text-base sm:text-lg tracking-widest font-black select-none">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team Side */}
                    <div className="col-span-12 md:col-span-5 flex md:flex-row flex-col items-center gap-3 sm:gap-4 text-center md:text-left justify-start">
                      <div className="shrink-0">
                        {renderTeamLogo(match.awayTeam.logo?.url, match.awayTeam.name)}
                      </div>
                      <div className="space-y-1">
                        <span className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide uppercase font-semibold leading-tight block text-primary">
                          {match.awayTeam.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-primary font-mono tracking-widest block uppercase">AWAY OPPONENT</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom section: date, venue details & highlight links */}
                  <div className="border-t border-cream/5 pt-3 sm:pt-4 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-cream/60">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left w-full md:w-auto">
                      <span className="flex items-center text-secondary font-semibold">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0" />
                        {formatDate(match.matchDate, true)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0 text-secondary" />
                        {match.venue}
                      </span>
                    </div>

                    {/* Video highlights trigger */}
                    {isFinished && match.highlights && (
                      <a
                        href={match.highlights}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-red-600/15 border border-red-500/20 rounded-lg text-red-400 text-[9px] sm:text-[10px] hover:bg-red-600/30 transition-all cursor-pointer font-bold shrink-0 self-center uppercase tracking-wider"
                      >
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                        <span>VIDEO HIGHLIGHTS</span>
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center border border-dashed border-secondary/15 rounded-2xl bg-card space-y-4 text-cream max-w-xl mx-auto">
            <AlertCircle className="w-12 h-12 mx-auto text-secondary/50 animate-pulse" />
            <div className="space-y-1">
              <h3 className="font-display text-2xl text-secondary uppercase font-bold">No matches cataloged</h3>
              <p className="text-cream/60 font-light text-sm max-w-xs mx-auto">
                No soccer contests matching status "{activeTab}" are currently loaded onto the schedule.
              </p>
            </div>
            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="px-5 py-2 bg-secondary text-primary-dark font-display text-xs tracking-wider uppercase rounded font-bold hover:brightness-110 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}

      </div>
    </div>
    </>
  );
}
