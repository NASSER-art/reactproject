import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoritesContextType, MediaItem } from '@/types';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();

  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }), [favorites, addFavorite, removeFavorite, isFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}
