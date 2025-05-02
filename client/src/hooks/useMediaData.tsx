import { useQuery } from '@tanstack/react-query';
import { 
  getMovieDetails, 
  getTVShowDetails,
  getMovieCredits,
  getTVShowCredits,
  getMovieProviders,
  getTVShowProviders
} from '@/lib/tmdb';
import { Movie, TVShow, CreditsResponse, ProviderResponse } from '@/types';

export function useMediaDetails(id: number, type: 'movie' | 'tv') {
  // Only run the queries if we have a valid ID
  const shouldFetch = id > 0;
  
  const { data: details, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: [`/api/${type}/${id}`],
    queryFn: () => type === 'movie' 
      ? getMovieDetails(id) 
      : getTVShowDetails(id),
    enabled: shouldFetch,
  });

  const { data: credits, isLoading: isLoadingCredits, error: creditsError } = useQuery<CreditsResponse>({
    queryKey: [`/api/${type}/${id}/credits`],
    queryFn: () => type === 'movie' 
      ? getMovieCredits(id) 
      : getTVShowCredits(id),
    enabled: shouldFetch,
  });

  const { data: providers, isLoading: isLoadingProviders, error: providersError } = useQuery<ProviderResponse>({
    queryKey: [`/api/${type}/${id}/watch/providers`],
    queryFn: () => type === 'movie' 
      ? getMovieProviders(id) 
      : getTVShowProviders(id),
    enabled: shouldFetch,
  });

  const isLoading = isLoadingDetails || isLoadingCredits || isLoadingProviders;
  const error = detailsError || creditsError || providersError;

  return {
    details: details as Movie | TVShow | undefined,
    credits,
    providers,
    isLoading,
    error,
  };
}

export function useMovieDetails(id: number) {
  return useMediaDetails(id, 'movie');
}

export function useTVShowDetails(id: number) {
  return useMediaDetails(id, 'tv');
}
