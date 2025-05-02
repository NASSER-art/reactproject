import React from 'react';
import { cn } from '@/lib/utils';

interface GenrePillProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GenrePill({ 
  name, 
  isActive = false, 
  onClick, 
  className = '' 
}: GenrePillProps) {
  return (
    <button 
      className={cn(
        "whitespace-nowrap px-4 py-2 rounded-full text-sm font-poppins transition-colors",
        isActive 
          ? "bg-primary text-white" 
          : "bg-dark-300 hover:bg-dark-200 text-light-200",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
