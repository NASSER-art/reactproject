import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { useMediaDetails } from '@/hooks/useMediaData';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { useCountryCode } from '@/hooks/useCountryCode';
import { Movie, TVShow } from '@/types';
import { 
  getImageUrl, 
  formatDate, 
  getMediaTitle,
  getTrailerKey,
  getYoutubeUrl,
  showNotification,
  getRuntime,
  getMediaType
} from '@/lib/utils';
import { RatingCircle } from '@/components/ui/RatingCircle';
import { CastSection } from '@/components/details/CastSection';
import { StreamingSection } from '@/components/details/StreamingSection';

export default function MediaDetails() {
  // Match route to determine media type and ID
  const movieMatch = useRoute('/movie/:id');
  const tvMatch = useRoute('/tv/:id');
  
  const mediaType = movieMatch[0] ? 'movie' : 'tv';
  const id = parseInt(movieMatch[0] ? movieMatch[1].id : tvMatch[1].id);
  
  const { countryCode } = useCountryCode();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();
  
  const { 
    details,
    credits,
    providers, 
    isLoading,
    error
  } = useMediaDetails(id, mediaType);
  
  const isInFavorites = details ? isFavorite(details.id) : false;
  
  const handleFavoriteToggle = () => {
    if (!details) return;
    
    if (isInFavorites) {
      removeFavorite(details.id);
      showNotification('Retiré des favoris', 'info');
    } else {
      addFavorite(details.id, mediaType, details);
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
  
  // Find similar content
  const similarMedia = [];
  
  return (
    <main>
      {/* Hero section with backdrop */}
      <section className="relative pt-20">
        {/* Backdrop image */}
        <div className="absolute inset-0 h-[70vh] overflow-hidden z-0">
          {isLoading ? (
            <div className="w-full h-full bg-dark-300 animate-pulse" />
          ) : details?.backdrop_path ? (
            <>
              <img 
                src={getImageUrl(details.backdrop_path, 'original')} 
                alt={getMediaTitle(details)} 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-500/80 via-dark-500/50 to-dark-400"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-dark-500 to-dark-400" />
          )}
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Poster */}
            <div className="w-64 md:w-80 flex-shrink-0 mb-8 md:mb-0">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
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
                
                {/* Rating Circle */}
                {!isLoading && details && (
                  <div className="absolute -bottom-6 -right-6">
                    <RatingCircle rating={details.vote_average} size="lg" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Info */}
            <div className="md:ml-10 text-center md:text-left">
              {isLoading ? (
                <>
                  <div className="h-10 w-64 bg-dark-300 animate-pulse rounded mb-4 mx-auto md:mx-0" />
                  <div className="h-6 w-36 bg-dark-300 animate-pulse rounded mb-6 mx-auto md:mx-0" />
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 w-20 bg-dark-300 animate-pulse rounded-full" />
                    ))}
                  </div>
                  <div className="h-24 bg-dark-300 animate-pulse rounded mb-8" />
                </>
              ) : error ? (
                <div className="text-status-error">
                  Une erreur est survenue lors du chargement des détails
                </div>
              ) : details ? (
                <>
                  <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-2">
                    {getMediaTitle(details)}
                  </h1>
                  
                  <h2 className="text-light-300 text-lg md:text-xl mb-6">
                    {mediaType === 'movie' ? (
                      <span>{formatDate(details.release_date)}</span>
                    ) : (
                      <span>{formatDate(details.first_air_date)} - {(details as TVShow).number_of_seasons || 0} saison{(details as TVShow).number_of_seasons !== 1 ? 's' : ''}</span>
                    )}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    {mediaType === 'movie' && (
                      <span className="bg-dark-300 px-4 py-2 rounded-full text-sm">
                        {getRuntime((details as Movie).runtime || 0)}
                      </span>
                    )}
                    
                    {details.genres?.map(genre => (
                      <span key={genre.id} className="bg-dark-300 px-4 py-2 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-light-200 mb-8 max-w-2xl">
                    {details.overview || "Aucune description disponible."}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {getTrailerKey(details) && (
                      <button 
                        className="bg-primary hover:bg-opacity-90 text-white font-poppins font-medium py-3 px-6 rounded-lg flex items-center"
                        onClick={handlePlayTrailer}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                        </svg>
                        Bande-annonce
                      </button>
                    )}
                    
                    <button 
                      className="bg-dark-300 hover:bg-dark-200 text-light-200 font-poppins font-medium py-3 px-6 rounded-lg flex items-center"
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
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      
      {/* Details Sections */}
      <section className="py-12 bg-dark-400">
        <div className="container mx-auto px-4">
          {/* Streaming Section */}
          {providers && (
            <StreamingSection providers={providers} countryCode={countryCode} />
          )}
          
          {/* Cast Section */}
          {credits && (
            <CastSection credits={credits} />
          )}
        </div>
      </section>
    </main>
  );
}
