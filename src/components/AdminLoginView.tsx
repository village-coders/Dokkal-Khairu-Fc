import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ShieldAlert, Key } from "lucide-react";
import clubLogo from "../assets/images/club_logo_crest_1782203456122.jpg";

export default function AdminLoginView() {
  const navigate = useNavigate();
  const { login, admin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UX State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Send to dashboard if already logged in on mount
  React.useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setShake(false);

    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid administrative credentials.");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-dark min-h-screen flex items-center justify-center py-16 px-4 relative select-none">
      {/* Decorative ambient auras */}
      <div className="absolute w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[90px] top-[15%] left-[20%] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] bottom-[15%] right-[20%] pointer-events-none" />

      {/* Main Login Card Wrapper */}
      <div 
        className={`w-full max-w-[400px] bg-card border border-secondary/25 p-8 rounded-2xl shadow-glow text-cream text-center space-y-6 transition-transform duration-200 ${
          shake ? "animate-bounce" : ""
        }`}
        id="login_card"
      >
        {/* Core vector shield emblem */}
        <div className="flex justify-center">
          <img 
            src={clubLogo} 
            alt="Dokkal Khairu Football Club Logo" 
            className="w-20 h-20 shrink-0 drop-shadow-md object-contain rounded-full bg-white p-0.5 border border-secondary/20"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-3xl text-secondary tracking-widest font-black uppercase">
            ADMIN LOGIN
          </h1>
          <p className="text-[10px] text-cream/50 uppercase font-mono tracking-widest">
            DOKKAL KHAIRU FC SECURE BACKOFFICE
          </p>
        </div>

        {/* Error message indicator with red text */}
        {errorMsg && (
          <div className="p-3.5 rounded bg-danger/10 border border-danger/30 text-xs text-red-300 text-left font-light leading-snug flex items-start space-x-2">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-[#F9F9F9]/60 uppercase">
              USERNAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded bg-primary-dark/80 border border-secondary/15 text-white placeholder-cream/20 text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-[#F9F9F9]/60 uppercase">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded bg-primary-dark/80 border border-secondary/15 text-white placeholder-cream/20 text-sm focus:outline-none focus:border-secondary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-white"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-secondary text-primary-dark font-display font-bold text-sm tracking-widest rounded hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 shadow-md uppercase"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>VERIFYING SYSTEM SECURITY...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4 shrink-0" />
                <span>SIGN IN SECURELY</span>
              </>
            )}
          </button>
        </form>

        {/* Informational tip */}
        <div className="pt-4 border-t border-cream/5 text-[9px] text-cream/35 leading-relaxed font-light">
          🔒 System access is strictly restricted. Contact the club directory administrator for credentials if yours are misplaced.
          <p className="mt-1 font-semibold text-secondary">Tip: Default username is 'admin', password is 'password123'</p>
        </div>

      </div>
    </div>
  );
}
