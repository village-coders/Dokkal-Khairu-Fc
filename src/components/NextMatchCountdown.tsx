import React, { useState, useEffect } from 'react';
import { Match } from '../types';

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
    <section className="bg-primary-dark py-8 sm:py-12 px-3 sm:px-6 lg:px-8 border-b border-secondary/10 relative">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Component Title */}
        <div className="text-left space-y-1 sm:space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-black uppercase tracking-wide">
            NEXT MATCH COUNTDOWN
          </h2>
          <div className="w-12 sm:w-16 h-1 bg-secondary rounded" />
        </div>

        {/* 50/50 Split Layout */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6) sm:var(--space-8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Left Side - Countdown */}
          <div className="space-y-4 sm:space-y-6">
            {/* Top Info Bar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="font-condensed" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gold)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)' }}>
                  {match.competition}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                  Matchweek {match.matchweek || 'TBD'} • 2026 Season
                </span>
              </div>
            </div>

            {/* Teams vs Board */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                width: '100%',
                gap: 'var(--space-4)'
              }}
            >
              {/* Team 1 (Dokkal Khairu) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '100px' }}>
                <div 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-green)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--color-gold)',
                    border: '3px solid var(--color-gold)',
                    boxShadow: 'var(--shadow-gold)',
                    marginBottom: 'var(--space-2)'
                  }}
                >
                  DK
                </div>
                <span className="font-display" style={{ fontSize: 'var(--text-base)', color: 'white', textAlign: 'center', lineHeight: '1.2' }}>
                  {match.homeTeam?.name}
                </span>
              </div>

              {/* VS Divider */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-display" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gold)', opacity: 0.8 }}>VS</span>
              </div>

              {/* Team 2 (Opponent) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '100px' }}>
                <div 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--color-text-muted)',
                    border: '3px solid var(--color-mid-grey)',
                    marginBottom: 'var(--space-2)'
                  }}
                >
                  {opponentName ? opponentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'OP'}
                </div>
                <span className="font-display" style={{ fontSize: 'var(--text-base)', color: 'white', textAlign: 'center', lineHeight: '1.2' }}>
                  {match.awayTeam?.name}
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3) sm:var(--space-4)', flexWrap: 'wrap' }}>
              
              {/* Days */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div 
                  className="font-display" 
                  style={{ 
                    fontSize: 'var(--text-3xl) sm:var(--text-4xl)', 
                    color: 'var(--color-gold)', 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: 'var(--space-2) sm:var(--space-3) var(--space-3) sm:var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    minWidth: '60px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-inset)',
                    lineHeight: '1'
                  }}
                >
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', letterSpacing: 'var(--tracking-wide)' }}>
                  DAYS
                </span>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div 
                  className="font-display" 
                  style={{ 
                    fontSize: 'var(--text-3xl) sm:var(--text-4xl)', 
                    color: 'var(--color-white)', 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: 'var(--space-2) sm:var(--space-3) var(--space-3) sm:var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    minWidth: '60px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-inset)',
                    lineHeight: '1'
                  }}
                >
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', letterSpacing: 'var(--tracking-wide)' }}>
                  HOURS
                </span>
              </div>

              {/* Minutes */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div 
                  className="font-display" 
                  style={{ 
                    fontSize: 'var(--text-3xl) sm:var(--text-4xl)', 
                    color: 'var(--color-white)', 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: 'var(--space-2) sm:var(--space-3) var(--space-3) sm:var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    minWidth: '60px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-inset)',
                    lineHeight: '1'
                  }}
                >
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', letterSpacing: 'var(--tracking-wide)' }}>
                  MINS
                </span>
              </div>

              {/* Seconds */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div 
                  className="font-display animate-pulse-live" 
                  style={{ 
                    fontSize: 'var(--text-3xl) sm:var(--text-4xl)', 
                    color: 'var(--color-green-light)', 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: 'var(--space-2) sm:var(--space-3) var(--space-3) sm:var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    minWidth: '60px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-inset)',
                    lineHeight: '1'
                  }}
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', letterSpacing: 'var(--tracking-wide)' }}>
                  SECS
                </span>
              </div>

            </div>

            {/* Venue & Action Details */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 <strong>Venue:</strong> {match.venue}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                Kickoff Date: {formattedDate}
              </span>
            </div>
          </div>

          {/* Right Side - Banner Image */}
          {console.log(match.countdownBanner)}
          <div 
            className="relative overflow-hidden rounded-lg"
            style={{
              minHeight: '300px',
              backgroundImage: match.countdownBanner 
                ? `url('${match.countdownBanner}')` 
                : 'linear-gradient(135deg, rgba(11, 67, 147, 0.3) 0%, rgba(229, 26, 36, 0.2) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay for better text readability if needed */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
              }}
            />
            
            {/* Optional: Add a label or overlay text */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-primary-dark/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-secondary/20 inline-block">
                <p className="font-display text-xs sm:text-sm text-secondary uppercase tracking-wider font-bold">
                  Countdown To Kickoff
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default NextMatchCountdown;