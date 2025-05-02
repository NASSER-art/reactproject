import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { searchMulti } from '@/lib/tmdb';
import { SearchResponse } from '@/types';
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { getImageUrl, getMediaTitle, formatDate, getMediaType } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  variant = 'hero', 
  className = '',
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        inputRef.current && 
        !resultsRef.current.contains(event.target as Node) && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce the search to avoid making too many API calls
  const debouncedSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length >= 2) {
      setIsLoading(true);
      try {
        const results = await searchMulti(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults(null);
      setShowResults(false);
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleResultClick = (id: number, mediaType: 'movie' | 'tv') => {
    setShowResults(false);
    navigate(`/${mediaType}/${id}`);
  };

  // Different styles based on variant
  const containerClasses = variant === 'hero' 
    ? "relative max-w-lg" 
    : "relative w-full";
  
  const inputClasses = variant === 'hero'
    ? "search-input bg-transparent w-full py-4 px-6 outline-none text-light-200 font-poppins"
    : "search-input bg-transparent w-full py-2 px-4 outline-none text-light-200 font-poppins text-sm";
  
  const buttonClasses = variant === 'hero'
    ? "bg-primary hover:bg-opacity-90 transition text-white font-poppins font-medium py-3 px-6 mr-1 rounded-full flex items-center"
    : "bg-primary hover:bg-opacity-90 transition text-white font-poppins text-sm py-2 px-4 mr-1 rounded-full flex items-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative glass-card bg-dark-400 bg-opacity-70 rounded-full overflow-hidden flex items-center border border-dark-300 focus-within:border-primary transition">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Rechercher un film ou une série" 
            className={inputClasses}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          <button 
            type="submit"
            className={buttonClasses}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            {variant === 'hero' && <span>Rechercher</span>}
          </button>
        </div>
      </form>
      
      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute left-0 right-0 top-full mt-2 bg-dark-300 rounded-xl overflow-hidden shadow-xl z-10 max-h-[70vh] overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin mb-2 inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full"></div>
              <p>Recherche en cours...</p>
            </div>
          ) : searchResults && searchResults.results.length > 0 ? (
            <div className="p-2">
              {searchResults.results.slice(0, 6).map(result => {
                const mediaType = getMediaType(result);
                return (
                  <div 
                    key={result.id}
                    onClick={() => handleResultClick(result.id, mediaType)}
                    className="flex items-center p-2 hover:bg-dark-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-16 flex-shrink-0 bg-dark-400 rounded overflow-hidden">
                      <img 
                        src={getImageUrl(result.poster_path, 'w92')} 
                        alt={getMediaTitle(result)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-poppins font-medium text-sm">{getMediaTitle(result)}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-dark-400 px-2 py-0.5 rounded-full mr-2">
                          {mediaType === 'movie' ? 'Film' : 'Série'}
                        </span>
                        <span className="text-xs text-light-300">
                          {formatDate(mediaType === 'movie' ? result.release_date : result.first_air_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-2 pt-2 border-t border-dark-400">
                <button 
                  onClick={() => {
                    setShowResults(false);
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="w-full py-2 text-center text-primary text-sm hover:underline"
                >
                  Voir tous les résultats
                </button>
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center">
              <p>Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p>Saisissez au moins 2 caractères</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
