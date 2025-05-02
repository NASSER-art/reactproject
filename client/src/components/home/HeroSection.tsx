import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingMovies } from '@/lib/tmdb';
import { Movie } from '@/types';
import { SearchBar } from '@/components/search/SearchBar';
import { RatingCircle } from '@/components/ui/RatingCircle';
import { getImageUrl, formatDate } from '@/lib/utils';

export function HeroSection() {
  const { data: trendingMovies, isLoading, error } = useQuery({
    queryKey: ['/api/trending/movie/week'],
    queryFn: getTrendingMovies
  });

  // Get a featured movie from the trending movies
  const featuredMovie = trendingMovies?.[0];

  return (
    <section id="home" className="hero-gradient pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 animate-slideUp">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              Découvrez où regarder vos <span className="text-primary">films</span> et <span className="text-primary">séries</span> préférés
            </h1>
            <p className="text-light-300 font-inter text-lg mb-8 max-w-lg">
              CineStream vous aide à trouver sur quelles plateformes de streaming vos contenus préférés sont disponibles.
            </p>
            
            <SearchBar variant="hero" />
          </div>
          
          <div className="w-full md:w-1/2 relative animate-fadeIn" style={{ perspective: '1000px' }}>
            {isLoading ? (
              <div className="w-full aspect-[3/4] rounded-xl bg-dark-300 animate-pulse flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-dark-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0H5.625m0 0c-.621 0-1.125.504-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6.75 7.5h3v3h-3v-3zm6 0h3v3h-3v-3z" />
                </svg>
              </div>
            ) : error ? (
              <div className="w-full aspect-[3/4] rounded-xl bg-dark-300 flex items-center justify-center">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-status-error mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p>Une erreur est survenue</p>
                </div>
              </div>
            ) : featuredMovie ? (
              <div className="relative">
                <img 
                  src={getImageUrl(featuredMovie.backdrop_path || featuredMovie.poster_path, 'w780')} 
                  alt={featuredMovie.title} 
                  className="rounded-xl shadow-2xl transform rotate-2 border-4 border-dark-500 w-full"
                />
                {/* Available on platform badge */}
                <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg font-poppins font-medium flex items-center transform -rotate-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                  Découvrir où regarder
                </div>
                
                {/* Rating circle */}
                <div className="absolute -bottom-6 -left-2">
                  <RatingCircle rating={featuredMovie.vote_average} size="lg" />
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[3/4] rounded-xl bg-dark-300 flex items-center justify-center">
                <p>Aucun film à afficher</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decoration Elements */}
      <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-primary opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-1/4 -right-10 w-20 h-20 rounded-full bg-accent opacity-20 animate-pulse-slow"></div>
    </section>
  );
}
