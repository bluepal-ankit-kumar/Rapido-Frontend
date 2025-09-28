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
import MapDisplay from '../../components/shared/MapDisplay';
import ProfileField from '../../components/common/ProfileField';

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
};

export default function Profile() {
  const ridesPerPage = 5;
  const [page, setPage] = useState(1);
  const geo = useGeolocation();
  const [profile, setProfile] = useState(initialProfile);
  // Optionally, you can display or use geo location in the profile if needed
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(profile.rides.length / ridesPerPage);
  const paginatedRides = profile.rides.slice((page - 1) * ridesPerPage, page * ridesPerPage);
  const handlePageChange = (event, value) => setPage(value);
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

  // Compute userLocation as [lat, lng] array for MapDisplay
  const userLocation = geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : [28.6139, 77.2090];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">My Profile</Typography>
          <Typography variant="body2" className="text-gray-600">Manage your account information and preferences</Typography>
        </Box>
        {/* Live Location Map */}
        <Box className="mb-8">
          <Typography variant="body2" className="mb-2">Current Location</Typography>
          <MapDisplay userLocation={userLocation} nearbyRiders={[]} />
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
                  <Box className="flex justify-between mb-2">
                    <Typography variant="body1" className="font-medium">{profile.totalRides} rides</Typography>
                    <Typography variant="body1" className="font-medium flex items-center">
                      <span className="text-yellow-500 mr-1">★</span> {profile.rating}
                    </Typography>
                  </Box>
                  <Divider className="my-2" />
                  <Box>
                    {paginatedRides.map(ride => (
                      <Box key={ride.id} className="flex justify-between items-center py-2 px-2 border-b last:border-b-0">
                        <Typography variant="body2" className="font-medium">#{ride.id}</Typography>
                        <Typography variant="body2">{ride.date}</Typography>
                        <Typography variant="body2">{ride.pickup} → {ride.dropoff}</Typography>
                        <Typography variant="body2" color="primary">₹{ride.fare}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <CustomPagination count={totalPages} page={page} onChange={handlePageChange} />
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
                  <ProfileField
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                  <ProfileField
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                  <ProfileField
                    label="Phone Number"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                  <ProfileField
                    label="Address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}