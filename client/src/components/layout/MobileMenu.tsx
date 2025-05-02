import React from 'react';
import { Link } from 'wouter';
import { useUI } from '@/contexts/UIContext';

export function MobileMenu() {
  const { state, closeMobileMenu } = useUI();
  
  if (!state.mobileMenuOpen) {
    return null;
  }
  
  return (
    <div
      className="fixed inset-0 z-50 bg-dark-500 bg-opacity-95 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        // Close if clicking on the backdrop
        if (e.target === e.currentTarget) {
          closeMobileMenu();
        }
      }}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary font-montserrat font-bold text-2xl" onClick={closeMobileMenu}>
            Cine<span className="text-light-100">Stream</span>
          </Link>
          <button className="text-light-100" onClick={closeMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col space-y-6 font-poppins text-lg">
          <Link href="/" className="hover:text-primary transition-colors py-2 border-b border-dark-300" onClick={closeMobileMenu}>
            Accueil
          </Link>
          <Link href="/trending" className="hover:text-primary transition-colors py-2 border-b border-dark-300" onClick={closeMobileMenu}>
            Tendances
          </Link>
          <Link href="/movies" className="hover:text-primary transition-colors py-2 border-b border-dark-300" onClick={closeMobileMenu}>
            Films
          </Link>
          <Link href="/tv-shows" className="hover:text-primary transition-colors py-2 border-b border-dark-300" onClick={closeMobileMenu}>
            Séries
          </Link>
          <Link href="/favorites" className="hover:text-primary transition-colors py-2 border-b border-dark-300" onClick={closeMobileMenu}>
            Favoris
          </Link>
        </div>
      </div>
    </div>
  );
}
