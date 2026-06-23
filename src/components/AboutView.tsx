import React from "react";
import { Helmet } from "react-helmet-async";
import { Shield, Medal, MapPin, Users, Flame, Star } from "lucide-react";

export default function AboutView() {
  const values = [
    {
      title: "CULTURAL INTEGRITY",
      desc: "Honoring the deep, ancient heritage of Ilé-Ifẹ̀ (The cradle of civilization) through physical resilience and disciplined work.",
      icon: <Flame className="w-6 h-6 text-secondary" />,
    },
    {
      title: "ATHLETIC DOMINANCE",
      desc: "Promoting elite tactical intelligence and supreme physical endurance in Nigerian football.",
      icon: <Shield className="w-6 h-6 text-secondary" />,
    },
    {
      title: "GRASROOTS EMPOWERMENT",
      desc: "Providing a direct, professional ladder to scout grids and European/International trials for talented street boys in Osun State.",
      icon: <Users className="w-6 h-6 text-secondary" />,
    },
  ];

  const executiveTeam = [
    { role: "President / Chairman", name: "Alhaj Kabir Olagoke" },
    { role: "General Manager", name: "Coach Adeleke Ismail" },
    { role: "Team Consultant", name: "Chief Gabriel Ooni" },
    { role: "Technical Director", name: "Coach Samuel Babalade" },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Dokkal Khairu FC</title>
        <meta name="description" content="Learn about the history and heritage of Dokkal Khairu FC, the pride of Ilé-Ifẹ̀, Osun State." />
      </Helmet>
      <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[72px] animate-fade-in text-left">
        <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-primary font-black uppercase leading-tight">
            ABOUT DOKKAL KHAIRU FC
          </h1>
          <p className="font-accent italic text-secondary text-lg sm:text-xl md:text-2xl">
            "The Pride of Ilé-Ifẹ̀, The Glory of Osun State"
          </p>
          <div className="w-16 h-1 bg-secondary mx-auto rounded" />
        </div>

        {/* Culture & Heritage Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-3xl text-primary font-bold tracking-wide uppercase">
              OUR HISTORICAL ORIGINS & IDENTITY
            </h2>
            <div className="space-y-4 text-[#111111]/85 text-sm sm:text-base leading-relaxed font-light">
              <p>
                Established in the holy and historical city of <strong>Ilé-Ifẹ̀, Osun State, Nigeria</strong>, <strong>Dokkal Khairu Football Club</strong> is affectionately known by our supporters as <strong>The Khairu Boys</strong>. We operate with a deep-seated vision that soccer is not merely a competitive game, but a powerful engine for structural community change, cultural prestige, and youth elevation.
              </p>
              <p>
                Ilé-Ifẹ̀ is globally renowned as the ancestral birthplace of Yorubaland and a cradle of ancient civilization. Our club represents that noble lineage by carrying a crown in our team crest, wearing the prestigious <strong>Royal Blue (#0B4393)</strong> representing loyalty, excellence, and elite sportsmanship, paired with the vibrant <strong>Scarlet Banner Red (#E51A24)</strong> mapping to courage, dynamic power, and historic victories.
              </p>
              <p>
                Our team trains at the state-of-the-art <strong>Ife Grand Resort Soccer Arena</strong> and the Ife Township Stadium, pushing our players to meet high levels of tactical discipline and athletic fitness, under the instruction of premium local coaches and technical program builders.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            {/* Thematic Cultural Card */}
            <div className="bg-primary-dark border border-secondary/25 p-8 rounded-2xl text-cream space-y-6 shadow-card hover:shadow-hover duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-secondary shrink-0 animate-pulse" />
                <h3 className="font-display text-2xl text-secondary tracking-widest leading-none">CLUB HONORS</h3>
              </div>
              <ul className="space-y-4 text-xs font-mono text-cream/90">
                <li className="flex items-start space-x-2">
                  <Medal className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="font-black">🏆 OSUN STATE FA DIVISION CHAMPIONS</p>
                    <p className="text-secondary/80 font-light mt-0.5">2024 Gold Laurels</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <Medal className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="font-black">🏆 ANCIENT CRADLE INVITATIONAL CUP</p>
                    <p className="text-secondary/80 font-light mt-0.5">2023 Winners</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <Medal className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="font-black">🥇 NIGERIAN GRASSROOTS FOOTBALL EXCELLENCE AWARD</p>
                    <p className="text-secondary/80 font-light mt-0.5">2025 Best Managed Club</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Club Values Blocks */}
        <div className="space-y-8 bg-primary-dark/5 p-8 sm:p-12 rounded-2xl border border-secondary/15">
          <h2 className="font-display text-3xl text-primary text-center font-bold tracking-wide uppercase">
            OUR CORE VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="bg-white p-6 rounded-xl border border-black/5 hover:border-secondary transition-all shadow-sm space-y-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-lg bg-primary-dark/5 flex items-center justify-center mx-auto md:mx-0">
                  {val.icon}
                </div>
                <h3 className="font-display text-xl text-primary font-black tracking-wide leading-tight">{val.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-primary font-bold tracking-wide uppercase">
              LEADERSHIP & DIRECTORY
            </h2>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
              A serious club requires elite backend coordination. Our leadership consists of prominent Osun State sports icons, physical trainers, and community leaders committed to the sustainable expansion of Dokkal Khairu Football Club onto the national and international stage.
            </p>
            <div className="flex items-center space-x-2 text-sm text-primary font-semibold font-mono">
              <MapPin className="w-4 h-4 text-secondary shrink-0 animate-bounce" />
              <span>Headquarters: 18, Royal Arena Lane, Ilé-Ifẹ̀, Osun, Nigeria</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/5 p-6 shadow-sm division divide-y divide-gray-100">
            {executiveTeam.map((exec) => (
              <div key={exec.name} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 font-body text-sm">
                <span className="font-semibold text-primary">{exec.name}</span>
                <span className="text-xs uppercase bg-secondary/10 px-2.5 py-1 rounded text-secondary font-mono tracking-widest font-black shrink-0">
                  {exec.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
