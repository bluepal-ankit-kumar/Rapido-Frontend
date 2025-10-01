import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField
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
import { useGlobalStore } from '../../context/GlobalStore.jsx';

export default function RideInProgress() {
  const navigate = useNavigate();
  const { getRide, cancelRide, reachCustomer } = useGlobalStore();

  // Simulate rideId for demo
  const rideId = 201;
  const ride = getRide(rideId);

  // Local UI state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!ride) {
    return <div className="p-6">Ride not found</div>;
  }

  // Map route points: driver -> customer
  const routePoints = [
    ride.driver.location,
    [ (ride.driver.location[0] + ride.customer.location[0]) / 2, (ride.driver.location[1] + ride.customer.location[1]) / 2 ],
    ride.customer.location
  ];

  const handleCancel = () => {
    cancelRide(rideId);
    // Simple feedback then redirect
    alert('Ride cancelled');
    navigate('/rider/dashboard');
  };

  const handleReachedCustomer = () => {
    setOtpValue('');
    setOtpError('');
    setOtpOpen(true);
  };

  const validateOtpAndProceed = () => {
    if (otpValue.trim() === ride.otp) {
      setOtpOpen(false);
      // mark stage and navigate to to-destination page
      reachCustomer(rideId);
      navigate('/rider/ride-to-destination', { state: { rideId } });
    } else {
      setOtpError('Invalid OTP');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ride In Progress
      </Typography>

      {/* Map View: Rider -> Customer */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-0">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <MapDisplay
              userLocation={ride.customer.location}
              nearbyRiders={[
                { id: ride.driver.name, name: ride.driver.name, location: ride.driver.location, distance: '0.5', eta: '3' }
              ]}
              routePoints={routePoints}
              riderLocation={ride.driver.location}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Card + actions */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" fontWeight="medium">
              Customer Details
            </Typography>
            <Chip 
              label={ride ? ride.status : 'Loading...'} 
              color="primary" 
              size="medium"
            />
          </Box>

          <Box className="flex items-center mb-3">
            <Avatar className="bg-blue-100 text-blue-600 mr-3">
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {ride.customer.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pickup: {ride.pickup} • Drop: {ride.drop}
              </Typography>
            </Box>
          </Box>

          <Divider className="my-3" />

          <Box className="flex justify-between">
            <Button variant="outlined" color="error" size="large" onClick={handleCancel}>
              Cancel Ride
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={handleReachedCustomer}>
              Reached Customer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Driver Info summary */}
      <Card elevation={2} className="mb-6">
        <CardContent className="p-4">
          <Typography variant="h6" fontWeight="medium" className="mb-4">
            Driver & Vehicle Details
          </Typography>

          <Box className="flex items-center mb-4">
            <Avatar className="bg-blue-100 text-blue-600 mr-3">
              <Person />
            </Avatar>
            <Box className="flex-1">
              <Typography variant="subtitle1" fontWeight="medium">
                {ride.driver.name}
              </Typography>
              <Box className="flex items-center">
                <Star className="text-yellow-500 mr-1" fontSize="small" />
                <Typography variant="body2">{ride.driver.rating}</Typography>
              </Box>
            </Box>

            <Box className="flex space-x-2">
              <IconButton color="primary" aria-label="call driver">
                <Phone />
              </IconButton>
              <IconButton color="primary" aria-label="message driver">
                <Message />
              </IconButton>
            </Box>
          </Box>

          <Divider className="my-3" />

          <Box className="flex items-center">
            <DirectionsCar className="text-gray-500 mr-3" />
            <Box>
              <Typography variant="subtitle1">{ride.driver.vehicle}</Typography>
              <Typography variant="body2" color="textSecondary">
                {ride.driver.licensePlate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
        <DialogTitle>Enter 4-digit OTP</DialogTitle>
        <DialogContent>
          <TextField
            value={otpValue}
            onChange={(e) => { setOtpValue(e.target.value); setOtpError(''); }}
            label="OTP"
            fullWidth
            inputProps={{ maxLength: 4 }}
            helperText={otpError || 'Ask customer for the 4-digit OTP'}
            error={!!otpError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpOpen(false)}>Cancel</Button>
          <Button onClick={validateOtpAndProceed} variant="contained">Verify</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}