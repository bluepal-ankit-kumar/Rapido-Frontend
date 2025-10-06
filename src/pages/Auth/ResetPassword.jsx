import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [form, setForm] = useState({ email: initialEmail, otp: '', newPassword: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError('');
    setSuccessMsg('');
    try {
      const response = await AuthService.resetPassword(form);
      setStatus('success');
      setSuccessMsg(response.message || 'Password reset successful.');
      setTimeout(() => {
        navigate('/login');
      }, 1200); // short delay so user sees success message
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      setStatus('error');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          value={form.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="OTP"
          name="otp"
          fullWidth
          required
          value={form.otp}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          fullWidth
          required
          value={form.newPassword}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
      {status === 'success' && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
      {status === 'error' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
