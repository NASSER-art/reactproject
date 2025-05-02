import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getPopularTVShows } from '@/lib/tmdb';
import { TVShow } from '@/types';
import { TVShowCard } from '@/components/ui/TVShowCard';

export function PopularTVShows() {
  const { data: tvShows, isLoading, error } = useQuery({
    queryKey: ['/api/tv/popular'],
    queryFn: getPopularTVShows
  });

  return (
    <section id="tvshows" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            Séries populaires
          </h2>
          <Link href="/tv-shows" className="text-primary font-poppins flex items-center hover:underline">
            Voir tout
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-6">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-56 md:w-64 lg:w-72 flex-shrink-0 bg-dark-300 rounded-xl animate-pulse"
                style={{ aspectRatio: '16/9' }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-status-error mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>Une erreur est survenue lors du chargement des séries populaires</p>
          </div>
        ) : tvShows && tvShows.length > 0 ? (
          <div className="horizontal-slider pb-6">
            <div className="flex space-x-4 md:space-x-6">
              {tvShows.slice(0, 6).map((tvShow) => (
                <TVShowCard key={tvShow.id} tvShow={tvShow} layout="slider" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-dark-300 rounded-xl p-6 text-center">
            <p>Aucune série populaire à afficher</p>
          </div>
        )}
      </div>
    </section>
  );
}
