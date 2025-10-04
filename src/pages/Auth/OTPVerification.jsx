import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useOTPValidation from '../../hooks/useOTPValidation';
import AuthService from '../../services/AuthService';

export default function OTPVerification() {
  const { otp, error: otpError, handleChange, validateOTP } = useOTPValidation(6);
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Expect email to be passed from forgot-password page

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!email) {
      setFormError('Email not provided. Please start the password reset process again.');
      return;
    }

    if (!validateOTP(otp.join(''))) {
      setFormError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError('Please enter a password with at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const resetRequest = {
        email,
        otp: otp.join(''),
        newPassword,
      };
      const response = await AuthService.resetPassword(resetRequest);
      setSuccess(response.data || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.status === 400) {
        setFormError(error.response.data || 'Invalid OTP or email');
      } else {
        setFormError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="p-8 w-full max-w-md">
        <Typography variant="h5" gutterBottom>OTP Verification</Typography>
        <Typography variant="body2" className="text-gray-600 mb-4">
          Enter the 6-digit OTP sent to {email || 'your email'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            {otp.map((digit, idx) => (
              <TextField
                key={idx}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                style={{ width: 40 }}
                error={!!otpError}
              />
            ))}
          </Box>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          {otpError && <Typography color="error" className="mb-2">{otpError}</Typography>}
          {formError && <Alert severity="error" className="mb-3">{formError}</Alert>}
          {success && <Alert severity="success" className="mb-3">{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Verifying...' : 'Verify OTP & Reset Password'}
          </Button>
        </form>
        <Box className="mt-4 text-center">
          <Button
            color="secondary"
            onClick={() => navigate('/forgot-password')}
          >
            Resend OTP
          </Button>
        </Box>
      </Paper>
    </div>
  );
}