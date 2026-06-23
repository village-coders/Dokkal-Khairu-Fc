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
      <div style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading Match Details...</p>
      </div>
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
    <section className="bg-primary-dark py-16 px-4 sm:px-6 lg:px-8 border-b border-secondary/10 relative">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Component Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-secondary/20 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl text-white font-black uppercase tracking-wide">
              NEXT MATCH COUNTDOWN
            </h2>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
        </div>

        {/* Outer Box */}
        <div 
          className="glass-panel glass-panel--gold"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8) var(--space-6)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-8)',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
          }}
        >
          {/* Top Info Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)', textAlign: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="font-condensed" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gold)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)' }}>
                {match.competition}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                Matchweek {match.matchweek} &bull; 2026 Season
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
              maxWidth: '800px', 
              margin: '0 auto',
              flexWrap: 'wrap',
              gap: 'var(--space-6)'
            }}
          >
            {/* Team 1 (Dokkal Khairu) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '150px' }}>
              <div 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-green)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--color-gold)',
                  border: '3px solid var(--color-gold)',
                  boxShadow: 'var(--shadow-gold)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                DK
              </div>
              <span className="font-display" style={{ fontSize: 'var(--text-lg)', color: 'white', textAlign: 'center' }}>
                {match.homeTeam?.name}
              </span>
            </div>

            {/* VS Divider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gold)', opacity: 0.8 }}>VS</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)', opacity: 0.3, marginTop: '5px' }}></div>
            </div>

            {/* Team 2 (Opponent) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '150px' }}>
              <div 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--color-text-muted)',
                  border: '3px solid var(--color-mid-grey)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                {opponentName ? opponentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'OP'}
              </div>
              <span className="font-display" style={{ fontSize: 'var(--text-lg)', color: 'white', textAlign: 'center' }}>
                {match.awayTeam?.name}
              </span>
            </div>
          </div>

          {/* Countdown Clock (styled like score clock) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            
            {/* Days */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
              <div 
                className="font-display" 
                style={{ 
                  fontSize: 'var(--text-4xl)', 
                  color: 'var(--color-gold)', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  minWidth: '70px',
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
              <div 
                className="font-display" 
                style={{ 
                  fontSize: 'var(--text-4xl)', 
                  color: 'var(--color-white)', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  minWidth: '70px',
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
              <div 
                className="font-display" 
                style={{ 
                  fontSize: 'var(--text-4xl)', 
                  color: 'var(--color-white)', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  minWidth: '70px',
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
              <div 
                className="font-display animate-pulse-live" 
                style={{ 
                  fontSize: 'var(--text-4xl)', 
                  color: 'var(--color-green-light)', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  minWidth: '70px',
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 <strong>Venue:</strong> {match.venue}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
              Kickoff Date: {formattedDate}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default NextMatchCountdown;
