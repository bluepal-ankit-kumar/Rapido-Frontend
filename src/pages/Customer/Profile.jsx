import useGeolocation from '../../hooks/useGeolocation';
import CustomPagination from '../../components/common/Pagination';
import React, { useState } from 'react';
import { mockProfiles, mockUsers } from '../../data/mockData';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  IconButton, 
  Divider, 
  Grid, 
  Card, 
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  CalendarToday,
  Lock
} from '@mui/icons-material';
import ProfileField from '../../components/common/ProfileField';
import EditProfileModal from '../../components/common/EditProfileModal';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const userId = 2; // Example: Customer user id
const user = mockUsers.find(u => u.id === userId);
const profileData = mockProfiles.find(p => p.user_id === userId);
const initialProfile = {
  full_name: profileData?.full_name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: profileData?.address || '',
  rating: user?.rating || 0,
  user_type: user?.user_type || '',
  documents: profileData?.documents || {},
  fcm_token: profileData?.fcm_token || '',
  rides: [], // Ensure rides is always an array
};

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const ridesPerPage = 5;
  const [page, setPage] = useState(1);
  const geo = useGeolocation();
  const [profile, setProfile] = useState(initialProfile);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(profile.rides.length / ridesPerPage);
  const paginatedRides = profile.rides.slice((page - 1) * ridesPerPage, page * ridesPerPage);
  const handlePageChange = (event, value) => setPage(value);
  const [success, setSuccess] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfile);

  const handleEdit = () => {
    setTempProfile(profile);
    setEditModalOpen(true);
  };

  const handleEditSave = (updated) => {
    setProfile(updated);
    setEditModalOpen(false);
    setSuccess(true);
    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  // Compute userLocation as [lat, lng] array for MapDisplay
  const userLocation = geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : [28.6139, 77.2090];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl w-full flex flex-col items-center justify-center">
        {/* Header */}
        <Box className="mb-8 text-center w-full flex flex-col items-center justify-center">
          <Avatar 
            src={`https://i.pravatar.cc/150?u=${profile.email}`}
            className="w-24 h-24 mx-auto mb-4 border-4 border-yellow-400"
          />
          <Typography variant="h5" className="font-bold text-gray-800">{profile.full_name}</Typography>
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
          {success && <Alert severity="success" className="mt-4">Profile updated successfully!</Alert>}
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