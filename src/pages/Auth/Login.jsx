import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Checkbox, Link, Box, Alert, CircularProgress } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useFormValidation from '../../hooks/useFormValidation';
import { validate } from '../../utils/validators';
import { mockUsers } from '../../data/mockData';

export default function Login() {
  const { signIn, loading } = useAuth();
  const { values, errors, handleChange } = useFormValidation({ email: '', password: '' }, validate);
  const [formError, setFormError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.keys(errors).length === 0 && values.email && values.password) {
      const user = mockUsers.find(u => u.email === values.email && u.password === values.password);
      if (!user) {
        setFormError('Invalid credentials');
        return;
      }
      if (user.role === 'rider' && user.verified === false) {
        setFormError('Your profile verification is pending. Please try after some time.');
        return;
      }
      signIn(values.email, values.password);
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
          <Typography variant="h4" className="font-bold text-gray-800">Welcome to Rapido</Typography>
          <Typography variant="body2" className="text-gray-600 mt-1">Sign in to your account</Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
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
          
          {/* Remember Me & Forgot Password */}
          <Box className="flex justify-between items-center mt-2 mb-4">
            <Box className="flex items-center">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                className="p-1"
              />
              <Typography variant="body2" className="text-gray-600">Remember me</Typography>
            </Box>
            <Link href="#" variant="body2" className="text-yellow-600 hover:text-yellow-700">
              Forgot password?
            </Link>
          </Box>

          {/* Error Message */}
          {formError && (
            <Alert severity="error" className="mb-3" size="small">
              {formError}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium shadow-md"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <Box className="text-center mt-6 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Sign up
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