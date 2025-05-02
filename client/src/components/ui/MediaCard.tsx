import React from 'react';
import { Movie, TVShow, MediaItem } from '@/types';
import { MovieCard } from './MovieCard';
import { TVShowCard } from './TVShowCard';
import { getMediaType } from '@/lib/utils';

interface MediaCardProps {
  media: MediaItem;
  className?: string;
  showProviders?: boolean;
  layout?: 'grid' | 'slider';
}

export function MediaCard({ 
  media, 
  className = '', 
  showProviders = false,
  layout = 'grid'
}: MediaCardProps) {
  const mediaType = getMediaType(media);
  
  return mediaType === 'movie' 
    ? <MovieCard movie={media as Movie} className={className} showProviders={showProviders} layout={layout} />
    : <TVShowCard tvShow={media as TVShow} className={className} showProviders={showProviders} layout={layout} />;
}
