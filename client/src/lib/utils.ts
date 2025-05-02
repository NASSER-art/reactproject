import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Movie, TVShow } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch (e) {
    return 'N/A';
  }
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-poster.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getMediaTitle(media: Movie | TVShow): string {
  return 'title' in media ? media.title : media.name;
}

export function getMediaOriginalTitle(media: Movie | TVShow): string {
  return 'original_title' in media ? media.original_title : media.original_name;
}

export function getMediaReleaseDate(media: Movie | TVShow): string {
  return 'release_date' in media ? media.release_date : media.first_air_date;
}

export function getMediaType(media: Movie | TVShow): 'movie' | 'tv' {
  return 'title' in media ? 'movie' : 'tv';
}

export function getYoutubeUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}?autoplay=1`;
}

export function getTrailerKey(media: Movie | TVShow): string | null {
  if (!media.videos || !media.videos.results.length) return null;
  
  // Try to find official trailer
  const trailer = media.videos.results.find(
    video => video.site === 'YouTube' && 
    video.type === 'Trailer' && 
    video.official
  );
  
  // If no official trailer, try any trailer
  if (!trailer) {
    const anyTrailer = media.videos.results.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    );
    
    if (!anyTrailer) {
      // Just get the first YouTube video
      const anyVideo = media.videos.results.find(
        video => video.site === 'YouTube'
      );
      
      return anyVideo ? anyVideo.key : null;
    }
    
    return anyTrailer.key;
  }
  
  return trailer.key;
}

export function getRuntime(runtime: number | undefined): string {
  if (!runtime) return 'N/A';
  
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}min`;
}

export function calculateCircleOffset(rating: number): number {
  const normalizedRating = Math.max(0, Math.min(10, rating));
  const circumference = 2 * Math.PI * 24; // circle radius is 24
  return circumference - (circumference * normalizedRating) / 10;
}

export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return '#4BB543'; // Green for high ratings
  if (rating >= 6) return '#FFA500';   // Orange for medium ratings
  return '#FF3B30';                    // Red for low ratings
}

export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 py-3 px-5 rounded-lg shadow-lg z-50 flex items-center transition-all transform translate-y-0 opacity-100`;
  
  // Set styles based on type
  if (type === 'success') {
    notification.classList.add('bg-status-success', 'text-white');
    notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
  } else if (type === 'error') {
    notification.classList.add('bg-status-error', 'text-white');
    notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${message}`;
  } else {
    notification.classList.add('bg-status-info', 'text-white');
    notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> ${message}`;
  }
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
