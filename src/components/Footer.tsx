import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, MessageSquare, Instagram, Youtube, Facebook, Send } from "lucide-react";
import { NewsArticle } from "../types";
import clubLogo from "../assets/images/club_logo_crest_1782203456122.jpg";

interface FooterProps {
  recentNews: NewsArticle[];
}

export default function Footer({ recentNews }: FooterProps) {
  const displayedNews = recentNews.slice(0, 3);

  const socialLinks = [
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, url: "https://instagram.com" },
    { name: "Twitter", icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, url: "https://x.com" },
    { name: "Facebook", icon: <Facebook className="w-4 h-4" />, url: "https://facebook.com" },
    { name: "YouTube", icon: <Youtube className="w-4 h-4" />, url: "https://youtube.com" }
  ];

  return (
    <footer className="bg-primary-dark text-cream pt-16 pb-8 border-t border-secondary/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Info and Crest */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src={clubLogo} 
              alt="Dokkal Khairu Football Club Logo" 
              className="w-10 h-10 shrink-0 drop-shadow-md object-contain rounded-full bg-white p-0.5 border border-secondary/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-display text-xl text-secondary leading-none tracking-wider block">
                DOKKAL KHAIRU FC
              </span>
              <span className="text-[10px] text-cream/50 uppercase font-mono tracking-widest block">
                Ilé-Ifẹ̀, Osun State
              </span>
            </div>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed font-light">
            Founded on the values of growth, physical excellence, and deep cultural honor. Representing the crown of ancient Ilé-Ifẹ̀ with hardwork and elite football.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary hover:bg-secondary hover:text-primary-dark transition-all duration-250 cursor-pointer"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-secondary tracking-widest border-b border-secondary/15 pb-2">
            QUICK LINKS
          </h3>
          <ul className="space-y-2">
            {[
              { label: "Home Base", path: "/" },
              { label: "Latest News", path: "/news" },
              { label: "Match Fixtures", path: "/matches" },
              { label: "About The Club", path: "/about" }
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-cream/70 hover:text-secondary transition-colors cursor-pointer text-left font-light flex items-center space-x-1"
                >
                  <span>›</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-secondary tracking-widest border-b border-secondary/15 pb-2">
            CONTACT INFO
          </h3>
          <ul className="space-y-3 text-sm text-cream/70 font-light">
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span>Ife Grand Resort Pitch, Ibadan-Ilesha Road, Ilé-Ifẹ̀, Osun State, Nigeria</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <span>info@dokkalkhairufc.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-secondary shrink-0" />
              <span>+234 803 123 4567</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Dynamic News Headlines */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-secondary tracking-widest border-b border-secondary/15 pb-2">
            LATEST UPDATES
          </h3>
          {displayedNews.length > 0 ? (
            <div className="space-y-3">
              {displayedNews.map((article) => (
                <Link
                  key={article._id}
                  to={`/news/${article.slug}`}
                  className="block text-left text-sm group cursor-pointer"
                >
                  <p className="text-cream/90 font-medium leading-snug group-hover:text-secondary duration-150 line-clamp-2">
                    {article.title}
                  </p>
                  <span className="text-[10px] text-cream/40 font-mono mt-1 block">
                    {new Date(article.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-sm text-cream/50 font-light">
              <p>⚽ Match trials registration online.</p>
              <p>👑 Osun State League qualifiers.</p>
              <p>🏟️ New training center launching.</p>
            </div>
          )}
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-secondary/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/40 font-mono">
        <p>© 2026 Dokkal Khairu FC. All Rights Reserved.</p>
        <p>Crafted with pride in Osun State, Nigeria.</p>
      </div>
    </footer>
  );
}
