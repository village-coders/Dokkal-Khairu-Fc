import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Match } from "../types";
import { formatDate } from "../lib/utils";
import { Shield, Play, Calendar, Trophy } from "lucide-react";

interface RecentResultsProps {
  matches: Match[];
}

export default function RecentResults({ matches }: RecentResultsProps) {
  const navigate = useNavigate();
  // Grab up to 3 completed matches
  // Grab up to 3 completed matches
  const completedList = matches
    .filter((m) => m.status === "completed")
    .slice(0, 3);

  // Fallback vector shields
  const renderTeamLogo = (logoUrl: string, name: string) => {
    if (logoUrl) {
      return (
        <img 
          referrerPolicy="no-referrer"
          src={logoUrl} 
          alt={name} 
          className="w-12 h-12 object-contain mx-auto" 
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center border border-secondary/20 text-secondary mx-auto">
        <Shield className="w-6 h-6" />
      </div>
    );
  };

  return (
    <section className="bg-primary py-16 px-4 sm:px-6 lg:px-8 border-b border-secondary/15 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#1e2d25_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-10 relative">
        {/* Title Group */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-secondary/20 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl text-white font-black uppercase tracking-wide">
              RECENT RESULTS
            </h2>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
          <Link
            to="/matches"
            className="flex items-center space-x-2 text-sm font-display font-bold tracking-widest uppercase text-secondary hover:text-primary-dark transition-colors cursor-pointer group"
          >
            <span>VIEW MATCH CENTER</span>
            <span className="group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </div>

        {/* 3-Column horizontal cards */}
        {completedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedList.map((match) => {
              const homeScore = match.homeScore ?? 0;
              const awayScore = match.awayScore ?? 0;
              const isHomeWinner = homeScore > awayScore;
              const isAwayWinner = awayScore > homeScore;

              return (
                <div
                  key={match._id}
                  onClick={() => navigate('/matches')}
                  className="bg-card border border-secondary/10 hover:border-secondary/30 rounded-xl p-6 text-center space-y-4 flex flex-col justify-between transition-all duration-300 shadow-card hover:shadow-hover cursor-pointer text-cream group relative overflow-hidden"
                >
                  {/* Subtle top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary/20 group-hover:bg-secondary/60 duration-300" />
                  
                  {/* Competition + Week info */}
                  <div className="text-[10px] font-mono tracking-widest text-secondary flex items-center justify-center space-x-2">
                    <span className="uppercase font-bold">{match.competition}</span>
                    <span>•</span>
                    <span className="bg-secondary/15 px-1.5 py-0.5 rounded text-[9px] text-secondary font-black">FT</span>
                  </div>

                  {/* Match Matchup Board */}
                  <div className="grid grid-cols-12 items-center gap-2 py-4">
                    
                    {/* Home Side */}
                    <div className="col-span-4 space-y-2">
                      {renderTeamLogo(match.homeTeam.logo?.url, match.homeTeam.name)}
                      <p className="font-display text-xs sm:text-sm tracking-wider uppercase font-semibold truncate leading-tight">
                        {match.homeTeam.name}
                      </p>
                    </div>

                    {/* Scores Display */}
                    <div className="col-span-4">
                      <div className="font-display text-4xl sm:text-5xl font-black tracking-tighter flex items-center justify-center space-x-2">
                        <span className={isHomeWinner ? "text-secondary font-extrabold" : "text-white/90"}>
                          {homeScore}
                        </span>
                        <span className="text-cream/30 text-2xl font-light">—</span>
                        <span className={isAwayWinner ? "text-secondary font-extrabold" : "text-white/90"}>
                          {awayScore}
                        </span>
                      </div>
                    </div>

                    {/* Away Side */}
                    <div className="col-span-4 space-y-2">
                      {renderTeamLogo(match.awayTeam.logo?.url, match.awayTeam.name)}
                      <p className="font-display text-xs sm:text-sm tracking-wider uppercase font-semibold truncate leading-tight">
                        {match.awayTeam.name}
                      </p>
                    </div>

                  </div>

                  {/* Location and Date details */}
                  <div className="pt-3 border-t border-cream/5 text-[10px] text-cream/50 space-y-1">
                    <p className="font-mono">{formatDate(match.matchDate, false)}</p>
                    <p className="truncate font-light text-cream/40">{match.venue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center rounded-xl border border-secondary/10 bg-card/40 text-cream/60 font-light">
            <p>⚽ No recent match results recorded in the archive.</p>
          </div>
        )}

      </div>
    </section>
  );
}
