export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
  original_title: string;
  runtime?: number;
  genres?: Genre[];
  videos?: VideoResponse;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  genre_ids: number[];
  original_name: string;
  number_of_seasons?: number;
  genres?: Genre[];
  videos?: VideoResponse;
}

export type MediaItem = Movie | TVShow;

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResponse {
  results: Video[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CreditsResponse {
  cast: CastMember[];
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface Providers {
  [countryCode: string]: {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
}

export interface ProviderResponse {
  results: Providers;
}

export interface SearchResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

export interface SearchFilters {
  query: string;
  year?: string;
  genre?: string;
  type?: 'movie' | 'tv' | 'all';
}

export interface UIState {
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  detailsModalOpen: boolean;
  currentMedia?: MediaItem;
  mediaType?: 'movie' | 'tv';
}

export interface FavoritesContextType {
  favorites: { [id: number]: { type: 'movie' | 'tv', data: MediaItem } };
  addFavorite: (id: number, type: 'movie' | 'tv', data: MediaItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}
