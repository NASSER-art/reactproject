import React from 'react';
import { Link, useLocation } from 'wouter';
import { useUI } from '@/contexts/UIContext';
import { useMobile } from '@/hooks/use-mobile';

export function Navbar() {
  const { openMobileMenu, openSearchModal } = useUI();
  const [location] = useLocation();
  const isMobile = useMobile();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-500 to-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-primary font-montserrat font-bold text-2xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0H5.625m0 0c-.621 0-1.125.504-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6.75 7.5h3v3h-3v-3zm6 0h3v3h-3v-3z" />
            </svg>
            <span>Cine<span className="text-light-100">Stream</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 font-poppins text-sm">
          <Link href="/" className={`${location === '/' ? 'text-primary' : 'text-light-200 hover:text-primary'} transition-colors`}>
            Accueil
          </Link>
          <Link href="/trending" className={`${location === '/trending' ? 'text-primary' : 'text-light-200 hover:text-primary'} transition-colors`}>
            Tendances
          </Link>
          <Link href="/movies" className={`${location === '/movies' ? 'text-primary' : 'text-light-200 hover:text-primary'} transition-colors`}>
            Films
          </Link>
          <Link href="/tv-shows" className={`${location === '/tv-shows' ? 'text-primary' : 'text-light-200 hover:text-primary'} transition-colors`}>
            Séries
          </Link>
          <Link href="/favorites" className={`${location === '/favorites' ? 'text-primary' : 'text-light-200 hover:text-primary'} transition-colors`}>
            Favoris
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-light-100 hover:text-primary transition-colors" 
            onClick={openSearchModal}
            aria-label="Rechercher"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <Link 
            href="/favorites" 
            className="hidden md:block text-light-100 hover:text-primary transition-colors"
            aria-label="Favoris"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </Link>
          <button 
            className="md:hidden text-light-100 hover:text-primary transition-colors" 
            onClick={openMobileMenu}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
