import React from 'react';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';

export default function StarRating({ 
  rating, 
  maxRating = 5,
  size = 'medium',
  color = 'primary',
  showValue = false,
  className = '',
  ...props 
}) {
  // Size mappings
  const sizeMap = {
    small: { fontSize: '16px', iconSize: 'small' },
    medium: { fontSize: '20px', iconSize: 'medium' },
    large: { fontSize: '24px', iconSize: 'large' }
  };

  // Color mappings
  const colorMap = {
    primary: { filled: '#FFC107', empty: '#E0E0E0' },
    secondary: { filled: '#9E9E9E', empty: '#E0E0E0' },
    success: { filled: '#4CAF50', empty: '#E0E0E0' },
    warning: { filled: '#FF9800', empty: '#E0E0E0' },
    error: { filled: '#F44336', empty: '#E0E0E0' }
  };

  const currentSize = sizeMap[size] || sizeMap.medium;
  const currentColor = colorMap[color] || colorMap.primary;

  // Calculate stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div 
      className={`flex items-center ${className}`} 
      style={{ fontSize: currentSize.fontSize }}
      {...props}
    >
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`full-${i}`} 
          fontSize={currentSize.iconSize}
          style={{ color: currentColor.filled }}
          className="mr-0.5"
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf 
          key="half" 
          fontSize={currentSize.iconSize}
          style={{ color: currentColor.filled }}
          className="mr-0.5"
        />
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorder 
          key={`empty-${i}`} 
          fontSize={currentSize.iconSize}
          style={{ color: currentColor.empty }}
          className="mr-0.5"
        />
      ))}
      
      {/* Numeric rating */}
      {showValue && (
        <span 
          className="ml-2 font-medium text-gray-700"
          style={{ fontSize: `calc(${currentSize.fontSize} * 0.9)` }}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}