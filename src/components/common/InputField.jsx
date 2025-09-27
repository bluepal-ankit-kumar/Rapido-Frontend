import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { ErrorOutline, CheckCircle } from '@mui/icons-material';

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
  helperText,
  required = false,
  disabled = false,
  startIcon,
  endIcon,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <TextField
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          variant="outlined"
          fullWidth
          error={error}
          helperText={helperText}
          InputProps={{
            startAdornment: startIcon && (
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            ),
            endAdornment: endIcon && (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            ),
            sx: {
              borderRadius: '8px',
              backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
              '&:hover': {
                borderColor: error ? '#f44336' : '#ffc107',
              },
              '&.Mui-focused': {
                borderColor: error ? '#f44336' : '#ffc107',
                boxShadow: error ? '0 0 0 2px rgba(244, 67, 54, 0.2)' : '0 0 0 2px rgba(255, 193, 7, 0.2)',
              },
            },
          }}
          InputLabelProps={{
            shrink: true,
            sx: {
              color: error ? '#f44336' : '#6b7280',
              '&.Mui-focused': {
                color: error ? '#f44336' : '#ffc107',
              },
            },
          }}
          FormHelperTextProps={{
            sx: {
              marginLeft: 0,
              color: error ? '#f44336' : '#6b7280',
            },
          }}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ErrorOutline className="text-red-500" />
          </div>
        )}
        
        {!error && value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CheckCircle className="text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
}