import React, { useState } from 'react';
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

const initialProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  address: '123 Main Street, Delhi',
  joinDate: '2023-01-15',
  totalRides: 24,
  rating: 4.8
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfile);

  const handleEdit = () => {
    setTempProfile(profile);
    setEdit(true);
  };

  const handleCancel = () => {
    setProfile(tempProfile);
    setEdit(false);
  };

  const handleChange = e => {
    if (edit) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTempProfile(profile);
      setEdit(false);
      setLoading(false);
      setSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">My Profile</Typography>
          <Typography variant="body2" className="text-gray-600">Manage your account information and preferences</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card className="shadow-md rounded-xl h-full">
              <CardContent className="text-center p-6">
                <Avatar 
                  src={`https://i.pravatar.cc/150?u=${profile.email}`}
                  className="w-24 h-24 mx-auto mb-4 border-4 border-yellow-400"
                />
                <Typography variant="h5" className="font-bold text-gray-800">{profile.name}</Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">{profile.email}</Typography>
                
                <Divider className="my-4" />
                
                <Box className="space-y-3">
                  <Box className="flex items-center">
                    <Phone className="text-gray-500 mr-2" fontSize="small" />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Box>
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-2" fontSize="small" />
                    <Typography variant="body2">{profile.address}</Typography>
                  </Box>
                  <Box className="flex items-center">
                    <CalendarToday className="text-gray-500 mr-2" fontSize="small" />
                    <Typography variant="body2">Member since {profile.joinDate}</Typography>
                  </Box>
                </Box>
                
                <Box className="mt-6 pt-4 border-t border-gray-200">
                  <Typography variant="body2" className="text-gray-600 mb-1">Ride Statistics</Typography>
                  <Box className="flex justify-between">
                    <Typography variant="body1" className="font-medium">{profile.totalRides} rides</Typography>
                    <Typography variant="body1" className="font-medium flex items-center">
                      <span className="text-yellow-500 mr-1">★</span> {profile.rating}
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="contained" 
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600"
                  onClick={edit ? handleSave : handleEdit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : edit ? <Save /> : <Edit />}
                >
                  {loading ? 'Saving...' : (edit ? 'Save Changes' : 'Edit Profile')}
                </Button>
                
                {edit && (
                  <Button 
                    variant="outlined" 
                    className="w-full mt-2"
                    onClick={handleCancel}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Form Card */}
          <Grid item xs={12} md={8}>
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-6">Personal Information</Typography>
                
                {success && (
                  <Alert severity="success" className="mb-4">
                    Profile updated successfully!
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                </Grid>
                
                <Divider className="my-6" />
                
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Security</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!edit}
                    />
                  </Grid>
                </Grid>
                
                <Box className="mt-6">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    className="mr-2"
                    disabled={!edit}
                    startIcon={<Lock />}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}