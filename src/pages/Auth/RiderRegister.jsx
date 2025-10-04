import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

export default function RiderRegister() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!fullName || !phone || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userRequest = {
        name: fullName,
        phone,
        email,
        password,
        userType: 'RIDER', // Indicate rider registration
      };
      const response = await AuthService.signup(userRequest);
      setSuccess('Registration successful! Redirecting to verification...');
      setTimeout(() => navigate('/rider-verification', { state: { email } }), 1500);
    } catch (error) {
      console.error('Rider registration error:', error);
      if (error.response?.status === 400) {
        setError(error.response.data || 'Invalid registration details');
      } else if (error.response?.status === 409) {
        setError('Email already registered. Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Paper className="p-8 w-full max-w-md rounded-xl shadow-lg">
        <Typography variant="h5" className="mb-4 font-bold text-center">Rider Registration</Typography>
        {error && <Alert severity="error" className="mb-3">{error}</Alert>}
        {success && <Alert severity="success" className="mb-3">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            type="tel"
            inputProps={{ maxLength: 10 }}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            type="email"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Box className="mt-4 text-center">
          <Button
            color="secondary"
            onClick={() => navigate('/login')}
            className="text-yellow-600 hover:text-yellow-700"
          >
            Already registered? Login
          </Button>
        </Box>
        <Box className="text-center mt-4">
          <Typography variant="caption" className="text-gray-500">
            © 2023 Rapido. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}