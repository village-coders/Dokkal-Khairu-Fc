import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import defaultBanner from '../assets/images/next-match-banner.jpeg';

interface NextMatchCountdownProps {
  upcomingMatch: Match | null;
  loading: boolean;
}

const NextMatchCountdown: React.FC<NextMatchCountdownProps> = ({ upcomingMatch, loading }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!upcomingMatch) return;

    const timer = setInterval(() => {
      const difference = +new Date(upcomingMatch.matchDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingMatch]);

  if (loading && !upcomingMatch) {
    return (
      <section className="bg-primary-dark py-8 sm:py-12 px-3 sm:px-6 lg:px-8 border-b border-secondary/10 relative">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10 animate-pulse">
          <div className="text-left space-y-1 sm:space-y-2">
            <div className="w-64 h-8 sm:h-10 bg-secondary/20 rounded"></div>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 border border-white/5"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6) sm:var(--space-8)'
            }}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-6 bg-white/10 rounded"></div>
                <div className="w-48 h-4 bg-white/10 rounded"></div>
              </div>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-[70px] h-[70px] rounded-full bg-white/10 mb-2"></div>
                  <div className="w-24 h-4 bg-white/10 rounded"></div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-[70px] h-[70px] rounded-full bg-white/10 mb-2"></div>
                  <div className="w-24 h-4 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:h-20 bg-white/10 rounded-md"></div>
                    <div className="w-10 h-3 bg-white/10 rounded mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-white/10" style={{ minHeight: '300px' }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (!upcomingMatch) return null;

  const match = upcomingMatch;
  const isDokkalHome = match.homeTeam?.name?.toLowerCase().includes('dokkal');
  const opponentName = isDokkalHome ? match.awayTeam?.name : match.homeTeam?.name;

  const formattedDate = new Date(match.matchDate).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="bg-primary-dark py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-secondary/10 relative overflow-hidden">
      {/* Subtle ambient background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Component Title */}
        <div className="text-left space-y-2 mb-10 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-black uppercase tracking-wide">
            NEXT MATCH
          </h2>
          <div className="w-16 h-1 bg-secondary rounded" />
        </div>

        {/* Main Countdown Card */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row relative">
          
          {/* Subtle Card Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-transparent pointer-events-none z-0" />

          {/* Left Side - Details & Countdown (z-10 to stay above overlay) */}
          <div className="w-full lg:w-3/5 p-6 sm:p-10 flex flex-col justify-center space-y-8 z-10 relative">
            
            {/* Top Info Bar */}
            <div className="text-center sm:text-left">
              <div className="inline-block px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-md">
                <span className="font-condensed text-secondary font-bold tracking-widest text-sm uppercase">
                  {match.competition}
                </span>
              </div>
              <p className="mt-3 font-body text-cream/60 text-sm sm:text-base">
                Matchweek {match.matchweek || 'TBD'} • 2026 Season
              </p>
            </div>

            {/* Teams VS Board */}
            <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full py-4">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1 max-w-[120px]">
                {match.homeTeam?.logo?.url ? (
                  <img src={match.homeTeam.logo.url} alt={match.homeTeam.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md mb-3" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/80 flex items-center justify-center border-2 border-white/20 shadow-lg mb-3">
                    <span className="font-display text-xl text-white font-bold">DK</span>
                  </div>
                )}
                <span className="font-display text-base sm:text-lg text-white text-center leading-tight">
                  {match.homeTeam?.name}
                </span>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center px-2">
                <span className="font-display text-3xl sm:text-4xl text-secondary opacity-90 drop-shadow-lg">VS</span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1 max-w-[120px]">
                {match.awayTeam?.logo?.url ? (
                  <img src={match.awayTeam.logo.url} alt={match.awayTeam.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md mb-3" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 mb-3">
                    <span className="font-display text-xl text-cream/50 font-bold">
                      {opponentName ? opponentName.substring(0, 2).toUpperCase() : 'OP'}
                    </span>
                  </div>
                )}
                <span className="font-display text-base sm:text-lg text-white text-center leading-tight">
                  {match.awayTeam?.name}
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex justify-center sm:justify-start gap-3 sm:gap-5 flex-wrap">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-black/50 border border-white/10 rounded-xl shadow-inner backdrop-blur-sm">
                  <span className="font-display text-3xl sm:text-4xl text-secondary drop-shadow">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                </div>
                <span className="font-condensed text-xs text-cream/50 mt-2 tracking-widest">DAYS</span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-black/50 border border-white/10 rounded-xl shadow-inner backdrop-blur-sm">
                  <span className="font-display text-3xl sm:text-4xl text-white drop-shadow">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                </div>
                <span className="font-condensed text-xs text-cream/50 mt-2 tracking-widest">HOURS</span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-black/50 border border-white/10 rounded-xl shadow-inner backdrop-blur-sm">
                  <span className="font-display text-3xl sm:text-4xl text-white drop-shadow">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                </div>
                <span className="font-condensed text-xs text-cream/50 mt-2 tracking-widest">MINS</span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-black/50 border border-secondary/30 rounded-xl shadow-[inset_0_0_15px_rgba(212,160,23,0.1)] backdrop-blur-sm">
                  <span className="font-display text-3xl sm:text-4xl text-green-400 drop-shadow animate-pulse-live">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                <span className="font-condensed text-xs text-cream/50 mt-2 tracking-widest">SECS</span>
              </div>
            </div>

            {/* Venue Details */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm text-cream/60">VENUE</p>
                  <p className="font-body text-base text-white">{match.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="sm:hidden p-2 bg-secondary/10 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm text-cream/60 sm:text-right text-left">KICKOFF</p>
                  <p className="font-body text-base text-white sm:text-right text-left">{formattedDate}</p>
                </div>
                 <div className="hidden sm:block p-2 bg-secondary/10 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Banner Image / Stadium Background */}
          <div className="w-full lg:w-2/5 min-h-[300px] lg:min-h-full relative overflow-hidden bg-primary">
            {/* The image is conditionally set to the match banner or a default gradient/image */}
            {match.countdownBanner ? (
               <img 
                 src={match.countdownBanner} 
                 alt="Match Banner" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                 referrerPolicy="no-referrer"
               />
            ) : (
               <img 
                 src={defaultBanner} 
                 alt="Match Banner Default" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                 referrerPolicy="no-referrer"
               />
            )}
            {/* Dark gradient overlay blending the image into the left card edge on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary-dark/90 lg:from-primary-dark via-primary-dark/40 lg:via-primary-dark/40 to-transparent" />
            
            {/* Decorative Label */}
            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg pointer-events-none hidden sm:block">
              <span className="font-display text-sm text-secondary uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Matchday Live
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NextMatchCountdown;