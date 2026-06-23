import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import clubLogo from "../assets/images/club_logo_crest_1782203456122.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { admin, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname;

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "NEWS", path: "/news" },
    { name: "MATCHES", path: "/matches" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-primary-dark/95 backdrop-blur-md border-b border-secondary/10 px-3 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand Logo & Name */}
      <Link
        to="/"
        className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
      >
        {/* Genuine Generated Logo Crest */}
        <img 
          src={clubLogo} 
          alt="Dokkal Khairu Football Club Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 drop-shadow-md object-contain rounded-full bg-white p-0.5 border border-secondary/20"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <span className="font-display text-lg sm:text-xl md:text-2xl text-secondary leading-none tracking-wider">
            DOKKAL KHAIRU FC
          </span>
          <span className="text-[9px] sm:text-[10px] text-cream/60 leading-none tracking-widest uppercase font-mono mt-0.5">
            The Khairu Boys
          </span>
        </div>
      </Link>

      {/* Desktop Links (Center) */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-display text-sm tracking-widest transition-colors duration-250 cursor-pointer relative py-2 ${
              currentView === link.path
                ? "text-secondary font-semibold"
                : "text-cream hover:text-secondary"
            }`}
          >
            {link.name}
            {/* Sliding Underline Accent */}
            {currentView === link.path && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary animate-fade-in" />
            )}
          </Link>
        ))}
      </div>

      {/* Right Controls */}
      <div className="hidden md:flex items-center space-x-4">
        {admin ? (
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-secondary text-xs uppercase tracking-wider font-display font-medium text-secondary hover:bg-secondary hover:text-primary-dark transition-all cursor-pointer ${
                currentView.startsWith("/admin") ? "bg-secondary text-primary-dark" : "bg-transparent"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              title="Logout"
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-cream/70 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/admin"
            className="px-4 py-2 rounded border border-secondary text-secondary font-display text-xs tracking-widest hover:bg-secondary hover:text-primary-dark transition-all cursor-pointer"
          >
            ADMIN LOGIN
          </Link>
        )}
      </div>

      {/* Hamburger Mobile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded text-cream hover:text-secondary focus:outline-none cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Slide-Over */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-primary-dark z-50 flex flex-col p-4 sm:p-6 animate-slide-up md:hidden border-t border-secondary/10">
          <div className="flex flex-col space-y-4 sm:space-y-6 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`font-display text-xl sm:text-2xl tracking-widest text-left cursor-pointer border-b border-cream/5 pb-2 ${
                  currentView === link.path ? "text-secondary" : "text-cream"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 sm:pt-6 border-t border-cream/10 flex flex-col space-y-3 sm:space-y-4">
              {admin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded bg-secondary text-primary-dark font-display font-medium text-center tracking-widest"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span>ADMIN PANEL</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      handleLinkClick();
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded border border-danger/40 text-danger font-display font-medium text-center tracking-widest hover:bg-danger/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>LOG OUT</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className="w-full py-3 rounded border border-secondary text-secondary font-display text-center tracking-widest flex items-center justify-center hover:bg-secondary hover:text-primary-dark"
                >
                  ADMIN LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
