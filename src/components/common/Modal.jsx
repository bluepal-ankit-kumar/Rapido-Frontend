import React, { useEffect } from 'react';
import { Close } from '@mui/icons-material';

export default function Modal({ 
  open, 
  children, 
  onClose,
  title,
  actions,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  ...props 
}) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && onClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [open, closeOnEscape, onClose]);

  // Size mappings
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const modalSize = sizeClasses[size] || sizeClasses.medium;

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      onClick={handleBackdropClick}
      {...props}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full ${modalSize} flex flex-col max-h-[90vh] ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close modal"
              >
                <Close />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {(actions || onClose) && (
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            {actions}
            {!actions && onClose && (
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded transition-colors duration-200 shadow-sm"
              >
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
