import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockData';

export default function CustomerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    // Check if already registered
  const exists = mockUsers.find(u => u.email === email && u.user_type === 'CUSTOMER');
    if (exists) {
      setError('Already registered. Please login.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    // Register user
    mockUsers.push({
      id: mockUsers.length + 1,
      username: name,
      password,
      email,
      phone: '',
      user_type: 'CUSTOMER',
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Box className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <Typography variant="h5" className="mb-4 font-bold">Customer Registration</Typography>
      {error && <Alert severity="error" className="mb-3">{error}</Alert>}
      {success && <Alert severity="success" className="mb-3">Registration successful! Redirecting to login...</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" type="email" />
        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" type="password" />
        <Button type="submit" variant="contained" color="primary" className="mt-4 w-full">Register</Button>
      </form>
      <Box className="mt-4 text-center">
        <Button color="secondary" onClick={() => navigate('/login')}>Already registered? Login</Button>
      </Box>
    </Box>
  );
}
