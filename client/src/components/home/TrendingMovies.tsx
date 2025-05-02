import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getTrendingMovies } from '@/lib/tmdb';
import { Movie } from '@/types';
import { MovieCard } from '@/components/ui/MovieCard';

export function TrendingMovies() {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['/api/trending/movie/week'],
    queryFn: getTrendingMovies
  });

  return (
    <section id="trending" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
            Tendances de la semaine
          </h2>
          <Link href="/trending" className="text-primary font-poppins flex items-center hover:underline">
            Voir tout
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="w-36 md:w-48 lg:w-56 flex-shrink-0 bg-dark-300 rounded-xl animate-pulse"
                style={{ aspectRatio: '2/3' }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-status-error mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>Une erreur est survenue lors du chargement des films tendance</p>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="horizontal-slider pb-6">
            <div className="flex space-x-4 md:space-x-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} layout="slider" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <p>Aucun film tendance à afficher</p>
          </div>
        )}
      </div>
    </section>
  );
}
