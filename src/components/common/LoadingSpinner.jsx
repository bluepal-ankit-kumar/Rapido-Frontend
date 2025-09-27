import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  text,
  overlay = false,
  className = '',
  ...props
}) {
  // Size mappings
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
    xlarge: 80
  };

  // Color mappings
  const colorMap = {
    primary: '#FFC107', // Rapido yellow
    secondary: '#6c757d',
    white: '#ffffff',
    inherit: 'inherit'
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;
  const spinnerColor = colorMap[color] || colorMap.primary;

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`} {...props}>
      <CircularProgress
        size={spinnerSize}
        sx={{
          color: spinnerColor,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {text && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: color === 'white' ? '#ffffff' : '#6c757d',
            fontWeight: 500
          }}
        >
          {text}
        </Typography>
      )}
    </div>
  );

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {spinnerContent}
      </Box>
    );
  }

  return spinnerContent;
}