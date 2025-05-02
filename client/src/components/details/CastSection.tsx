import React from 'react';
import { CreditsResponse, CastMember } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface CastSectionProps {
  credits: CreditsResponse;
}

export function CastSection({ credits }: CastSectionProps) {
  // Get top billed cast (first 5)
  const mainCast = credits.cast.slice(0, 5);
  
  if (mainCast.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h3 className="font-poppins font-semibold text-xl mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        Casting principal
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mainCast.map((castMember) => (
          <CastCard key={castMember.id} castMember={castMember} />
        ))}
      </div>
    </div>
  );
}

interface CastCardProps {
  castMember: CastMember;
}

function CastCard({ castMember }: CastCardProps) {
  return (
    <div className="bg-dark-300 rounded-xl overflow-hidden">
      {castMember.profile_path ? (
        <img 
          src={getImageUrl(castMember.profile_path, 'w185')} 
          alt={castMember.name} 
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-dark-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-dark-100">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      )}
      <div className="p-3">
        <h4 className="font-poppins font-medium text-sm">{castMember.name}</h4>
        <p className="text-xs text-light-300">{castMember.character}</p>
      </div>
    </div>
  );
}
