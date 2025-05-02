import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUI } from '@/contexts/UIContext';
import { search } from '@/lib/api';
import { MovieCard } from '@/components/ui/MovieCard';
import { TVShowCard } from '@/components/ui/TVShowCard';
import { MediaItem, SearchFilters } from '@/types';
import { getMovieGenres, getTVGenres } from '@/lib/tmdb';
import { getMediaType } from '@/lib/utils';

export function SearchModal() {
  const { state, closeSearchModal } = useUI();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'movie' | 'tv'>('all');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movieGenres, setMovieGenres] = useState<{ id: number; name: string }[]>([]);
  const [tvGenres, setTvGenres] = useState<{ id: number; name: string }[]>([]);

  // Years for select dropdown (current year down to 1970)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          getMovieGenres(),
          getTVGenres()
        ]);
        setMovieGenres(movieGenresData);
        setTvGenres(tvGenresData);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      const filters: SearchFilters = {
        query,
        type: searchType === 'all' ? undefined : searchType,
        year: year || undefined,
        genre: genre || undefined
      };
      
      const data = await search(filters);
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = () => {
    closeSearchModal();
    navigate(`/search?q=${encodeURIComponent(query)}&type=${searchType}&year=${year}&genre=${genre}`);
  };

  if (!state.searchModalOpen) {
    return null;
  }

  const genres = searchType === 'movie' ? movieGenres : searchType === 'tv' ? tvGenres : [...movieGenres, ...tvGenres];

  return (
    <div 
      className="fixed inset-0 z-50 bg-dark-500 bg-opacity-95 backdrop-blur-md pt-20 animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeSearchModal();
        }
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Rechercher
          </h2>
          <button 
            className="text-light-100 hover:text-primary transition-colors" 
            onClick={closeSearchModal}
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Advanced Search Form */}
        <div className="bg-dark-400 rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="col-span-1 md:col-span-3">
                <input 
                  type="text" 
                  placeholder="Titre du film ou de la série" 
                  className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'all' | 'movie' | 'tv')}
                >
                  <option value="all">Tous les types</option>
                  <option value="movie">Films</option>
                  <option value="tv">Séries</option>
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-light-200 focus:outline-none focus:border-primary"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
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
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  disabled={genres.length === 0}
                >
                  <option value="">Tous les genres</option>
                  {genres.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90 text-white font-poppins font-medium py-3 rounded-lg flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recherche en cours...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Rechercher
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Search Results */}
        <div>
          {results.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-poppins font-semibold text-xl">Résultats</h3>
                <button 
                  onClick={handleViewAll}
                  className="text-primary font-poppins text-sm flex items-center hover:underline"
                >
                  Voir tout
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {results.slice(0, 10).map(item => {
                  const type = getMediaType(item);
                  return type === 'movie' ? (
                    <MovieCard key={item.id} movie={item as any} />
                  ) : (
                    <TVShowCard key={item.id} tvShow={item as any} />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              {query.length > 0 && !isLoading ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-light-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                  <p className="text-light-300 text-xl mb-2">Aucun résultat trouvé</p>
                  <p className="text-light-400">Essayez d'autres termes de recherche ou filtres</p>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-light-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-light-300">Saisissez un terme de recherche pour voir les résultats</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
