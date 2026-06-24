import { NewsArticle, Match, PaginatedNews, AdminUser, Player, GalleryItem } from "../types";

const API_BASE = `${import.meta.env.VITE_API_URL || ""}/api`;

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("dk_admin_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to log in.");
    }
    return res.json();
  },

  async getCurrentAdmin(): Promise<{ admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    return res.json();
  },

  async logout(): Promise<void> {
    localStorage.removeItem("dk_admin_token");
    localStorage.removeItem("dk_admin_user");
    await fetch(`${API_BASE}/auth/logout`, { method: "POST" }).catch(() => {});
  },

  // News CRUD
  async getNews(params?: { page?: number; limit?: number; category?: string; featured?: boolean }): Promise<PaginatedNews> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.category) query.append("category", params.category);
    if (params?.featured) query.append("featured", "true");

    const res = await fetch(`${API_BASE}/news?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch news articles.");
    return res.json();
  },

  async getNewsBySlug(slug: string): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news/${slug}`);
    if (!res.ok) throw new Error("Article not found.");
    return res.json();
  },

  async createNews(data: {
    title: string;
    summary: string;
    content: string;
    coverImageUrl?: string;
    category: string;
    tags: string[];
    isFeatured: boolean;
  }): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create news article.");
    }
    return res.json();
  },

  async updateNews(
    id: string,
    data: {
      title?: string;
      summary?: string;
      content?: string;
      coverImageUrl?: string;
      category?: string;
      tags?: string[];
      isFeatured?: boolean;
    }
  ): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to edit news article.");
    }
    return res.json();
  },

  async deleteNews(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete article.");
  },

  // Matches CRUD
  async getMatches(status?: "upcoming" | "live" | "completed"): Promise<Match[]> {
    const query = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/matches${query}`);
    if (!res.ok) throw new Error("Failed to fetch matches.");
    return res.json();
  },

  async createMatch(data: {
    homeTeamName: string;
    homeTeamLogoUrl?: string;
    awayTeamName: string;
    awayTeamLogoUrl?: string;
    venue: string;
    matchDate: string;
    competition: string;
    status: 'upcoming' | 'live' | 'completed';
    matchweek?: number;
    highlights?: string;
    countdownBanner?: string;
  }): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create match fixture.");
    }
    return res.json();
  },

  async updateMatch(
    id: string,
    data: {
      homeTeamName?: string;
      homeTeamLogoUrl?: string;
      awayTeamName?: string;
      awayTeamLogoUrl?: string;
      venue?: string;
      matchDate?: string;
      competition?: string;
      status?: 'upcoming' | 'live' | 'completed';
      matchweek?: number;
      highlights?: string;
      countdownBanner?: string;
      homeScore?: number | null;
      awayScore?: number | null;
    }
  ): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update match.");
    }
    return res.json();
  },

  async updateMatchScore(
    id: string,
    data: { homeScore: number | null; awayScore: number | null; status: 'upcoming' | 'live' | 'completed' }
  ): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${id}/score`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update match score.");
    }
    return res.json();
  },

  async deleteMatch(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/matches/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete match.");
  },

  // Players CRUD
  async getPlayers(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/players`);
    if (!res.ok) throw new Error("Failed to fetch players.");
    return res.json();
  },

  async createPlayer(data: Partial<Player>): Promise<Player> {
    const res = await fetch(`${API_BASE}/players`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create player.");
    }
    return res.json();
  },

  async updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
    const res = await fetch(`${API_BASE}/players/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update player.");
    }
    return res.json();
  },

  async deletePlayer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/players/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete player.");
  },

  // Gallery CRUD
  async getGalleryItems(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery items.");
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create gallery item.");
    }
    return res.json();
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update gallery item.");
    }
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete gallery item.");
  },

  // Image upload
  async uploadImage(imageBase64: string, filename?: string): Promise<{ url: string }> {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ imageBase64, filename }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to upload image.");
    }
    return res.json();
  }
};
