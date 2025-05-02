import React from 'react';
import { FavoritesManager } from '@/components/favorites/FavoritesManager';

export default function Favorites() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl">
            Mes Favoris
          </h1>
          <p className="text-light-300 mt-2">
            Retrouvez ici tous vos films et séries favoris.
          </p>
        </div>
        
        <FavoritesManager />
      </div>
    </main>
  );
}
