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
import MapDisplay from '../../components/shared/MapDisplay';

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
  const [profile, setProfile] = useState(initialProfile);
  // Optionally, you can display or use geo location in the rider profile if needed
  const [edit, setEdit] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChange = (e) => {
    if (edit) {
      setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setEdit(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setEdit(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEdit(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Box className="mb-6">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Rider Profile
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your personal information and preferences
        </Typography>
      </Box>
      <Card elevation={3} className="mb-6">
        <CardContent className="p-6">
          <Box className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 bg-blue-500 mb-4">
              <Person className="text-4xl" />
            </Avatar>
            <Typography variant="h5" fontWeight="medium">
              {profile.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Member since Jan 2023
            </Typography>
          </Box>
          <Divider className="mb-6" />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box className="flex items-center mb-4">
                <Person className="text-gray-500 mr-2" />
                <TextField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  fullWidth
                  disabled={!edit}
                />
              </Box>
              {/* Show live location map */}
              <Box className="mt-4">
                <Typography variant="body2" className="mb-2">Current Location</Typography>
                <MapDisplay userLocation={geo && geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : [28.6139, 77.2090]} nearbyRiders={[]} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className="flex items-center mb-4">
                <Email className="text-gray-500 mr-2" />
                <TextField
                  label="Email Address"
                  name="email"
                  value={edit ? tempProfile.email : profile.email}
                  onChange={handleChange}
                  fullWidth
                  variant={edit ? "outlined" : "standard"}
                  InputProps={{
                    readOnly: !edit,
                    disableUnderline: !edit
                  }}
                />
              </Box>
              
              <Box className="flex items-center mb-4">
                <Phone className="text-gray-500 mr-2" />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={edit ? tempProfile.phone : profile.phone}
                  onChange={handleChange}
                  fullWidth
                  variant={edit ? "outlined" : "standard"}
                  InputProps={{
                    readOnly: !edit,
                    disableUnderline: !edit
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Divider className="my-6" />
          
          <Box className="flex items-center justify-between">
            <Box className="flex items-center">
              <Notifications className="text-gray-500 mr-2" />
              <Typography variant="body1">Enable Notifications</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </Box>
          
          <Box className="flex justify-center mt-8 space-x-4">
            {edit ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSave}
                  size="large"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  size="large"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={handleEdit}
                size="large"
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
      <Card elevation={2}>
        <CardContent className="p-6">
          <Box className="flex items-center mb-4">
            <Lock className="text-gray-500 mr-2" />
            <Typography variant="h6" fontWeight="medium">
              Account Security
            </Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary" className="mb-4">
            Manage your password and security settings
          </Typography>
          
          <Button variant="outlined" color="primary">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}