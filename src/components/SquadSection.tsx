import React, { useState } from 'react';
import { Player } from '../types';

interface SquadSectionProps {
  players: Player[];
}

const SquadSection: React.FC<SquadSectionProps> = ({ players = [] }) => {
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'];

  const filteredPlayers = filter === 'ALL' 
    ? players 
    : players.filter(player => player.position.toUpperCase() === filter);

  return (
    <section className="bg-primary py-16 px-4 sm:px-6 lg:px-8 border-b border-secondary/15 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#1e2d25_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-10 relative">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-secondary/20 pb-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl text-white font-black uppercase tracking-wide">
              MEET THE SQUAD
            </h2>
            <div className="w-16 h-1 bg-secondary rounded" />
          </div>
        </div>

        {/* Filters */}
        <div 
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            borderBottom: '1px solid var(--color-mid-grey)',
            paddingBottom: 'var(--space-4)'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                fontFamily: 'var(--font-condensed)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: filter === cat ? 'var(--color-gold)' : 'var(--color-text-muted)',
                backgroundColor: filter === cat ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                border: filter === cat ? '1px solid var(--color-gold)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {cat === 'ALL' ? 'ALL PLAYERS' : cat + 'S'}
            </button>
          ))}
        </div>

        {/* Players Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filteredPlayers.length > 0 ? filteredPlayers.slice(0, 4).map((player) => (
            <div key={player._id} className="player-card">
              
              {/* Jersey Number Background watermark */}
              <div className="player-card__number">
                #{player.number}
              </div>

              {/* Image Container / Styled Silhouette Placeholder */}
              <div className="player-card__img-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {player.imageUrl ? (
                  <img 
                    referrerPolicy="no-referrer"
                    src={player.imageUrl} 
                    alt={player.name} 
                    className="player-card__img" 
                  />
                ) : (
                  /* Stylized Vector Player Silhouette / Shirt */
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle at center, rgba(11, 110, 42, 0.2) 0%, rgba(10, 10, 10, 0) 70%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Abstract jersey frame */}
                    <svg 
                      width="100" 
                      height="120" 
                      viewBox="0 0 100 100" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ opacity: 0.25 }}
                    >
                      <path d="M20 30L35 15L50 25L65 15L80 30V85H20V30Z" fill="var(--color-green)" stroke="var(--color-gold)" strokeWidth="2" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="3 3"/>
                      <text x="50" y="58" textAnchor="middle" fill="var(--color-gold)" fontFamily="var(--font-display)" fontSize="20px" fontWeight="bold">
                        {player.number}
                      </text>
                    </svg>
                    <span 
                      style={{ 
                        position: 'absolute', 
                        bottom: '30%', 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-text-dim)', 
                        fontFamily: 'var(--font-condensed)', 
                        letterSpacing: 'var(--tracking-widest)' 
                      }}
                    >
                      PHOTO PENDING
                    </span>
                  </div>
                )}
              </div>

              {/* Card Info Overlay */}
              <div className="player-card__overlay">
                <span 
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gold)',
                    fontWeight: 700,
                    letterSpacing: 'var(--tracking-wider)',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  {player.position}
                </span>
                <h3 
                  className="font-display" 
                  style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-white)',
                    letterSpacing: 'var(--tracking-normal)',
                    marginBottom: '2px'
                  }}
                >
                  {player.name}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🇳🇬 {player.nationality}
                </span>
              </div>

              {/* Hover Stats Panel */}
              <div className="player-card__stats-overlay">
                <span className="font-display" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gold)', marginBottom: 'var(--space-1)' }}>
                  #{player.number}
                </span>
                <h4 className="font-display" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-white)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
                  {player.name}
                </h4>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                    <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)' }}>APPEARANCES</span>
                    <span className="font-display" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>{player.appearances}</span>
                  </div>

                  {player.position.toUpperCase() === 'GOALKEEPER' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                        <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)' }}>CLEAN SHEETS</span>
                        <span className="font-display" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)' }}>{player.cleanSheets}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                        <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)' }}>GOALS</span>
                        <span className="font-display" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>{player.goals}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="font-condensed" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)' }}>ASSISTS</span>
                        <span className="font-display" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)' }}>
                          {player.assists}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-cream/50">
              No players found for this position.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default SquadSection;
