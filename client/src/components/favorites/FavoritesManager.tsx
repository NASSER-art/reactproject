import React from 'react';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { MovieCard } from '@/components/ui/MovieCard';
import { TVShowCard } from '@/components/ui/TVShowCard';
import { MediaItem } from '@/types';
import { showNotification } from '@/lib/utils';

export function FavoritesManager() {
  const { favorites, removeFavorite } = useFavoritesContext();
  
  const favoritesList = Object.values(favorites);
  
  const handleClearAll = () => {
    if (favoritesList.length === 0) return;
    
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer tous vos favoris ?");
    if (confirm) {
      favoritesList.forEach(item => {
        removeFavorite(item.id);
      });
      showNotification('Tous les favoris ont été supprimés', 'info');
    }
  };
  
  if (favoritesList.length === 0) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-light-300 mx-auto mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <h3 className="font-montserrat font-bold text-xl mb-2">Aucun favori</h3>
        <p className="text-light-300 max-w-md mx-auto">
          Vous n'avez pas encore ajouté de films ou séries à vos favoris. 
          Explorez le contenu et cliquez sur l'icône de cœur pour les ajouter ici.
        </p>
      </div>
    );
  }
  
  // Separate movies and TV shows
  const movies = favoritesList.filter(item => item.type === 'movie');
  const tvShows = favoritesList.filter(item => item.type === 'tv');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-montserrat font-bold text-xl">
          Vous avez {favoritesList.length} favoris
        </h2>
        <button 
          onClick={handleClearAll}
          className="text-status-error font-poppins text-sm flex items-center hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Tout effacer
        </button>
      </div>
      
      {/* Movies Section */}
      {movies.length > 0 && (
        <div className="mb-8">
          <h3 className="font-poppins font-semibold text-lg mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0H5.625m0 0c-.621 0-1.125.504-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6.75 7.5h3v3h-3v-3zm6 0h3v3h-3v-3z" />
            </svg>
            Films ({movies.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map(item => (
              <MovieCard key={item.id} movie={item.data as any} />
            ))}
          </div>
        </div>
      )}
      
      {/* TV Shows Section */}
      {tvShows.length > 0 && (
        <div>
          <h3 className="font-poppins font-semibold text-lg mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            Séries ({tvShows.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {tvShows.map(item => (
              <TVShowCard key={item.id} tvShow={item.data as any} layout="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
