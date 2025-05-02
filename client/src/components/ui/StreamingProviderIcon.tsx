import React from 'react';
import { Provider } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface StreamingProviderIconProps {
  provider: Provider;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  link?: string;
}

export function StreamingProviderIcon({ 
  provider, 
  size = 'md', 
  className = '',
  link
}: StreamingProviderIconProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const containerSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-14 w-14'
  };
  
  const iconClassName = `${sizeClasses[size]} rounded object-cover`;
  const containerClassName = `${containerSizeClasses[size]} rounded-lg overflow-hidden ${className}`;
  
  const content = (
    <div className={containerClassName}>
      <img 
        src={getImageUrl(provider.logo_path, 'original')} 
        alt={provider.provider_name} 
        title={provider.provider_name}
        className={iconClassName}
      />
    </div>
  );
  
  // If there's a link, wrap the content in an anchor tag
  if (link) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="transition-transform hover:scale-105"
        title={`Watch on ${provider.provider_name}`}
      >
        {content}
      </a>
    );
  }
  
  return content;
}
