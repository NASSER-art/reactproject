import React, { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useUI } from '@/contexts/UIContext';
import { useMediaDetails } from '@/hooks/useMediaData';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { useCountryCode } from '@/hooks/useCountryCode';
import { 
  getImageUrl, 
  formatDate, 
  getMediaTitle,
  getTrailerKey,
  getYoutubeUrl,
  showNotification,
  getRuntime
} from '@/lib/utils';
import { RatingCircle } from '@/components/ui/RatingCircle';
import { CastSection } from './CastSection';
import { StreamingSection } from './StreamingSection';

export function MediaDetailsModal() {
  const { state, closeDetailsModal } = useUI();
  const [, navigate] = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();
  const { countryCode } = useCountryCode();
  
  // Initialize with default empty values
  const mediaId = state.currentMedia?.id || 0;
  const mediaType = state.mediaType || 'movie';
  
  // Always call the hook, but only enable if we have valid data
  const { 
    details,
    credits,
    providers, 
    isLoading,
    error
  } = useMediaDetails(mediaId, mediaType as 'movie' | 'tv');

  const isInFavorites = state.currentMedia ? isFavorite(state.currentMedia.id) : false;
  
  const handleCloseModal = () => {
    closeDetailsModal();
  };
  
  const handleFavoriteToggle = () => {
    if (!state.currentMedia || !state.mediaType) return;
    
    if (isInFavorites) {
      removeFavorite(state.currentMedia.id);
      showNotification('Retiré des favoris', 'info');
    } else {
      addFavorite(state.currentMedia.id, state.mediaType, state.currentMedia);
      showNotification('Ajouté aux favoris', 'success');
    }
  };
  
  const handlePlayTrailer = () => {
    if (!details) return;
    
    const trailerKey = getTrailerKey(details);
    if (trailerKey) {
      window.open(getYoutubeUrl(trailerKey), '_blank');
    } else {
      showNotification('Aucune bande-annonce disponible', 'info');
    }
  };
  
  const handleNavigateToDetails = () => {
    if (!state.currentMedia || !state.mediaType) return;
    
    closeDetailsModal();
    navigate(`/${state.mediaType}/${state.currentMedia.id}`);
  };
  
  // Close modal when clicking outside content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeDetailsModal();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDetailsModal]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (state.detailsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.detailsModalOpen]);
  
  if (!state.detailsModalOpen || !state.currentMedia) {
    return null;
  }
  
  const genres = details?.genres || [];
  const runtime = 'runtime' in (details || {}) ? (details as any).runtime : undefined;
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 bg-dark-500 bg-opacity-95 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-dark-400 rounded-2xl overflow-hidden max-w-4xl w-full mx-auto shadow-2xl">
          {/* Modal Header with Close Button */}
          <div className="relative">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 opacity-30">
              {isLoading ? (
                <div className="w-full h-full bg-dark-300 animate-pulse" />
              ) : details?.backdrop_path ? (
                <img 
                  src={getImageUrl(details.backdrop_path, 'w1280')} 
                  alt={getMediaTitle(details)} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-dark-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent"></div>
            
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                className="bg-dark-300 bg-opacity-70 text-light-200 rounded-full p-2 hover:bg-opacity-100 transition-all"
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Movie Header Content */}
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start">
              {/* Movie Poster */}
              <div className="w-48 md:w-64 flex-shrink-0 mb-6 md:mb-0">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  {isLoading ? (
                    <div className="w-full aspect-[2/3] bg-dark-300 animate-pulse" />
                  ) : details?.poster_path ? (
                    <img 
                      src={getImageUrl(details.poster_path, 'w500')} 
                      alt={getMediaTitle(details)} 
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-dark-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-dark-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0H5.625m0 0c-.621 0-1.125.504-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6.75 7.5h3v3h-3v-3zm6 0h3v3h-3v-3z" />
                      </svg>
                    </div>
                  )}
                  
                  {!isLoading && details && getTrailerKey(details) && (
                    <button 
                      className="absolute inset-0 flex items-center justify-center bg-dark-500 bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={handlePlayTrailer}
                      aria-label="Regarder la bande-annonce"
                    >
                      <div className="bg-primary rounded-full w-14 h-14 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Rating Circle */}
                {!isLoading && details && (
                  <div className="absolute top-6 -right-4 md:left-2 md:top-auto md:-bottom-4">
                    <RatingCircle rating={details.vote_average} size="lg" />
                  </div>
                )}
              </div>
              
              {/* Movie Info */}
              <div className="md:ml-8 text-center md:text-left">
                {isLoading ? (
                  <>
                    <div className="h-8 w-48 bg-dark-300 animate-pulse rounded mb-3 mx-auto md:mx-0" />
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-dark-300 animate-pulse rounded-full" />
                      ))}
                    </div>
                    <div className="h-20 bg-dark-300 animate-pulse rounded mb-6" />
                  </>
                ) : error ? (
                  <div className="text-status-error">
                    Une erreur est survenue lors du chargement des détails
                  </div>
                ) : details ? (
                  <>
                    <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-3">{getMediaTitle(details)}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      <span className="text-xs bg-dark-300 px-3 py-1 rounded-full text-light-300">
                        {formatDate(state.mediaType === 'movie' ? details.release_date : details.first_air_date)}
                      </span>
                      {runtime && (
                        <span className="text-xs bg-dark-300 px-3 py-1 rounded-full text-light-300">
                          {getRuntime(runtime)}
                        </span>
                      )}
                      {genres.map(genre => (
                        <span key={genre.id} className="text-xs bg-dark-300 px-3 py-1 rounded-full text-light-300">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-light-300 mb-6 line-clamp-3 md:line-clamp-none">
                      {details.overview || "Aucune description disponible."}
                    </p>
                  </>
                ) : null}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {!isLoading && details && getTrailerKey(details) && (
                    <button 
                      className="bg-primary hover:bg-opacity-90 text-white font-poppins font-medium py-2 px-4 rounded-lg flex items-center"
                      onClick={handlePlayTrailer}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                      </svg>
                      Bande-annonce
                    </button>
                  )}
                  
                  <button 
                    className="bg-dark-300 hover:bg-dark-200 text-light-200 font-poppins font-medium py-2 px-4 rounded-lg flex items-center"
                    onClick={handleFavoriteToggle}
                  >
                    {isInFavorites ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                        Retiré des favoris
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        Ajouter aux favoris
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="bg-dark-300 hover:bg-dark-200 text-light-200 font-poppins font-medium py-2 px-4 rounded-lg flex items-center"
                    onClick={handleNavigateToDetails}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Voir la page complète
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Body Content */}
          <div className="px-6 md:px-8 py-6">
            {/* Streaming Availability Section */}
            {providers && (
              <StreamingSection providers={providers} countryCode={countryCode} />
            )}
            
            {/* Cast Section */}
            {credits && (
              <CastSection credits={credits} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
