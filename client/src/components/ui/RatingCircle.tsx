import React from 'react';
import { calculateCircleOffset, getRatingColor } from '@/lib/utils';

interface RatingCircleProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingCircle({ rating, size = 'md', className = '' }: RatingCircleProps) {
  const normalizedRating = Math.max(0, Math.min(10, rating));
  const displayRating = normalizedRating.toFixed(1);
  const circleColor = getRatingColor(normalizedRating);
  
  // Size configurations
  const config = {
    sm: { width: 32, height: 32, radius: 14, strokeWidth: 2, fontSize: 'text-xs', className: 'w-8 h-8' },
    md: { width: 48, height: 48, radius: 20, strokeWidth: 3, fontSize: 'text-sm', className: 'w-12 h-12' },
    lg: { width: 64, height: 64, radius: 28, strokeWidth: 4, fontSize: 'text-lg', className: 'w-16 h-16' }
  };
  
  const { width, height, radius, strokeWidth, fontSize, className: sizeClassName } = config[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = calculateCircleOffset(normalizedRating);
  
  return (
    <div className={`relative ${sizeClassName} ${className}`}>
      <svg className="circle-progress-bar w-full h-full">
        <circle 
          cx={width / 2} 
          cy={height / 2} 
          r={radius} 
          fill="none" 
          stroke="#333333" 
          strokeWidth={strokeWidth} 
        />
        <circle 
          cx={width / 2} 
          cy={height / 2} 
          r={radius} 
          fill="none" 
          stroke={circleColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-montserrat font-bold ${fontSize}`}>
        {displayRating}
      </div>
    </div>
  );
}
