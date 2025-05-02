import {
  Movie,
  TVShow,
  SearchResponse,
  Genre,
  CreditsResponse,
  ProviderResponse,
  MediaItem,
} from "@/types";

// These functions make requests to our backend which proxies to TMDB API
// We always go through our backend to protect the API key

export async function getTrendingMovies(): Promise<Movie[]> {
  const response = await fetch('/api/trending/movie/week');
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  const data = await response.json();
  return data.results;
}

export async function getTrendingTVShows(): Promise<TVShow[]> {
  const response = await fetch('/api/trending/tv/week');
  if (!response.ok) {
    throw new Error('Failed to fetch trending TV shows');
  }
  const data = await response.json();
  return data.results;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const response = await fetch('/api/movie/popular');
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  const data = await response.json();
  return data.results;
}

export async function getPopularTVShows(): Promise<TVShow[]> {
  const response = await fetch('/api/tv/popular');
  if (!response.ok) {
    throw new Error('Failed to fetch popular TV shows');
  }
  const data = await response.json();
  return data.results;
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const response = await fetch(`/api/movie/${id}?append_to_response=videos`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return await response.json();
}

export async function getTVShowDetails(id: number): Promise<TVShow> {
  const response = await fetch(`/api/tv/${id}?append_to_response=videos`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV show details');
  }
  return await response.json();
}

export async function getMovieCredits(id: number): Promise<CreditsResponse> {
  const response = await fetch(`/api/movie/${id}/credits`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie credits');
  }
  return await response.json();
}

export async function getTVShowCredits(id: number): Promise<CreditsResponse> {
  const response = await fetch(`/api/tv/${id}/credits`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV show credits');
  }
  return await response.json();
}

export async function getMovieProviders(id: number): Promise<ProviderResponse> {
  const response = await fetch(`/api/movie/${id}/watch/providers`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie providers');
  }
  return await response.json();
}

export async function getTVShowProviders(id: number): Promise<ProviderResponse> {
  const response = await fetch(`/api/tv/${id}/watch/providers`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV show providers');
  }
  return await response.json();
}

export async function getMovieGenres(): Promise<Genre[]> {
  const response = await fetch('/api/genre/movie/list');
  if (!response.ok) {
    throw new Error('Failed to fetch movie genres');
  }
  const data = await response.json();
  return data.genres;
}

export async function getTVGenres(): Promise<Genre[]> {
  const response = await fetch('/api/genre/tv/list');
  if (!response.ok) {
    throw new Error('Failed to fetch TV genres');
  }
  const data = await response.json();
  return data.genres;
}

export async function searchMovies(query: string, year?: string, genre?: string): Promise<SearchResponse> {
  let url = `/api/search/movie?query=${encodeURIComponent(query)}`;
  if (year) url += `&year=${year}`;
  if (genre) url += `&with_genres=${genre}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  return await response.json();
}

export async function searchTVShows(query: string, year?: string, genre?: string): Promise<SearchResponse> {
  let url = `/api/search/tv?query=${encodeURIComponent(query)}`;
  if (year) url += `&first_air_date_year=${year}`;
  if (genre) url += `&with_genres=${genre}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search TV shows');
  }
  return await response.json();
}

export async function searchMulti(query: string): Promise<SearchResponse> {
  const url = `/api/search/multi?query=${encodeURIComponent(query)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search');
  }
  return await response.json();
}

export function getGenreNameById(id: number, genres: Genre[]): string {
  const genre = genres.find(g => g.id === id);
  return genre ? genre.name : '';
}

export async function discoverMovies(genreId?: number, year?: string, page: number = 1): Promise<SearchResponse> {
  let url = `/api/discover/movie?page=${page}`;
  if (genreId) url += `&with_genres=${genreId}`;
  if (year) url += `&year=${year}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to discover movies');
  }
  return await response.json();
}

export async function discoverTVShows(genreId?: number, year?: string, page: number = 1): Promise<SearchResponse> {
  let url = `/api/discover/tv?page=${page}`;
  if (genreId) url += `&with_genres=${genreId}`;
  if (year) url += `&first_air_date_year=${year}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to discover TV shows');
  }
  return await response.json();
}
