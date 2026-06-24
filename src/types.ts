export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // HTML format
  coverImage: {
    url: string;
    publicId: string;
  };
  category: 'Club News' | 'Match Report' | 'Transfer' | 'Youth' | 'Community' | 'General';
  tags: string[];
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  _id: string;
  homeTeam: {
    name: string;
    logo: {
      url: string;
      publicId: string;
    };
  };
  awayTeam: {
    name: string;
    logo: {
      url: string;
      publicId: string;
    };
  };
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
  matchDate: string; // ISO string
  competition: string;
  status: 'upcoming' | 'live' | 'completed';
  matchweek?: number;
  highlights?: string; // YouTube URL
  countdownBanner?: string; // Image URL for countdown banner
  createdAt: string;
}

export interface PaginatedNews {
  articles: NewsArticle[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AdminUser {
  id: string;
  username: string;
}

export interface Player {
  _id: string;
  name: string;
  number: number;
  position: string;
  nationality: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  imageUrl: string;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  type: 'image' | 'video';
  date: string;
  createdAt: string;
}
