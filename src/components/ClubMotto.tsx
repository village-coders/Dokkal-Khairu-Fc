import React from "react";

export default function ClubMotto() {
  return (
    <section className="bg-secondary py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative subtle sun-dial vector in background to reference Ile-Ife legacy */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg className="w-80 h-80 text-primary-dark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="30" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
          <line x1="22" y1="22" x2="78" y2="78" />
          <line x1="22" y1="78" x2="78" y2="22" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 text-center relative z-10">
        
        {/* Horizontal styling accent */}
        <div className="flex items-center space-x-4 w-full justify-center">
          <div className="h-[2px] bg-primary-dark/30 flex-1 max-w-[120px] rounded" />
          <span className="text-primary-dark text-xl">⚜</span>
          <div className="h-[2px] bg-primary-dark/30 flex-1 max-w-[120px] rounded" />
        </div>

        {/* Big Motto Quote */}
        <blockquote className="font-accent italic text-2xl sm:text-3xl md:text-4xl text-primary-dark font-semibold leading-relaxed max-w-2xl px-6">
          "From the Ancient City of Ilé-Ifẹ̀, We Rise."
        </blockquote>

        {/* Subtitle */}
        <p className="text-primary-dark/70 font-mono text-xs uppercase tracking-[0.25em] font-medium pt-2">
          Dokkal Khairu Football Club — Established for Excellence
        </p>

        <div className="h-2 w-2 rounded-full bg-primary-dark/40 mt-4" />

      </div>
    </section>
  );
}
