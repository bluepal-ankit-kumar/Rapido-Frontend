
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockData';

function hashPassword(password) {
  // Simple hash for demo (not secure for production)
  return btoa(password);
}

export default function CustomerRegister() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!fullName || !phone || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }
    // Check if already registered
    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      setError('Email already registered. Please login.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    // Register user
    mockUsers.push({
      fullName,
      phone,
      email,
      password: hashPassword(password),
      role: 'customer',
      created_at: new Date().toISOString(),
    });
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Box className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <Typography variant="h5" className="mb-4 font-bold">Customer Registration</Typography>
      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      {success && <Alert severity="success" className="mb-3">Registration successful! Redirecting to login...</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} fullWidth margin="normal" />
        <TextField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth margin="normal" type="tel" inputProps={{ maxLength: 10 }} />
        <TextField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" type="email" />
        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" type="password" />
        <Button type="submit" variant="contained" color="primary" className="mt-4 w-full">Register</Button>
      </form>
      <Box className="mt-4 text-center flex flex-col gap-2">
        <Button color="secondary" onClick={() => navigate('/login')}>Already registered? Login</Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/rider-register')}>Register as Rider</Button>
      </Box>
    </Box>
  );
}
