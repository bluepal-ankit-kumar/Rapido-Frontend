import React from 'react';
import { CircularProgress } from '@mui/material';

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
  ...props 
}) {
  // Base classes
  const baseClasses = 'font-semibold rounded shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-yellow-400 hover:bg-yellow-500 text-white focus:ring-yellow-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    outline: 'bg-transparent border-2 border-yellow-400 text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-300',
    text: 'bg-transparent text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-300'
  };
  
  // Disabled state
  const disabledClasses = disabled || loading 
    ? 'opacity-70 cursor-not-allowed' 
    : '';
  
  // Full width
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClass} ${className}`;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <CircularProgress size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className="mr-2" color="inherit" />}
      {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}