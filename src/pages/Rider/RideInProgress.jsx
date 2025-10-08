import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MapDisplay from '../../components/shared/MapDisplay';
import { 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress, 
  Divider,
  Chip,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { 
  LocationOn, 
  Person, 
  DirectionsCar, 
  AccessTime, 
  Star,
  Phone,
  Message,
  Navigation
} from '@mui/icons-material';
import RideService from '../../services/rideService';
import useAuth from '../../hooks/useAuth';

export default function RideInProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { rideId } = location.state || {};
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local UI state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    async function fetchRide() {
      if (!rideId) {
        setError('No ride ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await RideService.getRide(rideId);
        const rideData = res.data || res;
        setRide(rideData);
      } catch (err) {
        setError('Failed to load ride details');
        console.error('Failed to fetch ride:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [rideId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading ride details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rider/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!ride) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">Ride not found</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rider/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const customer = ride.customer || {};

  const handleCancel = async () => {
    try {
      await RideService.updateRideStatus({ rideId, status: 'CANCELLED' });
      navigate('/rider/dashboard');
    } catch (err) {
      setError('Failed to cancel ride');
      console.error('Failed to cancel ride:', err);
    }
  };

  const handleReachedCustomer = () => {
    setOtpValue('');
    setOtpError('');
    setOtpOpen(true);
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 4) {
      setOtpError('Please enter a 4-digit OTP');
      return;
    }
    
    try {
      // In a real app, you would verify the OTP with the backend
      // For now, we'll just proceed to the next step
      setOtpOpen(false);
      navigate('/rider/ride-to-destination', { state: { rideId } });
    } catch (err) {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={{ marginTop: 'clamp(64px, 8vw, 88px)' }}>
      <div className="max-w-6xl mx-auto">
        <Box mb={4}>
          <Typography variant="h4" className="font-bold text-gray-800">Pick Up Customer</Typography>
          <Typography variant="body1" className="text-gray-600">Navigate to customer location</Typography>
        </Box>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Customer Information</Typography>
                
                <Box className="flex items-center mb-4">
                  <Avatar className="mr-4" src={`https://i.pravatar.cc/150?u=${customer.name || 'user'}`} />
                  <Box>
                    <Typography variant="h6" className="font-medium">{customer.name || 'N/A'}</Typography>
                    <Box className="flex items-center">
                      <Star className="text-yellow-500 mr-1" fontSize="small" />
                      <Typography variant="body2">{customer.rating || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="space-y-3">
                  <Box className="flex items-center">
                    <LocationOn className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Pickup Location</Typography>
                      <Typography variant="h6" className="font-medium">{ride.currentPlaceName || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  
                  <Box className="flex items-center">
                    <DirectionsCar className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="body2" className="text-gray-600">Destination</Typography>
                      <Typography variant="h6" className="font-medium">{ride.dropOffPlaceName || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="space-y-2">
                  <Typography variant="body2" className="text-gray-600">Fare: ₹{ride.cost || 'N/A'}</Typography>
                  <Typography variant="body2" className="text-gray-600">Distance: {ride.distance || 'N/A'} km</Typography>
                  <Typography variant="body2" className="text-gray-600">Vehicle: {ride.vehicleType || 'N/A'}</Typography>
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex gap-2">
                  <Button 
                    variant="outlined" 
                    startIcon={<Phone />}
                    className="flex-1"
                    disabled={!customer.phone}
                    onClick={() => window.location.href = `tel:${customer.phone}`}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Message />}
                    className="flex-1"
                    disabled={!customer.phone}
                    onClick={() => window.location.href = `sms:${customer.phone}`}
                  >
                    Message
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Actions</Typography>
                
                <Box className="space-y-3">
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={handleReachedCustomer}
                    className="w-full"
                    startIcon={<Person />}
                  >
                    I've Reached the Customer
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleCancel}
                    className="w-full"
                  >
                    Cancel Ride
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div>
            <Card className="shadow-md rounded-xl">
              <CardContent className="p-0">
                <Typography variant="h6" className="font-bold text-gray-800 p-4 pb-2">Navigation Map</Typography>
                <Divider />
                <MapDisplay
                  pickup={ride.startLatitude && ride.startLongitude ? { lat: ride.startLatitude, lng: ride.startLongitude } : null}
                  dropoff={ride.endLatitude && ride.endLongitude ? { lat: ride.endLatitude, lng: ride.endLongitude } : null}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* OTP Dialog */}
        <Dialog open={otpOpen} onClose={() => setOtpOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Verify Customer Pickup</DialogTitle>
          <DialogContent>
            <Typography variant="body2" className="mb-4">
              Please ask the customer for the 4-digit OTP to confirm pickup.
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              error={!!otpError}
              helperText={otpError}
              inputProps={{ maxLength: 4 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOtpOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleOtpSubmit}>
              Verify & Continue
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}