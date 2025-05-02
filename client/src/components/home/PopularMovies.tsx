import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getPopularMovies, getMovieGenres, discoverMovies } from '@/lib/tmdb';
import { Movie, Genre } from '@/types';
import { MovieCard } from '@/components/ui/MovieCard';
import { GenrePill } from '@/components/ui/GenrePill';

export function PopularMovies() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['/api/genre/movie/list'],
    queryFn: getMovieGenres
  });
  
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['/api/movie/popular', selectedGenre],
    queryFn: () => selectedGenre 
      ? discoverMovies(selectedGenre).then(data => data.results) 
      : getPopularMovies()
  });

  const handleGenreClick = (genreId: number | null) => {
    setSelectedGenre(genreId);
  };

  return (
    <section id="movies" className="py-12 md:py-16 bg-dark-400 rounded-tl-3xl rounded-tr-3xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0H5.625m0 0c-.621 0-1.125.504-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6.75 7.5h3v3h-3v-3zm6 0h3v3h-3v-3z" />
            </svg>
            Films populaires
          </h2>
          <Link href="/movies" className="text-primary font-poppins flex items-center hover:underline">
            Voir tout
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        
        {/* Category Pills */}
        <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2">
          <GenrePill 
            name="Tous" 
            isActive={selectedGenre === null}
            onClick={() => handleGenreClick(null)}
          />
          
          {isLoadingGenres ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-9 w-20 bg-dark-300 rounded-full animate-pulse" />
            ))
          ) : genres ? (
            genres.slice(0, 6).map(genre => (
              <GenrePill 
                key={genre.id}
                name={genre.name} 
                isActive={selectedGenre === genre.id}
                onClick={() => handleGenreClick(genre.id)}
              />
            ))
          ) : null}
        </div>
        
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
            <p>Une erreur est survenue lors du chargement des films populaires</p>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <p>Aucun film populaire à afficher</p>
          </div>
        )}
        
        {/* Load More Button */}
        {movies && movies.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link href="/movies" className="bg-dark-300 hover:bg-dark-200 transition text-light-200 px-6 py-3 rounded-full text-sm font-poppins flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Charger plus
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
