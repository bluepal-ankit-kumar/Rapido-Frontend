import React, { useState } from 'react';
import { BrokenImage, ImageNotSupported } from '@mui/icons-material';

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = '',
  aspectRatio = 'auto',
  placeholder = null,
  fallback = null,
  objectFit = 'cover',
  maxWidth = '100%',
  maxHeight = '100%',
  loading = 'lazy',
  onClick,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    widescreen: 'aspect-video',
    auto: ''
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const imageClasses = `
    w-full 
    h-full 
    object-${objectFit} 
    transition-opacity 
    duration-300 
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `;

  const containerClasses = `
    overflow-hidden 
    ${aspectRatioClasses[aspectRatio]} 
    bg-gray-100 
    relative
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const containerStyle = {
    maxWidth,
    maxHeight
  };

  return (
    <div 
      className={containerClasses} 
      style={containerStyle}
      onClick={onClick}
      {...props}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img 
              src={placeholder} 
              alt="Loading placeholder" 
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="text-gray-400">
              <ImageNotSupported fontSize="large" />
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      <img
        src={hasError && fallback ? fallback : src}
        alt={alt}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
      />

      {/* Error fallback */}
      {hasError && !fallback && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
          <BrokenImage className="text-gray-400 mb-2" fontSize="large" />
          <p className="text-gray-500 text-sm">Image not available</p>
        </div>
      )}

      {/* Overlay for clickable images */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-80 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}