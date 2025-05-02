import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTVGenres, discoverTVShows } from '@/lib/tmdb';
import { TVShowCard } from '@/components/ui/TVShowCard';
import { GenrePill } from '@/components/ui/GenrePill';
import { SearchBar } from '@/components/search/SearchBar';

export default function TVShows() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [year, setYear] = useState<string>('');
  
  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['/api/genre/tv/list'],
    queryFn: getTVGenres
  });
  
  const { data: tvShowsData, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useQuery({
    queryKey: ['/api/discover/tv', selectedGenre, year, currentPage],
    queryFn: () => discoverTVShows(selectedGenre || undefined, year || undefined, currentPage),
    keepPreviousData: true
  });
  
  const tvShows = tvShowsData?.results || [];
  const totalPages = tvShowsData?.total_pages || 0;
  
  const handleGenreClick = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset to first page when changing genre
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
    setCurrentPage(1); // Reset to first page when changing year
  };
  
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // Years for select dropdown (current year down to 1970)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (currentYear - i).toString());
  
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl">
            Séries
          </h1>
          <SearchBar variant="compact" />
        </div>
        
        <div className="bg-dark-400 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-40 bg-dark-300 border border-dark-200 rounded-lg px-4 py-2 text-light-200 focus:outline-none focus:border-primary"
                value={year}
                onChange={handleYearChange}
              >
                <option value="">Toutes les années</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2">
            <GenrePill 
              name="Tous" 
              isActive={selectedGenre === null}
              onClick={() => handleGenreClick(null)}
            />
            
            {isLoadingGenres ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-9 w-20 bg-dark-300 rounded-full animate-pulse" />
              ))
            ) : genres ? (
              genres.map(genre => (
                <GenrePill 
                  key={genre.id}
                  name={genre.name} 
                  isActive={selectedGenre === genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                />
              ))
            ) : null}
          </div>
        </div>
        
        {isLoading && currentPage === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="bg-dark-300 rounded-xl animate-pulse"
                style={{ aspectRatio: '2/3' }}
              />
            ))}
          </div>
        ) : tvShows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {tvShows.map((tvShow) => (
                <TVShowCard key={tvShow.id} tvShow={tvShow} layout="grid" />
              ))}
            </div>
            
            {currentPage < totalPages && (
              <div className="flex justify-center mt-10">
                <button 
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="bg-dark-300 hover:bg-dark-200 transition text-light-200 px-6 py-3 rounded-full text-sm font-poppins flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Charger plus
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-light-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <p className="text-lg font-poppins mb-2">Aucune série trouvée</p>
            <p className="text-light-300">Essayez d'autres filtres</p>
          </div>
        )}
      </div>
    </main>
  );
}
