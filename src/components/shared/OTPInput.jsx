import React, { useState, useRef, useEffect } from 'react';

export default function OTPInput({ onChange, length = 6 }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input if current input is filled
      if (value && index < length - 1) {
        inputs.current[index + 1].focus();
      }
      
      // Trigger onChange callback with the complete OTP
      if (onChange) {
        onChange(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1].focus();
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < length) {
          newOtp[i] = pastedData[i];
        }
      }
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputs.current[nextIndex].focus();
      
      if (onChange) {
        onChange(newOtp.join(''));
      }
    }
  };

  // Reset OTP when component mounts
  useEffect(() => {
    setOtp(Array(length).fill(''));
  }, [length]);

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-200 ${
            digit
              ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
              : 'border-gray-300 text-gray-700 hover:border-yellow-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200'
          }`}
        />
      ))}
    </div>
  );
}