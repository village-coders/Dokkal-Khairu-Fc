import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/images/hero-img.png";
import heroImg2 from "../assets/images/hero-img-2.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[500px] lg:min-h-[calc(100vh-64px)] flex items-center justify-center bg-primary-dark overflow-hidden py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      {/* Mobile Background bleed image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 sm:hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(5,26,56,0.5) 25%, rgba(5,26,56,0.1) 60%), url(${heroImg2})`
        }}
      />

      {/* Desktop Background bleed image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 hidden sm:block"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(5,26,56,0.5) 25%, rgba(5,26,56,0.1) 60%), url(${heroImg})`
        }}
      />

      {/* Decorative Golden Ambient Aura */}
      <div className="absolute right-[-10%] top-[10%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-secondary/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute left-[-10%] bottom-[10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-primary/20 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      {/* Hero Core Content Grid */}
      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">

        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left" id="hero_left">
          <div className="inline-block mt-4 sm:mt-6 px-2.5 sm:px-3 py-1 rounded bg-secondary/15 border border-secondary/20 text-secondary font-display text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-bold shadow-sm backdrop-blur-sm">
            OFFICIAL WEBSITE
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-black leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)] sm:drop-shadow-none sm:[text-shadow:none]">
              DOKKAL KHAIRU FC
            </h1>
            <p className="font-accent italic text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide font-bold sm:font-normal drop-shadow-[0_2px_8px_rgba(5,26,56,0.8)] [text-shadow:_0_1px_2px_rgb(5_26_56_/_80%)] sm:drop-shadow-none sm:[text-shadow:none]">
              Ilé-Ifẹ̀'s Pride. Osun's Glory.
            </p>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-cream font-medium leading-relaxed max-w-lg sm:max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_4px_rgb(0_0_0_/_80%)] sm:drop-shadow-none sm:[text-shadow:none]">
            Hailing from the ancient, historical heartland of Nigeria—the cradle of civilization—The Khairu Boys embody the relentless spirit of sportsmanship, collective growth, and football mastery.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
            <Link
              to="/news"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded bg-secondary text-white font-display font-bold text-xs sm:text-sm tracking-widest hover:brightness-110 hover:shadow-glow hover:-translate-y-0.5 transition-all cursor-pointer shadow-md text-center"
            >
              LATEST NEWS
            </Link>
            <Link
              to="/matches"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded border border-secondary/60 text-secondary hover:text-white hover:border-white font-display text-xs sm:text-sm tracking-widest hover:bg-secondary/5 transition-all cursor-pointer text-center"
            >
              VIEW FIXTURES
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}