import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Alert, Checkbox, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    if (!name || !phone || !email || !password) {
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
        name,
        phone,
        email,
        password,
        userType: 'CUSTOMER',
      };
      const response = await AuthService.signup(userRequest);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Customer registration error:', error);
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
        <Box className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <Typography variant="h4" className="font-bold text-gray-800">Create Account</Typography>
          <Typography variant="body2" className="text-gray-600 mt-1">Join Rapido for quick and safe rides</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
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
          <Box className="flex items-center mt-3 mb-2">
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              size="small"
              className="p-1"
            />
            <Typography variant="body2" className="text-gray-600">
              I agree to the{' '}
              <Link href="#" className="text-yellow-600 hover:text-yellow-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-yellow-600 hover:text-yellow-700">
                Privacy Policy
              </Link>
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-3">{error}</Alert>}
          {success && <Alert severity="success" className="mb-3">{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium shadow-md mt-2"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <Box className="text-center mt-6 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600 mb-2">
            Register as:
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            className="mx-2"
            onClick={() => navigate('/customer-register')}
          >
            Customer
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="mx-2"
            onClick={() => navigate('/rider-register')}
          >
            Rider
          </Button>
          <Typography variant="body2" className="text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Sign in
            </Link>
          </Typography>
        </Box>

        <Box className="text-center mt-6">
          <Typography variant="caption" className="text-gray-500">
            © 2023 Rapido. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}