import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { search } from '@/lib/api';
import { getMovieGenres, getTVGenres } from '@/lib/tmdb';
import { MovieCard } from '@/components/ui/MovieCard';
import { TVShowCard } from '@/components/ui/TVShowCard';
import { SearchFilters, MediaItem } from '@/types';
import { getMediaType } from '@/lib/utils';
import { SearchBar } from '@/components/search/SearchBar';

export default function SearchResults() {
  const [location, navigate] = useLocation();
  
  // Parse query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const queryParam = params.get('q') || '';
  const typeParam = params.get('type') as 'movie' | 'tv' | 'all' || 'all';
  const yearParam = params.get('year') || '';
  const genreParam = params.get('genre') || '';
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: queryParam,
    type: typeParam === 'all' ? undefined : typeParam,
    year: yearParam || undefined,
    genre: genreParam || undefined
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch genres for filters
  const { data: movieGenres } = useQuery({
    queryKey: ['/api/genre/movie/list'],
    queryFn: getMovieGenres
  });
  
  const { data: tvGenres } = useQuery({
    queryKey: ['/api/genre/tv/list'],
    queryFn: getTVGenres
  });
  
  // Perform the search
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', filters],
    queryFn: () => search(filters),
    enabled: !!filters.query,
  });
  
  const handleSearch = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL params
    const searchParams = new URLSearchParams();
    if (updatedFilters.query) searchParams.set('q', updatedFilters.query);
    if (updatedFilters.type) searchParams.set('type', updatedFilters.type);
    if (updatedFilters.year) searchParams.set('year', updatedFilters.year);
    if (updatedFilters.genre) searchParams.set('genre', updatedFilters.genre);
    
    navigate(`/search?${searchParams.toString()}`);
  };
  
  // Group all genres
  const allGenres = React.useMemo(() => {
    const genreMap = new Map();
    
    if (movieGenres) {
      movieGenres.forEach(genre => {
        genreMap.set(genre.id, genre);
      });
    }
    
    if (tvGenres) {
      tvGenres.forEach(genre => {
        if (!genreMap.has(genre.id)) {
          genreMap.set(genre.id, genre);
        }
      });
    }
    
    return Array.from(genreMap.values());
  }, [movieGenres, tvGenres]);
  
  // Current year for select dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (currentYear - i).toString());
  
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-6">
            Résultats de recherche
          </h1>
          
          <div className="bg-dark-400 rounded-xl p-6">
            <form onSubmit={(e) => { 
              e.preventDefault();
              handleSearch(filters);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-1 md:col-span-4">
                  <SearchBar 
                    variant="compact" 
                    className="w-full"
                    onSearch={(query) => handleSearch({ query })}
                  />
                </div>
                
                <div>
                  <select 
                    className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                    value={filters.type || 'all'}
                    onChange={(e) => handleSearch({ type: e.target.value as 'movie' | 'tv' | 'all' })}
                  >
                    <option value="all">Tous les types</option>
                    <option value="movie">Films</option>
                    <option value="tv">Séries</option>
                  </select>
                </div>
                
                <div>
                  <select 
                    className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                    value={filters.year || ''}
                    onChange={(e) => handleSearch({ year: e.target.value })}
                  >
                    <option value="">Toutes les années</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select 
                    className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                    value={filters.genre || ''}
                    onChange={(e) => handleSearch({ genre: e.target.value })}
                  >
                    <option value="">Tous les genres</option>
                    {allGenres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-opacity-90 text-white font-poppins font-medium py-3 rounded-lg flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Rechercher
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Search Results */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-dark-300 rounded-xl animate-pulse"
                  style={{ aspectRatio: '2/3' }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-dark-300 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-status-error mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p>Une erreur est survenue lors de la recherche</p>
            </div>
          ) : searchResults && searchResults.results.length > 0 ? (
            <div>
              <h2 className="font-montserrat font-semibold text-xl mb-4">
                {searchResults.total_results} résultat{searchResults.total_results > 1 ? 's' : ''} trouvé{searchResults.total_results > 1 ? 's' : ''}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {searchResults.results.map((item: MediaItem) => {
                  const type = getMediaType(item);
                  return type === 'movie' ? (
                    <MovieCard key={item.id} movie={item as any} />
                  ) : (
                    <TVShowCard key={item.id} tvShow={item as any} layout="grid" />
                  );
                })}
              </div>
              
              {/* Pagination would go here if implemented */}
            </div>
          ) : filters.query ? (
            <div className="bg-dark-300 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-light-300 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <p className="text-lg font-poppins mb-2">Aucun résultat trouvé</p>
              <p className="text-light-300">Essayez d'autres termes de recherche ou filtres</p>
            </div>
          ) : (
            <div className="bg-dark-300 rounded-xl p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-light-300 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-light-300">Saisissez un terme de recherche pour voir les résultats</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
