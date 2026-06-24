import { Link, useNavigate } from "react-router-dom";

import { Match } from "../types";
import { formatDate } from "../lib/utils";
import { Calendar, MapPin, Shield } from "lucide-react";

interface UpcomingMatchesProps {
  matches: Match[];
  loading?: boolean;
}

export default function UpcomingMatches({ matches, loading = false }: UpcomingMatchesProps) {
  const navigate = useNavigate();
  // Grab up to 3 upcoming matches
  // Grab up to 3 upcoming matches
  const upcomingList = matches
    .filter((m) => m.status === "upcoming")
    .slice(0, 3);

  // Custom fallback vector shield
  const renderTeamLogo = (logoUrl: string, name: string) => {
    if (logoUrl) {
      return (
        <img 
          referrerPolicy="no-referrer"
          src={logoUrl} 
          alt={name} 
          className="w-10 h-10 object-contain justify-center animate-fade-in" 
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center border border-secondary/30 text-secondary">
        <Shield className="w-5 h-5" />
      </div>
    );
  };

  return (
    <section className="bg-primary-dark py-16 px-4 sm:px-6 lg:px-8 relative border-b border-secondary/10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-secondary pl-4">
          <div className="text-left">
            <h2 className="font-display text-4xl sm:text-5xl text-white font-semibold uppercase tracking-wider">
              UPCOMING FIXTURES
            </h2>
            <p className="text-xs text-cream/60 font-mono tracking-widest mt-1">
              SUPPORT THE KHAIRU BOYS IN THEIR NEXT MAJOR CONTESTS
            </p>
          </div>
          <Link
            to="/matches"
            className="flex items-center space-x-2 text-sm font-display font-bold tracking-widest uppercase text-secondary hover:text-white transition-colors cursor-pointer group"
          >
            <span>VIEW ALL FIXTURES</span>
            <span className="group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </div>

        {/* Matches Horizontal Grid */}
        {loading ? (
          <div className="flex flex-col space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-secondary/15 rounded-xl p-6 h-28 flex">
              </div>
            ))}
          </div>
        ) : upcomingList.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {upcomingList.map((match) => (
              <div
                key={match._id}
                className="bg-card border border-secondary/15 hover:border-secondary/35 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-250 cursor-pointer text-cream shadow-card hover:shadow-hover"
                onClick={() => navigate('/matches')}
              >
                {/* Competition Badge & Week (Left Column) */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 md:w-1/4">
                  <span className="px-3 py-1 rounded bg-secondary text-primary-dark font-display font-bold text-xs tracking-wider uppercase">
                    {match.competition}
                  </span>
                  {match.matchweek && (
                    <span className="text-[10px] text-cream/50 uppercase font-mono tracking-widest">
                      Matchweek {match.matchweek}
                    </span>
                  )}
                </div>

                {/* Matchup Teams Banner (Center Column - 60% Width) */}
                <div className="flex items-center justify-between w-full md:w-2/4 gap-4 px-2">
                  
                  {/* Home Team */}
                  <div className="flex items-center space-x-3 w-5/12 justify-end text-right">
                    <span className="font-display text-sm sm:text-base md:text-lg tracking-wider font-semibold truncate uppercase">{match.homeTeam.name}</span>
                    <div className="shrink-0">
                      {renderTeamLogo(match.homeTeam.logo?.url, match.homeTeam.name)}
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="w-2/12 flex flex-col items-center shrink-0">
                    <span className="font-display text-sm px-3 py-1 rounded bg-primary-dark text-secondary font-black border border-secondary/20 shadow-md">
                      VS
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-3 w-5/12 text-left">
                    <div className="shrink-0">
                      {renderTeamLogo(match.awayTeam.logo?.url, match.awayTeam.name)}
                    </div>
                    <span className="font-display text-sm sm:text-base md:text-lg tracking-wider font-semibold truncate uppercase">{match.awayTeam.name}</span>
                  </div>

                </div>

                {/* Venue & Date Details (Right Column) */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1.5 md:w-1/4 shrink-0 text-cream/80 text-xs">
                  <span className="font-mono text-secondary tracking-widest flex items-center font-semibold">
                    <Calendar className="w-4 h-4 mr-1.5 shrink-0" />
                    {formatDate(match.matchDate, true)}
                  </span>
                  <span className="tracking-wide text-cream/60 flex items-center font-light">
                    <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-secondary" />
                    {match.venue}
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-xl border border-secondary/10 bg-card/40 text-cream/60 font-light">
            <p>⚽ No upcoming fixtures scheduled currently. Stay tuned for details.</p>
          </div>
        )}

      </div>
    </section>
  );
}
