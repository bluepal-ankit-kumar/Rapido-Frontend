
import React from 'react';
import useOTPValidation from '../../hooks/useOTPValidation.js';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

export default function OTPVerification() {
  const { otp, error, handleChange, validateOTP } = useOTPValidation(6);

  const handleSubmit = e => {
    e.preventDefault();
    if (validateOTP('123456')) {
      // Proceed to next step (simulate success)
      alert('OTP Verified!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="p-8 w-full max-w-md">
        <Typography variant="h5" gutterBottom>OTP Verification</Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            {otp.map((digit, idx) => (
              <TextField
                key={idx}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                style={{ width: 40 }}
              />
            ))}
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>Verify OTP</Button>
        </form>
      </Paper>
    </div>
  );
}
