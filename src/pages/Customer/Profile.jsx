import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/userService';
import useGeolocation from '../../hooks/useGeolocation';
import CustomPagination from '../../components/common/Pagination';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import EditProfileModal from '../../components/common/EditProfileModal';
import useAuth from '../../hooks/useAuth';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const geo = useGeolocation();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    user_type: '',
    documents: {},
    fcmToken: '',
    rides: [], // Ensure rides is always an array
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await UserService.getUserProfile();
        setProfile({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          rating: res.data.rating || 0,
          user_type: res.data.user_type || '',
          documents: res.data.documents || {},
          fcmToken: res.data.fcmToken || '',
          rides: res.data.rides || [],
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSave = async (updated) => {
    setStatus(null);
    setError('');
    try {
      await UserService.updateUserProfile(updated);
      setProfile(updated);
      setEditModalOpen(false);
      setStatus('success');
      // Reset success message after 3 seconds
      setTimeout(() => setStatus(null), 3000);
      setTimeout(() => navigate('/profile'), 1000); // navigate after success
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.defaultMessage ||
        'Failed to update profile'
      );
      setStatus('error');
    }
  };

  // Compute userLocation as [lat, lng] array for MapDisplay
  const userLocation = geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : [28.6139, 77.2090];

  if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl w-full flex flex-col items-center justify-center">
        {/* Header */}
        <Box className="mb-8 text-center w-full flex flex-col items-center justify-center">
          <Avatar
            src={`https://i.pravatar.cc/150?u=${profile.email}`}
            className="w-24 h-24 mx-auto mb-4 border-4 border-yellow-400"
          />
          <Typography variant="h5" className="font-bold text-gray-800">{profile.fullName}</Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">{profile.email}</Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">{profile.phone}</Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">{profile.address}</Typography>
          {/* Removed role for a cleaner, more professional look */}
          <Box className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
            <Button
              variant="contained"
              className="bg-yellow-500 hover:bg-yellow-600 shadow-md px-6 py-2 rounded-lg text-base font-semibold"
              onClick={handleEdit}
              style={{ boxShadow: '0 0 0 4px #ffe082' }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              className="border-red-400 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg text-base font-semibold"
              onClick={() => { logout(); navigate('/login'); }}
            >
              Logout
            </Button>
          </Box>
          {status === 'success' && <Alert severity="success" className="mt-4">Profile updated successfully!</Alert>}
          {status === 'error' && <Alert severity="error" className="mt-4">{error}</Alert>}
        </Box>
        <Divider className="my-6 w-full" />
        {/* Edit Profile Modal */}
        <EditProfileModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          profile={profile}
          onSave={handleEditSave}
        />
      </div>
    </div>
  );
}