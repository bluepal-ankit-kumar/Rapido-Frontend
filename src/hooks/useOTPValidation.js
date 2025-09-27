import { useState } from 'react';

export default function useOTPValidation(length = 6) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [error, setError] = useState('');

  const handleChange = (value, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError('');
  };

  const validateOTP = (expectedOtp) => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== length) {
      setError('Please enter complete OTP');
      return false;
    }
    if (expectedOtp && enteredOtp !== expectedOtp) {
      setError('Invalid OTP');
      return false;
    }
    setError('');
    return true;
  };

  const resetOTP = () => {
    setOtp(Array(length).fill(''));
    setError('');
  };

  return { otp, error, handleChange, validateOTP, resetOTP };
}
