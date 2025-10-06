import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError('');
    setSuccessMsg('');
    try {
      const response = await AuthService.forgotPassword(email);
      setStatus('success');
      setSuccessMsg(response.message || 'OTP sent to your email.');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1200); // short delay so user sees success message
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      setStatus('error');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send OTP
        </Button>
      </form>
      {status === 'success' && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
      {status === 'error' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
