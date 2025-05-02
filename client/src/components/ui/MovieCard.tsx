import React from 'react';
import { Movie } from '@/types';
import { formatDate, getImageUrl, truncateText } from '@/lib/utils';
import { RatingCircle } from './RatingCircle';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { useUI } from '@/contexts/UIContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  showProviders?: boolean;
  layout?: 'grid' | 'slider';
}

export function MovieCard({ 
  movie, 
  className = '', 
  showProviders = false,
  layout = 'grid'
}: MovieCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();
  const { openDetailsModal } = useUI();
  
  const isInFavorites = isFavorite(movie.id);
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInFavorites) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id, 'movie', movie);
    }
  };
  
  const handleOpenDetails = () => {
    openDetailsModal(movie, 'movie');
  };
  
  // Determine sizing based on layout
  const containerClasses = layout === 'grid' 
    ? "w-full" 
    : "w-36 md:w-48 lg:w-56 flex-shrink-0";
  
  return (
    <div className={`movie-card ${containerClasses} ${className}`}>
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />
        
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/60 to-transparent p-4 flex flex-col justify-end">
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-semibold text-md">
              {truncateText(movie.title, 20)}
            </h3>
            <button 
              className="text-light-200 hover:text-primary transition-colors" 
              onClick={handleFavoriteToggle}
              aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
            >
              {isInFavorites ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-primary mr-1">
                <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
              </svg>
              <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-xs bg-dark-300 bg-opacity-80 px-2 py-1 rounded-md">
              {formatDate(movie.release_date)}
            </span>
          </div>
          
          <button 
            className="mt-3 bg-primary hover:bg-opacity-90 text-white text-xs font-medium py-1.5 rounded-md flex items-center justify-center"
            onClick={handleOpenDetails}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}
