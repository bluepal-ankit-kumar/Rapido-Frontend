// File removed as registration is now handled by CustomerRegister.jsx and RiderRegister.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Alert, Checkbox, Link, CircularProgress } from '@mui/material';
import useFormValidation from '../../hooks/useFormValidation.js';
import useAuth from '../../hooks/useAuth';

const validate = values => {
  const errors = {};
  if (!values.name) errors.name = 'Name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email is invalid';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export default function Register() {
  const { register, loading, error: authError } = useAuth();
  const { values, errors, handleChange } = useFormValidation({ name: '', email: '', password: '' }, validate);
  const [formError, setFormError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (!agreeTerms) {
      setFormError('You must agree to the terms and conditions');
      return;
    }
    if (Object.keys(errors).length === 0 && values.name && values.email && values.password) {
      register(values.name, values.email, values.password);
    } else {
      setFormError('Please fill all fields correctly');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Paper className="p-8 w-full max-w-md rounded-xl shadow-lg">
        {/* Logo and Brand */}
        <Box className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <Typography variant="h4" className="font-bold text-gray-800">Create Account</Typography>
          <Typography variant="body2" className="text-gray-600 mt-1">Join Rapido for quick and safe rides</Typography>
        </Box>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Email Address"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          
          {/* Terms and Conditions */}
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

          {/* Error Messages */}
          {formError && (
            <Alert severity="error" className="mb-3" size="small">
              {formError}
            </Alert>
          )}
          {authError && (
            <Alert severity="error" className="mb-3" size="small">
              {authError}
            </Alert>
          )}

          {/* Submit Button */}
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

        {/* Registration Role Selection */}
        <Box className="text-center mt-6 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600 mb-2">
            Register as:
          </Typography>
          <Button variant="outlined" color="primary" className="mx-2" href="/customer-register">Customer</Button>
          <Button variant="outlined" color="primary" className="mx-2" href="/rider-register">Rider</Button>
          <Typography variant="body2" className="text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Sign in
            </Link>
          </Typography>
        </Box>

        {/* Footer */}
        <Box className="text-center mt-6">
          <Typography variant="caption" className="text-gray-500">
            © 2023 Rapido. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}