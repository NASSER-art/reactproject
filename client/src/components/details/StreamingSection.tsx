import React from 'react';
import { ProviderResponse } from '@/types';
import { StreamingProviderIcon } from '@/components/ui/StreamingProviderIcon';

interface StreamingSectionProps {
  providers: ProviderResponse;
  countryCode: string;
}

export function StreamingSection({ providers, countryCode }: StreamingSectionProps) {
  // Get providers for the user's country
  const countryProviders = providers.results[countryCode];
  
  // If no providers found for the country
  if (!countryProviders) {
    // Try US as fallback
    const usProviders = providers.results['US'];
    
    if (!usProviders) {
      // If no US providers, try the first country available
      const countries = Object.keys(providers.results);
      
      if (countries.length === 0) {
        return (
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-xl mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Disponible en streaming
            </h3>
            <p className="text-light-300">
              Aucune plateforme de streaming disponible pour ce contenu dans votre région.
            </p>
          </div>
        );
      }
    }
  }
  
  // Filter out providers that are actually available for streaming (flatrate)
  const flatrateProviders = countryProviders?.flatrate || [];
  const rentProviders = countryProviders?.rent || [];
  const buyProviders = countryProviders?.buy || [];
  
  // If no streaming options are available
  if (flatrateProviders.length === 0 && rentProviders.length === 0 && buyProviders.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="font-poppins font-semibold text-xl mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          Disponible en streaming
        </h3>
        <p className="text-light-300">
          Aucune plateforme de streaming disponible pour ce contenu dans votre région.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h3 className="font-poppins font-semibold text-xl mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        Disponible en streaming
      </h3>
      
      {flatrateProviders.length > 0 && (
        <div className="mb-4">
          <h4 className="font-poppins text-sm text-light-300 mb-2">Abonnement</h4>
          <div className="platform-grid">
            {flatrateProviders.map(provider => (
              <StreamingProviderIcon 
                key={provider.provider_id} 
                provider={provider} 
                size="md" 
                link={countryProviders.link}
              />
            ))}
          </div>
        </div>
      )}
      
      {rentProviders.length > 0 && (
        <div className="mb-4">
          <h4 className="font-poppins text-sm text-light-300 mb-2">Location</h4>
          <div className="platform-grid">
            {rentProviders.map(provider => (
              <StreamingProviderIcon 
                key={provider.provider_id} 
                provider={provider} 
                size="md" 
                link={countryProviders.link}
              />
            ))}
          </div>
        </div>
      )}
      
      {buyProviders.length > 0 && (
        <div>
          <h4 className="font-poppins text-sm text-light-300 mb-2">Achat</h4>
          <div className="platform-grid">
            {buyProviders.map(provider => (
              <StreamingProviderIcon 
                key={provider.provider_id} 
                provider={provider} 
                size="md" 
                link={countryProviders.link}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
