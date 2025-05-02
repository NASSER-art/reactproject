import { SearchFilters } from '@/types';

// Injecting the API key directly for functionality
const TMDB_API_KEY = "e104c6f7f443470e8455999423a33d89";

// Helper functions to make API requests to our backend
// These are wrappers around fetch() with error handling and JSON parsing

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.message = await response.text();
    throw error;
  }
  
  return response.json() as Promise<T>;
}

export async function get<T>(url: string): Promise<T> {
  return fetchJson<T>(url);
}

export async function post<T>(url: string, data: any): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Get user's country code
export async function getUserCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'US'; // Default to US if not found
  } catch (error) {
    console.error('Failed to get user country:', error);
    return 'US'; // Default to US on error
  }
}

// For complex search operations
export async function search(filters: SearchFilters) {
  let endpoint = '';
  
  if (filters.type === 'movie') {
    endpoint = '/api/search/movie';
  } else if (filters.type === 'tv') {
    endpoint = '/api/search/tv';
  } else {
    endpoint = '/api/search/multi';
  }
  
  let url = `${endpoint}?query=${encodeURIComponent(filters.query)}`;
  
  if (filters.year && filters.type === 'movie') {
    url += `&year=${filters.year}`;
  } else if (filters.year && filters.type === 'tv') {
    url += `&first_air_date_year=${filters.year}`;
  }
  
  if (filters.genre) {
    url += `&with_genres=${filters.genre}`;
  }
  
  return get(url);
}
