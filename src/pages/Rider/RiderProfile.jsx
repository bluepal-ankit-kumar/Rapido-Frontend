import useGeolocation from '../../hooks/useGeolocation';
import React, { useState } from 'react';
import { mockProfiles, mockUsers } from '../../data/mockData';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar, 
  Box, 
  Grid, 
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  FormControlLabel,
  Switch
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  Edit, 
  Save, 
  Cancel,
  Home,
  LocationCity,
  Lock,
  Notifications
} from '@mui/icons-material';
import EditProfileModal from '../../components/common/EditProfileModal';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const userId = 3; // Example: Rider user id
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
};

export default function RiderProfile() {
  const geo = useGeolocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChange = (e) => {
    if (edit) {
      setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setEditModalOpen(true);
  };
  const handleEditSave = (updated) => {
    setProfile(updated);
    setEditModalOpen(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Box className="mb-6 text-center">
        <Avatar className="w-24 h-24 bg-blue-500 mb-4 mx-auto">
          <Person className="text-4xl" />
        </Avatar>
        <Typography variant="h5" fontWeight="medium">{profile.full_name}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.phone}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.address}</Typography>
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
      </Box>
      <EditProfileModal open={editModalOpen} onClose={() => setEditModalOpen(false)} profile={profile} onSave={handleEditSave} />
    </div>
  );
}