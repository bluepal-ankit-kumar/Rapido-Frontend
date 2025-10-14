import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import {
  Box,
  Button,
  Typography,
  Alert,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import EditProfileModal from '../../components/common/EditProfileModal';
import useAuth from '../../hooks/useAuth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Centralized error handler
  const handleApiError = (err) => {
    // Check for auth errors (e.g., token expired)
    if (err.response?.status === 401 || err.response?.status === 403) {
      setError('Your session has expired. Please log in again.');
      logout(); // This should clear the token via clearAuthToken()
      navigate('/login');
    } else {
      // Handle other API errors
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError('');
        const response = await UserService.getUserProfile();
        if (response.data?.success) {
          setProfile(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to load profile.');
        }
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate, logout]);

  const handleEditSave = async (updatedData) => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await UserService.updateUserProfile(updatedData);
      if (response.data?.success) {
        setProfile(response.data.data);
        // Update user name in localStorage and context for header icon
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.name = response.data.data.fullName || response.data.data.name;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        setEditModalOpen(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        window.dispatchEvent(new Event('storage'));
      } else {
        setError(response.data?.message || 'Failed to update profile.');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center p-8">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-2xl w-full flex flex-col items-center justify-center">
        {error && <Alert severity="error" className="mb-4 w-full">{error}</Alert>}
        {successMessage && <Alert severity="success" className="mb-4 w-full">{successMessage}</Alert>}
        
        {profile && (
          <>
            <Box className="mb-8 text-center w-full flex flex-col items-center justify-center">
              {/* Profile Icon */}
              <AccountCircleIcon 
                className="mb-4" 
                sx={{ 
                  fontSize: 64, 
                  color: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '50%',
                  padding: 1
                }} 
              />
              
            
              <Typography variant="h5" className="font-bold text-gray-800">{profile.fullName}</Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">{profile.email}</Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">{profile.phone}</Typography>
              
              <Box className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
                <Button
                  variant="outlined"
                  color="error"
                  className="border-red-400 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg text-base font-semibold"
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
            <Divider className="my-6 w-full" />
            <EditProfileModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              profile={profile}
              onSave={handleEditSave}
            />
          </>
        )}
      </div>
    </div>
  );
}