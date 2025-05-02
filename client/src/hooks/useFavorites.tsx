import { useState, useEffect } from 'react';
import { MediaItem } from '@/types';

type FavoriteItem = {
  id: number;
  type: 'movie' | 'tv';
  data: MediaItem;
  addedAt: number;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Record<number, FavoriteItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('cinestream_favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cinestream_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // Check if an item is in favorites
  const isFavorite = (id: number): boolean => {
    return !!favorites[id];
  };

  // Add a favorite
  const addFavorite = (id: number, type: 'movie' | 'tv', data: MediaItem) => {
    setFavorites(prev => ({
      ...prev,
      [id]: {
        id,
        type,
        data,
        addedAt: Date.now(),
      },
    }));
  };

  // Remove a favorite
  const removeFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      delete newFavorites[id];
      return newFavorites;
    });
  };

  // Toggle favorite status
  const toggleFavorite = (id: number, type: 'movie' | 'tv', data: MediaItem) => {
    if (isFavorite(id)) {
      removeFavorite(id);
      return false;
    } else {
      addFavorite(id, type, data);
      return true;
    }
  };

  // Get all favorites as an array, sorted by most recently added
  const getFavoritesList = (): FavoriteItem[] => {
    return Object.values(favorites).sort((a, b) => b.addedAt - a.addedAt);
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavoritesList,
    isLoaded,
  };
}
