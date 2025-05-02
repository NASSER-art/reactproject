import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrendingMovies } from '@/components/home/TrendingMovies';
import { PopularMovies } from '@/components/home/PopularMovies';
import { PopularTVShows } from '@/components/home/PopularTVShows';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrendingMovies />
      <PopularMovies />
      <PopularTVShows />
    </main>
  );
}
