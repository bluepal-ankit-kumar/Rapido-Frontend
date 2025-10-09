import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Person } from '@mui/icons-material';
import EditProfileModal from '../../components/common/EditProfileModal';
import useAuth from '../../hooks/useAuth';

export default function RiderProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Centralized error handler
  const handleApiError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      setError('Your session has expired. Please log in again.');
      logout();
      navigate('/login');
    } else {
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
        setEditModalOpen(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
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
    <div className="p-6 max-w-2xl mx-auto">
      {error && <Alert severity="error" className="mb-4 w-full">{error}</Alert>}
      {successMessage && <Alert severity="success" className="mb-4 w-full">{successMessage}</Alert>}

      {profile && (
        <>
          <Box className="mb-6 text-center">
            <Avatar className="w-24 h-24 bg-blue-500 mb-4 mx-auto">
              <Person className="text-4xl" />
            </Avatar>
            <Typography variant="h5" fontWeight="medium">{profile.fullName}</Typography>
            <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
            <Typography variant="body2" color="textSecondary">{profile.phone}</Typography>
            {/* <Typography variant="body2" color="textSecondary">{profile.address || 'No address provided'}</Typography> */}
            <Box className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
              {/* <Button 
                variant="contained" 
                className="bg-yellow-500 hover:bg-yellow-600 shadow-md px-6 py-2 rounded-lg text-base font-semibold"
                onClick={() => setEditModalOpen(true)}
              >
                Edit Profile
              </Button> */}
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
          <EditProfileModal 
            open={editModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            profile={profile} 
            onSave={handleEditSave} 
          />
        </>
      )}
    </div>
  );
}