import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AdminUser } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem("dk_admin_token");
      const storedUser = localStorage.getItem("dk_admin_user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setAdmin(JSON.parse(storedUser));
          
          // Verify with server
          const info = await api.getCurrentAdmin();
          setAdmin(info.admin);
          localStorage.setItem("dk_admin_user", JSON.stringify(info.admin));
        } catch (e) {
          console.warn("Session expired or invalid. Cleared.");
          localStorage.removeItem("dk_admin_token");
          localStorage.removeItem("dk_admin_user");
          setToken(null);
          setAdmin(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login(username, password);
      setToken(response.token);
      setAdmin(response.admin);
      localStorage.setItem("dk_admin_token", response.token);
      localStorage.setItem("dk_admin_user", JSON.stringify(response.admin));
    } catch (e) {
      setLoading(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } finally {
      setToken(null);
      setAdmin(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
